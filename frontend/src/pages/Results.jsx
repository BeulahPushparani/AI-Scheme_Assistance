import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiRefreshCw, FiAlertCircle } from "react-icons/fi";
import { eligibilityApi } from "../api/eligibility.api.js";
import { savedApi } from "../api/saved.api.js";
import Button from "../components/ui/Button.jsx";
import Loader from "../components/ui/Loader.jsx";
import SchemeMatchCard from "../components/schemes/SchemeMatchCard.jsx";

export default function Results() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [savedIds, setSavedIds] = useState(() => new Set());
  const [filter, setFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [analysisRes, savedRes] = await Promise.all([
        eligibilityApi.analyze(),
        savedApi.list().catch(() => ({ data: { data: { saved: [] } } })),
      ]);

      setData(analysisRes.data.data);

      const ids = savedRes?.data?.data?.saved?.map((s) => s.schemeId) || [];
      setSavedIds(new Set(ids));
    } catch (err) {
      setError(err.message || "Failed to analyze. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSavedChange = (schemeId, isSaved) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (isSaved) next.add(schemeId);
      else next.delete(schemeId);
      return next;
    });
  };

  if (loading) return <Loader label="Analyzing your eligibility..." />;

  if (error) {
    return (
      <div className="container-app py-16 max-w-2xl">
        <div className="rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 p-6 text-center">
          <FiAlertCircle className="mx-auto text-3xl text-amber-600" />
          <h2 className="mt-3 text-lg font-bold text-slate-900 dark:text-slate-100">
            Can't analyze yet
          </h2>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{error}</p>
          <div className="mt-5 flex justify-center gap-3">
            <Link to="/category">
              <Button>Complete Profile</Button>
            </Link>
            <Button variant="outline" onClick={load}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const results = data.results || [];
  const counts = data.counts || { total: 0, eligible: 0, possibly_eligible: 0 };

  const filtered =
    filter === "all"
      ? results
      : results.filter((item) => item.status === filter);

  return (
    <div className="relative bg-slate-50 dark:bg-slate-950 transition-colors min-h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 -z-10 bg-hero-mesh opacity-30 dark:opacity-15" />
      <div className="absolute inset-0 -z-10 bg-grid opacity-20" />

      <div className="container-app py-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="chip bg-white/70 dark:bg-slate-900/70 border border-primary-100 dark:border-slate-800 text-primary-700 dark:text-primary-300 shadow-soft">
              Eligibility Results
            </span>
            <h1 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
              Here's what you qualify for
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Based on your confirmed profile. Sorted by relevance.
            </p>
          </div>
          <Button variant="outline" onClick={load}>
            <FiRefreshCw /> Re-analyze
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-2xl border p-4 text-left transition ${
              filter === "all"
                ? "border-primary-400 dark:border-primary-600 shadow-glow bg-white dark:bg-slate-900"
                : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:-translate-y-0.5"
            }`}
          >
            <p className="text-xs text-slate-500 dark:text-slate-400">Total schemes</p>
            <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {counts.total}
            </p>
          </button>
          <button
            onClick={() => setFilter("eligible")}
            className={`rounded-2xl border p-4 text-left transition ${
              filter === "eligible"
                ? "border-emerald-400 dark:border-emerald-600 shadow-glow bg-white dark:bg-slate-900"
                : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:-translate-y-0.5"
            }`}
          >
            <p className="text-xs text-emerald-700 dark:text-emerald-400">🟢 Eligible</p>
            <p className="mt-1 text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">
              {counts.eligible}
            </p>
          </button>
          <button
            onClick={() => setFilter("possibly_eligible")}
            className={`rounded-2xl border p-4 text-left transition ${
              filter === "possibly_eligible"
                ? "border-amber-400 dark:border-amber-600 shadow-glow bg-white dark:bg-slate-900"
                : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:-translate-y-0.5"
            }`}
          >
            <p className="text-xs text-amber-700 dark:text-amber-400">🟡 Possibly eligible</p>
            <p className="mt-1 text-2xl font-extrabold text-amber-700 dark:text-amber-400">
              {counts.possibly_eligible}
            </p>
          </button>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {filter === "all"
              ? "All matches"
              : filter === "eligible"
              ? "Fully matched"
              : "Needs verification"}
            <span className="ml-2 text-slate-400 dark:text-slate-500 normal-case font-normal">
              ({filtered.length})
            </span>
          </h2>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 py-16 text-center">
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              No schemes in this category
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
              Try another filter above
            </p>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {filtered.map((item) => (
              <SchemeMatchCard
                key={item.scheme.schemeId}
                result={item}
                isSaved={savedIds.has(item.scheme.schemeId)}
                onSavedChange={(isNowSaved) =>
                  handleSavedChange(item.scheme.schemeId, isNowSaved)
                }
              />
            ))}
          </div>
        )}

        <div className="mt-10 rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 p-5 text-sm text-amber-800 dark:text-amber-200">
          <strong>Guidance only.</strong> Final eligibility is decided solely by the
          concerned government department. Always verify with the official portal
          before applying.
        </div>
      </div>
    </div>
  );
}