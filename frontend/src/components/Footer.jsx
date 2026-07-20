import React, { useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { ThemeToggle } from "./ThemeToggle";
import {
  infoPath,
  landingSectionPath,
  resourcesPath,
} from "../utils/hashRoute";

const FOOTER_COLUMNS = [
  {
    titleKey: "landing.footer.product.title",
    links: [
      {
        labelKey: "landing.footer.product.features",
        href: landingSectionPath("#features"),
      },
      {
        labelKey: "landing.footer.product.preview",
        href: landingSectionPath("#preview"),
      },
      {
        labelKey: "landing.footer.product.categories",
        href: landingSectionPath("#features"),
      },
    ],
  },
  {
    titleKey: "landing.footer.support.title",
    links: [
      { labelKey: "landing.footer.support.help", href: infoPath("help") },
      { labelKey: "landing.footer.support.guides", href: infoPath("guides") },
    ],
  },
  {
    titleKey: "landing.footer.company.title",
    links: [
      { labelKey: "landing.footer.company.about", href: infoPath("about") },
      { labelKey: "landing.footer.company.blog", href: resourcesPath() },
      { labelKey: "landing.footer.company.contact", href: infoPath("contact") },
    ],
  },
  {
    titleKey: "landing.footer.legal.title",
    links: [
      { labelKey: "landing.footer.legal.terms", href: infoPath("terms") },
      { labelKey: "landing.footer.legal.privacy", href: infoPath("privacy") },
    ],
  },
];

export function Footer() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const year = new Date().getFullYear();
  const footerRef = useRef(null);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    // Mientras el footer está a la vista, "marcamos" la URL actual como
    // #site-footer usando replaceState (no pushState): esto NO crea una
    // entrada nueva en el historial ni mueve el scroll, solo actualiza
    // en silencio a dónde debería volver el usuario si presiona "atrás"
    // después de haber salido desde aquí (ej. a Ayuda, Empresa, etc).
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          history.replaceState(null, "", landingSectionPath("#site-footer"));
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      id="site-footer"
      ref={footerRef}
      className="border-t border-neutral-200 bg-white"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        {t("landing.footer.heading")}
      </h2>
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-6">
            <img
              src={theme === "dark" ? "/isotipo-light.png" : "/isotipo-dark.png"}
              alt={t("common.appName")}
              className="h-12 w-auto"
            />
            <p className="max-w-xs text-sm leading-relaxed text-neutral-500">
              {t("landing.footer.tagline")}
            </p>
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
            <p className="text-xs text-neutral-400">
              © {year} {t("common.appName")}. {t("landing.footer.rights")}
            </p>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4 xl:col-span-2 xl:mt-0">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.titleKey}>
                <h3 className="text-sm font-semibold text-neutral-900">
                  {t(column.titleKey)}
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {column.links.map((link) => (
                    <li key={link.labelKey ?? link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
                      >
                        {link.label ?? t(link.labelKey)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
