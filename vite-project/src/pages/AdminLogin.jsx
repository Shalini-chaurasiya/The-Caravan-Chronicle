import React, { useState } from "react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    console.log("Admin Email:", email);
    console.log("Admin Password:", password);

    // Later connect this with your backend:
    // POST http://localhost:3000/api/admin/login
  };

  const handleBack = () => {
    // Redirect to the role selection page
    // running in the citizen frontend
    window.location.href = "http://localhost:5173/";
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-sm px-8 py-8">

        {/* Header */}
        <div className="text-center mb-7">

          <p className="text-blue-600 text-sm font-semibold tracking-wide">
            MUNICIPAL SERVICES
          </p>

          <h1 className="text-2xl font-semibold text-slate-900 mt-2">
            Admin Login
          </h1>

          <p className="text-slate-500 text-sm mt-2">
            Sign in to manage municipal complaints and services.
          </p>

        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin}>

          {/* Email */}
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              required
              className="
                w-full h-11 px-4
                rounded-lg
                border border-slate-300
                bg-white
                text-sm text-slate-900
                placeholder:text-slate-400
                outline-none
                transition
                focus:border-blue-500
                focus:ring-2 focus:ring-blue-100
              "
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              className="
                w-full h-11 px-4
                rounded-lg
                border border-slate-300
                bg-white
                text-sm text-slate-900
                placeholder:text-slate-400
                outline-none
                transition
                focus:border-blue-500
                focus:ring-2 focus:ring-blue-100
              "
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="
              w-full h-11
              bg-blue-600
              hover:bg-blue-700
              text-white
              text-sm font-medium
              rounded-lg
              transition
              duration-200
              shadow-sm
            "
          >
            Login
          </button>
        </form>

        {/* Back to Role Selection */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={handleBack}
            className="
              text-slate-500 hover:text-blue-600
              text-sm font-medium
              transition
            "
          >
            ← Back to role selection
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;