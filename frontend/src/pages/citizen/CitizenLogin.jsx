
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const CitizenLogin = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  // If token exists, show reset password form
  const [mode, setMode] = useState(token ? "reset" : "login");

  // LOGIN
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // FORGOT PASSWORD
  const [forgotEmail, setForgotEmail] = useState("");

  // RESET PASSWORD
  const [resetData, setResetData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // LOGIN
  // =====================================================

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
     const response = await fetch(
  `${import.meta.env.VITE_API_URL}/api/auth/login`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  }
);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save JWT token
      localStorage.setItem("token", data.token);

      // Save user information
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to Citizen Home
      navigate("/citizen/");
    } catch (error) {
      console.error("Login Error:", error);

      setError(
        error.message || "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FORGOT PASSWORD
  // =====================================================

  const handleForgotSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: forgotEmail,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to send reset link"
        );
      }

      setSuccess(
        data.message ||
          "Password reset link sent successfully."
      );

      setForgotEmail("");
    } catch (error) {
      console.error("Forgot Password Error:", error);

      setError(
        error.message || "Unable to send reset link."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RESET PASSWORD
  // =====================================================

  const handleResetChange = (e) => {
    setResetData({
      ...resetData,
      [e.target.name]: e.target.value,
    });
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Check password match
    if (
      resetData.password !==
      resetData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    // Check password length
    if (resetData.password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: resetData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Password reset failed"
        );
      }

      setSuccess(
        "Password reset successfully."
      );

      setResetData({
        password: "",
        confirmPassword: "",
      });

      // Go back to login after 2 seconds
      setTimeout(() => {
        navigate("/citizen/login");
      }, 2000);
    } catch (error) {
      console.error("Reset Password Error:", error);

      setError(
        error.message || "Password reset failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOGIN UI
  // =====================================================

  const renderLogin = () => {
    return (
      <>
        <div className="mb-7 text-center">
          <p className="mb-2 text-sm font-semibold text-blue-600">
            MUNICIPAL SERVICES
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Citizen Login
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Login to submit and track your complaints.
          </p>
        </div>

        <form
          onSubmit={handleLoginSubmit}
          className="space-y-5"
        >
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email Address
            </label>

            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={loginData.email}
              onChange={handleLoginChange}
              required
              autoComplete="email"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={loginData.password}
              onChange={handleLoginChange}
              required
              minLength={6}
              autoComplete="current-password"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {/* Forgot Password */}
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setMode("forgot");
                  setError("");
                  setSuccess("");
                }}
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register */}
        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?

          <Link
            to="/citizen/register"
            className="ml-1 font-semibold text-blue-600 hover:underline"
          >
            Register
          </Link>
        </p>
      </>
    );
  };

  // =====================================================
  // FORGOT PASSWORD UI
  // =====================================================

  const renderForgotPassword = () => {
    return (
      <>
        <div className="mb-7 text-center">
          <p className="mb-2 text-sm font-semibold text-blue-600">
            MUNICIPAL SERVICES
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Forgot Password
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Enter your registered email address.
          </p>
        </div>

        <form
          onSubmit={handleForgotSubmit}
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="forgotEmail"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email Address
            </label>

            <input
              type="email"
              id="forgotEmail"
              placeholder="Enter your registered email"
              value={forgotEmail}
              onChange={(e) =>
                setForgotEmail(e.target.value)
              }
              required
              autoComplete="email"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {loading
              ? "Sending..."
              : "Send Reset Link"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode("login");
            setError("");
            setSuccess("");
          }}
          className="mt-6 block w-full text-center text-sm text-slate-500 hover:text-blue-600"
        >
          ← Back to Login
        </button>
      </>
    );
  };

  // =====================================================
  // RESET PASSWORD UI
  // =====================================================

  const renderResetPassword = () => {
    return (
      <>
        <div className="mb-7 text-center">
          <p className="mb-2 text-sm font-semibold text-blue-600">
            MUNICIPAL SERVICES
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Reset Password
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Create a new password for your account.
          </p>
        </div>

        <form
          onSubmit={handleResetSubmit}
          className="space-y-5"
        >
          {/* New Password */}
          <div>
            <label
              htmlFor="newPassword"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              New Password
            </label>

            <input
              type="password"
              id="newPassword"
              name="password"
              placeholder="Enter new password"
              value={resetData.password}
              onChange={handleResetChange}
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Confirm Password
            </label>

            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={resetData.confirmPassword}
              onChange={handleResetChange}
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Reset Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {loading
              ? "Resetting..."
              : "Reset Password"}
          </button>
        </form>
      </>
    );
  };

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Current Page */}
        {mode === "login" && renderLogin()}

        {mode === "forgot" &&
          renderForgotPassword()}

        {mode === "reset" &&
          renderResetPassword()}

        {/* Back to Role Selection */}
        {mode !== "reset" && (
          <Link
            to="/"
            className="mt-5 block text-center text-sm text-slate-500 hover:text-blue-600"
          >
            ← Back to role selection
          </Link>
        )}
      </div>
    </div>
  );
};

export default CitizenLogin;