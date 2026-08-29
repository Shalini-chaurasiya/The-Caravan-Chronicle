import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const CitizenLogin = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  // If token exists, show reset password form
  const [mode, setMode] = useState(
    token ? "reset" : "login"
  );

  // Login
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState("");

  // Reset password
  const [resetData, setResetData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ---------------- LOGIN ----------------

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
        `${import.meta.env.VITE_API_URL}/auth/login`,
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
        throw new Error(
          data.message || "Login failed"
        );
      }

      // Save JWT
      localStorage.setItem("token", data.token);

      // Save user
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert("Login successful!");

      // Later:
      // navigate("/citizen/dashboard");

    } catch (error) {
      console.error("Login Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FORGOT PASSWORD ----------------

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
          data.message ||
            "Unable to send reset link"
        );
      }

      setSuccess(data.message);

      setForgotEmail("");

    } catch (error) {
      console.error(
        "Forgot Password Error:",
        error
      );

      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- RESET PASSWORD ----------------

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

    if (
      resetData.password !==
      resetData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

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
          data.message ||
            "Password reset failed"
        );
      }

      setSuccess(
        "Password reset successfully."
      );

      setResetData({
        password: "",
        confirmPassword: "",
      });

      // After 2 seconds go back to login
      setTimeout(() => {
        navigate("/citizen/login");
      }, 2000);

    } catch (error) {
      console.error(
        "Reset Password Error:",
        error
      );

      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- LOGIN UI ----------------

  const renderLogin = () => {
    return (
      <>
        {/* Header */}
        <div className="text-center mb-7">

          <p className="text-blue-600 text-sm font-semibold mb-2">
            MUNICIPAL SERVICES
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Citizen Login
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Login to submit and track your complaints.
          </p>

        </div>

        {/* Login Form */}
        <form
          onSubmit={handleLoginSubmit}
          className="space-y-5"
        >

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-2"
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
              className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Password */}
          <div>

            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-2"
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
              className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {/* Forgot Password */}
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={() => {
                  setMode("forgot");
                  setError("");
                  setSuccess("");
                }}
                className="text-sm text-blue-600 font-medium hover:underline"
              >
                Forgot Password?
              </button>
            </div>

          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        {/* Register */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account?

          <Link
            to="/citizen/register"
            className="text-blue-600 font-semibold ml-1 hover:underline"
          >
            Register
          </Link>
        </p>
      </>
    );
  };

  // ---------------- FORGOT UI ----------------

  const renderForgotPassword = () => {
    return (
      <>
        {/* Header */}
        <div className="text-center mb-7">

          <p className="text-blue-600 text-sm font-semibold mb-2">
            MUNICIPAL SERVICES
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Forgot Password
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Enter your registered email address.
          </p>

        </div>

        <form
          onSubmit={handleForgotSubmit}
          className="space-y-5"
        >

          {/* Email */}
          <div>
            <label
              htmlFor="forgotEmail"
              className="block text-sm font-medium text-slate-700 mb-2"
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
              className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading
              ? "Sending..."
              : "Send Reset Link"}
          </button>

        </form>

        {/* Back to Login */}
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setError("");
            setSuccess("");
          }}
          className="block w-full text-center text-sm text-slate-500 hover:text-blue-600 mt-6"
        >
          ← Back to Login
        </button>
      </>
    );
  };

  // ---------------- RESET UI ----------------

  const renderResetPassword = () => {
    return (
      <>
        {/* Header */}
        <div className="text-center mb-7">

          <p className="text-blue-600 text-sm font-semibold mb-2">
            MUNICIPAL SERVICES
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Reset Password
          </h1>

          <p className="text-sm text-slate-500 mt-2">
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
              className="block text-sm font-medium text-slate-700 mb-2"
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
              className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-slate-700 mb-2"
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
              className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Reset Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading
              ? "Resetting..."
              : "Reset Password"}
          </button>

        </form>
      </>
    );
  };

  // ---------------- MAIN UI ----------------

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">

      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-sm p-8">

        {/* Error */}
        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-5 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
            {success}
          </div>
        )}

        {/* Current Page */}
        {mode === "login" && renderLogin()}

        {mode === "forgot" &&
          renderForgotPassword()}

        {mode === "reset" &&
          renderResetPassword()}

        {/* Back to Home */}
        {mode !== "reset" && (
          <Link
            to="/"
            className="block text-center text-sm text-slate-500 hover:text-blue-600 mt-5"
          >
            ← Back to role selection
          </Link>
        )}

      </div>
    </div>
  );
};

export default CitizenLogin;