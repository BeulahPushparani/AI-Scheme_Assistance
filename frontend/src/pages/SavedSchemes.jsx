import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiBookmark, FiArrowRight, FiExternalLink, FiTrash2 } from "react-icons/fi";
import { savedApi } from "../api/saved.api.js";
import { useToast } from "../context/ToastContext.jsx";
import Loader from "../components/ui/Loader.jsx";
import Button from "../components/ui/Button.jsx";

export default function SavedSchemes() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await savedApi.list();
      setItems(res.data.data.saved);
    } catch (err) {
      toast.error(err.message || "Failed to load saved schemes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (schemeId) => {
    try {
      await savedApi.unsave(schemeId);
      setItems((prev) => prev.filter((i) => i.schemeId !== schemeId));
      toast.info("Removed from saved");
    } catch (err) {
      toast.error(err.message || "Failed to remove");
    }
  };

  if (loading) return <Loader label="Loading saved schemes..." />;

  return (
    <div className="relative bg-slate-50 dark:bg-slate-950 transition-colors min-h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 -z-10 bg-hero-mesh opacity-30 dark:opacity-15" />
      <div className="absolute inset-0 -z-10 bg-grid opacity-20" />

      <div className="container-app py-10 max-w-5xl">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 grid place-items-center">
            <FiBookmark className="text-xl" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              Saved schemes
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {items.length} scheme{items.length !== 1 ? "s" : ""} bookmarked
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 py-20 text-center">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800 grid place-items-center text-slate-400">
              <FiBookmark className="text-2xl" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">
              No saved schemes yet
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Bookmark schemes from the results page to see them here.
            </p>
            <Link to="/results" className="inline-block mt-5">
              <Button>
                View Results <FiArrowRight />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {items.map(({ schemeId, scheme, savedAt }) => (
              <div
                key={schemeId}
                className="rounded-2xl border bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-soft hover:shadow-card transition p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                      {schemeId}
                    </p>
                    <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
                      {scheme?.name || "Scheme unavailable"}
                    </h3>
                  </div>
                  <button
                    onClick={() => remove(schemeId)}
                    className="h-9 w-9 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 grid place-items-center transition shrink-0"
                    aria-label="Remove"
                  >
                    <FiTrash2 />
                  </button>
                </div>

                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                  {scheme?.shortDescription}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <Link
                    to={`/schemes/${schemeId}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary-700 dark:text-primary-400 hover:gap-2 transition-all"
                  >
                    View Details <FiArrowRight />
                  </Link>
                  {scheme?.officialLink && (
                    <a
                      href={scheme.officialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-primary-700"
                    >
                      Portal <FiExternalLink />
                    </a>
                  )}
                </div>

                <p className="mt-3 text-[10px] text-slate-400 dark:text-slate-500">
                  Saved {new Date(savedAt).toLocaleDateString("en-IN")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}