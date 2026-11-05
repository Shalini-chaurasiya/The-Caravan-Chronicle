
import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  ArrowRight,
  ShieldCheck,
  Users,
  ClipboardList,
  BarChart3,
} from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid admin credentials.");
        return;
      }

      localStorage.setItem("adminToken", data.token);

      if (data.admin) {
        localStorage.setItem("admin", JSON.stringify(data.admin));
      }

      window.location.href = "http://localhost:5174/admin/dashboard";
    } catch (error) {
      console.error("Admin Login Error:", error);
      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    window.location.href = "http://localhost:5173/";
  };

  return (
    <div className="min-h-screen w-full flex bg-[#f4f7fc] overflow-hidden">

      {/* LEFT ADMIN BRANDING PANEL */}
      <div className="hidden lg:flex lg:w-[48%] bg-[#112541]
        text-white flex-col justify-between px-10 py-7 xl:px-14
        relative overflow-hidden">

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">

          <div className="w-12 h-12 rounded-xl bg-[#2176e8]
            flex items-center justify-center shadow-lg">
            <Building2 size={26} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-wide">
              Caravan Chronicle
            </h1>

            <p className="text-xs text-blue-200">
              Municipal Grievance System
            </p>
          </div>

        </div>

        {/* Welcome Content */}
        <div className="relative z-10 max-w-lg">

          <div className="inline-flex items-center gap-2
            bg-blue-500/10 border border-blue-400/20
            rounded-full px-3 py-1.5 text-xs text-blue-200 mb-5">

            <ShieldCheck size={14} />
            Administration Portal
          </div>

          <h2 className="text-3xl xl:text-4xl font-bold leading-tight">
            Welcome,
            <span className="block text-blue-400 mt-1">
              Administrator.
            </span>
          </h2>

          <p className="mt-4 text-sm xl:text-base text-blue-100
            leading-7 max-w-md">
            Manage citizen grievances, oversee municipal staff,
            monitor departments, and ensure timely resolution
            of public complaints.
          </p>

          {/* Admin Features */}
          <div className="mt-7 space-y-3">

            <div className="flex items-center gap-3 text-sm text-blue-100">
              <div className="w-8 h-8 rounded-lg bg-white/10
                flex items-center justify-center">
                <ClipboardList size={16} />
              </div>
              Centralized Complaint Management
            </div>

            <div className="flex items-center gap-3 text-sm text-blue-100">
              <div className="w-8 h-8 rounded-lg bg-white/10
                flex items-center justify-center">
                <Users size={16} />
              </div>
              Staff and Department Administration
            </div>

            <div className="flex items-center gap-3 text-sm text-blue-100">
              <div className="w-8 h-8 rounded-lg bg-white/10
                flex items-center justify-center">
                <BarChart3 size={16} />
              </div>
              Reports and Performance Monitoring
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-blue-300">
          © 2026 Caravan Chronicle · Municipal Administration
        </div>

        {/* Background Decorations */}
        <div className="absolute -bottom-32 -right-24
          w-80 h-80 rounded-full bg-[#2176e8]/10" />

        <div className="absolute top-1/3 -right-20
          w-56 h-56 rounded-full bg-blue-400/5" />

      </div>

      {/* RIGHT ADMIN LOGIN SECTION */}
      <div className="w-full lg:w-[52%] flex items-center
        justify-center px-5 py-5">

        <div className="w-full max-w-md">

          {/* Mobile Branding */}
          <div className="lg:hidden flex items-center
            justify-center gap-3 mb-5">

            <div className="w-10 h-10 rounded-lg bg-[#2176e8]
              text-white flex items-center justify-center">
              <Building2 size={23} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-[#112541]">
                Caravan Chronicle
              </h1>

              <p className="text-xs text-slate-500">
                Municipal Grievance System
              </p>
            </div>

          </div>

          {/* LOGIN CARD */}
          <div className="bg-white border border-slate-200
            rounded-2xl shadow-sm p-6 sm:p-8">

            {/* Header */}
            <div className="mb-5">

              <div className="flex items-center gap-2
                text-[#2176e8] text-xs font-semibold
                uppercase tracking-wider">

                <ShieldCheck size={15} />
                Administrator Access

              </div>

              <h2 className="text-2xl sm:text-3xl font-bold
                text-[#112541] mt-3">
                Admin Login
              </h2>

              <p className="text-sm text-slate-500 mt-1.5">
                Sign in to access your administration dashboard.
              </p>

            </div>

            {/* Error Message */}
            {error && (
              <div
                role="alert"
                className="mb-4 rounded-lg border
                  border-red-200 bg-red-50 px-3 py-2"
              >
                <p className="text-xs leading-5 text-red-700">
                  {error}
                </p>
              </div>
            )}

            {/* LOGIN FORM */}
            <form onSubmit={handleLogin} className="space-y-4">

              {/* Email */}
              <div>

                <label
                  htmlFor="email"
                  className="block text-sm font-medium
                    text-slate-700 mb-1.5"
                >
                  Administrator Email
                </label>

                <div className="relative">

                  <Mail
                    size={17}
                    className="absolute left-3.5 top-1/2
                      -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter administrator email"
                    autoComplete="username"
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5
                      text-sm border border-slate-200 rounded-lg
                      outline-none transition
                      focus:border-[#2176e8]
                      focus:ring-4 focus:ring-blue-100
                      text-[#112541] disabled:bg-slate-100"
                  />

                </div>

              </div>

              {/* Password */}
              <div>

                <label
                  htmlFor="password"
                  className="block text-sm font-medium
                    text-slate-700 mb-1.5"
                >
                  Password
                </label>

                <div className="relative">

                  <Lock
                    size={17}
                    className="absolute left-3.5 top-1/2
                      -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter administrator password"
                    autoComplete="current-password"
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-11 py-2.5
                      text-sm border border-slate-200 rounded-lg
                      outline-none transition
                      focus:border-[#2176e8]
                      focus:ring-4 focus:ring-blue-100
                      text-[#112541] disabled:bg-slate-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2
                      -translate-y-1/2 text-slate-400
                      hover:text-[#2176e8]"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword
                      ? <EyeOff size={17} />
                      : <Eye size={17} />
                    }
                  </button>

                </div>

              </div>

              {/* SIGN IN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center
                  gap-2 bg-[#2176e8] hover:bg-[#1765cc]
                  text-white text-sm font-semibold py-2.5
                  rounded-lg transition duration-200
                  focus:outline-none focus:ring-2
                  focus:ring-blue-300 focus:ring-offset-2
                  disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? "Signing in..." : "Sign In to Admin Portal"}

                {!loading && <ArrowRight size={17} />}

              </button>

            </form>

            {/* SECURITY NOTE */}
            <div className="mt-5 pt-4 border-t border-slate-100">

              <div className="flex items-center justify-center
                gap-2 text-xs text-slate-500">

                <ShieldCheck size={15} className="text-green-600" />

                Secure access for authorized administrators

              </div>

            </div>

          </div>

          {/* BACK BUTTON */}
          <div className="mt-4 text-center">

            <button
              type="button"
              onClick={handleBack}
              disabled={loading}
              className="text-sm font-medium text-slate-500
                transition hover:text-[#2176e8]
                disabled:cursor-not-allowed"
            >
              &larr; Back to role selection
            </button>

          </div>

          {/* Footer */}
          <p className="text-center text-xs text-slate-400 mt-3">
            Together for a Better City
          </p>

        </div>

      </div>

    </div>
  );
};

export default AdminLogin;
