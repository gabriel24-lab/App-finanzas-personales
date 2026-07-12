import React from "react";
import { motion } from "framer-motion";

// Envoltorio genérico para animar la entrada de cualquier bloque cuando
// entra en el viewport. Usa una curva de easing tipo "spring suave" para
// que se sienta fluido en vez de mecánico (el mismo espíritu que las
// animaciones de scroll de las páginas de producto de Apple).
export function Reveal({
  children,
  delay = 0,
  y = 24,
  duration = 0.7,
  className = "",
  once = true,
  amount = 0.25,
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// Variante para animar listas de hijos en cascada (stagger).
export function RevealGroup({ children, className = "", stagger = 0.09, once = true, amount = 0.2 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

export const revealItemVariants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
