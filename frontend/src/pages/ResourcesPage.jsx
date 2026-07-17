import React from "react";
import {
  ArrowRight,
  ClipboardList,
  PieChart,
  PiggyBank,
  ShieldCheck,
  Scissors,
  AlertTriangle,
  GraduationCap,
  Coffee,
  Lightbulb,
  Library,
} from "lucide-react";
import { PublicPageLayout } from "../components/PublicPageLayout";

// ─── Configuración de los 10 recursos ─────────────────────────────────────────
// Para añadir tu imagen coloca el archivo en /public/resources/<slug>.webp
// y automáticamente aparecerá como fondo en la tarjeta.
export const RESOURCES = [
  {
    slug: "como-crear-presupuesto",
    image: "/resources/como-crear-presupuesto.webp",
    Icon: ClipboardList,
    color: "#1d4ed8", // azul
  },
  {
    slug: "regla-50-30-20",
    image: "/resources/regla-50-30-20.webp",
    Icon: PieChart,
    color: "#7c3aed", // violeta
  },
  {
    slug: "como-ahorrar-dinero",
    image: "/resources/como-ahorrar-dinero.webp",
    Icon: PiggyBank,
    color: "#059669", // verde
  },
  {
    slug: "fondo-de-emergencia",
    image: "/resources/fondo-de-emergencia.webp",
    Icon: ShieldCheck,
    color: "#d97706", // ámbar
  },
  {
    slug: "como-eliminar-deudas",
    image: "/resources/como-eliminar-deudas.webp",
    Icon: Scissors,
    color: "#dc2626", // rojo
  },
  {
    slug: "errores-financieros",
    image: "/resources/errores-financieros.webp",
    Icon: AlertTriangle,
    color: "#ea580c", // naranja
  },
  {
    slug: "educacion-financiera-estudiantes",
    image: "/resources/educacion-financiera-estudiantes.webp",
    Icon: GraduationCap,
    color: "#0891b2", // cian
  },
  {
    slug: "gastos-hormiga",
    image: "/resources/gastos-hormiga.webp",
    Icon: Coffee,
    color: "#65a30d", // lima
  },
  {
    slug: "metodos-de-ahorro",
    image: "/resources/metodos-de-ahorro.webp",
    Icon: Lightbulb,
    color: "#9333ea", // púrpura
  },
  {
    slug: "glosario-financiero",
    image: "/resources/glosario-financiero.webp",
    Icon: Library,
    color: "#0f766e", // teal
  },
];

// Etiquetas de los títulos de los recursos (puedes moverlos a i18n después)
export const RESOURCE_LABELS = {
  "como-crear-presupuesto": "Cómo crear un presupuesto",
  "regla-50-30-20": "Regla 50/30/20",
  "como-ahorrar-dinero": "Cómo ahorrar dinero",
  "fondo-de-emergencia": "Qué es un fondo de emergencia",
  "como-eliminar-deudas": "Cómo eliminar deudas",
  "errores-financieros": "Errores financieros comunes",
  "educacion-financiera-estudiantes": "Educación financiera para estudiantes",
  "gastos-hormiga": "Cómo controlar gastos hormiga",
  "metodos-de-ahorro": "Métodos de ahorro",
  "glosario-financiero": "Glosario financiero",
};

export const RESOURCE_DESCRIPTIONS = {
  "como-crear-presupuesto":
    "Aprende a diseñar y mantener un presupuesto personal paso a paso.",
  "regla-50-30-20":
    "Distribuye tus ingresos de forma inteligente con esta regla probada.",
  "como-ahorrar-dinero":
    "Estrategias prácticas para construir un hábito de ahorro sólido.",
  "fondo-de-emergencia":
    "Descubre por qué es esencial y cómo empezar el tuyo hoy.",
  "como-eliminar-deudas":
    "Métodos efectivos para salir de deudas y recuperar tu libertad financiera.",
  "errores-financieros":
    "Identifica y evita los errores que más afectan tu economía personal.",
  "educacion-financiera-estudiantes":
    "Conceptos básicos de finanzas pensados para jóvenes y estudiantes.",
  "gastos-hormiga":
    "Detecta esos pequeños gastos diarios que drenan tu presupuesto sin que te des cuenta.",
  "metodos-de-ahorro":
    "Conoce los métodos de ahorro más populares y elige el que mejor se adapte a ti.",
  "glosario-financiero":
    "Domina el vocabulario financiero clave con definiciones claras y sencillas.",
};

const cardBaseClass =
  "group relative overflow-hidden rounded-3xl shadow-md hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 transform-gpu cursor-pointer";

const ResourceCardComponent = React.memo(function ResourceCard({
  resource,
  onNavigate,
  className = "",
}) {
  const title = RESOURCE_LABELS[resource.slug];
  const description = RESOURCE_DESCRIPTIONS[resource.slug];

  return (
    <article
      className={`${cardBaseClass} ${className}`}
      style={{
        minHeight: "260px",
        contain: "layout paint style",
        contentVisibility: "auto",
      }}
      onClick={() => onNavigate(resource.slug)}
      id={`resource-card-${resource.slug}`}
    >
      {/* Imagen de fondo optimizada con lazy loading y GPU acceleration */}
      <img
        src={resource.image}
        alt=""
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 transform-gpu"
        aria-hidden="true"
      />

      {/* Overlay degradado — más oscuro abajo para legibilidad del texto */}
      <div
        className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-90"
        style={{
          background: `linear-gradient(160deg, ${resource.color}cc 0%, rgba(0,0,0,0.78) 100%)`,
        }}
        aria-hidden="true"
      />

      {/* Fallback color cuando no hay imagen */}
      <div
        className="absolute inset-0 -z-10"
        style={{ backgroundColor: resource.color }}
        aria-hidden="true"
      />

      {/* Contenido */}
      <div className="relative flex h-full min-h-65 flex-col justify-end p-6">
        {/* Emoji / Icono en la esquina superior */}
        <div className="absolute top-5 right-5 text-white opacity-95 transition-transform duration-200 group-hover:scale-110">
          <resource.Icon
            className="h-10 w-10 sm:h-11 sm:w-11"
            strokeWidth={1.6}
          />
        </div>

        <h2 className="text-xl font-bold leading-tight text-white drop-shadow-sm">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-white/80 line-clamp-2">
          {description}
        </p>

        {/* CTA */}
        <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-white/90 transition-colors group-hover:text-white">
          <span>Leer recurso</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </article>
  );
});

export const ResourceCard = ResourceCardComponent;

export function ResourcesPage({ onNavigate, onBack }) {
  return (
    <PublicPageLayout
      title="Recursos financieros"
      subtitle="Guías y artículos para mejorar tu relación con el dinero, paso a paso."
      onBack={onBack}
    >
      <section aria-label="Lista de recursos">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {RESOURCES.map((resource) => (
            <ResourceCard
              key={resource.slug}
              resource={resource}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </section>
    </PublicPageLayout>
  );
}
