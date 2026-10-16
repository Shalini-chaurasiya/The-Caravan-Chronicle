
import React, { useState } from "react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-100 px-5 py-6">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white px-6 py-6 shadow-sm sm:px-8 sm:py-7">

        {/* Header */}
        <div className="mb-6 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-700">
            Municipal Services
          </p>

          <h1 className="mb-2 text-2xl font-semibold text-slate-800 sm:text-3xl">
            Admin Login
          </h1>

          <p className="text-sm leading-6 text-slate-500">
            Sign in to access the administration portal.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3"
          >
            <p className="text-sm leading-5 text-red-700">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="Enter admin email"
              autoComplete="username"
              required
              disabled={loading}
              className="h-10 w-full rounded-md border border-slate-300 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Enter admin password"
              autoComplete="current-password"
              required
              disabled={loading}
              className="h-10 w-full rounded-md border border-slate-300 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-1 h-10 w-full rounded-md bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Back Button */}
        <div className="mt-5 border-t border-slate-200 pt-4 text-center">
          <button
            type="button"
            onClick={handleBack}
            disabled={loading}
            className="text-sm font-medium text-slate-500 transition hover:text-blue-700 disabled:cursor-not-allowed"
          >
            &larr; Back to role selection
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
