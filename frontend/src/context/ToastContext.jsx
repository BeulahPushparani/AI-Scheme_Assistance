import { createContext, useContext, useState, useCallback } from "react";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (type, message, duration = 3500) => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, type, message }]);
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss]
  );

  const toast = {
    success: (msg, d) => push("success", msg, d),
    error: (msg, d) => push("error", msg, d),
    info: (msg, d) => push("info", msg, d),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 w-[calc(100vw-2rem)] max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }) {
  const config = {
    success: {
      icon: <FiCheckCircle />,
      cls: "border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300",
      iconCls: "text-emerald-500",
    },
    error: {
      icon: <FiAlertCircle />,
      cls: "border-red-200 dark:border-red-800 bg-white dark:bg-slate-900 text-red-700 dark:text-red-300",
      iconCls: "text-red-500",
    },
    info: {
      icon: <FiInfo />,
      cls: "border-primary-200 dark:border-primary-800 bg-white dark:bg-slate-900 text-primary-700 dark:text-primary-300",
      iconCls: "text-primary-500",
    },
  }[toast.type];

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 rounded-xl border shadow-card px-4 py-3 fade-in ${config.cls}`}
    >
      <span className={`text-lg shrink-0 mt-0.5 ${config.iconCls}`}>{config.icon}</span>
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0"
      >
        <FiX />
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx.toast;
}