import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiLogOut, FiMenu, FiX, FiZap, FiSun, FiMoon } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import Button from "../ui/Button.jsx";
import { APP_NAME } from "../../utils/constants.js";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    `relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
      isActive
        ? "text-primary-700 bg-primary-50 dark:text-primary-300 dark:bg-primary-900/40"
        : "text-slate-600 hover:text-primary-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-primary-300 dark:hover:bg-slate-800"
    }`;

  const IconBtn = ({ onClick, children, label }) => (
    <button
      onClick={onClick}
      aria-label={label}
      className="h-10 w-10 rounded-xl grid place-items-center transition
                 bg-slate-100 text-slate-700 hover:bg-slate-200
                 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
    >
      {children}
    </button>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-[0_4px_20px_-4px_rgba(15,23,42,0.08)] border-b border-slate-100 dark:border-slate-800"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div
        className={`container-app flex items-center justify-between transition-all duration-300 ${
          scrolled ? "h-14" : "h-16"
        }`}
      >
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-primary-600 to-indigo-600 grid place-items-center text-white shadow-glow transition-transform group-hover:scale-105">
            <FiZap className="text-lg" />
          </div>
          <div className="leading-tight">
            <p className="text-base font-extrabold text-slate-900 dark:text-slate-100">{APP_NAME}</p>
            <p className="text-[10px] uppercase tracking-widest text-primary-600 dark:text-primary-400 font-semibold">
              TN Scheme Finder
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={navLinkClass} end>Home</NavLink>
          <NavLink to="/about" className={navLinkClass}>About</NavLink>
          <NavLink to="/schemes" className={navLinkClass}>Schemes</NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
              <NavLink to="/schemes" className={navLinkClass}>All Schemes</NavLink> 
              <NavLink to="/category" className={navLinkClass}>Find Schemes</NavLink>
              <NavLink to="/saved" className={navLinkClass}>Saved</NavLink>
              <NavLink to="/chat" className={navLinkClass}>AI Chat</NavLink>
              <NavLink to="/applications" className={navLinkClass}>Applications</NavLink>
            </>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-2 shrink-0">
          <IconBtn onClick={toggleTheme} label="Toggle theme">
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </IconBtn>

          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary-500 to-indigo-500 grid place-items-center text-white text-xs font-bold">
                  {(user?.name?.[0] || "U").toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                  {user?.name || "User"}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
              >
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
              <Link to="/register">
                <Button variant="primary" size="sm" className="shadow-glow">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex md:hidden items-center gap-2">
          <IconBtn onClick={toggleTheme} label="Toggle theme">
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </IconBtn>
          <button
            className="h-10 w-10 rounded-lg grid place-items-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden fixed inset-0 top-14 bg-white dark:bg-slate-950 transition-all duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="container-app py-4 flex flex-col gap-1">
          {[
            { to: "/", label: "Home", end: true },
            { to: "/about", label: "About" },
            ...(isAuthenticated
              ? [
                  { to: "/dashboard", label: "Dashboard" },
                  { to: "/schemes",   label: "All Schemes" }, 
                  { to: "/category", label: "Find Schemes" },
                  { to: "/saved", label: "Saved" },
                  { to: "/applications", label: "Applications" },
                  { to: "/chat", label: "AI Chat" },
                ]
              : []),
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          <div className="h-px bg-slate-100 dark:bg-slate-800 my-3" />

          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-500 to-indigo-500 grid place-items-center text-white text-sm font-bold">
                  {(user?.name?.[0] || "U").toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user?.name || "User"}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Signed in</p>
                </div>
              </div>
              <button
                onClick={() => { handleLogout(); setOpen(false); }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
              >
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>
                <Button variant="outline" size="lg" className="w-full">Login</Button>
              </Link>
              <Link to="/register" onClick={() => setOpen(false)}>
                <Button variant="primary" size="lg" className="w-full">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}