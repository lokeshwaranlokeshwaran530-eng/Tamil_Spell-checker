import { useLang } from '../contexts/useLang';
import styles from './AppFooter.module.css';

export default function AppFooter() {
  const { t, isTamil } = useLang();

  return (
    <footer className={styles.footer} role="contentinfo">
      <p className={`${styles.text} ${isTamil ? styles.tamilFont : ''}`}>
        {t.footer.powered} &nbsp;·&nbsp;
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          {t.footer.viewSource}
        </a>
        &nbsp;·&nbsp; தமிழ் எழுத்துச் சரிபார்ப்பான் &copy; {new Date().getFullYear()}
      </p>
    </footer>
  );
}
