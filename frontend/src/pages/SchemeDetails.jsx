import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft, FiExternalLink, FiFileText, FiList, FiInfo,
  FiCheckCircle, FiAlertCircle, FiXCircle, FiBookmark,
} from "react-icons/fi";
import { eligibilityApi } from "../api/eligibility.api.js";
import { schemeApi } from "../api/scheme.api.js";
import Loader from "../components/ui/Loader.jsx";
import Button from "../components/ui/Button.jsx";
import MatchBadge from "../components/schemes/MatchBadge.jsx";
import { savedApi } from "../api/saved.api.js";
import { applicationApi } from "../api/application.api.js";
import SaveButton from "../components/schemes/SaveButton.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { FiCpu, FiRefreshCw } from "react-icons/fi";

function CriteriaGroup({ title, items, icon, color }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h4 className={`text-sm font-bold ${color} mb-2 flex items-center gap-2`}>
        {icon} {title}
      </h4>
      <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
        {items.map((m) => (
          <li key={m.rule} className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-current shrink-0 opacity-60" />
            <span>{m.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SchemeDetails() {
  const { schemeId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const toast = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [application, setApplication] = useState(null);
  const [appBusy, setAppBusy] = useState(false);
  const [aiExplanation, setAiExplanation] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");


  useEffect(() => {
  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await eligibilityApi.analyzeOne(schemeId);
      setData(res.data.data);
    } catch (err) {
      try {
        const res = await schemeApi.get(schemeId);
        setData({
          scheme: res.data.data.scheme,
          status: null, score: null,
          matched: [], unmatched: [], missing: [], summary: null,
        });
      } catch (err2) {
        setError(err2.message || "Scheme not found");
      }
    } finally {
      setLoading(false);
    }

    // Parallel: saved + application state
    try {
      const [savedRes, appRes] = await Promise.all([
        savedApi.check(schemeId).catch(() => ({ data: { data: { saved: false } } })),
        applicationApi.get(schemeId).catch(() => ({ data: { data: { application: null } } })),
      ]);
      setIsSaved(savedRes.data.data.saved);
      setApplication(appRes.data.data.application);
    } catch {
      // ignore
    }
  };
  load();
}, [schemeId]);
const markApplied = async () => {
  setAppBusy(true);
  try {
    if (application) {
      // Update existing
      const res = await applicationApi.update(schemeId, { status: "applied" });
      setApplication(res.data.data.application);
      toast.success("Marked as applied!");
    } else {
      // Create then mark applied
      await applicationApi.create(schemeId);
      const res = await applicationApi.update(schemeId, { status: "applied" });
      setApplication(res.data.data.application);
      toast.success("Marked as applied!");
    }
  } catch (err) {
    toast.error(err.message || "Failed to update");
  } finally {
    setAppBusy(false);
  }
};
const getAIExplanation = async () => {
  setAiLoading(true);
  setAiError("");
  try {
    const res = await eligibilityApi.explainWithAI(schemeId);
    setAiExplanation(res.data.data.aiExplanation);
  } catch (err) {
    setAiError(err.message || "Failed to get AI explanation");
  } finally {
    setAiLoading(false);
  }
};

  if (loading) return <Loader label="Loading scheme..." />;

  if (error) {
    return (
      <div className="container-app py-16 max-w-2xl text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {error}
        </h1>
        <Link to="/results" className="inline-block mt-4">
          <Button variant="outline">
            <FiArrowLeft /> Back to results
          </Button>
        </Link>
      </div>
    );
  }

  const { scheme, status, score, matched, unmatched, missing, summary } = data;

  return (
    <div className="relative bg-slate-50 dark:bg-slate-950 transition-colors min-h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 -z-10 bg-hero-mesh opacity-30 dark:opacity-15" />
      <div className="absolute inset-0 -z-10 bg-grid opacity-20" />

      <div className="container-app py-10 max-w-5xl">
        <Link
          to="/results"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-700 dark:hover:text-primary-400 mb-6"
        >
          <FiArrowLeft /> Back to results
        </Link>

        {/* ============ HEADER ============ */}
        <div className="rounded-3xl border bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-soft p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {scheme.schemeId}
              </p>
              <h1 className="mt-2 text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                {scheme.name}
              </h1>
              <p className="mt-3 text-slate-600 dark:text-slate-400">
                {scheme.shortDescription}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="chip bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {scheme.category}
                </span>
                {scheme.status === "active" && (
                  <span className="chip bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
                  </span>
                )}
                {status && <MatchBadge status={status} />}
              </div>
            </div>

            {score !== null && score !== undefined && (
              <div className="shrink-0 rounded-2xl bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 p-5 text-center min-w-[140px]">
                <p className="text-4xl font-extrabold text-primary-700 dark:text-primary-300">
                  {score}%
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                  Match Score
                </p>
              </div>
            )}
          </div>

          {/* CTAs */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
  {scheme.officialLink ? (
    <Button href={scheme.officialLink} target="_blank" className="shadow-glow">
      Visit Official Portal <FiExternalLink />
    </Button>
  ) : (
    <Button disabled className="opacity-60">
      Official link not available
    </Button>
  )}

  <SaveButton
    schemeId={scheme.schemeId}
    initialSaved={isSaved}
    onChange={setIsSaved}
  />

  {application?.status === "applied" ? (
    <span className="chip bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
      <FiCheckCircle /> Applied
    </span>
  ) : (
    <Button
      variant="outline"
      onClick={markApplied}
      disabled={appBusy}
    >
      <FiCheckCircle /> {appBusy ? "Saving..." : "I Applied"}
    </Button>
  )}

  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
    <FiExternalLink /> Opens in a new tab
  </p>
</div>
        </div>

        {/* ============ WHY THIS MATCH ============ */}
        {status && matched.length + unmatched.length + missing.length > 0 && (
          <div className="mt-6 rounded-3xl border bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-soft p-6 md:p-8">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FiInfo /> Why this match?
            </h2>
            {summary && (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {summary}
              </p>
            )}
            <div className="mt-5 grid md:grid-cols-2 gap-6">
              <CriteriaGroup
                title="Matched criteria"
                items={matched}
                icon={<FiCheckCircle />}
                color="text-emerald-700 dark:text-emerald-400"
              />
              <div className="space-y-6">
                <CriteriaGroup
                  title="Needs verification"
                  items={missing}
                  icon={<FiAlertCircle />}
                  color="text-amber-700 dark:text-amber-400"
                />
                <CriteriaGroup
                  title="Does not match"
                  items={unmatched}
                  icon={<FiXCircle />}
                  color="text-red-700 dark:text-red-400"
                />
              </div>
            </div>
          </div>
        )}
        {/* AI EXPLANATION */}
<div className="mt-6 rounded-3xl border bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-slate-900 dark:to-slate-900 border-primary-100 dark:border-slate-800 shadow-soft p-6 md:p-8">
  <div className="flex items-start justify-between gap-4 flex-wrap">
    <div className="flex items-center gap-3">
      <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-500 text-white grid place-items-center shadow-glow">
        <FiCpu />
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          AI Explanation
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Plain-English summary from our AI assistant
        </p>
      </div>
    </div>
    {!aiExplanation && (
      <Button onClick={getAIExplanation} disabled={aiLoading}>
        {aiLoading ? (
          <>
            <FiRefreshCw className="animate-spin" /> Generating...
          </>
        ) : (
          <>
            <FiCpu /> Explain with AI
          </>
        )}
      </Button>
    )}
  </div>

  {aiError && (
    <div className="mt-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm px-4 py-3">
      {aiError}
    </div>
  )}

  {aiExplanation && (
    <div className="mt-5 rounded-2xl bg-white dark:bg-slate-950 p-5 border border-primary-100 dark:border-slate-800">
      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
        {aiExplanation}
      </p>
      <button
        onClick={getAIExplanation}
        disabled={aiLoading}
        className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary-700 dark:text-primary-400 hover:underline disabled:opacity-50"
      >
        <FiRefreshCw className={aiLoading ? "animate-spin" : ""} /> Regenerate
      </button>
    </div>
  )}

  {!aiExplanation && !aiError && !aiLoading && (
    <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
      Click the button above to get a friendly explanation of this eligibility result.
      This uses our AI service and takes 3–8 seconds.
    </p>
  )}
</div>

        {/* ============ DESCRIPTION + BENEFITS ============ */}
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="rounded-3xl border bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-soft p-6">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FiInfo /> About the scheme
            </h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
              {scheme.description}
            </p>
          </div>

          <div className="rounded-3xl border bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-soft p-6">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FiCheckCircle /> Benefits
            </h3>
            <ul className="mt-3 space-y-2">
              {scheme.benefits?.map((b, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
                >
                  <FiCheckCircle className="text-emerald-500 mt-0.5 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ============ REQUIRED DOCUMENTS ============ */}
        <div className="mt-6 rounded-3xl border bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-soft p-6">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FiFileText /> Required documents
          </h3>
          <ul className="mt-4 grid sm:grid-cols-2 gap-3">
            {scheme.requiredDocuments?.map((d, i) => (
              <li
                key={i}
                className="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 px-4 py-3 text-sm text-slate-700 dark:text-slate-300"
              >
                <span className="h-7 w-7 rounded-lg bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 grid place-items-center text-xs font-bold">
                  {i + 1}
                </span>
                {d}
              </li>
            ))}
          </ul>
        </div>

        {/* ============ HOW TO APPLY ============ */}
        <div className="mt-6 rounded-3xl border bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-soft p-6">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FiList /> How to apply
          </h3>
          <ol className="mt-4 space-y-3">
            {scheme.applicationSteps?.map((s, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300"
              >
                <span className="h-6 w-6 rounded-full bg-primary-600 text-white grid place-items-center text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </div>

        {/* ============ SOURCE ============ */}
        <div className="mt-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>
              <strong>Source:</strong>{" "}
              <a
                href={scheme.officialSource}
                target="_blank"
                rel="noreferrer"
                className="text-primary-700 dark:text-primary-400 hover:underline"
              >
                {scheme.officialSource}
              </a>
            </span>
            <span>
              <strong>Last verified:</strong>{" "}
              {new Date(scheme.lastVerifiedDate).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}