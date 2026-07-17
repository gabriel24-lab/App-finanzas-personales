export const INFO_SLUGS = [
  "help",
  "docs",
  "guides",
  "about",
  "blog",
  "contact",
  "terms",
  "privacy",
  "license",
];

export const RESOURCE_SLUGS = [
  "como-crear-presupuesto",
  "regla-50-30-20",
  "como-ahorrar-dinero",
  "fondo-de-emergencia",
  "como-eliminar-deudas",
  "errores-financieros",
  "educacion-financiera-estudiantes",
  "gastos-hormiga",
  "metodos-de-ahorro",
  "glosario-financiero",
];

export const LANDING_SECTION_HASHES = ["#features", "#preview", "#empezar"];

export function infoPath(slug) {
  return `#/${slug}`;
}

export function resourcesPath() {
  return "#/resources";
}

export function resourceDetailPath(slug) {
  return `#/resources/${slug}`;
}

export function landingSectionPath(sectionHash) {
  return sectionHash.startsWith("#") ? sectionHash : `#${sectionHash}`;
}

export function parseAppHash(hash = window.location.hash) {
  // Detalle de un recurso: #/resources/<slug>
  const resourceDetailMatch = hash.match(/^#\/resources\/([a-z0-9-]+)$/);
  if (resourceDetailMatch && RESOURCE_SLUGS.includes(resourceDetailMatch[1])) {
    return { kind: "resource-detail", slug: resourceDetailMatch[1] };
  }

  // Lista de recursos: #/resources
  if (hash === "#/resources") {
    return { kind: "resources" };
  }

  // Páginas de info: #/<slug>
  const infoMatch = hash.match(/^#\/([a-z]+)$/);
  if (infoMatch && INFO_SLUGS.includes(infoMatch[1])) {
    return { kind: "info", slug: infoMatch[1] };
  }

  if (LANDING_SECTION_HASHES.includes(hash)) {
    return { kind: "landing", section: hash };
  }

  if (hash === "" || hash === "#") {
    return { kind: "landing", section: null };
  }

  return { kind: "unknown", hash };
}

export function scrollToLandingSection(sectionHash) {
  if (!sectionHash) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  requestAnimationFrame(() => {
    document.querySelector(sectionHash)?.scrollIntoView({ behavior: "smooth" });
  });
}
