import { Link } from "react-router-dom";
import {
  FiArrowRight, FiShield, FiCpu, FiFileText, FiCheckCircle,
  FiSearch, FiUserCheck, FiAward, FiTrendingUp, FiLock,
} from "react-icons/fi";
import Button from "../components/ui/Button.jsx";
import { CATEGORIES, APP_NAME } from "../utils/constants.js";

export default function Landing() {
  return (
    <div className="overflow-x-hidden bg-slate-50 dark:bg-slate-950 transition-colors">

      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-hero-mesh dark:opacity-40" />
        <div className="absolute inset-0 -z-10 bg-grid opacity-40 dark:opacity-20" />
        <div className="absolute -top-24 -left-24 -z-10 h-72 w-72 rounded-full bg-primary-400/30 dark:bg-primary-500/20 blur-3xl animate-blob" />
        <div className="absolute top-40 -right-24 -z-10 h-80 w-80 rounded-full bg-emerald-400/25 dark:bg-emerald-500/15 blur-3xl animate-blob" style={{ animationDelay: "3s" }} />
        <div className="absolute -bottom-24 left-1/3 -z-10 h-72 w-72 rounded-full bg-indigo-400/25 dark:bg-indigo-500/15 blur-3xl animate-blob" style={{ animationDelay: "6s" }} />

        <div className="container-app py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div className="fade-in">
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-white/70 dark:bg-slate-900/70 border border-primary-100 dark:border-slate-800 text-primary-700 dark:text-primary-300 shadow-soft">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-600"></span>
              </span>
              AI-Powered · Tamil Nadu Focused
            </div>

            <h1 className="mt-6 text-4xl md:text-6xl font-extrabold leading-[1.05] text-slate-900 dark:text-slate-100">
              Find the<br />
              <span className="gradient-text">right schemes</span><br />
              for your life.
            </h1>

            <p className="mt-6 text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
              {APP_NAME} matches your profile with official Tamil Nadu and
              Central government schemes — with clear reasons, required
              documents, and step-by-step guidance.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register">
                <Button size="lg" className="shadow-glow">
                  Get Started Free <FiArrowRight />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline">How it works</Button>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2"><FiShield className="text-emerald-500" /> Official sources only</div>
              <div className="flex items-center gap-2"><FiLock className="text-primary-500" /> No Aadhaar stored</div>
              <div className="flex items-center gap-2"><FiCheckCircle className="text-indigo-500" /> Rule-based accuracy</div>
            </div>
          </div>

          {/* Hero mockup */}
          <div className="fade-in relative">
            <div className="absolute -top-4 -left-4 z-20 hidden md:flex items-center gap-2 rounded-2xl shadow-card px-4 py-3 animate-floaty bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 grid place-items-center">
                <FiAward />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Top match</p>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">95% Eligible</p>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-2 z-20 hidden md:flex items-center gap-2 rounded-2xl shadow-card px-4 py-3 animate-floaty bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800" style={{ animationDelay: "1.5s" }}>
              <div className="h-8 w-8 rounded-lg bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 grid place-items-center">
                <FiSearch />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Schemes indexed</p>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">100+ verified</p>
              </div>
            </div>

            <div className="relative rounded-3xl backdrop-blur-xl p-6 shadow-card border bg-white/70 dark:bg-slate-900/60 border-white/60 dark:border-slate-800">
              <div className="rounded-2xl p-5 border shadow-soft bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                      Highly matched
                    </p>
                  </div>
                  <span className="text-2xl font-extrabold gradient-text">95%</span>
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">
                  TN Post-Matric Scholarship
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Tamil Nadu Adi Dravidar Housing & Development Corp.
                </p>

                <div className="mt-4 space-y-2">
                  {["You are a student", "Tamil Nadu resident", "Income within limit"].map((line) => (
                    <div key={line} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <FiCheckCircle className="text-emerald-500 shrink-0" />
                      {line}
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t flex items-center justify-between border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    Source: tn.gov.in · Verified 15 Jan 2025
                  </span>
                  <button className="text-xs font-semibold text-primary-700 dark:text-primary-400 hover:underline">
                    View →
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <div className="h-full w-[95%] rounded-full bg-gradient-to-r from-primary-500 to-emerald-500" />
                </div>
                <span className="font-medium">95% match</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="container-app pb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "100+", label: "Verified schemes", icon: <FiAward /> },
              { value: "8",     label: "User categories",  icon: <FiUserCheck /> },
              { value: "3 min", label: "To get results",   icon: <FiTrendingUp /> },
              { value: "100%",  label: "Source-backed",    icon: <FiShield /> },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl px-4 py-5 text-center backdrop-blur-xl border shadow-soft bg-white/70 dark:bg-slate-900/70 border-white/40 dark:border-slate-800/60">
                <div className="mx-auto h-9 w-9 rounded-xl grid place-items-center bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
                  {s.icon}
                </div>
                <p className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-slate-100">{s.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative container-app py-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-800">
            Why choose us
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
            Accurate results, not guesses
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            We combine a strict eligibility engine with AI explanations.
            No hallucinations on rules that decide your future.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            { icon: <FiCpu />, color: "from-primary-500 to-indigo-500", title: "AI-Powered Matching", desc: "Understands your profile in plain language and explains why each scheme matches or doesn't." },
            { icon: <FiShield />, color: "from-emerald-500 to-teal-500", title: "Rule-Based Accuracy", desc: "Eligibility is decided by deterministic rules, not by AI. Zero hallucination risk." },
            { icon: <FiFileText />, color: "from-orange-500 to-amber-500", title: "Document Assistant", desc: "Upload income or mark sheets. We extract key fields for you to review and confirm." },
          ].map((f) => (
            <div key={f.title} className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur transition rounded-3xl from-primary-200 to-indigo-200 dark:from-primary-800 dark:to-indigo-800" />
              <div className="relative h-full rounded-2xl border p-6 shadow-soft bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${f.color} text-white grid place-items-center text-xl shadow-glow`}>
                  {f.icon}
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-slate-100">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative bg-slate-900 dark:bg-black text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary-500/30 blur-3xl" />

        <div className="container-app relative">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-white/10 text-primary-200 border border-white/10">
              Simple process
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-white">How it works</h2>
            <p className="mt-3 text-slate-300">
              From "I don't know what I qualify for" to a personalized scheme list in three steps.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { step: "01", title: "Tell us about you", desc: "Pick your category and fill a short wizard. Takes 3 minutes." },
              { step: "02", title: "We analyze rules", desc: "Our engine compares your profile against verified scheme rules." },
              { step: "03", title: "See your matches", desc: "Get ranked schemes with reasons, documents, and apply links." },
            ].map((s) => (
              <div key={s.step} className="relative rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm hover:bg-white/10 transition">
                <span className="text-5xl font-extrabold text-white/10">{s.step}</span>
                <h3 className="mt-2 text-lg font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="relative container-app py-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">
            Built for everyone
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
            Who are you?
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Pick your category — the form adapts to your situation.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((c) => (
            <Link to="/category" key={c.id} className="group">
              <div className="relative rounded-2xl border p-6 text-center transition hover:-translate-y-1 hover:shadow-card hover:border-primary-200 dark:hover:border-primary-700 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800">
                <div className="mx-auto h-14 w-14 rounded-2xl grid place-items-center text-3xl group-hover:scale-110 transition bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800">
                  {c.emoji}
                </div>
                <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-slate-100">{c.label}</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{c.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-app pb-24">
        <div className="relative overflow-hidden rounded-3xl gradient-hero p-10 md:p-16 text-center">
          <div className="absolute inset-0 bg-grid opacity-10" />
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />

          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Ready to discover your schemes?
            </h2>
            <p className="mt-4 text-primary-50/90 max-w-2xl mx-auto">
              It takes 3 minutes. No sensitive documents required.
              Guidance only — final eligibility is decided by official authorities.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/register">
                <Button size="lg" className="keep-light !bg-white !text-primary-700 hover:!bg-primary-50">
                  Create Free Account <FiArrowRight />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="!border-white/60 !text-white hover:!bg-white/10">
                  I already have an account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}