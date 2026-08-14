import { useContext } from 'react';
import { LanguageContext } from './LanguageContext.js';

/** Hook to consume the language context */
export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>');
  return ctx;
}
