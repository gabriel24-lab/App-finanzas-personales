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
import { parseAppHash, scrollToLandingSection } from "./utils/hashRoute";
import { useAuth } from "./context/AuthContext";
import { useLanguage } from "./context/LanguageContext";
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
  const { user, token, logout } = useAuth();
  const { t } = useLanguage();

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
    [token, user._id, t]
  );

  const handleAddTransaction = useCallback(
    async (newTransaction) => {
      if (!wallet) return;
      try {
        const created = await createTransaction(
          token,
          user._id,
          wallet.wallet_id,
          wallet.currency_code,
          newTransaction
        );
        setTransactions((prev) => [created, ...prev]);
      } catch (err) {
        setError(t("dashboard.error.transaction", { detail: err.message }));
      }
    },
    [token, user._id, wallet, t]
  );

  const handleDeleteTransaction = useCallback(
    async (id) => {
      if (!window.confirm(t("dashboard.confirm.delete"))) return;
      try {
        await deleteTransactionApi(token, id);
        setTransactions((prev) => prev.filter((tx) => tx.id !== id));
      } catch (err) {
        setError(t("dashboard.error.delete", { detail: err.message }));
      }
    },
    [token, t]
  );

  const handleCreateCategory = useCallback(
    async (values) => {
      try {
        const created = await createCategoryApi(token, user._id, values);
        setCategories((prev) => [...prev, created]);
      } catch (err) {
        setError(t("dashboard.error.category", { detail: err.message }));
      }
    },
    [token, user._id, t]
  );

  const handleUpdateCategory = useCallback(
    async (categoryId, updates) => {
      const previous = categories;
      setCategories((prev) =>
        prev.map((c) => (c.id === categoryId ? { ...c, ...updates } : c))
      );
      try {
        await updateCategoryApi(token, categoryId, updates);
      } catch (err) {
        setCategories(previous);
        setError(t("dashboard.error.category", { detail: err.message }));
      }
    },
    [token, categories, t]
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
    [token, categories, t]
  );

  const handleResetFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setCategoryFilter("");
  };

  const filteredTransactions = transactions
    .filter((t) => {
      const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || t.type === typeFilter;
      const matchesCategory = categoryFilter === "" || t.category === categoryFilter;
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
      className="min-h-screen bg-neutral-50 px-4 py-6 text-neutral-800 antialiased sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut }}
          className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-900/20">
              <img src="/isotipo.png" alt={t("common.appName")} className="h-12 w-12 object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
                {t(greetingKey, { name: firstName })}
              </h1>
              <p className="text-sm font-medium text-neutral-500">{t("dashboard.subtitle")}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Switcher */}
            <div className="relative flex items-center gap-1.5 rounded-2xl border border-neutral-200 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setActiveView("dashboard")}
                className={`relative z-10 flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  activeView === "dashboard" ? "text-white" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                {t("dashboard.nav.transactions")}
                {activeView === "dashboard" && (
                  <motion.span
                    layoutId="viewSwitcherPill"
                    transition={{ duration: 0.35, ease: easeOut }}
                    className="absolute inset-0 -z-10 rounded-xl bg-brand-600 shadow-sm"
                  />
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveView("budgets")}
                className={`relative z-10 flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  activeView === "budgets" ? "text-white" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                <PiggyBank className="h-3.5 w-3.5" />
                {t("dashboard.nav.budgets")}
                {activeView === "budgets" && (
                  <motion.span
                    layoutId="viewSwitcherPill"
                    transition={{ duration: 0.35, ease: easeOut }}
                    className="absolute inset-0 -z-10 rounded-xl bg-brand-600 shadow-sm"
                  />
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveView("categories")}
                className={`relative z-10 flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  activeView === "categories" ? "text-white" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                <Tags className="h-3.5 w-3.5" />
                {t("dashboard.nav.categories")}
                {activeView === "categories" && (
                  <motion.span
                    layoutId="viewSwitcherPill"
                    transition={{ duration: 0.35, ease: easeOut }}
                    className="absolute inset-0 -z-10 rounded-xl bg-brand-600 shadow-sm"
                  />
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveView("goals")}
                className={`relative z-10 flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  activeView === "goals" ? "text-white" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                <Target className="h-3.5 w-3.5" />
                {t("dashboard.nav.goals")}
                {activeView === "goals" && (
                  <motion.span
                    layoutId="viewSwitcherPill"
                    transition={{ duration: 0.35, ease: easeOut }}
                    className="absolute inset-0 -z-10 rounded-xl bg-brand-600 shadow-sm"
                  />
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveView("explore")}
                className={`relative z-10 flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  activeView === "explore" ? "text-white" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                <Compass className="h-3.5 w-3.5" />
                {t("dashboard.nav.explore")}
                {activeView === "explore" && (
                  <motion.span
                    layoutId="viewSwitcherPill"
                    transition={{ duration: 0.35, ease: easeOut }}
                    className="absolute inset-0 -z-10 rounded-xl bg-brand-600 shadow-sm"
                  />
                )}
              </button>
            </div>

            <LanguageSwitcher variant="default" />

            <button
              type="button"
              onClick={logout}
              title={t("common.logoutTitle")}
              className="flex items-center gap-1.5 rounded-2xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-neutral-500 shadow-sm transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t("common.logout")}</span>
            </button>
          </div>
        </motion.header>

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
              className="flex items-start gap-2 overflow-hidden rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Layout */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          {/* Left Column: Form */}
          <div className="space-y-6 lg:sticky lg:top-8 lg:col-span-4">
            <TransactionForm categories={categories} onAddTransaction={handleAddTransaction} />
            <UpcomingPayments transactions={transactions} categories={categories} wallet={wallet} />
          </div>

          {/* Right Column: Cards, Filters & List */}
          <div className="space-y-6 lg:col-span-8">
            <AnimatePresence mode="wait">
              {activeView === "dashboard" && (
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
                    <InsightsPanel token={token} walletId={wallet?.wallet_id} />
                  )}

                  <DashboardCharts transactions={transactions} categories={categories} wallet={wallet} />

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
                            : "dashboard.history.count.other"
                        )}
                      </span>
                    </div>
                    <TransactionList
                      transactions={filteredTransactions}
                      categories={categories}
                      onDeleteTransaction={handleDeleteTransaction}
                      wallet={wallet}
                    />
                  </div>
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
                  <BudgetOverview transactions={transactions} budgets={budgets} categories={categories} wallet={wallet} />
                  <BudgetManager categories={categories} budgets={budgets} onUpdateBudget={handleUpdateBudget} />
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
                  <InvestmentExplorer token={token} walletId={wallet?.wallet_id} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function App() {
  const { user, loading } = useAuth();
  // "landing" -> página de inicio pública | "auth" -> login/registro | "info" -> páginas legales/soporte
  const [publicView, setPublicView] = useState("landing");
  const [authMode, setAuthMode] = useState("login");
  const [infoSlug, setInfoSlug] = useState(null);

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
      window.location.hash = "";
    }
  }, [user]);

  useEffect(() => {
    function applyRouteFromHash() {
      const route = parseAppHash();

      if (route.kind === "info") {
        setPublicView("info");
        setInfoSlug(route.slug);
        return;
      }

      if (route.kind === "landing") {
        setPublicView("landing");
        setInfoSlug(null);
        scrollToLandingSection(route.section);
      }
    }

    applyRouteFromHash();
    window.addEventListener("hashchange", applyRouteFromHash);
    return () => window.removeEventListener("hashchange", applyRouteFromHash);
  }, []);

  const goHome = () => {
    window.location.hash = "";
    setPublicView("landing");
    setInfoSlug(null);
    scrollToLandingSection(null);
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
          <AuthPage initialMode={authMode} onBack={() => setPublicView("landing")} />
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
