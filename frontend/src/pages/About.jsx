import { Link } from "react-router-dom";
import {
  FiInfo, FiLock, FiAlertTriangle, FiBookOpen, FiShield,
  FiCpu, FiCheckCircle, FiArrowRight, FiDatabase, FiUserCheck,
} from "react-icons/fi";
import Button from "../components/ui/Button.jsx";
import { APP_NAME } from "../utils/constants.js";

export default function About() {
  return (
    <div className="overflow-x-hidden bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-hero-mesh dark:opacity-40" />
        <div className="absolute inset-0 -z-10 bg-grid opacity-30 dark:opacity-15" />
        <div className="absolute -top-24 -left-24 -z-10 h-72 w-72 rounded-full bg-primary-400/25 dark:bg-primary-500/15 blur-3xl animate-blob" />
        <div className="absolute top-40 -right-24 -z-10 h-80 w-80 rounded-full bg-emerald-400/20 dark:bg-emerald-500/10 blur-3xl animate-blob" style={{ animationDelay: "3s" }} />

        <div className="container-app py-20 text-center max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-white/70 dark:bg-slate-900/70 border border-primary-100 dark:border-slate-800 text-primary-700 dark:text-primary-300 shadow-soft">
            About the platform
          </span>
          <h1 className="mt-5 text-4xl md:text-5xl font-extrabold leading-tight text-slate-900 dark:text-slate-100">
            Built to make schemes<br />
            <span className="gradient-text">accessible for everyone.</span>
          </h1>
          <p className="mt-5 text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            {APP_NAME} is an academic MCA project that helps Tamil Nadu citizens
            discover government schemes they may be eligible for — using a strict
            rule engine and AI explanations grounded in official sources.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/register">
              <Button size="lg" className="shadow-glow">Try it now <FiArrowRight /></Button>
            </Link>
            <Link to="/">
              <Button size="lg" variant="outline">Back to home</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* MISSION CARDS */}
      <section className="relative container-app py-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-800">
            Our commitment
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
            Four principles we never break
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Every design decision in this platform follows these rules.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {[
            { icon: <FiInfo />, color: "from-primary-500 to-indigo-500", title: "Guidance, not authority", desc: "We provide eligibility guidance based on official scheme information. Final eligibility is decided solely by the concerned government authority." },
            { icon: <FiBookOpen />, color: "from-emerald-500 to-teal-500", title: "Official sources only", desc: "Every scheme is sourced from .gov.in / .nic.in portals and carries a source URL with a last-verified date." },
            { icon: <FiLock />, color: "from-purple-500 to-pink-500", title: "Privacy by design", desc: "We never store Aadhaar or identity numbers. Uploaded documents stay private, can be deleted anytime." },
            { icon: <FiCpu />, color: "from-orange-500 to-amber-500", title: "AI that explains, not decides", desc: "Eligibility is decided by deterministic rules — not by AI. The LLM only rewrites results into simple language." },
          ].map((f) => (
            <div key={f.title} className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-200 to-indigo-200 dark:from-primary-800 dark:to-indigo-800 opacity-0 group-hover:opacity-100 blur transition rounded-3xl" />
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

      {/* TIMELINE */}
      <section className="relative py-20 bg-slate-900 dark:bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary-500/30 blur-3xl" />

        <div className="container-app relative">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-white/10 text-primary-200 border border-white/10">
              Behind the scenes
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-white">
              How eligibility is decided
            </h2>
            <p className="mt-3 text-slate-300">
              A transparent pipeline — no black-box decisions on your future.
            </p>
          </div>

          <ol className="mt-14 grid gap-6 md:grid-cols-4">
            {[
              { step: "01", title: "Profile", desc: "You fill a guided wizard with only necessary details." },
              { step: "02", title: "Rule engine", desc: "Structured rules compare your profile to each scheme." },
              { step: "03", title: "Explain", desc: "AI rewrites the rule output in simple language." },
              { step: "04", title: "Sources", desc: "Official link + last-verified date shown on every card." },
            ].map((s, i) => (
              <li key={s.step} className="relative">
                {i < 3 && (
                  <span className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-white/30 to-transparent" />
                )}
                <div className="relative rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm hover:bg-white/10 transition">
                  <span className="text-4xl font-extrabold text-white/10">{s.step}</span>
                  <h3 className="mt-2 text-base font-bold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm text-slate-300 leading-relaxed">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* DATA SOURCES */}
      <section className="relative container-app py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">
              Data sources
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
              Only from official portals.
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              We collect scheme information exclusively from government-run websites. Every scheme record stores:
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700 dark:text-slate-300">
              {["Official source URL", "Last verified date", "Required documents", "Application steps", "Direct link to the official portal"].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 grid place-items-center shrink-0">
                    <FiCheckCircle className="text-xs" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="absolute -top-4 -right-4 h-40 w-40 rounded-full bg-primary-200/40 dark:bg-primary-700/20 blur-3xl" />
            <div className="relative rounded-3xl border p-6 shadow-card bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 grid place-items-center">
                  <FiDatabase />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Scheme record</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">TN Post-Matric Scholarship</p>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Source</span>
                  <span className="font-medium text-primary-700 dark:text-primary-400">tn.gov.in</span>
                </div>
                <div className="flex justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Last verified</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">15 Jan 2025</span>
                </div>
                <div className="flex justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Status</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Docs required</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">4 documents</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRIVACY */}
      <section className="relative py-20 border-y bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 border-slate-100 dark:border-slate-800">
        <div className="container-app max-w-4xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
              Privacy
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
              Your data, your control.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { icon: <FiLock />, title: "No Aadhaar", desc: "We never ask for or store Aadhaar or any government ID numbers." },
              { icon: <FiUserCheck />, title: "You confirm", desc: "Extracted data from documents is always shown to you for review before use." },
              { icon: <FiShield />, title: "You can delete", desc: "Delete uploaded documents and your account anytime." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border p-6 shadow-soft text-center hover:-translate-y-1 transition bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800">
                <div className="mx-auto h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 grid place-items-center text-xl">
                  {f.icon}
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-slate-100">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="container-app py-20">
        <div className="relative overflow-hidden rounded-3xl border p-8 md:p-10 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border-amber-200 dark:border-amber-900">
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-amber-200/40 dark:bg-amber-700/20 blur-3xl" />
          <div className="relative flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 grid place-items-center text-2xl shrink-0">
              <FiAlertTriangle />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Important disclaimer
              </h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
                This is <strong>not a government website</strong>. We do not process,
                approve, or reject any application. All eligibility shown here is
                guidance based on our interpretation of official rules. Final
                eligibility and approvals are made only by the concerned government
                department. Always verify with the official portal before applying.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}