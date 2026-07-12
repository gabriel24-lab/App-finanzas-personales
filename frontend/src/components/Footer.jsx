import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { infoPath, landingSectionPath } from "../utils/hashRoute";

const FOOTER_COLUMNS = [
  {
    titleKey: "landing.footer.product.title",
    links: [
      { labelKey: "landing.footer.product.features", href: landingSectionPath("#features") },
      { labelKey: "landing.footer.product.preview", href: landingSectionPath("#preview") },
      { labelKey: "landing.footer.product.budgets", href: landingSectionPath("#features") },
      { labelKey: "landing.footer.product.categories", href: landingSectionPath("#features") },
    ],
  },
  {
    titleKey: "landing.footer.support.title",
    links: [
      { labelKey: "landing.footer.support.help", href: infoPath("help") },
      { labelKey: "landing.footer.support.docs", href: infoPath("docs") },
      { labelKey: "landing.footer.support.guides", href: infoPath("guides") },
    ],
  },
  {
    titleKey: "landing.footer.company.title",
    links: [
      { labelKey: "landing.footer.company.about", href: infoPath("about") },
      { labelKey: "landing.footer.company.blog", href: infoPath("blog") },
      { labelKey: "landing.footer.company.contact", href: infoPath("contact") },
    ],
  },
  {
    titleKey: "landing.footer.legal.title",
    links: [
      { labelKey: "landing.footer.legal.terms", href: infoPath("terms") },
      { labelKey: "landing.footer.legal.privacy", href: infoPath("privacy") },
      { labelKey: "landing.footer.legal.license", href: infoPath("license") },
    ],
  },
];

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        {t("landing.footer.heading")}
      </h2>
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-6">
            <img
              src="/isotipo.png"
              alt={t("common.appName")}
              className="h-9 w-auto"
            />
            <p className="max-w-xs text-sm leading-relaxed text-neutral-400">
              {t("landing.footer.tagline")}
            </p>
            <p className="text-xs text-neutral-500">
              © {year} {t("common.appName")}. {t("landing.footer.rights")}
            </p>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4 xl:col-span-2 xl:mt-0">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.titleKey}>
                <h3 className="text-sm font-semibold text-white">
                  {t(column.titleKey)}
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {column.links.map((link) => (
                    <li key={link.labelKey}>
                      <a
                        href={link.href}
                        className="text-sm text-neutral-400 transition-colors hover:text-white"
                      >
                        {t(link.labelKey)}
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
