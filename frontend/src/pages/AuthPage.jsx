import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { CurrencySelector } from "../components/CurrencySelector";
import { ThemeToggle } from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";

function FieldInput({ icon: Icon, error, ...props }) {
  return (
    <div>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400">
          <Icon className="h-4.5 w-4.5" />
        </div>
        <input
          {...props}
          className={`w-full rounded-2xl border bg-neutral-50 py-3 pl-11 pr-4 text-sm font-medium text-neutral-900 placeholder-neutral-400 transition-all focus:bg-white focus:outline-none focus:ring-4 ${
            error
              ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
              : "border-neutral-200 focus:border-brand-600 focus:ring-brand-600/10"
          }`}
        />
      </div>
    </div>
  );
}

// Panel decorativo izquierdo: recrea, en clave propia, la misma línea visual
// de tarjetas oscuras + acentos en degradado que pediste como referencia.
function BrandPanel({ t }) {
  return (
    <div
      className="relative hidden h-full flex-col justify-between overflow-hidden bg-linear-to-b from-brand-950 via-brand-900 to-brand-800 bg-cover bg-center p-10 text-white lg:flex force-light"
      style={{ backgroundImage: "url('/auth-panel-bg.jpg')" }}
    >
      {/* Capa oscura sobre la foto: sin esto, el texto blanco pierde
          contraste dependiendo de qué tan clara sea la imagen que uses.
          Ajusta la opacidad (los números tras la "/") según qué tan
          visible quieras la foto de fondo vs. qué tan legible necesitas
          el texto. */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-brand-950/90 via-brand-900/85 to-brand-800/90" />

      {/* Glow ambiental */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-brand-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-brand-300/10 blur-3xl" />

      <div
        data-gsap="auth-brand"
        className="relative flex items-center gap-2.5"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
          <img
            src="/isotipo-light.png"
            alt={t("common.appName")}
            className="h-10 w-10 object-contain"
          />
        </div>
        <span className="text-sm font-semibold tracking-tight">
          {t("common.appName")}
        </span>
      </div>

      <div data-gsap="auth-copy" className="relative">
        <h1 className="max-w-sm text-3xl font-bold leading-tight tracking-tight">
          {t("auth.tagline.title")}
        </h1>
        <p className="mt-3 max-w-xs text-sm text-white/80">
          {t("auth.tagline.subtitle")}
        </p>

        {/* Stack de tarjetas decorativas */}
        <div className="relative mt-10 h-64 w-full max-w-sm">
          <div
            data-gsap="auth-card"
            className="absolute left-0 top-10 w-72 rounded-3xl border border-white/10 bg-linear-to-br from-brand-800 to-brand-950 p-5 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-white/75">
                Tu Balance
              </span>
              <span className="text-[11px] font-medium text-white/65">
                **** 1189
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight">
              $34,788<span className="text-white/65">.90</span>
            </p>
            <p className="mt-1 text-[11px] font-medium text-emerald-400">
              +4.88% este mes
            </p>
          </div>

          <div
            data-gsap="auth-card"
            className="absolute left-10 top-32 w-72 rounded-3xl bg-linear-to-br from-brand-700 to-brand-950 p-5 shadow-2xl"
          >
            <div className="flex items-center justify-between text-white">
              <span className="text-sm font-semibold tracking-wide">
                **** 9802
              </span>
              <span className="text-xs font-bold italic">VISA</span>
            </div>
          </div>

          <div
            data-gsap="auth-card"
            className="absolute left-20 top-46 w-72 rounded-3xl bg-linear-to-br from-brand-200 to-brand-400 p-5 shadow-2xl"
          >
            <div className="flex items-center justify-between text-neutral-900">
              <span className="text-sm font-semibold tracking-wide">
                **** 5673
              </span>
              <span className="text-xs font-bold italic">VISA</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex items-center gap-2 text-xs font-medium text-white/75">
        <ShieldCheck className="h-4 w-4 text-emerald-400" />
        {t("auth.tagline.secure")}
      </div>
    </div>
  );
}

export function AuthPage({ onBack, initialMode = "login" }) {
  const { login, register } = useAuth();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [mode, setMode] = useState(initialMode); // "login" | "register"

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currencyCode, setCurrencyCode] = useState("USD");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currencyFieldSettled, setCurrencyFieldSettled] = useState(false);
  const authRef = useRef(null);

  const isLogin = mode === "login";

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // El formulario (el que de verdad usa la persona para iniciar sesión
      // o registrarse) tiene su propia línea de tiempo, corta e inmediata,
      // para que el texto y los campos aparezcan sin demora.
      gsap
        .timeline({ defaults: { ease: "power3.out", duration: 0.45 } })
        .from("[data-gsap='auth-form'] > *", {
          y: 14,
          opacity: 0,
          stagger: 0.05,
          // Importante: sin esto, GSAP deja un `transform` residual en cada
          // hijo animado, y eso crea un stacking context nuevo por elemento.
          // Como consecuencia, el z-index del desplegable de moneda (dentro
          // del <form>) queda "atrapado" y pierde frente a hermanos
          // posteriores en el DOM (p. ej. el texto "¿Ya tienes cuenta?"),
          // que terminan pintándose por encima aunque tengan z-index menor.
          clearProps: "transform,opacity",
        });

      // El panel decorativo (solo visible en pantallas grandes) anima en
      // paralelo, no antes: ya no bloquea la aparición del formulario.
      gsap
        .timeline({ defaults: { ease: "power3.out", duration: 0.75 } })
        .from("[data-gsap='auth-brand']", { x: -18, opacity: 0 })
        .from("[data-gsap='auth-copy']", { y: 22, opacity: 0 }, "-=0.45")
        .from(
          "[data-gsap='auth-card']",
          { y: 28, opacity: 0, rotate: -2, stagger: 0.12 },
          "-=0.35",
        );

      gsap.to("[data-gsap='auth-card']", {
        y: (i) => (i % 2 === 0 ? -8 : 8),
        duration: 3.8,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 0.4,
      });
    }, authRef);

    return () => ctx.revert();
  }, []);

  const resetFieldsError = () => error && setError("");

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError("");
    setPassword("");
    setConfirmPassword("");
    setCurrencyFieldSettled(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError(t("auth.error.required"));
      return;
    }

    if (!isLogin) {
      if (!name.trim()) {
        setError(t("auth.error.name"));
        return;
      }
      if (password.length < 6) {
        setError(t("auth.error.passwordLength"));
        return;
      }
      if (password !== confirmPassword) {
        setError(t("auth.error.passwordMatch"));
        return;
      }
    }

    setSubmitting(true);
    // Tiempo mínimo de carga: si la respuesta es instantánea (ej. en local),
    // el spinner igual se ve un instante en vez de parpadear y desaparecer.
    const minDelay = new Promise((resolve) => setTimeout(resolve, 400));
    try {
      const action = isLogin
        ? login(email.trim(), password)
        : register(name.trim(), email.trim(), password, currencyCode);
      await Promise.all([action, minDelay]);
    } catch (err) {
      setError(err.message || t("auth.error.generic"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      ref={authRef}
      className="grid min-h-screen grid-cols-1 bg-neutral-50 lg:grid-cols-2"
    >
      <BrandPanel t={t} />

      {/* Panel del formulario */}
      <div className="relative flex items-center justify-center px-6 py-12 sm:px-10">
        {/* Barra superior: volver + idioma */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-6 py-5 sm:px-10">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 rounded-2xl px-2 py-2 text-xs font-semibold text-neutral-500 transition-colors hover:text-neutral-900 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t("auth.backToHome")}</span>
            </button>
          ) : (
            <span />
          )}
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle variant="icon" />
            <LanguageSwitcher variant="default" />
          </div>
        </div>

        <div data-gsap="auth-form" className="w-full max-w-sm">
          {/* Logo visible solo en mobile */}
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-900">
              <img
                src={
                  theme === "dark" ? "/isotipo-dark.png" : "/isotipo-light.png"
                }
                alt={t("common.appName")}
                className="h-10 w-10 object-contain"
              />
            </div>
            <span className="text-sm font-semibold tracking-tight text-neutral-900">
              {t("common.appName")}
            </span>
          </div>

          {/* Toggle Login / Registro */}
          <div className="relative mb-8 flex items-center gap-1.5 rounded-2xl border border-neutral-200 bg-neutral-100 p-1">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`relative z-10 flex-1 rounded-xl py-2 text-sm font-semibold transition-colors cursor-pointer ${
                isLogin
                  ? "text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              {isLogin && (
                <motion.span
                  layoutId="authTabPill"
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 -z-10 rounded-xl bg-white shadow-sm"
                />
              )}
              {t("auth.tab.login")}
            </button>
            <button
              type="button"
              onClick={() => switchMode("register")}
              className={`relative z-10 flex-1 rounded-xl py-2 text-sm font-semibold transition-colors cursor-pointer ${
                !isLogin
                  ? "text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              {!isLogin && (
                <motion.span
                  layoutId="authTabPill"
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 -z-10 rounded-xl bg-white shadow-sm"
                />
              )}
              {t("auth.tab.register")}
            </button>
          </div>

          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6"
          >
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
              {isLogin ? t("auth.title.login") : t("auth.title.register")}
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              {isLogin ? t("auth.subtitle.login") : t("auth.subtitle.register")}
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence initial={false}>
              {!isLogin && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <FieldInput
                    icon={User}
                    type="text"
                    placeholder={t("auth.field.name")}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      resetFieldsError();
                    }}
                    autoComplete="name"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence initial={false}>
              {!isLogin && (
                <motion.div
                  key="currency-field"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  onAnimationComplete={() => setCurrencyFieldSettled(true)}
                  className={`relative z-20 ${
                    currencyFieldSettled
                      ? "overflow-visible"
                      : "overflow-hidden"
                  }`}
                >
                  <label className="mb-1.5 block px-1 text-xs font-semibold text-neutral-500">
                    {t("auth.field.currency")}
                  </label>
                  <CurrencySelector
                    value={currencyCode}
                    onChange={setCurrencyCode}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <FieldInput
              icon={Mail}
              type="email"
              placeholder={t("auth.field.email")}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                resetFieldsError();
              }}
              autoComplete="email"
            />

            <div className="relative">
              <FieldInput
                icon={Lock}
                type={showPassword ? "text" : "password"}
                placeholder={
                  isLogin
                    ? t("auth.field.password")
                    : t("auth.field.passwordNew")
                }
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  resetFieldsError();
                }}
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-400 hover:text-neutral-600"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4.5 w-4.5" />
                ) : (
                  <Eye className="h-4.5 w-4.5" />
                )}
              </button>
            </div>

            <AnimatePresence initial={false}>
              {!isLogin && (
                <motion.div
                  key="confirm-field"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <FieldInput
                    icon={Lock}
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth.field.passwordConfirm")}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      resetFieldsError();
                    }}
                    autoComplete="new-password"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -6, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-start gap-2 overflow-hidden rounded-xl border border-rose-100 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700"
                >
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: submitting ? 1 : 1.015 }}
              whileTap={{ scale: submitting ? 1 : 0.98 }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-800 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-950 active:bg-brand-950 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-brand-700"
            >
              {isLogin ? t("auth.submit.login") : t("auth.submit.register")}
              <AnimatePresence mode="wait" initial={false}>
                {submitting ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Loader2 className="h-4 w-4" />
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="arrow"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-500">
            {isLogin ? t("auth.switch.toRegister") : t("auth.switch.toLogin")}{" "}
            <button
              type="button"
              onClick={() => switchMode(isLogin ? "register" : "login")}
              className="font-semibold text-neutral-900 hover:underline cursor-pointer"
            >
              {isLogin
                ? t("auth.switch.toRegisterAction")
                : t("auth.switch.toLoginAction")}
            </button>
          </p>

          <div className="mt-8 flex items-center gap-2 rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-3 text-xs text-neutral-500">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
            {t("auth.disclaimer")}
          </div>
        </div>
      </div>
    </div>
  );
}
