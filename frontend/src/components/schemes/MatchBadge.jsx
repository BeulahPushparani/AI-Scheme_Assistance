export default function MatchBadge({ status }) {
  const map = {
    eligible: {
      label: "Eligible",
      cls: "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
      dot: "bg-emerald-500",
      emoji: "🟢",
    },
    possibly_eligible: {
      label: "Possibly Eligible",
      cls: "bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
      dot: "bg-amber-500",
      emoji: "🟡",
    },
    not_eligible: {
      label: "Not Eligible",
      cls: "bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
      dot: "bg-red-500",
      emoji: "🔴",
    },
  };
  const cfg = map[status] || map.not_eligible;
  return (
    <span className={`chip border ${cfg.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}