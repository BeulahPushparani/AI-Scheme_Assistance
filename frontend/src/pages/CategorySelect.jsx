import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
import Button from "../components/ui/Button.jsx";
import { CATEGORIES } from "../utils/constants.js";

export default function CategorySelect() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const handleContinue = () => {
    if (!selected) return;
    localStorage.setItem("selectedCategory", selected);
    navigate("/wizard");
  };

  return (
    <div className="relative bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="absolute inset-0 -z-10 bg-hero-mesh opacity-60 dark:opacity-25" />
      <div className="absolute inset-0 -z-10 bg-grid opacity-30 dark:opacity-15" />

      <div className="container-app py-16 max-w-5xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-white/70 dark:bg-slate-900/70 border border-primary-100 dark:border-slate-800 text-primary-700 dark:text-primary-300 shadow-soft">
            Step 1 of 6
          </span>
          <h1 className="mt-5 text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
            Who are you?
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Choose the option that best describes you. The wizard will adapt its
            questions to your category.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((c) => {
            const active = selected === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelected(c.id)}
                className="text-left focus:outline-none"
              >
                <div
                  className={`relative h-full rounded-2xl p-5 border transition-all bg-white dark:bg-slate-900
                    ${active
                      ? "border-primary-400 dark:border-primary-500 shadow-glow -translate-y-1"
                      : "border-slate-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-700 hover:-translate-y-1 hover:shadow-card"}`}
                >
                  {active && (
                    <span className="absolute top-3 right-3 h-6 w-6 rounded-full bg-primary-600 text-white grid place-items-center">
                      <FiCheckCircle className="text-sm" />
                    </span>
                  )}
                  <div className={`h-14 w-14 rounded-2xl grid place-items-center text-3xl transition
                    ${active
                      ? "bg-gradient-to-br from-primary-100 to-indigo-100 dark:from-primary-900/50 dark:to-indigo-900/50"
                      : "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800"}`}>
                    {c.emoji}
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-slate-100">{c.label}</h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{c.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            You can change this later from your dashboard.
          </p>
          <Button
            size="lg"
            disabled={!selected}
            onClick={handleContinue}
            className={selected ? "shadow-glow" : ""}
          >
            Continue <FiArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}