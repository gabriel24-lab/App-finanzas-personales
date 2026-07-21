import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  PiggyBank,
  Tags,
  Target,
  Compass,
  Loader2,
  AlertCircle,
  LogOut,
  Menu,
  X,
  PlusCircle,
} from "lucide-react";
import { KPICards } from "./components/KPICards";
import { InsightsPanel } from "./components/InsightsPanel";
import { InvestmentExplorer } from "./components/InvestmentExplorer";
import { OnboardingChecklist } from "./components/OnboardingChecklist";
import { DashboardCharts } from "./components/DashboardCharts";
import { TransactionForm } from "./components/TransactionForm";
import { TransactionFilters } from "./components/TransactionFilters";
import { TransactionList } from "./components/TransactionList";
import { BudgetOverview } from "./components/BudgetOverview";
import { BudgetManager } from "./components/BudgetManager";
import { CategoryManager } from "./components/CategoryManager";
import { SavingsGoals } from "./components/SavingsGoals";
import { UpcomingPayments } from "./components/UpcomingPayments";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { LandingPage } from "./pages/LandingPage";
import { AuthPage } from "./pages/AuthPage";
import { InfoPage } from "./pages/InfoPage";
import { ResourcesPage } from "./pages/ResourcesPage";
import { ResourceDetailPage } from "./pages/ResourceDetailPage";
import {
  parseAppHash,
  scrollToLandingSection,
  resourcesPath,
  resourceDetailPath,
} from "./utils/hashRoute";
import { ThemeToggle } from "./components/ThemeToggle";
import { useAuth } from "./context/AuthContext";
import { useLanguage } from "./context/LanguageContext";
import { useTheme } from "./context/ThemeContext";
import { ConfirmDialog } from "./components/ConfirmDialog";
import {
  fetchTransactions,
  createTransaction,
  deleteTransactionApi,
  fetchBudgets,
  upsertBudgetApi,
  fetchCategories,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from "./api";

const easeOut = [0.22, 1, 0.36, 1];

function Dashboard() {
  const { user, token, logout, updateUserData } = useAuth();
  const { t } = useLanguage();
  const { theme } = useTheme();

  // Guard: al cerrar sesión, `user` pasa a null de inmediato, pero este
  // componente sigue montado unos milisegundos más mientras AnimatePresence
  // reproduce la animación de salida (mode="wait"). Sin este guard, las
  // líneas de abajo (user.wallets, user.name, etc.) intentan leer
  // propiedades de null y lanzan un error que rompe todo el árbol de React,
  // dejando la pantalla en blanco hasta recargar. Con el guard, el
  // componente simplemente no dibuja nada durante ese instante y la
  // transición hacia la landing page ocurre con normalidad.
  if (!user) return null;

  const wallet = user.wallets?.[0];

  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingDeleteTransactionId, setPendingDeleteTransactionId] =
    useState(null);

  const NAV_ITEMS = [
    { id: "dashboard", labelKey: "dashboard.nav.transactions", Icon: LayoutDashboard },
    { id: "agregar",   labelKey: "dashboard.nav.add",          Icon: PlusCircle },
    { id: "budgets",   labelKey: "dashboard.nav.budgets",      Icon: PiggyBank },
    { id: "categories",labelKey: "dashboard.nav.categories",   Icon: Tags },
    { id: "goals",     labelKey: "dashboard.nav.goals",        Icon: Target },
    { id: "explore",   labelKey: "dashboard.nav.explore",      Icon: Compass },
  ];

  // Carga inicial de transacciones, presupuestos y categorías del usuario autenticado.
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        setLoading(true);
        setError("");

        const [txs, budgetMap, cats] = await Promise.all([
          fetchTransactions(token, user._id),
          fetchBudgets(token, user._id),
          fetchCategories(token, user._id),
        ]);

        if (cancelled) return;
        setTransactions(txs);
        setBudgets(budgetMap);
        setCategories(cats);
      } catch (err) {
        if (!cancelled) {
          setError(t("dashboard.error.load", { detail: err.message }));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [token, user._id]);

  const handleUpdateBudget = useCallback(
    async (category, amount) => {
      setBudgets((prev) => ({ ...prev, [category]: amount }));
      try {
        await upsertBudgetApi(token, user._id, category, amount);
      } catch (err) {
        setError(t("dashboard.error.budget", { detail: err.message }));
      }
    },
    [token, user._id, t],
  );

  // El backend recalcula el balance de la billetera al crear/eliminar un
  // movimiento y lo devuelve en la respuesta. Aquí lo escribimos de vuelta en
  // `user.wallets` (el mismo objeto que usan KPICards y el resto del
  // dashboard para pintar el "Balance total") para que se actualice al
  // instante, igual que ya pasa con los totales de ingresos/gastos, que se
  // calculan sobre el arreglo `transactions` local.
  const applyWalletUpdate = useCallback(
    (updatedWallet) => {
      if (!updatedWallet) return;
      updateUserData((prev) => {
        return {
          wallets: prev.wallets.map((w) =>
            w.wallet_id === updatedWallet.wallet_id
              ? { ...w, ...updatedWallet }
              : w,
          ),
        };
      });
    },
    [updateUserData],
  );

  const handleAddTransaction = useCallback(
    async (newTransaction) => {
      if (!wallet) return;
      try {
        const { transaction: created, wallet: updatedWallet } =
          await createTransaction(
            token,
            user._id,
            wallet.wallet_id,
            wallet.currency_code,
            newTransaction,
          );
        setTransactions((prev) => [created, ...prev]);
        applyWalletUpdate(updatedWallet);
      } catch (err) {
        setError(t("dashboard.error.transaction", { detail: err.message }));
      }
    },
    [token, user._id, wallet, t, applyWalletUpdate],
  );

  const requestDeleteTransaction = useCallback((id) => {
    setPendingDeleteTransactionId(id);
  }, []);

  const cancelDeleteTransaction = useCallback(() => {
    setPendingDeleteTransactionId(null);
  }, []);

  const confirmDeleteTransaction = useCallback(async () => {
    if (!pendingDeleteTransactionId) return;
    try {
      const { wallet: updatedWallet } = await deleteTransactionApi(
        token,
        pendingDeleteTransactionId,
      );
      setTransactions((prev) =>
        prev.filter((tx) => tx.id !== pendingDeleteTransactionId),
      );
      applyWalletUpdate(updatedWallet);
    } catch (err) {
      setError(t("dashboard.error.delete", { detail: err.message }));
    } finally {
      setPendingDeleteTransactionId(null);
    }
  }, [pendingDeleteTransactionId, token, t, applyWalletUpdate]);

  const handleCreateCategory = useCallback(
    async (values) => {
      try {
        const created = await createCategoryApi(token, user._id, values);
        setCategories((prev) => [...prev, created]);
      } catch (err) {
        setError(t("dashboard.error.category", { detail: err.message }));
      }
    },
    [token, user._id, t],
  );

  const handleUpdateCategory = useCallback(
    async (categoryId, updates) => {
      const previous = categories;
      setCategories((prev) =>
        prev.map((c) => (c.id === categoryId ? { ...c, ...updates } : c)),
      );
      try {
        await updateCategoryApi(token, categoryId, updates);
      } catch (err) {
        setCategories(previous);
        setError(t("dashboard.error.category", { detail: err.message }));
      }
    },
    [token, categories, t],
  );

  const handleDeleteCategory = useCallback(
    async (categoryId) => {
      const previous = categories;
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
      try {
        await deleteCategoryApi(token, categoryId);
      } catch (err) {
        setCategories(previous);
        setError(t("dashboard.error.category", { detail: err.message }));
      }
    },
    [token, categories, t],
  );

  const handleResetFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setCategoryFilter("");
  };

  const filteredTransactions = transactions
    .filter((t) => {
      const matchesSearch = t.description
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || t.type === typeFilter;
      const matchesCategory =
        categoryFilter === "" || t.category === categoryFilter;
      return matchesSearch && matchesType && matchesCategory;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateB.getTime() !== dateA.getTime()) return dateB - dateA;
      return b.id.localeCompare(a.id);
    });

  const firstName = user.name?.split(" ")[0] || "";

  const greetingHour = new Date().getHours();
  const greetingKey =
    greetingHour < 12
      ? "dashboard.greeting.morning"
      : greetingHour < 19
        ? "dashboard.greeting.afternoon"
        : "dashboard.greeting.evening";

  const hasBudget = Object.values(budgets).some((amount) => Number(amount) > 0);
  const hasCustomCategory = categories.some((c) => !c.isDefault);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-3 text-neutral-400">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="h-8 w-8" />
          </motion.div>
          <p className="text-sm font-medium">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: easeOut }}
      className="flex h-screen overflow-hidden antialiased"
    >
      {/* ── Mobile overlay ───────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ──────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-60 shrink-0 flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ backgroundColor: "#111111" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 border-b px-5 py-5" style={{ borderColor: "#1f1f1f" }}>
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: "#1a1a1a" }}
          >
            <img
              src="/isotipo-light.png"
              alt={t("common.appName")}
              className="h-6 w-6 object-contain"
            />
          </div>
          <span className="text-sm font-bold tracking-tight text-[#ffffff]">
            {t("common.appName")}
          </span>
          {/* Close button — mobile only */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="ml-auto flex h-7 w-7 items-center justify-center rounded-lg text-[#9ca3af] hover:text-[#ffffff] transition-colors lg:hidden cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Greeting (mobile, inside sidebar) */}
        <div className="border-b px-5 py-3 lg:hidden" style={{ borderColor: "#1f1f1f" }}>
          <p className="text-xs font-semibold text-[#ffffff]">{t(greetingKey, { name: firstName })}</p>
          <p className="text-[11px] text-[#9ca3af]">{t("dashboard.subtitle")}</p>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map(({ id, labelKey, Icon }) => {
            const isActive = activeView === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => { setActiveView(id); setSidebarOpen(false); }}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all cursor-pointer"
                style={{
                  backgroundColor: isActive ? "rgba(74,222,128,0.08)" : "transparent",
                  color: isActive ? "#4ade80" : "#9ca3af",
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#ffffff"; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#9ca3af"; } }}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span
                    className="absolute left-0 h-5 w-0.5 rounded-r-full"
                    style={{ backgroundColor: "#4ade80" }}
                  />
                )}
                <Icon className="h-4 w-4 shrink-0" />
                {t(labelKey)}
              </button>
            );
          })}
        </nav>

        {/* Bottom: theme + lang + logout */}
        <div className="border-t px-3 py-4 space-y-0.5" style={{ borderColor: "#1f1f1f" }}>
          <div className="flex items-center gap-2 px-3 py-2">
            <ThemeToggle variant="icon" />
            <LanguageSwitcher variant="default" align="left" drop="up" />
          </div>
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all cursor-pointer"
            style={{ color: "#9ca3af" }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(248,113,113,0.08)"; e.currentTarget.style.color = "#f87171"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#9ca3af"; }}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {t("common.logout")}
          </button>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden bg-neutral-50 text-neutral-800">

        {/* Top header bar */}
        <header className="relative z-50 flex shrink-0 items-center justify-between gap-4 border-b border-neutral-200 bg-white/80 px-4 py-3 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-500 shadow-sm transition-all hover:bg-neutral-100 lg:hidden cursor-pointer"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-base font-bold text-neutral-900 sm:text-lg">
                {t(NAV_ITEMS.find(n => n.id === activeView)?.labelKey ?? "dashboard.nav.transactions")}
              </h1>
              <p className="hidden text-xs font-medium text-neutral-500 sm:block">
                {t(greetingKey, { name: firstName })} &middot; {t("dashboard.subtitle")}
              </p>
            </div>
          </div>

          {/* Desktop right-side actions (sidebar already shows these on mobile) */}
          <div className="hidden items-center gap-2 lg:flex">
            <ThemeToggle variant="icon" />
            <LanguageSwitcher variant="default" />
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 rounded-2xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-500 shadow-sm transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              {t("common.logout")}
            </button>
          </div>
          {/* Mobile: just theme toggle in header */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle variant="icon" />
          </div>
        </header>

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">

          <OnboardingChecklist
            userId={user._id}
            hasTransactions={transactions.length > 0}
            hasBudget={hasBudget}
            hasCustomCategory={hasCustomCategory}
            onGoToBudgets={() => setActiveView("budgets")}
            onGoToCategories={() => setActiveView("categories")}
          />

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                transition={{ duration: 0.3, ease: easeOut }}
                className="mb-4 flex items-start gap-2 overflow-hidden rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Views (all full-width) ────────────────────── */}
          <AnimatePresence mode="wait">
            {activeView === "dashboard" && (
              <>
                <motion.div
                  key="dashboard-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.32, ease: easeOut }}
                  className="space-y-6"
                >
                  <KPICards transactions={transactions} wallet={wallet} />

                  {transactions.length > 0 && (
                    <InsightsPanel
                      token={token}
                      walletId={wallet?.wallet_id}
                    />
                  )}

                  <DashboardCharts
                    transactions={transactions}
                    categories={categories}
                    wallet={wallet}
                  />

                  <TransactionFilters
                    categories={categories}
                    search={search}
                    setSearch={setSearch}
                    typeFilter={typeFilter}
                    setTypeFilter={setTypeFilter}
                    categoryFilter={categoryFilter}
                    setCategoryFilter={setCategoryFilter}
                    onResetFilters={handleResetFilters}
                  />

                  <div>
                    <div className="mb-3 flex items-center justify-between px-1">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
                        {t("dashboard.history.title")}
                      </h3>
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500">
                        {filteredTransactions.length}{" "}
                        {t(
                          filteredTransactions.length === 1
                            ? "dashboard.history.count.one"
                            : "dashboard.history.count.other",
                        )}
                      </span>
                    </div>
                    <TransactionList
                      transactions={filteredTransactions}
                      categories={categories}
                      onDeleteTransaction={requestDeleteTransaction}
                      wallet={wallet}
                    />
                  </div>
                </motion.div>
                <ConfirmDialog
                  open={Boolean(pendingDeleteTransactionId)}
                  title={t("dashboard.confirm.deleteTitle")}
                  message={t("dashboard.confirm.delete")}
                  cancelLabel={t("common.dialog.cancel")}
                  confirmLabel={t("common.dialog.confirm")}
                  onCancel={cancelDeleteTransaction}
                  onConfirm={confirmDeleteTransaction}
                />
              </>
            )}

            {activeView === "agregar" && (
              <motion.div
                key="agregar-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.32, ease: easeOut }}
                className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2"
              >
                <div className="lg:sticky lg:top-6">
                  <TransactionForm
                    categories={categories}
                    onAddTransaction={handleAddTransaction}
                    wallet={wallet}
                  />
                </div>
                <UpcomingPayments
                  transactions={transactions}
                  categories={categories}
                  wallet={wallet}
                />
              </motion.div>
            )}

            {activeView === "budgets" && (
              <motion.div
                key="budgets-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.32, ease: easeOut }}
                className="space-y-6"
              >
                <BudgetOverview
                  transactions={transactions}
                  budgets={budgets}
                  categories={categories}
                  wallet={wallet}
                />
                <BudgetManager
                  categories={categories}
                  budgets={budgets}
                  onUpdateBudget={handleUpdateBudget}
                  wallet={wallet}
                />
              </motion.div>
            )}

            {activeView === "categories" && (
              <motion.div
                key="categories-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.32, ease: easeOut }}
                className="space-y-6"
              >
                <CategoryManager
                  categories={categories}
                  onCreateCategory={handleCreateCategory}
                  onUpdateCategory={handleUpdateCategory}
                  onDeleteCategory={handleDeleteCategory}
                />
              </motion.div>
            )}

            {activeView === "goals" && (
              <motion.div
                key="goals-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.32, ease: easeOut }}
                className="space-y-6"
              >
                <SavingsGoals userId={user._id} wallet={wallet} />
              </motion.div>
            )}

            {activeView === "explore" && (
              <motion.div
                key="explore-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.32, ease: easeOut }}
                className="space-y-6"
              >
                <InvestmentExplorer
                  token={token}
                  walletId={wallet?.wallet_id}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </motion.div>
  );
}

function App() {
  const { user, loading } = useAuth();
  // "landing" -> página de inicio pública | "auth" -> login/registro | "info" -> páginas legales/soporte
  // "resources" -> lista de recursos | "resource-detail" -> detalle de un recurso
  const [publicView, setPublicView] = useState("landing");
  const [authMode, setAuthMode] = useState("login");
  const [infoSlug, setInfoSlug] = useState(null);
  const [resourceSlug, setResourceSlug] = useState(null);

  // Recuerda si en el render anterior había una sesión activa, para poder
  // detectar el momento exacto del logout (user pasa de "algo" a null).
  const wasLoggedInRef = useRef(false);

  useEffect(() => {
    if (user) {
      wasLoggedInRef.current = true;
      return;
    }
    // Si justo veníamos de tener sesión iniciada, es un logout: llevamos a
    // la persona a la página de inicio (landing), no a la de login, que es
    // simplemente el último "publicView" que quedó guardado de antes de
    // entrar a la cuenta.
    if (wasLoggedInRef.current) {
      wasLoggedInRef.current = false;
      setPublicView("landing");
      setAuthMode("login");
      setInfoSlug(null);
      setResourceSlug(null);
      window.location.hash = "";
    }
  }, [user]);

  // Recuerda el último hash de "landing" (top, #features, #site-footer...)
  // en el que estaba el usuario justo antes de entrar a Info o Recursos,
  // para que el botón "Volver" lo regrese ahí y no siempre al tope.
  const lastLandingHashRef = useRef("");

  useEffect(() => {
    function applyRouteFromHash(event) {
      const route = parseAppHash();

      // event.oldURL solo existe cuando esto se dispara por un hashchange
      // real (no en la llamada inicial). Ahí es donde capturamos "de dónde
      // veníamos" justo antes de saltar a una página de Info/Recursos.
      if (event) {
        const oldHash = new URL(event.oldURL).hash;
        const cameFromLanding = parseAppHash(oldHash).kind === "landing";
        if (cameFromLanding && route.kind !== "landing") {
          lastLandingHashRef.current = oldHash;
        }
      }

      if (route.kind === "resource-detail") {
        setPublicView("resource-detail");
        setResourceSlug(route.slug);
        return;
      }

      if (route.kind === "resources") {
        setPublicView("resources");
        setResourceSlug(null);
        return;
      }

      if (route.kind === "info") {
        setPublicView("info");
        setInfoSlug(route.slug);
        return;
      }

      if (route.kind === "landing") {
        setPublicView("landing");
        setInfoSlug(null);
        setResourceSlug(null);
        scrollToLandingSection(route.section);
      }
    }

    applyRouteFromHash();
    window.addEventListener("hashchange", applyRouteFromHash);
    return () => window.removeEventListener("hashchange", applyRouteFromHash);
  }, []);

  const goHome = () => {
    // Si veníamos de alguna sección de landing (footer incluido), volvemos
    // exactamente ahí. Si no hay nada guardado (ej. se entró directo por
    // URL a /help), caemos al comportamiento anterior: ir al tope.
    const targetHash = lastLandingHashRef.current || "";
    const targetSection = parseAppHash(targetHash).section ?? null;

    window.location.hash = targetHash;
    setPublicView("landing");
    setInfoSlug(null);
    setResourceSlug(null);
    scrollToLandingSection(targetSection);
  };

  const goToResources = () => {
    window.location.hash = resourcesPath();
    setPublicView("resources");
    setResourceSlug(null);
  };

  const goToResourceDetail = (slug) => {
    window.location.hash = resourceDetailPath(slug);
    setPublicView("resource-detail");
    setResourceSlug(slug);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-8 w-8 text-neutral-400" />
        </motion.div>
      </div>
    );
  }

  const viewKey = user ? "dashboard" : publicView;

  return (
    <AnimatePresence mode="wait">
      {viewKey === "auth" && (
        <motion.div
          key="auth"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: easeOut }}
        >
          <AuthPage
            initialMode={authMode}
            onBack={() => setPublicView("landing")}
          />
        </motion.div>
      )}
      {viewKey === "landing" && (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: easeOut }}
        >
          <LandingPage
            onGetStarted={() => {
              setAuthMode("register");
              setPublicView("auth");
            }}
            onLogin={() => {
              setAuthMode("login");
              setPublicView("auth");
            }}
          />
        </motion.div>
      )}
      {viewKey === "info" && (
        <motion.div
          key={`info-${infoSlug}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: easeOut }}
        >
          <InfoPage slug={infoSlug} onBack={goHome} />
        </motion.div>
      )}
      {viewKey === "resources" && (
        <motion.div
          key="resources"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: easeOut }}
        >
          <ResourcesPage onNavigate={goToResourceDetail} onBack={goHome} />
        </motion.div>
      )}
      {viewKey === "resource-detail" && (
        <motion.div
          key={`resource-detail-${resourceSlug}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: easeOut }}
        >
          <ResourceDetailPage
            slug={resourceSlug}
            onBack={goHome}
            onBackToResources={goToResources}
          />
        </motion.div>
      )}
      {viewKey === "dashboard" && (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: easeOut }}
        >
          <Dashboard />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
