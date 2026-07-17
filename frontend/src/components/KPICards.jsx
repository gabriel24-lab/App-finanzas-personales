import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { Wallet, ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import { InfoTooltip } from "./InfoTooltip";

const easeOut = [0.22, 1, 0.36, 1];

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: easeOut },
  },
};

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

export function KPICards({ transactions = [], wallet }) {
  const cardsRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Nota: la animación de ENTRADA de las tarjetas ya la maneja Framer
      // Motion (ver `cardVariants` / `containerVariants` abajo). Añadir
      // aquí un gsap.from() sobre los mismos elementos hacía que las dos
      // librerías pelearan por controlar el mismo opacity/transform,
      // dejando las tarjetas "trabadas" en opacity 0 en algunos casos.
      // GSAP se deja solo para el detalle ambiental (el glow), que no
      // tiene ninguna animación de Framer encima.
      gsap.to("[data-gsap='kpi-glow']", {
        x: 18,
        y: -12,
        scale: 1.08,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, cardsRef);

    return () => ctx.revert();
  }, []);

  const totals = transactions.reduce(
    (acc, transaction) => {
      const amount = Number(transaction.amount) || 0;
      if (transaction.type === "income") {
        acc.income += amount;
      } else {
        acc.expense += amount;
      }
      return acc;
    },
    { income: 0, expense: 0 },
  );

  const currencyCode = wallet?.currency_code || "COP";
  const balance = wallet?.current_balance ?? totals.income - totals.expense;

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
    }).format(value);

  const netChange = totals.income - totals.expense;
  const changePct =
    totals.income > 0 ? Math.round((netChange / totals.income) * 1000) / 10 : 0;

  return (
    <motion.div
      ref={cardsRef}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="relative z-30 mb-6 grid grid-cols-1 gap-4 md:grid-cols-3"
    >
      {/* Balance Card — hero oscuro */}
      <motion.div
        data-gsap="kpi-card"
        variants={cardVariants}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3, ease: easeOut }}
        className="relative rounded-3xl bg-linear-to-br from-brand-700 to-brand-950 p-4 sm:p-6 text-white shadow-xl shadow-brand-900/20"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
          <div
            data-gsap="kpi-glow"
            className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-500/20 blur-3xl"
          />
        </div>
        <div className="relative">
          <div className="flex items-start justify-between">
            <p className="flex items-center gap-1.5 text-sm font-medium text-white/80">
              Balance total
              <InfoTooltip text="Es lo que te queda hoy: la suma de todos tus ingresos menos todos tus gastos. Si es positivo, te sobra dinero; si es negativo, gastaste más de lo que ganaste." />
            </p>
            <div className="rounded-2xl bg-white/10 p-2 text-white backdrop-blur">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <motion.h3
            key={balance}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: easeOut }}
            className="mt-2 font-sans text-2xl font-bold tracking-tight"
          >
            {formatCurrency(balance)}
          </motion.h3>
          <p
            className={`mt-1 text-xs font-semibold ${
              netChange >= 0 ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {netChange >= 0 ? "+" : ""}
            {changePct}% este período
          </p>
        </div>
        {wallet?.account_name && (
          <div className="relative mt-5 flex items-center justify-between rounded-2xl bg-white/10 px-4 py-2.5 text-xs font-medium text-white/80">
            <span>{wallet.account_name}</span>
            <span className="font-semibold tracking-wide">{currencyCode}</span>
          </div>
        )}
      </motion.div>

      {/* Income Card */}
      <motion.div
        data-gsap="kpi-card"
        variants={cardVariants}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3, ease: easeOut }}
        className="relative rounded-3xl border border-neutral-100 bg-white p-4 sm:p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
      >
        <div className="relative">
          <div className="flex items-start justify-between">
            <p className="flex items-center gap-1.5 text-sm font-medium text-neutral-500">
              Ingresos totales
              <InfoTooltip text="Todo el dinero que ha entrado: sueldo, ventas, regalos u otros ingresos que hayas registrado." />
            </p>
            <div className="rounded-2xl bg-emerald-50 p-2.5 text-emerald-600">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
          <motion.h3
            key={totals.income}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: easeOut }}
            className="mt-2 font-sans text-2xl font-bold tracking-tight text-neutral-900"
          >
            {formatCurrency(totals.income)}
          </motion.h3>
        </div>
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease: easeOut, delay: 0.15 }}
            style={{ transformOrigin: "left" }}
            className="h-full w-full rounded-full bg-linear-to-r from-emerald-400 to-emerald-600"
          />
        </div>
      </motion.div>

      {/* Expense Card */}
      <motion.div
        data-gsap="kpi-card"
        variants={cardVariants}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3, ease: easeOut }}
        className="relative rounded-3xl border border-neutral-100 bg-white p-4 sm:p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
      >
        <div className="relative">
          <div className="flex items-start justify-between">
            <p className="flex items-center gap-1.5 text-sm font-medium text-neutral-500">
              Gastos totales
              <InfoTooltip text="Todo el dinero que ha salido: compras, servicios, suscripciones y cualquier otro gasto que hayas registrado." />
            </p>
            <div className="rounded-2xl bg-rose-50 p-2.5 text-rose-600">
              <ArrowDownRight className="h-4 w-4" />
            </div>
          </div>
          <motion.h3
            key={totals.expense}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: easeOut }}
            className="mt-2 font-sans text-2xl font-bold tracking-tight text-neutral-900"
          >
            {formatCurrency(totals.expense)}
          </motion.h3>
        </div>
        <div className="mt-4 flex items-center gap-1.5 text-[11px] font-medium text-neutral-600">
          <TrendingUp className="h-3.5 w-3.5" />
          {totals.expense > totals.income
            ? "Gastaste más de lo que ingresó"
            : "Vas bien: gastas menos de lo que ingresa"}
        </div>
      </motion.div>
    </motion.div>
  );
}
