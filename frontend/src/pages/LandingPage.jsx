import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import {
  ArrowRight,
  Zap,
  PiggyBank,
  BarChart3,
  ShieldCheck,
  SlidersHorizontal,
  Globe2,
  TrendingUp,
  TrendingDown,
  Wallet,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { FloatingCoins } from "../components/FloatingCoins";
import { Reveal, RevealGroup, revealItemVariants } from "../components/Reveal";
import { Footer } from "../components/Footer";
import { RESOURCES, ResourceCard } from "./ResourcesPage";
import { resourceDetailPath, resourcesPath } from "../utils/hashRoute";

const easeOut = [0.22, 1, 0.36, 1];

const FEATURE_ICONS = [
  Zap,
  PiggyBank,
  BarChart3,
  ShieldCheck,
  SlidersHorizontal,
  Globe2,
];
const FEATURE_KEYS = [
  "tracking",
  "budgets",
  "insights",
  "secure",
  "filters",
  "multilang",
];

function ResourceCarousel() {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Esta función arranca el auto-scroll; la aislamos para poder
    // llamarla/pararla desde el observer de abajo.
    const startAutoScroll = () => {
      return setInterval(() => {
        if (scrollRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
          // Si llegamos al final (con un margen de error), volvemos al inicio
          if (scrollLeft + clientWidth >= scrollWidth - 20) {
            scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            // Aproximadamente el ancho de una tarjeta + gap
            scrollRef.current.scrollBy({ left: 374, behavior: "smooth" });
          }
        }
      }, 4500); // Cambia cada 4.5s
    };

    let intervalId = null;

    // Solo corre el auto-scroll mientras el carrusel esté realmente
    // visible en pantalla (al menos un 30% de él).
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!intervalId) intervalId = startAutoScroll();
        } else if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -374 : 374,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 group">
      {/* Botones (se muestran al hacer hover en desktop) */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg text-neutral-800 opacity-0 transition-opacity hover:bg-neutral-50 group-hover:opacity-100 ring-1 ring-black/5"
        aria-label="Anterior"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg text-neutral-800 opacity-0 transition-opacity hover:bg-neutral-50 group-hover:opacity-100 ring-1 ring-black/5"
        aria-label="Siguiente"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 px-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {RESOURCES.map((resource) => (
          <div
            key={resource.slug}
            className="snap-center shrink-0 w-[85vw] sm:w-87.5"
          >
            <ResourceCard
              resource={resource}
              index={0}
              onNavigate={(slug) => {
                window.location.hash = resourceDetailPath(slug);
              }}
            />
          </div>
        ))}
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .snap-x::-webkit-scrollbar { display: none; }
      `,
        }}
      />
    </div>
  );
}

function FeatureCard({ Icon, titleKey, descKey, t }) {
  return (
    <motion.div
      variants={revealItemVariants}
      whileHover={{ y: -6, transition: { duration: 0.35, ease: easeOut } }}
      className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
    >
      <motion.div
        whileHover={{ rotate: 8, scale: 1.08 }}
        transition={{ duration: 0.35, ease: easeOut }}
        className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white"
      >
        <Icon className="h-5 w-5" />
      </motion.div>
      <h3 className="text-base font-bold tracking-tight text-neutral-900">
        {t(titleKey)}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">
        {t(descKey)}
      </p>
    </motion.div>
  );
}

// Versión compacta del mockup, pensada para ir al lado del texto del CTA
// final (no necesita todo el detalle de DashboardPreviewMock: solo dar la
// sensación de "así se ve" en poco espacio).
function MiniDashboardCard({ t }) {
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-2xl shadow-black/30">
      <div className="flex items-center gap-1.5 border-b border-neutral-100 bg-neutral-50 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-brand-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-brand-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-brand-500" />
      </div>

      <div className="space-y-4 p-5">
        <div className="rounded-2xl bg-brand-700 p-4 text-white">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/85">
            <Wallet className="h-3.5 w-3.5" />
            {t("landing.preview.balance")}
          </div>
          <p className="mt-2 text-xl font-bold tracking-tight">$12,480.50</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-neutral-200 p-3">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              {t("landing.preview.income")}
            </div>
            <p className="mt-1.5 text-sm font-bold text-neutral-900">
              $3,250.00
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-200 p-3">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-rose-500">
              <TrendingDown className="h-3 w-3" />
              {t("landing.preview.expenses")}
            </div>
            <p className="mt-1.5 text-sm font-bold text-neutral-900">
              $1,180.35
            </p>
          </div>
        </div>

        <div className="space-y-2.5 rounded-2xl border border-neutral-200 p-4">
          {[
            { label: "🍔 Comida", pct: 72, color: "bg-brand-800" },
            { label: "🚗 Transporte", pct: 45, color: "bg-brand-500" },
          ].map((b) => (
            <div key={b.label}>
              <div className="mb-1 flex items-center justify-between text-[11px] font-medium text-neutral-600">
                <span>{b.label}</span>
                <span>
                  {b.pct}% {t("landing.preview.budgetUsed")}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                <div
                  className={`h-full rounded-full ${b.color}`}
                  style={{ width: `${b.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Mini "maqueta" del dashboard real, construida con los mismos tokens
// visuales (tarjetas redondeadas, KPIs, barra de presupuesto) para dar una
// vista previa fiel sin depender de una captura de pantalla estática.
function DashboardPreviewMock({ t }) {
  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <div className="pointer-events-none absolute -top-10 -left-10 h-56 w-56 rounded-full bg-brand-300/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-56 w-56 rounded-full bg-brand-500/20 blur-3xl" />

      <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-2xl shadow-brand-900/20">
        {/* Barra de título estilo ventana */}
        <div className="flex items-center gap-1.5 border-b border-neutral-100 bg-neutral-50 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-brand-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-brand-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-brand-500" />
        </div>

        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3">
          {/* KPI: Balance */}
          <div className="rounded-2xl bg-brand-700 p-4 text-white">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/85">
              <Wallet className="h-3.5 w-3.5" />
              {t("landing.preview.balance")}
            </div>
            <p className="mt-2 text-xl font-bold tracking-tight">$12,480.50</p>
          </div>
          {/* KPI: Ingresos */}
          <div className="rounded-2xl border border-neutral-200 p-4">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5" />
              {t("landing.preview.income")}
            </div>
            <p className="mt-2 text-xl font-bold tracking-tight text-neutral-900">
              $3,250.00
            </p>
          </div>
          {/* KPI: Gastos */}
          <div className="rounded-2xl border border-neutral-200 p-4">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-rose-500">
              <TrendingDown className="h-3.5 w-3.5" />
              {t("landing.preview.expenses")}
            </div>
            <p className="mt-2 text-xl font-bold tracking-tight text-neutral-900">
              $1,180.35
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 px-5 pb-5 sm:grid-cols-5">
          {/* Presupuestos */}
          <div className="space-y-3 rounded-2xl border border-neutral-200 p-4 sm:col-span-2">
            <p className="text-[11px] font-bold uppercase tracking-wide text-neutral-600">
              {t("landing.preview.card2.title")}
            </p>
            {[
              { label: "🍔 Comida", pct: 72, color: "bg-brand-800" },
              { label: "🚗 Transporte", pct: 45, color: "bg-brand-500" },
              { label: "🎬 Ocio", pct: 90, color: "bg-brand-300" },
            ].map((b) => (
              <div key={b.label}>
                <div className="mb-1 flex items-center justify-between text-xs font-medium text-neutral-600">
                  <span>{b.label}</span>
                  <span className="text-neutral-600">
                    {b.pct}% {t("landing.preview.budgetUsed")}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className={`h-full rounded-full ${b.color}`}
                    style={{ width: `${b.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Historial */}
          <div className="rounded-2xl border border-neutral-200 p-4 sm:col-span-3">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wide text-neutral-600">
                {t("landing.preview.card3.title")}
              </p>
              <Search className="h-3.5 w-3.5 text-neutral-500" />
            </div>
            {[
              {
                label: "Supermercado",
                cat: "🍔 Comida",
                amount: "-$54.20",
                neg: true,
              },
              {
                label: "Salario",
                cat: "💼 Ingreso",
                amount: "+$1,200.00",
                neg: false,
              },
              {
                label: "Uber",
                cat: "🚗 Transporte",
                amount: "-$12.80",
                neg: true,
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between border-b border-neutral-50 py-2 last:border-0"
              >
                <div>
                  <p className="text-xs font-semibold text-neutral-800">
                    {row.label}
                  </p>
                  <p className="text-[11px] text-neutral-600">{row.cat}</p>
                </div>
                <span
                  className={`text-xs font-bold ${row.neg ? "text-rose-500" : "text-emerald-600"}`}
                >
                  {row.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LandingPage({ onGetStarted, onLogin }) {
  const { t } = useLanguage();
  const pageRef = useRef(null);
  const headerRef = useRef(null);

  // Alto real del header, medido en vivo. Lo usamos como padding-top del
  // hero para que el navbar (ahora fixed, fuera del flujo normal) no tape
  // el contenido de arriba. ResizeObserver lo mantiene correcto en
  // cualquier dispositivo/ancho, sin necesitar un valor fijo "a ojo".
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const updateHeight = () => setHeaderHeight(el.offsetHeight);
    updateHeight();
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, []);

  // true en cuanto el usuario baja un poco: ahí cambiamos el navbar de
  // "transparente con texto blanco" (para leerse sobre la foto del hero) a
  // "fondo blanco con texto oscuro" (para leerse sobre el resto de la
  // página, que es clara).
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 80);
        ticking = false;
      });
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Nota: "preview-mock" y "cta-final" ya están envueltos en <Reveal>,
      // que anima opacity/y con Framer Motion al entrar en el viewport.
      // Tener también un gsap.from() con ScrollTrigger sobre esos mismos
      // elementos hacía que dos motores de animación distintos controlaran
      // el mismo opacity al mismo tiempo con umbrales de disparo distintos:
      // si uno de los dos no se disparaba en el momento esperado, el
      // contenido se quedaba en opacity 0 (por eso "desaparecía"). Se quita
      // de aquí y se deja que Reveal maneje esa parte, como en el resto de
      // la página.
      //
      // GSAP se queda con una animación propia que no pisa a Framer: el
      // flotado ambiental y continuo de los blobs de fondo del hero.
      gsap.to("[data-gsap='hero-blob']", {
        y: (i) => (i % 2 === 0 ? -22 : 18),
        x: (i) => (i % 2 === 0 ? 14 : -10),
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.6,
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-neutral-50 text-neutral-800 antialiased"
    >
      {/* Nav centrado — fixed para quedar visible durante todo el scroll,
          en cualquier dispositivo. Cambia de transparente/texto blanco
          (sobre la foto del hero) a blanco/texto oscuro (sobre el resto
          de la página) según isScrolled. */}
      <motion.header
        ref={headerRef}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easeOut }}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          isScrolled
            ? "bg-white/90 shadow-sm backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto grid max-w-6xl grid-cols-2 items-center px-4 py-6 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl backdrop-blur transition-colors duration-300 ${
                isScrolled ? "bg-neutral-100" : "bg-white/10"
              }`}
            >
              <img
                src={isScrolled ? "/isotipo-dark.png" : "/isotipo-light.png"}
                alt={t("common.appName")}
                className="h-9 w-9 object-contain"
              />
            </div>
            <span
              className={`hidden text-sm font-bold tracking-tight sm:inline transition-colors duration-300 ${
                isScrolled ? "text-neutral-900" : "text-white"
              }`}
            >
              {t("common.appName")}
            </span>
          </div>

          <nav className="hidden items-center justify-center gap-8 lg:flex">
            <a
              href="#features"
              className={`text-xs font-semibold transition-colors duration-300 ${
                isScrolled
                  ? "text-neutral-600 hover:text-neutral-900"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {t("landing.nav.features")}
            </a>
            <a
              href="#preview"
              className={`text-xs font-semibold transition-colors duration-300 ${
                isScrolled
                  ? "text-neutral-600 hover:text-neutral-900"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {t("landing.nav.preview")}
            </a>
            <a
              href="#empezar"
              className={`text-xs font-semibold transition-colors duration-300 ${
                isScrolled
                  ? "text-neutral-600 hover:text-neutral-900"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {t("landing.nav.start")}
            </a>
          </nav>

          <div className="flex items-center justify-end gap-2 sm:gap-3">
            <div>
              <LanguageSwitcher variant={isScrolled ? "default" : "light"} />
            </div>
            <button
              type="button"
              onClick={onLogin}
              className={`flex items-center gap-1 text-xs font-semibold transition-colors duration-300 hover:opacity-80 cursor-pointer ${
                isScrolled ? "text-neutral-900" : "text-white"
              }`}
            >
              {t("landing.nav.login")}
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </motion.header>

      <div
        className="relative overflow-hidden bg-brand-950 bg-cover bg-center"
        style={{
          backgroundImage: "url('/hero.jpg')",
          paddingTop: headerHeight,
        }}
      >
        {/* Fondo atmosférico: capas de color difuminadas + textura sutil + viñeta
            sobre la foto de fondo, para mantener el contraste del texto blanco. */}
        <div className="pointer-events-none absolute inset-0">
          <div
            data-gsap="hero-blob"
            className="absolute -top-40 left-[8%] h-112 w-md rounded-full bg-brand-500/20 blur-[110px]"
          />
          <div
            data-gsap="hero-blob"
            className="absolute -top-24 right-[10%] h-96 w-[24rem] rounded-full bg-brand-300/15 blur-[110px]"
          />
          <div
            data-gsap="hero-blob"
            className="absolute -bottom-32 left-1/3 h-104 w-104 rounded-full bg-brand-700/20 blur-[120px]"
          />
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 30%, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.8) 100%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-brand-950 to-transparent" />
        </div>

        {/* Monedas flotando de fondo: suben y bajan suavemente, nunca caen */}
        <FloatingCoins className="z-1" />

        {/* Hero centrado */}
        <section className="relative z-10 mx-auto max-w-3xl px-4 pb-24 pt-14 text-center sm:px-6 sm:pb-32 sm:pt-16 lg:px-8">
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut, delay: 0.1 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              document
                .getElementById("features")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-neutral-200 backdrop-blur transition-colors hover:bg-white/15 cursor-pointer"
          >
            {t("landing.hero.badge")}
            <span className="font-semibold text-brand-300">
              {t("landing.hero.badgeLink")} →
            </span>
          </motion.button>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.2 }}
            className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            {t("landing.hero.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.32 }}
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg"
          >
            {t("landing.hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.44 }}
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <motion.button
              type="button"
              onClick={onGetStarted}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.25, ease: easeOut }}
              className="flex items-center justify-center gap-2 rounded-xl bg-brand-800 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/30 transition-shadow hover:bg-brand-950 hover:shadow-xl cursor-pointer"
            >
              {t("landing.hero.ctaPrimary")}
            </motion.button>
            <motion.button
              type="button"
              onClick={onLogin}
              whileHover={{ x: 3, opacity: 0.85 }}
              className="flex items-center gap-1.5 text-sm font-semibold text-white cursor-pointer"
            >
              {t("landing.hero.ctaSecondary")}
              <ArrowRight className="h-3.5 w-3.5" />
            </motion.button>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-5 text-xs font-medium text-white/75"
          >
            {t("landing.hero.note")}
          </motion.p>
        </section>
      </div>
      <section
        id="features"
        className="border-t border-neutral-200 bg-white py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
              {t("landing.features.title")}
            </h2>
            <p className="mt-3 text-sm text-neutral-500 sm:text-base">
              {t("landing.features.subtitle")}
            </p>
          </Reveal>

          <RevealGroup className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURE_KEYS.map((key, i) => (
              <FeatureCard
                key={key}
                Icon={FEATURE_ICONS[i]}
                titleKey={`landing.features.${key}.title`}
                descKey={`landing.features.${key}.desc`}
                t={t}
              />
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Preview / cómo se ve la app */}
      <section
        id="preview"
        className="relative overflow-hidden bg-brand-950 bg-cover bg-center py-20"
        style={{ backgroundImage: "url('/dentro.jpg')" }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 30%, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.82) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {t("landing.preview.title")}
            </h2>
            <p className="mt-3 text-sm text-white/75 sm:text-base">
              {t("landing.preview.subtitle")}
            </p>
          </Reveal>

          <Reveal delay={0.1} y={36} className="mt-12">
            <DashboardPreviewMock t={t} />
          </Reveal>

          <RevealGroup className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {["card1", "card2", "card3"].map((key) => (
              <motion.div
                key={key}
                variants={revealItemVariants}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, ease: easeOut }}
                className="rounded-3xl border border-white/10 bg-white/95 p-6 text-center shadow-lg backdrop-blur"
              >
                <h3 className="text-sm font-bold text-neutral-900">
                  {t(`landing.preview.${key}.title`)}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-neutral-500">
                  {t(`landing.preview.${key}.desc`)}
                </p>
              </motion.div>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Recursos Carrusel */}
      <section className="overflow-hidden bg-neutral-50 py-24 sm:py-32 border-y border-neutral-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-12 text-center">
          <Reveal>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-600">
              Aprende con nosotros
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              Domina tus finanzas personales
            </p>
            <p className="mt-4 text-lg text-neutral-500 max-w-2xl mx-auto">
              Descubre guías, métodos de ahorro y consejos prácticos para
              mejorar tu relación con el dinero.
            </p>
          </Reveal>
        </div>

        {/* Carrusel interactivo */}
        <ResourceCarousel />

        <div className="mt-8 flex justify-center">
          <a
            href={resourcesPath()}
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 transition-all hover:bg-neutral-50"
          >
            Ver todos los recursos
            <ArrowRight className="h-4 w-4 text-neutral-400" />
          </a>
        </div>
      </section>

      {/* CTA final */}
      <section
        id="empezar"
        className="relative overflow-hidden bg-brand-950 py-20 text-white"
      >
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-brand-300/10 blur-3xl" />
        </div>

        {/* Mismas monedas flotantes del hero, atenuadas para no competir con el contenido */}
        <FloatingCoins className="opacity-40" />

        <div className="relative mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal className="text-center lg:text-left">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {t("landing.cta.title")}
            </h2>
            <p className="mt-3 text-sm text-white/85 sm:text-base">
              {t("landing.cta.subtitle")}
            </p>
            <motion.button
              type="button"
              onClick={onGetStarted}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-neutral-900 shadow-lg transition-shadow hover:shadow-xl cursor-pointer"
            >
              {t("landing.cta.button")}
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </Reveal>

          <Reveal delay={0.15} y={28}>
            <MiniDashboardCard t={t} />
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
