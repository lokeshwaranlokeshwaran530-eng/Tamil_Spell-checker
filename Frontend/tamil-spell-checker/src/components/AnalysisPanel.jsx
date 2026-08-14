import { useState } from 'react';
import { useLang } from '../contexts/useLang';
import AnomalyCard from './AnomalyCard';
import styles from './AnalysisPanel.module.css';

/* ── Empty State ── */
function EmptyState({ t, isTamil }) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIllustration} aria-hidden="true">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="8" y="8" width="48" height="48" rx="12" fill="#F0FDF4" stroke="#A7F3D0" strokeWidth="1.5"/>
          <path d="M20 24h24M20 32h18M20 40h12" stroke="#6EE7B7" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="46" cy="42" r="10" fill="#ECFDF5" stroke="#34D399" strokeWidth="1.5"/>
          <path d="M42 42l3 3 5-5" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h3 className={`${styles.emptyTitle} ${isTamil ? styles.tamilFont : ''}`}>
        {t.analysis.emptyTitle}
      </h3>
      <p className={`${styles.emptyDesc} ${isTamil ? styles.tamilFont : ''}`}>
        {t.analysis.emptyDesc}{' '}
        <kbd className={styles.kbdInline}>Ctrl+Enter</kbd>
      </p>
      <div className={styles.emptyHints}>
        {t.analysis.emptyHints.map((h) => (
          <span key={h} className={`${styles.emptyHint} ${isTamil ? styles.tamilFont : ''}`}>
            ✓ {h}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Loading State ── */
function LoadingState({ t, isTamil }) {
  return (
    <div className={styles.loadingState}>
      <div className={styles.loadingSpinner} aria-hidden="true" />
      <div className={styles.loadingText}>
        <p className={`${styles.loadingTitle} ${isTamil ? styles.tamilFont : ''}`}>
          {t.analysis.loadingTitle}
        </p>
        <p className={`${styles.loadingSubtitle} ${isTamil ? styles.tamilFont : ''}`}>
          {t.analysis.loadingSubtitle}
        </p>
      </div>
      <div className={styles.skeletonList}>
        {[80, 60, 72].map((w, i) => (
          <div key={i} className={styles.skeletonCard} style={{ animationDelay: `${i * 150}ms` }}>
            <div className={styles.skeletonRow}>
              <div className={styles.skeletonChip} style={{ width: `${w}px` }} />
              <div className={styles.skeletonArrow} />
              <div className={styles.skeletonChip} style={{ width: `${w - 10}px` }} />
            </div>
            <div className={styles.skeletonLine} style={{ width: '75%' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Success (Clean) State ── */
function SuccessState({ data, t, isTamil }) {
  return (
    <div className={styles.successState}>
      <div className={`${styles.cleanBox} animate-bounceIn`}>
        <div className={styles.cleanIcon} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <div>
          <p className={`${styles.cleanTitle} ${isTamil ? styles.tamilFont : ''}`}>
            {t.analysis.cleanTitle}
          </p>
          <p className={`${styles.cleanSubtitle} ${isTamil ? styles.tamilFont : ''}`}>
            {t.analysis.cleanSubtitle}
          </p>
        </div>
      </div>
      <div className={styles.correctedBox}>
        <div className={styles.correctedHeader}>
          <span className={`${styles.sectionLabel} ${isTamil ? styles.tamilFont : ''}`}>
            {t.analysis.correctedLabel}
          </span>
        </div>
        <p className={`${styles.correctedText} ${isTamil ? styles.tamilFont : ''}`}>
          {data.corrected_text}
        </p>
      </div>
    </div>
  );
}

/* ── Success (Errors) State ── */
function ErrorsState({ data, t, isTamil }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.corrected_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch { /* ignore */ }
  };

  return (
    <div className={styles.errorsState}>
      {/* Corrected output */}
      <div className={`${styles.correctedBox} animate-fadeSlideUp`}>
        <div className={styles.correctedHeader}>
          <span className={`${styles.sectionLabel} ${isTamil ? styles.tamilFont : ''}`}>
            {t.analysis.correctedLabel}
          </span>
          <button
            className={`${styles.copyBtn} ${copied ? styles.copyBtnDone : ''} ${isTamil ? styles.tamilFont : ''}`}
            onClick={handleCopy}
            id="copyToClipboardBtn"
          >
            {copied ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {t.analysis.copiedBtn}
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                {t.analysis.copyBtn}
              </>
            )}
          </button>
        </div>
        <p className={`${styles.correctedText} ${isTamil ? styles.tamilFont : ''}`} id="targetRefinementString">
          {data.corrected_text}
        </p>
      </div>

      {/* Issues list */}
      <div className={styles.anomalySection}>
        <div className={styles.anomalyHeader}>
          <span className={`${styles.sectionLabel} ${isTamil ? styles.tamilFont : ''}`}
                style={{ color: 'var(--gray-500)' }}>
            {t.analysis.issuesLabel}
          </span>
          <span className={styles.countBadge}>{data.errors.length}</span>
        </div>
        <div className={styles.anomalyList}>
          {data.errors.map((err, i) => (
            <AnomalyCard key={i} error={err} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Fault State ── */
function FaultState({ message, t, isTamil }) {
  return (
    <div className={`${styles.faultBox} animate-fadeSlideUp`}>
      <div className={styles.faultIcon} aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <div>
        <p className={`${styles.faultTitle} ${isTamil ? styles.tamilFont : ''}`}>
          {t.analysis.faultTitle}
        </p>
        <p className={styles.faultDesc}>{message}</p>
      </div>
    </div>
  );
}

/* ── Main Panel ── */
export default function AnalysisPanel({ status, results, error }) {
  const { t, isTamil } = useLang();
  const errorCount = results?.errors?.length ?? 0;
  const hasErrors = errorCount > 0;

  const badgeEl = status === 'success' && (
    hasErrors
      ? <span className={`${styles.badge} ${styles.badgeError} ${isTamil ? styles.tamilFont : ''}`}>
          {t.analysis.badgeError(errorCount)}
        </span>
      : <span className={`${styles.badge} ${styles.badgeOk} ${isTamil ? styles.tamilFont : ''}`}>
          {t.analysis.badgeOk}
        </span>
  );

  return (
    <div className={styles.panel} aria-live="polite" aria-label="Analysis results">
      {/* Header */}
      <div className={styles.panelHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
          </div>
          <span className={`${styles.panelTitle} ${isTamil ? styles.tamilFont : ''}`}>
            {t.analysis.title}
          </span>
        </div>
        <div id="badgeAnchor">{badgeEl}</div>
      </div>

      {/* Dynamic Content */}
      <div className={styles.content}>
        {status === 'idle'    && <EmptyState   t={t} isTamil={isTamil} />}
        {status === 'loading' && <LoadingState  t={t} isTamil={isTamil} />}
        {status === 'success' && !hasErrors && <SuccessState data={results} t={t} isTamil={isTamil} />}
        {status === 'success' && hasErrors  && <ErrorsState  data={results} t={t} isTamil={isTamil} />}
        {status === 'error'   && <FaultState   message={error} t={t} isTamil={isTamil} />}
      </div>
    </div>
  );
}
