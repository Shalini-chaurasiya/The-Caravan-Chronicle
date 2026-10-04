import React, { useState } from "react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // ADMIN LOGIN
  // ==========================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // Send login request to backend
      const response = await fetch(
        "http://localhost:3000/api/admin/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      // Convert response to JSON
      const data = await response.json();

      // ==========================================
      // LOGIN FAILED
      // ==========================================

      if (!response.ok) {
        setError(
          data.message || "Invalid admin credentials."
        );

        setLoading(false);
        return;
      }

      // ==========================================
      // LOGIN SUCCESSFUL
      // ==========================================

      console.log("Admin Login Successful");
      console.log("Admin:", data.admin);

      // Save JWT token
      localStorage.setItem(
        "adminToken",
        data.token
      );

      // Save admin information
      if (data.admin) {
        localStorage.setItem(
          "admin",
          JSON.stringify(data.admin)
        );
      }

      // Redirect to Admin Dashboard
      window.location.href =
        "http://localhost:5174/admin/dashboard";

    } catch (error) {

      console.error(
        "Admin Login Error:",
        error
      );

      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );

    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // BACK TO ROLE SELECTION
  // ==========================================

  const handleBack = () => {

    window.location.href =
      "http://localhost:5173/";

  };


  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

      {/* ==========================================
          LOGIN CARD
          ========================================== */}

      <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-sm px-8 py-8">


        {/* ==========================================
            HEADER
            ========================================== */}

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


        {/* ==========================================
            ERROR MESSAGE
            ========================================== */}

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">

            <p className="text-sm text-red-600">
              {error}
            </p>

          </div>
        )}


        {/* ==========================================
            LOGIN FORM
            ========================================== */}

        <form onSubmit={handleLogin}>


          {/* ==========================================
              EMAIL
              ========================================== */}

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
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="Enter admin email"
              required
              disabled={loading}
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
                disabled:bg-slate-100
                disabled:cursor-not-allowed
              "
            />

          </div>


          {/* ==========================================
              PASSWORD
              ========================================== */}

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
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Enter admin password"
              required
              disabled={loading}
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
                disabled:bg-slate-100
                disabled:cursor-not-allowed
              "
            />

          </div>


          {/* ==========================================
              LOGIN BUTTON
              ========================================== */}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full h-11
              bg-blue-600
              hover:bg-blue-700
              disabled:bg-blue-400
              text-white
              text-sm font-medium
              rounded-lg
              transition
              duration-200
              shadow-sm
              disabled:cursor-not-allowed
            "
          >

            {loading ? "Logging in..." : "Login"}

          </button>

        </form>


        {/* ==========================================
            BACK TO ROLE SELECTION
            ========================================== */}

        <div className="text-center mt-6">

          <button
            type="button"
            onClick={handleBack}
            disabled={loading}
            className="
              text-slate-500
              hover:text-blue-600
              text-sm font-medium
              transition
              disabled:cursor-not-allowed
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