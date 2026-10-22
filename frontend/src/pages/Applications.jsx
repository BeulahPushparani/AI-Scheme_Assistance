import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiTrendingUp, FiArrowRight, FiExternalLink,
  FiCheckCircle, FiClock, FiXCircle, FiAlertCircle,
} from "react-icons/fi";
import { applicationApi } from "../api/application.api.js";
import { useToast } from "../context/ToastContext.jsx";
import Loader from "../components/ui/Loader.jsx";
import Button from "../components/ui/Button.jsx";

const STATUS_META = {
  started: { label: "Started", cls: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300", icon: <FiClock /> },
  applied: { label: "Applied", cls: "bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300", icon: <FiCheckCircle /> },
  approved: { label: "Approved", cls: "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300", icon: <FiCheckCircle /> },
  rejected: { label: "Rejected", cls: "bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-300", icon: <FiXCircle /> },
};

export default function Applications() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await applicationApi.list();
      setItems(res.data.data.applications);
    } catch (err) {
      toast.error(err.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (schemeId, status) => {
    try {
      const res = await applicationApi.update(schemeId, { status });
      setItems((prev) =>
        prev.map((i) => (i.schemeId === schemeId ? { ...i, ...res.data.data.application } : i))
      );
      toast.success(`Marked as ${status}`);
    } catch (err) {
      toast.error(err.message || "Failed to update");
    }
  };

  if (loading) return <Loader label="Loading applications..." />;

  return (
    <div className="relative bg-slate-50 dark:bg-slate-950 transition-colors min-h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 -z-10 bg-hero-mesh opacity-30 dark:opacity-15" />
      <div className="absolute inset-0 -z-10 bg-grid opacity-20" />

      <div className="container-app py-10 max-w-5xl">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-orange-50 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 grid place-items-center">
            <FiTrendingUp className="text-xl" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              Applications
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Track your scheme applications
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 py-20 text-center">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800 grid place-items-center text-slate-400">
              <FiTrendingUp className="text-2xl" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">
              No applications yet
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              When you apply for a scheme, track it here.
            </p>
            <Link to="/results" className="inline-block mt-5">
              <Button>View Results <FiArrowRight /></Button>
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {items.map((app) => {
              const meta = STATUS_META[app.status] || STATUS_META.started;
              return (
                <div
                  key={app.schemeId}
                  className="rounded-2xl border bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-soft p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                          {app.schemeId}
                        </p>
                        <span className={`chip ${meta.cls}`}>{meta.icon} {meta.label}</span>
                      </div>
                      <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-slate-100">
                        {app.scheme?.name || "Scheme unavailable"}
                      </h3>
                      {app.appliedAt && (
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Applied on {new Date(app.appliedAt).toLocaleDateString("en-IN")}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {app.status === "started" && (
                      <Button size="sm" onClick={() => updateStatus(app.schemeId, "applied")}>
                        <FiCheckCircle /> Mark as Applied
                      </Button>
                    )}
                    {app.status === "applied" && (
                      <>
                        <Button size="sm" variant="success" onClick={() => updateStatus(app.schemeId, "approved")}>
                          <FiCheckCircle /> Mark Approved
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => updateStatus(app.schemeId, "rejected")}>
                          <FiXCircle /> Mark Rejected
                        </Button>
                      </>
                    )}
                    {app.scheme?.officialLink && (
                      <Button
                        size="sm"
                        variant="outline"
                        href={app.scheme.officialLink}
                        target="_blank"
                      >
                        Portal <FiExternalLink />
                      </Button>
                    )}
                    <Link to={`/schemes/${app.schemeId}`}>
                      <Button size="sm" variant="ghost">
                        Details <FiArrowRight />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}