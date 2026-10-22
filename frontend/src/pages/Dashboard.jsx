import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch, FiBookmark, FiMessageSquare, FiArrowRight,
  FiCheckCircle, FiClock, FiTrendingUp, FiFileText,
  FiActivity, FiPlus, FiRefreshCw, FiAlertCircle,
} from "react-icons/fi";
import Button from "../components/ui/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { dashboardApi } from "../api/dashboard.api.js";

export default function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    saved: 0, eligible: 0, applied: 0, pending: 0,
  });
  const [meta, setMeta] = useState({ hasProfile: false, isConfirmed: false });
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await dashboardApi.getStats();
      const d = res.data.data;
      setStats({
        saved: d.saved,
        eligible: d.eligible,
        applied: d.applied,
        pending: d.pending,
      });
      setMeta({ hasProfile: d.hasProfile, isConfirmed: d.isConfirmed });
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const statCards = [
    {
      key: "saved",
      label: "Saved Schemes",
      value: stats.saved,
      subtitle: "Bookmarked for later",
      icon: <FiBookmark />,
      tint: "bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300",
      to: "/saved",
    },
    {
      key: "eligible",
      label: "Eligible Matches",
      value: stats.eligible,
      subtitle: "From last analysis",
      icon: <FiCheckCircle />,
      tint: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
      to: "/results",
    },
    {
      key: "applied",
      label: "Applied",
      value: stats.applied,
      subtitle: "Applications tracked",
      icon: <FiTrendingUp />,
      tint: "bg-orange-50 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
      to: "/dashboard",
    },
    {
      key: "pending",
      label: "Pending Actions",
      value: stats.pending,
      subtitle: "Need verification",
      icon: <FiClock />,
      tint: "bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
      to: "/results",
    },
  ];

  const quickActions = [
    {
      title: "Find Schemes",
      desc: "Run eligibility analysis",
      to: "/category",
      icon: <FiSearch />,
      color: "from-primary-500 to-indigo-500",
    },
    {
      title: "Saved Schemes",
      desc: "Review your bookmarks",
      to: "/saved",
      icon: <FiBookmark />,
      color: "from-emerald-500 to-teal-500",
    },
    {
      title: "AI Chat",
      desc: "Ask scheme questions",
      to: "/chat",
      icon: <FiMessageSquare />,
      color: "from-orange-500 to-amber-500",
    },
  ];

  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 bg-hero-mesh opacity-40 dark:opacity-15" />
      <div className="absolute inset-0 -z-10 bg-grid opacity-20" />

      <div className="container-app py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="chip bg-white/70 dark:bg-slate-800/70 border border-primary-100 dark:border-slate-700 text-primary-700 dark:text-primary-300 shadow-soft">
              Dashboard
            </span>
            <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              Hello, {user?.name || "there"} 👋
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Let's find the schemes you're eligible for.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadStats}
              disabled={loading}
              className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 grid place-items-center hover:bg-slate-200 dark:hover:bg-slate-700 transition disabled:opacity-50"
              aria-label="Refresh stats"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
            </button>
            <Link to="/category">
              <Button className="shadow-glow">
                Run Eligibility Check <FiArrowRight />
              </Button>
            </Link>
          </div>
        </div>

        {/* Profile status banner */}
        {!loading && !meta.isConfirmed && (
          <div className="mt-6 rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 p-5 flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 grid place-items-center shrink-0">
              <FiAlertCircle />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-amber-900 dark:text-amber-200">
                {meta.hasProfile ? "Your profile isn't confirmed" : "You haven't set up a profile yet"}
              </p>
              <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">
                Complete the wizard to see personalized scheme matches.
              </p>
            </div>
            <Link to="/category" className="shrink-0">
              <Button size="sm">Complete Now</Button>
            </Link>
          </div>
        )}

        {/* Stat cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <Link to={s.to} key={s.key} className="group">
              <div className="relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
                <div className="flex items-start justify-between">
                  <div className={`h-11 w-11 rounded-xl grid place-items-center text-lg ${s.tint}`}>
                    {s.icon}
                  </div>
                  <FiArrowRight className="text-slate-300 dark:text-slate-600 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition -translate-x-1 group-hover:translate-x-0" />
                </div>
                <p className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-slate-100 leading-none">
                  {loading ? "—" : s.value}
                </p>
                <p className="mt-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {s.label}
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-500">
                  {s.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick actions + Getting started */}
        <div className="mt-6 grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Quick actions
              </h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {quickActions.map((a) => (
                <Link to={a.to} key={a.title} className="group">
                  <div className="relative h-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 transition hover:-translate-y-1 hover:shadow-card">
                    <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${a.color} text-white grid place-items-center text-lg shadow-glow`}>
                      {a.icon}
                    </div>
                    <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-slate-100">
                      {a.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                      {a.desc}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary-700 dark:text-primary-400 group-hover:gap-2 transition-all">
                      Open <FiArrowRight />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Recent activity */}
            <div className="mt-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 grid place-items-center">
                  <FiActivity />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Recent activity
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Your latest actions appear here
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 py-8 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 grid place-items-center text-slate-400">
                  <FiFileText />
                </div>
                <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                  No activity yet
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Run your first eligibility check to see results here.
                </p>
                <Link to="/category" className="inline-block mt-4">
                  <Button size="sm">
                    <FiPlus /> Start now
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Getting started
              </h2>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-600 dark:from-primary-800 dark:to-indigo-900 text-white p-6 shadow-glow relative overflow-hidden">
              <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

              <div className="relative">
                <p className="text-xs uppercase tracking-widest text-primary-100 font-semibold">
                  3-minute setup
                </p>
                <h3 className="mt-2 text-lg font-bold text-white">
                  Start your eligibility journey
                </h3>
                <p className="mt-2 text-sm text-primary-50/90 leading-relaxed">
                  Fill a short wizard, optionally upload documents, and get
                  personalized scheme matches.
                </p>

                <ol className="mt-5 space-y-3 text-sm">
                  {[
                    "Select your category",
                    "Fill the guided wizard",
                    "Upload documents (optional)",
                    "Review your matches",
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="h-6 w-6 rounded-full bg-white/20 grid place-items-center text-xs font-bold shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-primary-50/95">{step}</span>
                    </li>
                  ))}
                </ol>

                <Link to="/category" className="inline-block mt-6 w-full">
                  <Button className="w-full bg-white !text-primary-700 hover:bg-primary-50">
                    Start Wizard <FiArrowRight />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 shadow-soft">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 grid place-items-center shrink-0">
                  <FiCheckCircle />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Tip
                  </p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Uploading your income certificate can boost match accuracy
                    by up to <strong>30%</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}