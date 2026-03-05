import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { translations, Locale } from '../i18n/translations';

const LOCALE_KEY = 'clickpay-locale';

type LocaleContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: typeof translations.ru;
};

const LocaleContext = createContext<LocaleContextType | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LOCALE_KEY) as Locale | null;
      if (stored === 'ru' || stored === 'en') return stored;
    }
    return 'ru';
  });
  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);
  useEffect(() => {
    localStorage.setItem(LOCALE_KEY, locale);
  }, [locale]);
  const t = translations[locale];

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
