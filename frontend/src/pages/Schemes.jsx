import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiArrowRight } from "react-icons/fi";
import { schemeApi } from "../api/scheme.api.js";
import { CATEGORIES } from "../utils/constants.js";
import Loader from "../components/ui/Loader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "../components/ui/Button.jsx";


export default function Schemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const { user } = useAuth();
  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await schemeApi.list({ q: q || undefined, category: category || undefined, limit: 50 });
        if (active) setSchemes(res.data.data.schemes);
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    };
    const t = setTimeout(load, 300);
    return () => { active = false; clearTimeout(t); };
  }, [q, category]);

  return (
    <div className="relative bg-slate-50 dark:bg-slate-950 transition-colors min-h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 -z-10 bg-hero-mesh opacity-30 dark:opacity-15" />
      <div className="absolute inset-0 -z-10 bg-grid opacity-20" />

      <div className="container-app py-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
  Browse schemes
</h1>
<p className="mt-2 text-slate-600 dark:text-slate-400">
  {user?.name ? `Hi ${user.name}, explore` : "Explore"} all government schemes in our verified database.
</p>

        {/* Filters */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="input-base pl-11"
              placeholder="Search schemes..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <select
            className="input-base sm:w-56"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
            ))}
          </select>
        </div>

        {/* Results */}
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-primary-100 dark:border-primary-900 bg-primary-50/60 dark:bg-primary-950/40 px-5 py-4">
  <div>
    <p className="text-sm font-semibold text-primary-800 dark:text-primary-200">
      Want personalized matches?
    </p>
    <p className="text-xs text-primary-700/80 dark:text-primary-300/80">
      Fill a 3-minute wizard to see which schemes you're eligible for.
    </p>
  </div>
  <Link to="/category">
    <Button size="sm">Run wizard →</Button>
  </Link>
</div>
        {loading ? (
          <Loader label="Loading schemes..." />
        ) : schemes.length === 0 ? (
          <div className="mt-16 text-center py-16 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-slate-600 dark:text-slate-400 font-medium">No schemes found</p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Try a different search or category</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {schemes.map((s) => (
              <div key={s.schemeId} className="rounded-2xl border p-5 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{s.schemeId}</span>
                  <span className="chip bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {s.status}
                  </span>
                </div>
                <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
                  {s.name}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                  {s.shortDescription}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="capitalize">{s.category}</span>
                  <span>Verified {new Date(s.lastVerifiedDate).toLocaleDateString("en-IN")}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}