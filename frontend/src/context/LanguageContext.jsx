import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { translations, DEFAULT_LANGUAGE, LANGUAGES } from "../i18n/translations";

const LANG_KEY = "app_finanzas_lang";
const LanguageContext = createContext(null);

function getInitialLanguage() {
  const stored = localStorage.getItem(LANG_KEY);
  if (stored && translations[stored]) return stored;
  return DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLanguage);

  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  const setLang = useCallback((next) => {
    if (!translations[next]) return;
    localStorage.setItem(LANG_KEY, next);
    setLangState(next);
  }, []);

  // t("clave.anidada", { variable: "valor" }) -> string traducido con
  // interpolación simple de {variable}. Si falta la clave, cae a español
  // y, en último caso, muestra la clave misma para no romper la UI.
  const t = useCallback(
    (key, vars) => {
      const dict = translations[lang] || translations[DEFAULT_LANGUAGE];
      let str = dict[key] ?? translations[DEFAULT_LANGUAGE][key] ?? key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          str = str.replace(new RegExp(`{${k}}`, "g"), v);
        });
      }
      return str;
    },
    [lang]
  );

  const value = useMemo(
    () => ({ lang, setLang, t, languages: LANGUAGES }),
    [lang, setLang, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage debe usarse dentro de un <LanguageProvider>");
  return ctx;
}
