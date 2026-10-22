import { FiCheckCircle, FiXCircle, FiAlertCircle } from "react-icons/fi";

export default function CriteriaList({ matched = [], unmatched = [], missing = [] }) {
  return (
    <div className="space-y-2 text-sm">
      {matched.map((m) => (
        <div key={m.rule} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
          <FiCheckCircle className="text-emerald-500 shrink-0 mt-0.5" />
          <span>{m.label}</span>
        </div>
      ))}
      {missing.map((m) => (
        <div key={m.rule} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
          <FiAlertCircle className="text-amber-500 shrink-0 mt-0.5" />
          <span>
            {m.label}
            {m.mandatory && <span className="text-amber-600 dark:text-amber-400 text-xs ml-1">(required)</span>}
          </span>
        </div>
      ))}
      {unmatched.map((m) => (
        <div key={m.rule} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
          <FiXCircle className="text-red-500 shrink-0 mt-0.5" />
          <span>{m.label}</span>
        </div>
      ))}
    </div>
  );
}