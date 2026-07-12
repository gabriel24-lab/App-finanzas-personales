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

export const LANDING_SECTION_HASHES = ["#features", "#preview", "#empezar"];

export function infoPath(slug) {
  return `#/${slug}`;
}

export function landingSectionPath(sectionHash) {
  return sectionHash.startsWith("#") ? sectionHash : `#${sectionHash}`;
}

export function parseAppHash(hash = window.location.hash) {
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
