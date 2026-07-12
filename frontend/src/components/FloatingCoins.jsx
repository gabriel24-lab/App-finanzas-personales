import React, { useMemo } from "react";
import { motion } from "framer-motion";

// Una moneda ilustrada con CSS/SVG: cara, canto con relieve y un símbolo
// central. Se dibuja completa (no como ícono plano) para que el efecto de
// "sube y baja" luzca tridimensional, como una moneda real flotando.
function Coin({ size, symbol, tone }) {
  const tones = {
    gold: {
      face: "url(#coin-gold-face)",
      rim: "#8a6416",
      shine: "#fff6d9",
    },
    silver: {
      face: "url(#coin-silver-face)",
      rim: "#7c828c",
      shine: "#f4f6f8",
    },
    indigo: {
      face: "url(#coin-indigo-face)",
      rim: "#312e81",
      shine: "#c7d2fe",
    },
  };
  const c = tones[tone] || tones.gold;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="block drop-shadow-[0_18px_30px_rgba(0,0,0,0.45)]"
    >
      <defs>
        <radialGradient id="coin-gold-face" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#ffe9a8" />
          <stop offset="55%" stopColor="#f0c04d" />
          <stop offset="100%" stopColor="#c8901f" />
        </radialGradient>
        <radialGradient id="coin-silver-face" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#f4f6f8" />
          <stop offset="55%" stopColor="#c9d0d8" />
          <stop offset="100%" stopColor="#9aa2ad" />
        </radialGradient>
        <radialGradient id="coin-indigo-face" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#c7d2fe" />
          <stop offset="55%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#4338ca" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="47" fill={c.rim} />
      <circle cx="50" cy="48" r="43" fill={c.face} />
      <circle
        cx="50"
        cy="48"
        r="43"
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.5"
        strokeDasharray="2 3"
      />
      <circle cx="50" cy="48" r="34" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" />
      <text
        x="50"
        y="60"
        textAnchor="middle"
        fontSize="34"
        fontWeight="800"
        fill="rgba(0,0,0,0.55)"
        fontFamily="Georgia, 'Times New Roman', serif"
      >
        {symbol}
      </text>
      <ellipse cx="36" cy="28" rx="14" ry="7" fill={c.shine} opacity="0.55" />
    </svg>
  );
}

const COIN_LAYOUT = [
  { top: "8%", left: "6%", size: 76, symbol: "$", tone: "gold", duration: 6.5, delay: 0, drift: 22 },
  { top: "62%", left: "3%", size: 54, symbol: "¢", tone: "silver", duration: 5.2, delay: 0.6, drift: 16 },
  { top: "18%", left: "88%", size: 64, symbol: "€", tone: "indigo", duration: 7, delay: 0.3, drift: 20 },
  { top: "72%", left: "90%", size: 88, symbol: "$", tone: "gold", duration: 6, delay: 1, drift: 26 },
  { top: "40%", left: "94%", size: 40, symbol: "¢", tone: "silver", duration: 4.6, delay: 0.2, drift: 14 },
  { top: "4%", left: "45%", size: 42, symbol: "€", tone: "indigo", duration: 5.6, delay: 0.9, drift: 16 },
  { top: "82%", left: "40%", size: 50, symbol: "$", tone: "silver", duration: 6.2, delay: 1.4, drift: 18 },
  { top: "50%", left: "10%", size: 34, symbol: "$", tone: "indigo", duration: 4.8, delay: 1.7, drift: 12 },
];

// Fondo de monedas flotantes: cada una sube y baja suavemente (no cae),
// con una leve rotación en el eje Y para simular el brillo de una moneda
// real girando despacio. Duraciones y retrasos distintos evitan que se
// vean sincronizadas, dando una sensación orgánica y fluida.
export function FloatingCoins({ className = "" }) {
  const coins = useMemo(() => COIN_LAYOUT, []);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {coins.map((coin, i) => (
        <motion.div
          key={i}
          className="absolute opacity-[0.5]"
          style={{ top: coin.top, left: coin.left }}
          animate={{
            y: [0, -coin.drift, 0, coin.drift * 0.6, 0],
            rotateY: [0, 180, 360],
          }}
          transition={{
            duration: coin.duration,
            delay: coin.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Coin size={coin.size} symbol={coin.symbol} tone={coin.tone} />
        </motion.div>
      ))}
    </div>
  );
}
