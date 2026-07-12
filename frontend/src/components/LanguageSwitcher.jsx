import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

// Selector de idioma tipo "mundo" para la esquina superior derecha.
// variant="light"  -> pensado para fondos oscuros (landing hero, panel de auth)
// variant="default"-> pensado para fondos claros (dashboard, resto de la app)
export function LanguageSwitcher({ variant = "default" }) {
  const { lang, setLang, languages, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isLight = variant === "light";

  return (
    <div className="relative" ref={ref}>
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title={t("common.language")}
        aria-haspopup="true"
        aria-expanded={open}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        className={`flex h-9 w-9 items-center justify-center rounded-2xl border shadow-sm cursor-pointer ${
          isLight
            ? "border-white/15 bg-white/10 text-white backdrop-blur hover:bg-white/20"
            : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900"
        }`}
      >
        <motion.span animate={{ rotate: open ? 25 : 0 }} transition={{ duration: 0.25 }}>
          <Globe className="h-4 w-4" />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-2xl border shadow-xl ${
              isLight
                ? "border-white/10 bg-neutral-900/95 backdrop-blur"
                : "border-neutral-200 bg-white"
            }`}
          >
            <div
              className={`px-3.5 pb-1.5 pt-3 text-[10px] font-bold uppercase tracking-wider ${
                isLight ? "text-neutral-400" : "text-neutral-400"
              }`}
            >
              {t("common.language")}
            </div>
            {languages.map((l) => (
              <motion.button
                key={l.code}
                type="button"
                whileHover={{ x: 2 }}
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left text-sm font-medium transition-colors cursor-pointer ${
                  isLight
                    ? "text-neutral-200 hover:bg-white/10"
                    : "text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{l.flag}</span>
                  <span>{l.label}</span>
                </span>
                {l.code === lang && (
                  <Check className={`h-4 w-4 ${isLight ? "text-lime-400" : "text-neutral-900"}`} />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}