import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Coins } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { MAIN_CURRENCIES, OTHER_CURRENCIES, findCurrency } from "../currencies";

// Selector de moneda principal, pensado para el formulario de registro.
// Al abrirse, siempre muestra primero USD, EUR y COP (las "importantes"
// según el negocio) y debajo el resto de monedas soportadas.
export function CurrencySelector({ value, onChange }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = findCurrency(value);

  const renderOption = (c) => (
    <motion.button
      key={c.code}
      type="button"
      whileHover={{ x: 2 }}
      onClick={() => {
        onChange(c.code);
        setOpen(false);
      }}
      className="flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 cursor-pointer"
    >
      <span className="flex items-center gap-2.5">
        <span className="text-base leading-none">{c.flag}</span>
        <span>
          {t(c.nameKey)} <span className="text-neutral-400">· {c.code}</span>
        </span>
      </span>
      {c.code === value && (
        <Check className="h-4 w-4 shrink-0 text-brand-600" />
      )}
    </motion.button>
  );

  return (
    <div ref={ref}>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="true"
          aria-expanded={open}
          className="flex w-full items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 py-3 pl-4 pr-4 text-left text-sm font-medium text-neutral-900 transition-all hover:bg-neutral-100 focus:bg-white focus:outline-none focus:ring-4 focus:border-brand-600 focus:ring-brand-600/10 cursor-pointer"
        >
          <Coins className="h-4.5 w-4.5 shrink-0 text-neutral-400" />
          <span className="flex-1">
            <span className="mr-1.5">{selected.flag}</span>
            {t(selected.nameKey)}{" "}
            <span className="text-neutral-400">· {selected.code}</span>
          </span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4 text-neutral-400" />
          </motion.span>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 right-0 z-50 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-neutral-200 bg-white shadow-xl"
            >
              <div className="px-3.5 pb-1.5 pt-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                {t("auth.currency.main")}
              </div>
              {MAIN_CURRENCIES.map(renderOption)}

              <div className="mt-1 border-t border-neutral-100 px-3.5 pb-1.5 pt-2.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                {t("auth.currency.other")}
              </div>
              {OTHER_CURRENCIES.map(renderOption)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="mt-1.5 px-1 text-xs text-neutral-400">
        {t("auth.currency.hint")}
      </p>
    </div>
  );
}
