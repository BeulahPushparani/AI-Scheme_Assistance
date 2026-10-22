export default function Card({ children, className = "", hover = false }) {
  return (
    <div
      className={`rounded-2xl shadow-soft border p-6 transition
        bg-white border-slate-100
        dark:bg-slate-900 dark:border-slate-800
        ${hover ? "hover:shadow-lg hover:-translate-y-0.5" : ""}
        ${className}`}
    >
      {children}
    </div>
  );
}