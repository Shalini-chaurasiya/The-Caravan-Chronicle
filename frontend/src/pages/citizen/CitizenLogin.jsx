import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  ClipboardList,
  CheckCircle2,
  Users,
} from "lucide-react";

const CitizenLogin = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3000";

  const [mode, setMode] = useState(token ? "reset" : "login");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [forgotEmail, setForgotEmail] = useState("");

  const [resetData, setResetData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // LOGIN
  // =========================

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
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginData.email.trim(),
          password: loginData.password,
        }),
      });

      const contentType = response.headers.get("content-type") || "";
      let data = {};

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = {
          message: text || `Server returned status ${response.status}`,
        };
      }

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      if (!data.token) {
        throw new Error(
          "Login succeeded but no authentication token was received."
        );
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      localStorage.setItem("token", data.token);

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      navigate("/citizen/");
    } catch (error) {
      console.error("Login Error:", error);
      setError(error.message || "Unable to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FORGOT PASSWORD
  // =========================

  const handleForgotSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: forgotEmail.trim(),
          }),
        }
      );

      const contentType = response.headers.get("content-type") || "";
      let data = {};

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = {
          message: text || `Server returned status ${response.status}`,
        };
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to send password reset link."
        );
      }

      setSuccess(
        data.message || "Password reset link sent successfully."
      );

      setForgotEmail("");
    } catch (error) {
      console.error("Forgot Password Error:", error);
      setError(error.message || "Unable to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // RESET PASSWORD
  // =========================

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

    if (resetData.password !== resetData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (resetData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!token) {
      setError("Password reset token is missing or invalid.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/reset-password/${token}`,
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

      const contentType = response.headers.get("content-type") || "";
      let data = {};

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = {
          message: text || `Server returned status ${response.status}`,
        };
      }

      if (!response.ok) {
        throw new Error(data.message || "Password reset failed.");
      }

      setSuccess(data.message || "Password reset successfully.");

      setResetData({
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/citizen/login");
      }, 2000);
    } catch (error) {
      console.error("Reset Password Error:", error);
      setError(error.message || "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // COMMON UI HELPERS
  // =========================

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setSuccess("");
  };

  const renderHeading = (title, description) => (
    <div className="mb-6">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Building2 size={24} />
      </div>

      <h2 className="text-2xl font-bold text-[#172033]">{title}</h2>

      <p className="mt-2 text-sm leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );

  const renderInput = ({
    id,
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    icon: Icon,
    minLength,
    rightElement,
  }) => (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <div className="relative">
        <Icon
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          minLength={minLength}
          className={`w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 ${
            rightElement ? "pr-12" : "pr-4"
          } text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10`}
        />

        {rightElement}
      </div>
    </div>
  );

  const renderSubmitButton = (text, loadingText) => (
    <button
      type="submit"
      disabled={loading}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading ? loadingText : text}
      {!loading && <ArrowRight size={17} />}
    </button>
  );

  // =========================
  // LOGIN UI
  // =========================

  const renderLogin = () => (
    <>
      {renderHeading(
        "Citizen Sign In",
        "Login to submit complaints, track progress, and access municipal services."
      )}

      <form onSubmit={handleLoginSubmit} className="space-y-5">
        {renderInput({
          id: "email",
          label: "Email Address",
          type: "email",
          name: "email",
          value: loginData.email,
          onChange: handleLoginChange,
          placeholder: "Enter your email",
          icon: Mail,
        })}

        {renderInput({
          id: "password",
          label: "Password",
          type: showPassword ? "text" : "password",
          name: "password",
          value: loginData.password,
          onChange: handleLoginChange,
          placeholder: "Enter your password",
          icon: Lock,
          minLength: 6,
          rightElement: (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          ),
        })}

        <div className="-mt-2 flex justify-end">
          <button
            type="button"
            onClick={() => switchMode("forgot")}
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        {renderSubmitButton("Sign In to Citizen Portal", "Signing in...")}
      </form>

      <p className="mt-5 text-center text-sm text-slate-500">
        Don't have an account?{" "}
        <Link
          to="/citizen/register"
          className="font-semibold text-blue-600 hover:underline"
        >
          Register
        </Link>
      </p>
    </>
  );

  // =========================
  // FORGOT PASSWORD UI
  // =========================

  const renderForgotPassword = () => (
    <>
      {renderHeading(
        "Forgot Password",
        "Enter your registered email address to receive a password reset link."
      )}

      <form onSubmit={handleForgotSubmit} className="space-y-5">
        {renderInput({
          id: "forgotEmail",
          label: "Email Address",
          type: "email",
          value: forgotEmail,
          onChange: (e) => setForgotEmail(e.target.value),
          placeholder: "Enter your registered email",
          icon: Mail,
        })}

        {renderSubmitButton("Send Reset Link", "Sending...")}
      </form>

      <button
        type="button"
        onClick={() => switchMode("login")}
        className="mt-5 flex w-full items-center justify-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
      >
        <ArrowLeft size={16} />
        Back to Login
      </button>
    </>
  );

  // =========================
  // RESET PASSWORD UI
  // =========================

  const renderResetPassword = () => (
    <>
      {renderHeading(
        "Reset Password",
        "Create a new password for your citizen account."
      )}

      <form onSubmit={handleResetSubmit} className="space-y-5">
        {renderInput({
          id: "newPassword",
          label: "New Password",
          type: showResetPassword ? "text" : "password",
          name: "password",
          value: resetData.password,
          onChange: handleResetChange,
          placeholder: "Enter new password",
          icon: Lock,
          minLength: 6,
          rightElement: (
            <button
              type="button"
              onClick={() => setShowResetPassword(!showResetPassword)}
              aria-label={showResetPassword ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showResetPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          ),
        })}

        {renderInput({
          id: "confirmPassword",
          label: "Confirm Password",
          type: showConfirmPassword ? "text" : "password",
          name: "confirmPassword",
          value: resetData.confirmPassword,
          onChange: handleResetChange,
          placeholder: "Confirm new password",
          icon: Lock,
          minLength: 6,
          rightElement: (
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          ),
        })}

        {renderSubmitButton("Reset Password", "Resetting...")}
      </form>
    </>
  );

  // =========================
  // MAIN PAGE
  // =========================

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f7fb] p-4">
      <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">

        {/* LEFT BRANDING PANEL */}
        <div className="relative hidden min-h-[600px] flex-col justify-between overflow-hidden bg-[#101c3a] p-10 text-white lg:flex">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/10" />
          <div className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-cyan-400/10" />

          <div className="relative z-10">
            <div className="mb-10 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
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

            <span className="rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1 text-xs font-semibold tracking-wider text-blue-200">
              CITIZEN PORTAL
            </span>

            <h2 className="mt-5 max-w-sm text-3xl font-bold leading-tight">
              Your voice matters.
              <span className="block text-blue-400">
                We’re here to help.
              </span>
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
              Report civic issues, track complaint updates, and stay connected
              with your municipal administration.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                  <ClipboardList size={17} className="text-blue-300" />
                </div>
                <span className="text-sm text-slate-200">
                  Submit and track complaints
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                  <CheckCircle2 size={17} className="text-blue-300" />
                </div>
                <span className="text-sm text-slate-200">
                  Receive complaint status updates
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                  <Users size={17} className="text-blue-300" />
                </div>
                <span className="text-sm text-slate-200">
                  Help improve your community
                </span>
              </div>
            </div>
          </div>

          <p className="relative z-10 text-xs text-slate-400">
            © 2026 Caravan Chronicle. All rights reserved.
          </p>
        </div>

        {/* RIGHT AUTHENTICATION PANEL */}
        <div className="flex items-center justify-center px-6 py-8 sm:px-10">
          <div className="w-full max-w-md">

            {/* Back to Role Selection */}
            {mode !== "reset" && (
              <Link
                to="/"
                className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
              >
                <ArrowLeft size={16} />
                Back to Role Selection
              </Link>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}

            {/* Current Mode */}
            {mode === "login" && renderLogin()}
            {mode === "forgot" && renderForgotPassword()}
            {mode === "reset" && renderResetPassword()}

            {/* Security Footer */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck size={15} />
              Secure citizen authentication
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenLogin;