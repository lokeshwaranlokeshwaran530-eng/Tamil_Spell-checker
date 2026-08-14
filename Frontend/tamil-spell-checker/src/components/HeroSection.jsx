import { useLang } from '../contexts/useLang';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  const { t, isTamil } = useLang();

  return (
    <section
      className={`${styles.hero} animate-fadeSlideUp`}
      aria-labelledby="hero-heading"
    >
      <div className={`${styles.eyebrow} ${isTamil ? styles.tamilFont : ''}`}>
        <span className={styles.eyebrowIcon}>✦</span>
        {t.hero.eyebrow}
        <span className={styles.eyebrowIcon}>✦</span>
      </div>

      <h1 className={`${styles.heading} ${isTamil ? styles.tamilFont : ''}`} id="hero-heading">
        {t.hero.heading}
        <span className={styles.headingAccent}>{t.hero.headingAccent}</span>
      </h1>

      <p className={`${styles.subheading} ${isTamil ? styles.tamilFont : ''}`}>
        {t.hero.subheading}
      </p>

      <div className={styles.featurePills}>
        {t.hero.pills.map((feat) => (
          <span key={feat} className={`${styles.pill} ${isTamil ? styles.tamilFont : ''}`}>
            {feat}
          </span>
        ))}
      </div>
    </section>
  );
}
