import React from "react";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Footer } from "./Footer";

export function PublicPageLayout({ title, subtitle, children, onBack }) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800 antialiased">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-semibold text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("info.common.backHome")}
          </button>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onBack();
            }}
            className="flex items-center gap-2"
          >
            <img
              src="/isotipo-dark.png"
              alt={t("common.appName")}
              className="h-10 w-auto"
            />
            <span className="hidden text-sm font-bold text-neutral-900 sm:inline">
              {t("common.appName")}
            </span>
          </a>

          <LanguageSwitcher variant="default" />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-neutral-500">
              {subtitle}
            </p>
          )}
        </div>

        {children}
      </main>

      <Footer />
    </div>
  );
}
