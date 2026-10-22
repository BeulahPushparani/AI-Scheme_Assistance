const STEPS = ["Basic", "Details", "Income", "Docs", "Review"];

export default function ProgressBar({ current, total = 5 }) {
  return (
    <div className="w-full">
      {/* Circles + line */}
      <div className="relative flex items-center justify-between">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-800 -z-0" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-primary-500 transition-all duration-300 -z-0"
          style={{ width: `${((current - 1) / (total - 1)) * 100}%` }}
        />

        {STEPS.map((label, i) => {
          const step = i + 1;
          const isDone = step < current;
          const isActive = step === current;
          return (
            <div key={label} className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`h-8 w-8 rounded-full grid place-items-center text-xs font-bold transition
                  ${isDone ? "bg-primary-600 text-white" : ""}
                  ${isActive ? "bg-primary-600 text-white ring-4 ring-primary-100 dark:ring-primary-900/40" : ""}
                  ${!isDone && !isActive ? "bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700" : ""}
                `}
              >
                {isDone ? "✓" : step}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  isActive ? "text-primary-700 dark:text-primary-400" : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-center mt-5 text-xs font-medium text-slate-500 dark:text-slate-400">
        Step {current} of {total}
      </p>
    </div>
  );
}