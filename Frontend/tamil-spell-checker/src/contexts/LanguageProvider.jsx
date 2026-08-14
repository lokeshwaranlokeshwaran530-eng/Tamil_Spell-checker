import { useState, useCallback } from 'react';
import { LanguageContext } from './LanguageContext.js';
import { translations } from '../i18n/translations';

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

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
