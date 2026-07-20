import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export function ThemeToggle({ variant = "default" }) {
  const { theme, toggleTheme } = useTheme();

  if (variant === "icon" || variant === "icon-light") {
    const baseIconClass = "flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm transition-all cursor-pointer ";
    const defaultIconClass = baseIconClass + "border-neutral-200 bg-white text-neutral-500 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-600 active:bg-brand-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:border-brand-700 dark:hover:bg-neutral-700 dark:hover:text-brand-400";
    const lightIconClass = baseIconClass + "border-white/20 bg-white/10 text-white hover:bg-white/20";
    
    return (
      <button
        onClick={toggleTheme}
        className={variant === "icon-light" ? lightIconClass : defaultIconClass}
        aria-label="Toggle theme"
        title={theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
      >
        {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-1.5 rounded-2xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-neutral-500 shadow-sm transition-all hover:border-brand-200 hover:bg-brand-50 hover:text-brand-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:border-brand-700 dark:hover:bg-neutral-700 dark:hover:text-brand-400 cursor-pointer"
      title={theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
    >
      {theme === "light" ? (
        <>
          <Moon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Modo oscuro</span>
        </>
      ) : (
        <>
          <Sun className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Modo claro</span>
        </>
      )}
    </button>
  );
}
