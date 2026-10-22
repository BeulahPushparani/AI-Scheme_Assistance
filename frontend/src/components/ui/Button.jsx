export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  href,
  target,
  rel,
  ...props
}) {
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
    secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200 focus:ring-slate-400 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
    outline: "border border-primary-600 text-primary-700 hover:bg-primary-50 focus:ring-primary-500 dark:border-primary-500 dark:text-primary-400 dark:hover:bg-primary-950/40",
    success: "bg-accent-600 text-white hover:bg-accent-500 focus:ring-accent-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost: "text-slate-700 hover:bg-slate-100 focus:ring-slate-300 dark:text-slate-300 dark:hover:bg-slate-800",
  };
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };
  const cls = `btn-base ${variants[variant]} ${sizes[size]} ${className}`;

  // Render as <a> when href is provided — fixes the button-in-anchor problem
  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : rel}
        className={cls}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={cls} {...props}>
      {children}
    </button>
  );
}