import { useState, useRef, useEffect, useCallback } from 'react';
import { useLang } from '../contexts/useLang';
import { TAMIL_SAMPLES, ENGLISH_SAMPLES } from '../mockEngine';
import styles from './EditorPanel.module.css';

const CHARACTER_LIMIT = 5000;

export default function EditorPanel({ onAnalyze, isLoading }) {
  const { t, isTamil, lang } = useLang();
  const [text, setText] = useState('');
  const [sampleIndex, setSampleIndex] = useState(0);
  const textareaRef = useRef(null);

  // Reset text and sample index when language changes
  useEffect(() => {
    setText('');
    setSampleIndex(0);
  }, [lang]);

  const charCount = text.length;
  const usagePercent = Math.min((charCount / CHARACTER_LIMIT) * 100, 100);
  const isOverLimit = charCount > CHARACTER_LIMIT;
  const canSubmit = charCount > 0 && !isOverLimit && !isLoading;

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.max(ta.scrollHeight, 260)}px`;
  }, [text]);

  const handleKeyDown = useCallback(
    (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && canSubmit) {
        e.preventDefault();
        onAnalyze(text);
      }
    },
    [canSubmit, onAnalyze, text]
  );

  const handleClear = () => {
    setText('');
    textareaRef.current?.focus();
  };

  const handleSample = () => {
    const samples = isTamil ? TAMIL_SAMPLES : ENGLISH_SAMPLES;
    setText(samples[sampleIndex % samples.length]);
    setSampleIndex((i) => i + 1);
    textareaRef.current?.focus();
  };

  const handleAnalyzeClick = () => {
    if (canSubmit) onAnalyze(text);
  };

  const progressColor =
    usagePercent > 90 ? 'var(--error-500)' :
    usagePercent > 70 ? 'var(--warn-500)' :
    'var(--brand-500)';

  return (
    <div className={styles.panel}>
      {/* Panel Header */}
      <div className={styles.panelHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </div>
          <span className={`${styles.panelTitle} ${isTamil ? styles.tamilFont : ''}`}>
            {t.editor.title}
          </span>
        </div>
        <div className={`${styles.charCount} ${isOverLimit ? styles.charCountError : ''}`}>
          <span className={isOverLimit ? styles.charNumError : ''}>
            {t.editor.characters(charCount)}
          </span>
        </div>
      </div>

      {/* Textarea */}
      <div className={styles.editorArea}>
        <textarea
          ref={textareaRef}
          id="workspaceInput"
          className={`${styles.textarea} ${isTamil ? styles.tamilFont : ''}`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.editor.placeholder}
          spellCheck={false}
          autoComplete="off"
          aria-label={isTamil ? 'தமிழ் உரை உள்ளீட்டு பகுதி' : 'Tamil text input area'}
          aria-describedby="char-hint"
          lang={lang}
        />
      </div>

      {/* Usage Progress Bar */}
      <div className={styles.progressTrack} title={`${Math.round(usagePercent)}% of limit used`}>
        <div
          className={styles.progressFill}
          style={{
            width: `${usagePercent}%`,
            background: progressColor,
            transition: 'width 0.3s var(--ease-out), background 0.3s',
          }}
        />
      </div>

      {/* Action Bar */}
      <div className={styles.actionBar}>
        <div className={styles.actionLeft}>
          <button
            id="clearWorkspaceBtn"
            className={`${styles.btn} ${styles.btnGhost} ${isTamil ? styles.tamilFont : ''}`}
            onClick={handleClear}
            disabled={text.length === 0}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
            </svg>
            {t.editor.clearBtn}
          </button>
          <button
            id="populateSampleBtn"
            className={`${styles.btn} ${styles.btnOutline} ${isTamil ? styles.tamilFont : ''}`}
            onClick={handleSample}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4l3 3"/>
            </svg>
            {t.editor.sampleBtn}
          </button>
        </div>

        <button
          id="evaluateMetricsBtn"
          className={`${styles.btn} ${styles.btnPrimary} ${isTamil ? styles.tamilFont : ''}`}
          onClick={handleAnalyzeClick}
          disabled={!canSubmit}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <span className={styles.spinner} aria-hidden="true" />
              {t.editor.analyzingBtn}
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              {t.editor.analyzeBtn}
              <kbd className={styles.kbd}>⌃↵</kbd>
            </>
          )}
        </button>
      </div>

      <span id="char-hint" className="visually-hidden">
        {charCount} characters entered. Press Ctrl+Enter to analyze.
      </span>
    </div>
  );
}
