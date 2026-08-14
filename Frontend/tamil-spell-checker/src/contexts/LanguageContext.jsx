import { createContext, useContext, useState, useCallback } from 'react';
import { translations } from '../i18n/translations';

export const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en'); // 'en' | 'ta'

  const toggle = useCallback(() => {
    setLang((prev) => (prev === 'en' ? 'ta' : 'en'));
  }, []);

  const t = translations[lang];
  const isTamil = lang === 'ta';

  return (
    <LanguageContext.Provider value={{ lang, toggle, t, isTamil }}>
      {children}
    </LanguageContext.Provider>
  );
}

/** Hook — exported separately so Vite Fast Refresh is happy */
export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>');
  return ctx;
}
