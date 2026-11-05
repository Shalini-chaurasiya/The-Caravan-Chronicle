import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  ArrowRight,
  ShieldCheck,
  ClipboardList,
  CheckCircle2,
} from "lucide-react";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/+$/, "");
const API_URL = API_BASE_URL.endsWith("/api")
  ? API_BASE_URL
  : `${API_BASE_URL}/api`;

const StaffLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/staff/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Invalid email or password");
      }

      if (!data.token || !data.staff) {
        throw new Error("The server returned an invalid login response.");
      }

      localStorage.setItem("staffToken", data.token);
      localStorage.setItem("staff", JSON.stringify(data.staff));

      window.location.href = "/staff/dashboard";
    } catch (err) {
      setError(err.message || "Unable to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    window.location.href = "http://localhost:5173/";
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl min-h-[580px] overflow-hidden rounded-3xl bg-white shadow-2xl grid grid-cols-1 lg:grid-cols-2">
        {/* Left Panel */}
        <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[#101c3a] p-10 text-white">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/10" />
          <div className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-cyan-400/10" />

          <div className="relative z-10">
            <div className="mb-12 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500">
                <Building2 size={25} />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-wide">
                  Caravan Chronicle
                </h1>
                <p className="text-xs text-blue-200">
                  Municipal Grievance System
                </p>
              </div>
            </div>

            <span className="rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1 text-xs font-medium text-blue-200">
              STAFF PORTAL
            </span>

            <h2 className="mt-5 max-w-sm text-3xl font-bold leading-tight">
              Welcome to your
              <span className="block text-blue-400">Staff Workspace</span>
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
              Access assigned complaints, manage your workload, and keep
              citizens informed with timely updates.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                  <ClipboardList size={17} className="text-blue-300" />
                </div>
                <span className="text-sm text-slate-200">
                  View and manage assigned complaints
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                  <CheckCircle2 size={17} className="text-blue-300" />
                </div>
                <span className="text-sm text-slate-200">
                  Update complaint progress and status
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                  <ShieldCheck size={17} className="text-blue-300" />
                </div>
                <span className="text-sm text-slate-200">
                  Secure access to your staff account
                </span>
              </div>
            </div>
          </div>

          <p className="relative z-10 text-xs text-slate-400">
            © 2026 Caravan Chronicle. All rights reserved.
          </p>
        </div>

        {/* Right Panel */}
        <div className="flex items-center justify-center px-6 py-8 sm:px-10">
          <div className="w-full max-w-md">
            <button
              type="button"
              onClick={handleBack}
              className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
            >
              <ArrowRight className="rotate-180" size={16} />
              Back to Role Selection
            </button>

            <div className="mb-7">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Building2 size={24} />
              </div>

              <h2 className="text-2xl font-bold text-[#172033]">
                Staff Sign In
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Sign in using the credentials provided by your administrator.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="staff@municipal.gov.in"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-12 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Sign In to Staff Portal"}
                {!loading && <ArrowRight size={17} />}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck size={15} />
              Secure staff authentication
            </div>

            <p className="mt-5 text-center text-xs text-slate-400">
              Need access? Contact your system administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;