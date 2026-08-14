import { useLang } from '../contexts/useLang';
import styles from './AnomalyCard.module.css';

const TYPE_META = {
  vowel:     { color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
  consonant: { color: '#B45309', bg: '#FFFBEB', border: '#FDE68A' },
  grammar:   { color: '#E11D48', bg: '#FFF1F2', border: '#FECDD3' },
  spelling:  { color: '#1D4ED8', bg: '#EFF6FF', border: '#BFDBFE' },
};
const DEFAULT_META = { color: '#047857', bg: '#ECFDF5', border: '#A7F3D0' };

export default function AnomalyCard({ error, index }) {
  const { t, isTamil } = useLang();
  const meta = TYPE_META[error.type] || DEFAULT_META;

  // Translate type label through t.anomaly.types, fallback to default
  const typeLabel = t.anomaly.types[error.type] || t.anomaly.types.default;

  return (
    <div
      className={styles.card}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Token Comparison Row */}
      <div className={styles.cardTop}>
        <div className={styles.tokens}>
          <span className={`${styles.tokenWrong} ${isTamil ? styles.tamilFont : ''}`}>
            {error.wrong}
          </span>
          <span className={styles.arrow} aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </span>
          <span className={`${styles.tokenCorrect} ${isTamil ? styles.tamilFont : ''}`}>
            {error.correct}
          </span>
        </div>

        <span
          className={`${styles.typeBadge} ${isTamil ? styles.tamilFont : ''}`}
          style={{ color: meta.color, background: meta.bg, borderColor: meta.border }}
        >
          {typeLabel}
        </span>
      </div>

      {/* Explanation */}
      {error.reason && (
        <p className={`${styles.reason} ${isTamil ? styles.tamilFont : ''}`}>
          {error.reason}
        </p>
      )}
    </div>
  );
}
