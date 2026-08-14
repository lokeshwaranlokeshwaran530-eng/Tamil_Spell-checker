/**
 * Mock Spell-Check Engine — Bilingual (Tamil + English)
 */

// ── Tamil corrections database ──
const TAMIL_CORRECTIONS = [
  {
    trigger: 'படிக்கிரேன்',
    response: {
      corrected_text:
        'நான் பாடசாலையில் படிக்கிறேன். என் ஆசிரியர் மிகவும் நல்லவர். தமிழ் மொழி உலகின் பழமையான மொழிகளில் ஒன்று.',
      errors: [
        {
          wrong: 'பாடசலையில்',
          correct: 'பாடசாலையில்',
          reason: 'நெடில் பிழை — "சா" வர வேண்டும். Missing long vowel marker.',
          type: 'vowel',
        },
        {
          wrong: 'படிக்கிரேன்',
          correct: 'படிக்கிறேன்',
          reason: 'உயிர்மெய் எழுத்து வடிவமைப்பு பிழை — "ற" வர வேண்டும். Incorrect consonant cluster.',
          type: 'consonant',
        },
        {
          wrong: 'மொழகளில்',
          correct: 'மொழிகளில்',
          reason: 'விடுபட்ட குறில் எழுத்து — "ழி" சேர்க்க வேண்டும். Short vowel omission.',
          type: 'vowel',
        },
      ],
    },
  },
  {
    trigger: 'கடற்கரையல்',
    response: {
      corrected_text:
        'இன்று வானிலை மிகவும் சூடாக உள்ளது. நாங்கள் கடற்கரைக்குச் சென்றோம். அங்கே நிறைய குழந்தைகள் விளையாடினர்.',
      errors: [
        {
          wrong: 'கடற்கரையல்',
          correct: 'கடற்கரைக்குச்',
          reason: 'வேற்றுமை உருபு மற்றும் சந்திப்பிழை — Incorrect case suffix and sandhi.',
          type: 'grammar',
        },
        {
          wrong: 'நிரய',
          correct: 'நிறைய',
          reason: 'ரகர-றகர வேறுபாடு — Confusion between ர and ற consonants.',
          type: 'consonant',
        },
      ],
    },
  },
  {
    trigger: 'புத்திசாலியானா',
    response: {
      corrected_text:
        'அவன் மிகவும் புத்திசாலியான மாணவன். தினமும் படிப்பதால் அவன் தேர்வில் நல்ல மதிப்பெண் பெறுகிறான்.',
      errors: [
        {
          wrong: 'புத்திசாலியானா',
          correct: 'புத்திசாலியான',
          reason: 'உபரி சந்தி — Extra vowel suffix incorrectly applied.',
          type: 'grammar',
        },
        {
          wrong: 'பெறுகிறன்',
          correct: 'பெறுகிறான்',
          reason: 'ஆண்பால் விகுதி பிழை — Masculine verb suffix "ஆன்" missing.',
          type: 'grammar',
        },
      ],
    },
  },
];

// ── English corrections database ──
const ENGLISH_CORRECTIONS = [
  {
    trigger: 'recieve',
    response: {
      corrected_text:
        'I believe we will receive the package tomorrow. The accommodation at the hotel was excellent and the staff was very knowledgeable.',
      errors: [
        {
          wrong: 'recieve',
          correct: 'receive',
          reason: 'Common misspelling — remember "i before e except after c" rule.',
          type: 'spelling',
        },
        {
          wrong: 'acommodation',
          correct: 'accommodation',
          reason: 'Missing double "m" — the word has two m\'s and two c\'s.',
          type: 'spelling',
        },
        {
          wrong: 'knowlegable',
          correct: 'knowledgeable',
          reason: 'Missing "d" and "e" — derived from "knowledge" + "-able".',
          type: 'spelling',
        },
      ],
    },
  },
  {
    trigger: 'definately',
    response: {
      corrected_text:
        'She will definitely attend the occurrence of the annual committee meeting next Wednesday.',
      errors: [
        {
          wrong: 'definately',
          correct: 'definitely',
          reason: 'Common misspelling — derived from "definite", not "definate".',
          type: 'spelling',
        },
        {
          wrong: 'occurence',
          correct: 'occurrence',
          reason: 'Double "r" and double "c" are both required.',
          type: 'spelling',
        },
        {
          wrong: 'comittee',
          correct: 'committee',
          reason: 'Double "m", double "t", and double "e" are all required.',
          type: 'spelling',
        },
      ],
    },
  },
  {
    trigger: 'seperate',
    response: {
      corrected_text:
        'Please separate the documents and send them to the appropriate department. The necessary adjustments have been acknowledged.',
      errors: [
        {
          wrong: 'seperate',
          correct: 'separate',
          reason: 'Common misspelling — think "there is a rat in separate".',
          type: 'spelling',
        },
        {
          wrong: 'neccessary',
          correct: 'necessary',
          reason: 'One "c" and two "s\'s" — remember "one collar, two socks".',
          type: 'spelling',
        },
        {
          wrong: 'acknowleged',
          correct: 'acknowledged',
          reason: 'Missing "d" in the middle — derived from "knowledge".',
          type: 'spelling',
        },
      ],
    },
  },
];

// ── Sample texts ──
export const TAMIL_SAMPLES = [
  'நான் பாடசலையில் படிக்கிரேன். என் ஆசிரியர் மிகவும் நல்லவர். தமிழ் மொழி உலகின் பழமையான மொழகளில் ஒன்று.',
  'இன்று வானிலை மிகவும் சூடாக உள்ளது. நாங்கள் கடற்கரையல் சென்றோம். அங்கே நிரய குழந்தைகள் விளையாடினர்.',
  'அவன் மிகவும் புத்திசாலியானா மாணவன். தினமும் படிப்பதால் அவன் தேர்வில் நல்ல மதிப்பெண் பெறுகிறன்.',
];

export const ENGLISH_SAMPLES = [
  'I believe we will recieve the package tomorrow. The acommodation at the hotel was excellent and the staff was very knowlegable.',
  'She will definately attend the occurence of the annual comittee meeting next Wednesday.',
  'Please seperate the documents and send them to the appropriate department. The neccessary adjustments have been acknowleged.',
];

/**
 * @param {string} text - Raw input text
 * @param {'en'|'ta'} lang - Active language
 * @returns {Promise<{corrected_text: string, errors: Array}>}
 */
export async function runMockSpellCheck(text, lang = 'ta') {
  const latency = 700 + Math.random() * 600;
  await new Promise((resolve) => setTimeout(resolve, latency));

  const db = lang === 'en' ? ENGLISH_CORRECTIONS : TAMIL_CORRECTIONS;

  for (const entry of db) {
    if (text.includes(entry.trigger)) {
      return entry.response;
    }
  }

  return { corrected_text: text, errors: [] };
}
