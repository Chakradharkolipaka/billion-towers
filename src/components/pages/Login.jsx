import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}`);
      navigate(user.role === "admin" ? "/admin/products" : "/session", { replace: true });
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-4 py-24 sm:px-6 lg:px-8">
      <motion.div
        className="mx-auto max-w-md rounded-2xl border border-white/[0.08] bg-brand-bg-panel/60 p-8 shadow-glass backdrop-blur-md"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-cyan/30 bg-brand-cyan/10">
            <LogIn className="h-7 w-7 text-brand-cyan" aria-hidden />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Sign in</h1>
          <p className="mt-2 text-sm text-brand-ink-secondary">
            Access your account or admin dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-brand-ink-secondary">Email</span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-ink-muted" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="w-full rounded-xl border border-white/10 bg-brand-bg-base/80 py-3 pl-10 pr-4 text-white outline-none transition focus:border-brand-cyan/50"
                placeholder="you@company.com"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-brand-ink-secondary">Password</span>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-ink-muted" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className="w-full rounded-xl border border-white/10 bg-brand-bg-base/80 py-3 pl-10 pr-4 text-white outline-none transition focus:border-brand-cyan/50"
                placeholder="••••••••"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-hero-primary w-full min-h-[48px] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-brand-ink-secondary">
          No account yet?{" "}
          <Link to="/register" className="text-brand-cyan hover:text-brand-cyan-mint">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
