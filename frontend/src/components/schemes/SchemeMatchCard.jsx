import { Link } from "react-router-dom";
import { FiArrowRight, FiExternalLink, FiFileText } from "react-icons/fi";
import MatchBadge from "./MatchBadge.jsx";
import CriteriaList from "./CriteriaList.jsx";
import SaveButton from "./SaveButton.jsx";

export default function SchemeMatchCard({ result, isSaved = false, onSavedChange }) {
  const { scheme, status, score, matched, unmatched, missing } = result;

  const barColor =
    status === "eligible"
      ? "from-emerald-500 to-teal-500"
      : status === "possibly_eligible"
      ? "from-amber-500 to-orange-500"
      : "from-red-500 to-rose-500";

  return (
    <div className="rounded-2xl border bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-soft hover:shadow-card transition">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
              {scheme.schemeId}
            </p>
            <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
              {scheme.name}
            </h3>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {score}%
            </p>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Match
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <MatchBadge status={status} />
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
            style={{ width: `${score}%` }}
          />
        </div>

        <div className="mt-4">
          <CriteriaList matched={matched} unmatched={unmatched} missing={missing} />
        </div>

        {scheme.requiredDocuments?.length > 0 && (
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <FiFileText />
            <span>
              {scheme.requiredDocuments.length} document
              {scheme.requiredDocuments.length > 1 ? "s" : ""} required
            </span>
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-3 flex items-center justify-between gap-3">
        <Link
          to={`/schemes/${scheme.schemeId}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary-700 dark:text-primary-400 hover:gap-2 transition-all"
        >
          View Details <FiArrowRight />
        </Link>
        <div className="flex items-center gap-2">
          <SaveButton
            schemeId={scheme.schemeId}
            initialSaved={isSaved}
            variant="ghost"
            size="sm"
            showLabel={false}
            onChange={onSavedChange}
          />
          {scheme.officialLink && (
            <a
              href={scheme.officialLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-primary-700 dark:hover:text-primary-400"
              title="Opens in new tab"
            >
              Portal <FiExternalLink />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}