import { useState, useCallback } from 'react';
import { LanguageProvider } from './contexts/LanguageProvider';
import { useLang } from './contexts/useLang';
import AppHeader     from './components/AppHeader';
import HeroSection   from './components/HeroSection';
import EditorPanel   from './components/EditorPanel';
import AnalysisPanel from './components/AnalysisPanel';
import AppFooter     from './components/AppFooter';
import { runMockSpellCheck } from './mockEngine';
import styles from './App.module.css';

const USE_MOCK      = true;
const API_ENDPOINT  = '/api/check';

/* Inner shell — has access to useLang() because it's inside LanguageProvider */
function AppShell() {
  const { lang, t, isTamil } = useLang();

  const [status,  setStatus]  = useState('idle');
  const [results, setResults] = useState(null);
  const [error,   setError]   = useState(null);

  const handleAnalyze = useCallback(async (text) => {
    if (!text?.trim()) return;
    setStatus('loading');
    setResults(null);
    setError(null);

    try {
      let data;
      if (USE_MOCK) {
        data = await runMockSpellCheck(text, lang);
      } else {
        const resp = await fetch(API_ENDPOINT, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ text, lang }),
        });
        if (!resp.ok) throw new Error(`Server responded with ${resp.status}`);
        data = await resp.json();
      }
      setResults(data);
      setStatus('success');
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
      setStatus('error');
    }
  }, [lang]);

  return (
    <div className={`${styles.appShell} ${isTamil ? styles.tamilMode : ''}`}>
      <AppHeader />

      <main className={styles.main}>
        <HeroSection />

        <div className={styles.workspace}>
          <div className={styles.grid}>
            <div className={`${styles.editorCol} animate-fadeSlideUp`} style={{ animationDelay: '80ms' }}>
              <EditorPanel onAnalyze={handleAnalyze} isLoading={status === 'loading'} />
            </div>
            <div className={`${styles.analysisCol} animate-fadeSlideUp`} style={{ animationDelay: '160ms' }}>
              <AnalysisPanel status={status} results={results} error={error} />
            </div>
          </div>

          {/* Stats Bar */}
          <div className={styles.statsBar}>
            {t.stats.map((stat) => (
              <div key={stat.label} className={styles.statItem}>
                <span className={styles.statIcon}>{stat.icon}</span>
                <div className={styles.statMeta}>
                  <span className={`${styles.statValue} ${isTamil ? styles.tamilFont : ''}`}>
                    {stat.value}
                  </span>
                  <span className={`${styles.statLabel} ${isTamil ? styles.tamilFont : ''}`}>
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppShell />
    </LanguageProvider>
  );
}
