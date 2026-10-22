import { useEffect, useState } from "react";
import {
  FiZap, FiShield, FiGithub, FiMail, FiArrowUp, FiHeart,
} from "react-icons/fi";
import { APP_NAME } from "../../utils/constants.js";

export default function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const LinkItem = ({ href, children }) => (
    <li>
      <a
        href={href}
        className="group inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 hover:text-primary-700 dark:hover:text-primary-400 transition"
      >
        <span className="relative">
          {children}
          <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-primary-600 dark:bg-primary-400 transition-all duration-300 group-hover:w-full" />
        </span>
      </a>
    </li>
  );

  return (
    <>
      <footer className="relative mt-20 bg-white dark:bg-slate-950 transition-colors">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary-300 dark:via-primary-800 to-transparent" />

        <div className="absolute inset-0 bg-grid opacity-20 dark:opacity-10 pointer-events-none" />

        <div className="container-app relative py-14 grid gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 rounded-xl gradient-hero grid place-items-center text-white shadow-glow overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 animate-shimmer" />
                <FiZap />
              </div>
              <div>
                <p className="text-base font-extrabold text-slate-900 dark:text-slate-100">{APP_NAME}</p>
                <p className="text-[10px] uppercase tracking-widest text-primary-600 dark:text-primary-400 font-semibold">
                  TN Scheme Finder
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
              AI-powered guidance to help Tamil Nadu citizens discover government
              schemes they may be eligible for. Information is sourced from official
              portals and verified periodically.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="chip bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">
                <FiShield className="text-xs" /> Privacy-first
              </span>
              <span className="chip bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-800">
                <FiShield className="text-xs" /> Source-backed
              </span>
            </div>

            <div className="mt-6 flex items-center gap-3">
              {[
                { icon: <FiGithub />, href: "#", label: "GitHub" },
                { icon: <FiMail />,   href: "mailto:contact@example.com", label: "Email" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 grid place-items-center transition hover:bg-primary-600 dark:hover:bg-primary-600 hover:text-white hover:-translate-y-0.5"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Product</h4>
            <ul className="space-y-3">
              <LinkItem href="/">Home</LinkItem>
              <LinkItem href="/about">About</LinkItem>
              <LinkItem href="/category">Find Schemes</LinkItem>
              <LinkItem href="/chat">AI Chat</LinkItem>
            </ul>
          </div>

          {/* Account */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Account</h4>
            <ul className="space-y-3">
              <LinkItem href="/login">Login</LinkItem>
              <LinkItem href="/register">Register</LinkItem>
              <LinkItem href="/dashboard">Dashboard</LinkItem>
              <LinkItem href="/saved">Saved</LinkItem>
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Important</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              This platform provides eligibility <strong>guidance only</strong>. We
              are not affiliated with any government department. Final eligibility
              is decided solely by official authorities.
            </p>
            <a
              href="/about"
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary-700 dark:text-primary-400 hover:underline"
            >
              Read full disclaimer <FiArrowUp className="rotate-45" />
            </a>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="border-t border-slate-100 dark:border-slate-800">
          <div className="container-app py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span>© {new Date().getFullYear()} {APP_NAME}. An MCA academic project.</span>
            <span className="flex items-center gap-1.5">
              Built with <FiHeart className="text-rose-500" /> for citizens of Tamil Nadu
            </span>
          </div>
        </div>
      </footer>

      {/* Back-to-top */}
      <button
        onClick={scrollTop}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-40 h-11 w-11 rounded-full bg-primary-600 text-white shadow-glow grid place-items-center transition-all duration-300
          ${showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
      >
        <FiArrowUp />
      </button>
    </>
  );
}