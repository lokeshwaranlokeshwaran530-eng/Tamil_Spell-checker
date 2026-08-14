import { useLang } from '../contexts/useLang';
import styles from './AppHeader.module.css';

export default function AppHeader() {
  const { t, lang, toggle, isTamil } = useLang();

  return (
    <header className={styles.header} role="banner" lang={lang}>
      <div className={styles.brand}>
        <div className={styles.avatar} aria-hidden="true">த</div>
        <div className={styles.brandMeta}>
          <span className={`${styles.brandName} ${isTamil ? styles.tamilFont : ''}`}>
            {t.header.brandName}
          </span>
          <span className={`${styles.brandSub} ${isTamil ? '' : styles.tamilFont}`}>
            {t.header.brandSub}
          </span>
        </div>
      </div>

      <div className={styles.headerRight}>
        <div className={styles.statusChip}>
          <span className={styles.statusDot} aria-hidden="true" />
          <span className={isTamil ? styles.tamilFont : ''}>{t.header.statusLabel}</span>
        </div>

        {/* Language Toggle */}
        <button
          className={styles.langToggle}
          onClick={toggle}
          aria-label={`Switch to ${isTamil ? 'English' : 'Tamil'}`}
          title={t.langToggle}
        >
          <span className={styles.langIcon} aria-hidden="true">
            {isTamil ? '🇬🇧' : '🇮🇳'}
          </span>
          <span className={`${styles.langLabel} ${isTamil ? styles.tamilFont : ''}`}>
            {t.langToggle}
          </span>
        </button>

        <span className={`${styles.badge} ${isTamil ? styles.tamilFont : ''}`}>
          {t.header.badge}
        </span>
      </div>
    </header>
  );
}
