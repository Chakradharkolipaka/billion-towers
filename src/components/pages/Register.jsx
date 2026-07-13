import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, User } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    gender: "prefer-not-to-say",
  });
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
      const user = await register(form);
      toast.success(`Account created for ${user.name}`);
      navigate(user.role === "admin" ? "/admin/products" : "/session", { replace: true });
    } catch (error) {
      toast.error(error.message || "Registration failed");
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
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-gold/30 bg-brand-gold/10">
            <UserPlus className="h-7 w-7 text-brand-gold-light" aria-hidden />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Create account</h1>
          <p className="mt-2 text-sm text-brand-ink-secondary">
            Register to invest and manage your portfolio.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-brand-ink-secondary">Full name</span>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-ink-muted" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/10 bg-brand-bg-base/80 py-3 pl-10 pr-4 text-white outline-none transition focus:border-brand-cyan/50"
                placeholder="Jane Investor"
              />
            </div>
          </label>

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
                minLength={8}
                autoComplete="new-password"
                className="w-full rounded-xl border border-white/10 bg-brand-bg-base/80 py-3 pl-10 pr-4 text-white outline-none transition focus:border-brand-cyan/50"
                placeholder="At least 8 characters"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-brand-ink-secondary">Gender</span>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-brand-bg-base/80 px-4 py-3 text-white outline-none transition focus:border-brand-cyan/50"
            >
              <option value="prefer-not-to-say">Prefer not to say</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-hero-primary w-full min-h-[48px] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-brand-ink-secondary">
          Already registered?{" "}
          <Link to="/login" className="text-brand-cyan hover:text-brand-cyan-mint">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
