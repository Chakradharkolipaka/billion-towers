import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Shield,
  LogOut,
  KeyRound,
  LayoutDashboard,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import * as authApi from "../../api/authApi";

const SessionPage = () => {
  const navigate = useNavigate();
  const { user, isAdmin, logout, refreshUser } = useAuth();
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  React.useEffect(() => {
    setProfileForm({
      name: user?.name || "",
      email: user?.email || "",
    });
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Session ended");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error.message || "Logout failed");
    }
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setSavingProfile(true);

    try {
      await authApi.updateProfile(profileForm);
      await refreshUser();
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setSavingPassword(true);

    try {
      await authApi.updatePassword(
        passwordForm.oldPassword,
        passwordForm.newPassword,
      );
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password updated");
    } catch (error) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-cyan">
            Session
          </p>
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Account & session management
          </h1>
          <p className="mt-2 text-sm text-brand-ink-secondary">
            View your active session, manage profile details, and sign out securely.
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
            <div>
              <p className="font-semibold text-white">Active session</p>
              <p className="mt-1 text-sm text-brand-ink-secondary">
                You are signed in as <span className="text-white">{user.email}</span>.
                Your session is stored in a secure httpOnly cookie.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.section
            className="rounded-2xl border border-white/[0.08] bg-brand-bg-panel/60 p-6 shadow-glass backdrop-blur-md"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <User className="h-5 w-5 text-brand-cyan" />
              Profile
            </h2>

            <div className="mb-5 space-y-3 text-sm">
              <div className="flex items-center gap-2 text-brand-ink-secondary">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-brand-ink-secondary">
                <Shield className="h-4 w-4" />
                <span className="capitalize">Role: {user.role}</span>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm text-brand-ink-secondary">Name</span>
                <input
                  name="name"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                  className="admin-input"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-brand-ink-secondary">Email</span>
                <input
                  name="email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                  className="admin-input"
                />
              </label>
              <button
                type="submit"
                disabled={savingProfile}
                className="btn btn-hero-primary min-h-[44px] disabled:opacity-60"
              >
                {savingProfile ? "Saving…" : "Save profile"}
              </button>
            </form>
          </motion.section>

          <motion.section
            className="rounded-2xl border border-white/[0.08] bg-brand-bg-panel/60 p-6 shadow-glass backdrop-blur-md"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <KeyRound className="h-5 w-5 text-brand-gold-light" />
              Change password
            </h2>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm text-brand-ink-secondary">Current password</span>
                <input
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      oldPassword: e.target.value,
                    }))
                  }
                  required
                  className="admin-input"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-brand-ink-secondary">New password</span>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  required
                  minLength={8}
                  className="admin-input"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-brand-ink-secondary">Confirm new password</span>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  required
                  minLength={8}
                  className="admin-input"
                />
              </label>
              <button
                type="submit"
                disabled={savingPassword}
                className="btn btn-hero-secondary min-h-[44px] disabled:opacity-60"
              >
                {savingPassword ? "Updating…" : "Update password"}
              </button>
            </form>
          </motion.section>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {isAdmin && (
            <Link
              to="/admin/products"
              className="btn btn-hero-primary inline-flex min-h-[44px] items-center gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              Product management
            </Link>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-hero-secondary inline-flex min-h-[44px] items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            End session
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionPage;
