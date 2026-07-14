import React, { useState, useRef, useEffect } from "react";
import { HelpCircle } from "lucide-react";

/**
 * Pequeño ícono de ayuda contextual ("?") que muestra una explicación breve
 * al pasar el mouse, al enfocar con teclado (Tab) o al tocar en móvil.
 *
 * Por qué existe:
 * Personas que ya usan apps de finanzas no necesitan explicaciones, pero
 * quienes recién empiezan sí. En vez de agregar texto largo permanente
 * (que estorba a los usuarios avanzados) o esconder el significado por
 * completo (que confunde a los principiantes), este componente aplica
 * "divulgación progresiva": la ayuda está siempre disponible a un toque
 * de distancia, pero nunca se impone.
 *
 * Accesible: funciona con teclado, tiene aria-label y role="tooltip".
 */
export function InfoTooltip({ text, label = "Más información" }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <span
      ref={wrapperRef}
      className="relative inline-flex items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full text-neutral-300 transition-colors hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-600/20 cursor-help"
      >
        <HelpCircle className="h-3.5 w-3.5" />
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 z-50 mb-2 w-56 -translate-x-1/2 rounded-xl border border-neutral-100 bg-white p-3 text-left text-xs font-normal leading-relaxed text-neutral-600 shadow-lg"
        >
          {text}
          <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-neutral-100 bg-white" />
        </span>
      )}
    </span>
  );
}
