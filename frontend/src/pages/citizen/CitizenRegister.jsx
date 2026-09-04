import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CitizenRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setSuccess("");
  setLoading(true);

  try {
    console.log("API URL:", import.meta.env.VITE_API_URL);
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    const text = await response.text();

    console.log("STATUS:", response.status);
    console.log("RAW RESPONSE:", text);

    let data;

    try {
      data = text ? JSON.parse(text) : {};
    } catch (err) {
      console.error("Invalid JSON received:", text);
      throw new Error("Server returned invalid JSON");
    }

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    console.log("Registration Response:", data);

    setSuccess(
      "Registration successful! Redirecting to login..."
    );

    setFormData({
      name: "",
      email: "",
      password: "",
    });

    setTimeout(() => {
      navigate("/citizen/login");
    }, 1500);

  } catch (error) {
    console.error("Registration Error:", error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">

      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-sm p-8">

        {/* Header */}
        <div className="text-center mb-6">

          <p className="text-blue-600 text-sm font-semibold mb-2">
            MUNICIPAL SERVICES
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Citizen Registration
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Create an account to submit and track complaints.
          </p>

        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg">
            {success}
          </div>
        )}

        {/* Registration Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Full Name
            </label>

            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Email Address
            </label>

            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Password
            </label>

            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <p className="text-xs text-slate-400 mt-1">
              Password must be at least 6 characters.
            </p>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        {/* Login */}
        <p className="text-center text-sm text-slate-500 mt-5">
          Already have an account?

          <Link
            to="/citizen/login"
            className="text-blue-600 font-semibold ml-1 hover:underline"
          >
            Login
          </Link>
        </p>

        {/* Back */}
        <Link
          to="/"
          className="block text-center text-sm text-slate-500 hover:text-blue-600 mt-4"
        >
          ← Back to role selection
        </Link>

      </div>
    </div>
  );
};

export default CitizenRegister;