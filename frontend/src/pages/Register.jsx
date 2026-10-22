import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { APP_NAME } from "../utils/constants.js";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Minimum 6 characters";
    if (form.confirm !== form.password) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setServerError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate("/category", { replace: true });
    } catch (err) {
      setServerError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      {/* LEFT — Form */}
      <div className="flex items-center justify-center p-6 md:p-12 bg-slate-50 order-2 lg:order-1">
        <div className="w-full max-w-md fade-in">
          <div className="lg:hidden mb-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl gradient-hero grid place-items-center text-white font-bold">SS</div>
              <span className="text-lg font-bold text-slate-900">{APP_NAME}</span>
            </Link>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900">Create your account</h1>
          <p className="mt-1 text-sm text-slate-600">
            Takes less than a minute. No sensitive documents required.
          </p>

          {serverError && (
            <div className="mt-5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
              {serverError}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 space-y-5">
            <div className="relative">
              <FiUser className="absolute left-4 top-[42px] text-slate-400 pointer-events-none" />
              <Input
                label="Full Name"
                name="name"
                placeholder="Priya Rajesh"
                className="[&_input]:pl-11"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                error={errors.name}
              />
            </div>

            <div className="relative">
              <FiMail className="absolute left-4 top-[42px] text-slate-400 pointer-events-none" />
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="[&_input]:pl-11"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                error={errors.email}
              />
            </div>

            <div className="relative">
              <FiLock className="absolute left-4 top-[42px] text-slate-400 pointer-events-none" />
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="At least 6 characters"
                className="[&_input]:pl-11"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={errors.password}
              />
            </div>

            <div className="relative">
              <FiLock className="absolute left-4 top-[42px] text-slate-400 pointer-events-none" />
              <Input
                label="Confirm Password"
                name="confirm"
                type="password"
                placeholder="Re-enter password"
                className="[&_input]:pl-11"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                error={errors.confirm}
              />
            </div>

            <Button type="submit" size="lg" className="w-full shadow-glow" disabled={loading}>
              {loading ? "Creating account..." : <>Create Account <FiArrowRight /></>}
            </Button>
          </form>

          <p className="mt-6 text-sm text-slate-600 text-center">
            Already registered?{" "}
            <Link to="/login" className="text-primary-700 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT — Brand panel */}
      <div className="hidden lg:flex relative overflow-hidden gradient-hero text-white p-12 flex-col justify-between order-1 lg:order-2">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl animate-blob" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl animate-blob" style={{ animationDelay: "4s" }} />

        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-white/20 grid place-items-center font-bold">SS</div>
            <span className="text-lg font-bold">{APP_NAME}</span>
          </div>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-4xl font-extrabold leading-tight">
            Your journey to the<br />right scheme starts here.
          </h2>

          <ul className="mt-8 space-y-3 text-sm text-primary-50/90">
            {[
              "Personalized scheme recommendations",
              "Transparent eligibility scoring",
              "Document AI to read your certificates",
              "AI chat to answer your questions",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <FiCheckCircle className="text-emerald-300 shrink-0" /> {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative text-xs text-primary-100/70">
          Guidance only. Final eligibility decided by official authorities.
        </div>
      </div>
    </div>
  );
}