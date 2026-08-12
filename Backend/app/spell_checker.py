import os
import pickle
import sqlite3
import time
import regex
from pathlib import Path
from typing import List, Dict, Tuple, Set, Optional

from app.TamilinaiyaVaaniSpellcheckerPy import TamilinaiyaVaaniData, TamilinaiyaVaaniSpellchecker
from app import tamil_grammar_morphology

BASE_DIR = Path(__file__).resolve().parent
BLOOM_PATH = BASE_DIR / "tamil_bloom.pkl"
BK_TREE_PATH = BASE_DIR / "bk_tree.pkl"
USER_CONFIG_DIR = BASE_DIR / "TamilinaiyaVaaniSpellcheckerPy" / "data" / "user_config"
TAMILINAIYA_VAANI_DB_PATH = BASE_DIR / "TamilinaiyaVaaniSpellcheckerPy" / "data" / "DB.json"
BIGRAM_DB_PATH = BASE_DIR / "TamilinaiyaVaaniSpellcheckerPy" / "data" / "bigrams_lite.db"


class TamilSpellCheckerEngine:
    def __init__(self):
        self.bloom = None
        self.bk_tree = None
        self.vaani = None
        self.whitelist: Set[str] = set()
        self.blacklist: Set[str] = set()
        self.replacements: Dict[str, List[str]] = {}
        self.bigrams_conn = None
        self.is_loaded = False

    def load_resources(self):
        """Loads dictionaries, Bloom filter, BK-Tree, and Vaani dataset."""
        print("Loading Tamil Spell Checker resources...")

        if BLOOM_PATH.exists():
            try:
                with open(BLOOM_PATH, "rb") as f:
                    self.bloom = pickle.load(f)
                print("Bloom Filter loaded.")
            except Exception as e:
                print(f"Error loading Bloom Filter: {e}")

        if BK_TREE_PATH.exists():
            try:
                with open(BK_TREE_PATH, "rb") as f:
                    self.bk_tree = pickle.load(f)
                print("BK-Tree loaded.")
            except Exception as e:
                print(f"Error loading BK-Tree: {e}")

        # Load Tamilinaiya Vaani Database
        if TAMILINAIYA_VAANI_DB_PATH.exists():
            try:
                vaani_data = TamilinaiyaVaaniData(str(TAMILINAIYA_VAANI_DB_PATH))
                if vaani_data.load():
                    if USER_CONFIG_DIR.exists():
                        right_words = USER_CONFIG_DIR / "rightwordlist.txt"
                        vulgar_words = USER_CONFIG_DIR / "vulgar_splits.txt"
                        if right_words.exists():
                            vaani_data.load_user_data(str(right_words))
                        if vulgar_words.exists():
                            vaani_data.load_vulgar_words(str(vulgar_words))
                    self.vaani = TamilinaiyaVaaniSpellchecker(vaani_data)
                    print("Tamilinaiya Vaani engine initialized.")
            except Exception as e:
                print(f"Error initializing Vaani Engine: {e}")

        # Load Bigrams Database if available
        if BIGRAM_DB_PATH.exists():
            try:
                self.bigrams_conn = sqlite3.connect(str(BIGRAM_DB_PATH), check_same_thread=False)
                print("Bigram DB loaded.")
            except Exception as e:
                print(f"Bigram load warning: {e}")

        # Load user configurations (whitelists, replacements)
        self._load_user_configs()
        self.is_loaded = True
        print("Tamil Spell Checker initialization complete!")

    def _load_user_configs(self):
        def read_config(filename: str) -> List[str]:
            path = USER_CONFIG_DIR / filename
            if path.exists():
                with open(path, "r", encoding="utf-8") as f:
                    return [line.strip() for line in f if line.strip() and not line.startswith("#")]
            return []

        self.whitelist.update(read_config("rightwordlist.txt"))
        self.whitelist.update(read_config("global_places.txt"))
        self.blacklist.update(read_config("wrongwordlist.txt"))

        for line in read_config("replacements.txt"):
            if "|" in line:
                orig, sug = line.split("|", 1)
                self.replacements[orig.strip()] = [s.strip() for s in sug.split(",")]

    def suggest_word(self, word: str, prev_word: Optional[str] = None, max_suggestions: int = 5) -> List[str]:
        """Generate top candidate suggestions using BK-Tree and optional bigram ranking."""
        if not self.bk_tree:
            return []

        candidates_raw = self.bk_tree.find(word, 2)
        if not candidates_raw and len(word) >= 10:
            candidates_raw = self.bk_tree.find(word, 3)

        filtered = [w for d, w in candidates_raw if abs(len(w) - len(word)) <= 2 and w[0] == word[0]]
        if not filtered:
            return []

        if prev_word and self.bigrams_conn:
            scored = []
            try:
                cursor = self.bigrams_conn.cursor()
                for cand in filtered:
                    cursor.execute("SELECT freq FROM bigrams WHERE word1=? AND word2=?", (prev_word, cand))
                    row = cursor.fetchone()
                    freq = row[0] if row else 0
                    scored.append((cand, freq))
                ranked = [pair[0] for pair in sorted(scored, key=lambda x: x[1], reverse=True)]
                return ranked[:max_suggestions]
            except Exception:
                pass

        return sorted(filtered)[:max_suggestions]

    def check_word_correctness(self, word: str, prev_word: Optional[str] = None) -> Tuple[bool, str, List[str]]:
        """
        Check if a single Tamil word is correct.
        Returns: (is_correct, error_type, suggestions)
        """
        word_clean = word.replace('\u200c', '').replace('\u200d', '')

        # Check explicit overrides
        if word_clean in self.blacklist:
            return False, "blacklist", []
        if word_clean in self.replacements:
            return False, "colloquial", self.replacements[word_clean]
        if word_clean in self.whitelist:
            return True, "", []

        # 1. Primary check: Tamilinaiya Vaani (Authoritative TVA engine)
        if self.vaani:
            try:
                v_val = self.vaani.validate_words([word_clean])
                if v_val and len(v_val) > 0:
                    code, suggestion_str = v_val[0][0], v_val[0][1]
                    if code == 0 and suggestion_str == "correct":
                        return True, "", []
                    elif code > 0 and suggestion_str and suggestion_str != "wrong":
                        vaani_sugs = [s.strip() for s in suggestion_str.split(",") if s.strip()]
                        if vaani_sugs:
                            return False, "spelling", vaani_sugs
                    elif suggestion_str == "wrong":
                        sugs = self.suggest_word(word_clean, prev_word=prev_word)
                        return False, "spelling", sugs
            except Exception:
                pass

        # 2. Fallback: Bloom Filter check
        if self.bloom and word_clean in self.bloom:
            return True, "", []

        # Check trailing sandhi consonants
        base_sandhi = tamil_grammar_morphology.get_base_sandhi_word(word_clean)
        if base_sandhi:
            if (self.bloom and base_sandhi in self.bloom) or base_sandhi in self.whitelist or (self.vaani and self.vaani.checkword(base_sandhi, 0)):
                return True, "", []
            # Check derived variants from base sandhi
            possible_roots = tamil_grammar_morphology.get_derived_viku_variants(base_sandhi)
            for r_word in possible_roots:
                if (self.bloom and r_word in self.bloom) or r_word in self.whitelist or (self.vaani and self.vaani.checkword(r_word, 0)):
                    return True, "", []

        # Check derived root words (Noun cases / Coordinating suffixes)
        possible_roots = tamil_grammar_morphology.get_derived_viku_variants(word_clean)
        for r_word in possible_roots:
            if len(r_word) <= 2:
                if r_word in self.whitelist or (self.vaani and self.vaani.checkword(r_word, 0)):
                    return True, "", []
            else:
                if (self.bloom and r_word in self.bloom) or r_word in self.whitelist or (self.vaani and self.vaani.checkword(r_word, 0)):
                    return True, "", []

        # Sandhi check with previous word
        if prev_word:
            combined = prev_word + word_clean
            if (self.bloom and combined in self.bloom) or combined in self.whitelist or (self.vaani and self.vaani.checkword(combined, 0)):
                return False, "sandhi", [combined]

        # BK-Tree suggestions fallback
        suggestions = self.suggest_word(word_clean, prev_word=prev_word)
        return False, "spelling", suggestions

    def analyze_text(self, text: str) -> Dict:
        start_time = time.time()

        # 1. Spacing errors
        spacing_errs = tamil_grammar_morphology.find_spacing_errors(text)
        formatted_spacing_errs = []
        for se in spacing_errs:
            formatted_spacing_errs.append({
                "type": se.get("type", "spacing"),
                "message": se.get("message", "இடைவெளி பிழை (Spacing error)")
            })

        # 2. Extract Tamil word tokens
        words = regex.findall(r"[\p{Tamil}\u200C\u200D]+", text)
        word_results = []
        error_count = 0

        corrected_words_map = {}
        prev_word = None

        for word in words:
            is_correct, err_type, sugs = self.check_word_correctness(word, prev_word=prev_word)

            if not is_correct:
                error_count += 1
                if sugs:
                    corrected_words_map[word] = sugs[0]
            else:
                corrected_words_map[word] = word

            word_results.append({
                "word": word,
                "is_correct": is_correct,
                "error_type": err_type if not is_correct else None,
                "suggestions": sugs
            })

            prev_word = word

        # Build corrected text
        corrected_text = text
        for orig, replacement in corrected_words_map.items():
            if orig != replacement:
                corrected_text = regex.sub(r'\b' + regex.escape(orig) + r'\b', replacement, corrected_text)

        elapsed_ms = round((time.time() - start_time) * 1000, 2)

        return {
            "original_text": text,
            "corrected_text": corrected_text,
            "has_errors": error_count > 0 or len(formatted_spacing_errs) > 0,
            "error_count": error_count,
            "words": word_results,
            "spacing_errors": formatted_spacing_errs,
            "process_time_ms": elapsed_ms
        }


# Singleton instance
engine = TamilSpellCheckerEngine()
