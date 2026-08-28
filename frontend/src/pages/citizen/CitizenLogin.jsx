import { useState } from "react";
import { Link } from "react-router-dom";

const CitizenLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Citizen Login:", formData);

    // Later:
    // Send email and password to backend
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-sm p-8">

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
        <form onSubmit={handleSubmit} className="space-y-5">

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
              value={formData.email}
              onChange={handleChange}
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
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {/* Forgot Password Below Password Field */}
            <div className="flex justify-end mt-2">
              <Link
                to="/citizen/forgot-password"
                className="text-sm text-blue-600 font-medium hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Login
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

        {/* Back */}
        <Link
          to="/"
          className="block text-center text-sm text-slate-500 hover:text-blue-600 mt-5"
        >
          ← Back to role selection
        </Link>

      </div>
    </div>
  );
};

export default CitizenLogin;