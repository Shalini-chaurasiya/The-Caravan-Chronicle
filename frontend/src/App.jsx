import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CitizenLogin from "./pages/citizen/CitizenLogin";
import CitizenRegister from "./pages/citizen/CitizenRegister";

function App() {
  return (
    <Routes>

      {/* ================= HOME ================= */}
      <Route
        path="/"
        element={<Home />}
      />


      {/* ================= CITIZEN ================= */}

      {/* Citizen Login */}
      <Route
        path="/citizen/login"
        element={<CitizenLogin />}
      />

      {/* Citizen Register */}
      <Route
        path="/citizen/register"
        element={<CitizenRegister />}
      />

      {/* Citizen Forgot Password
          This route is optional because the forgot form
          is displayed inside CitizenLogin.jsx */}
      <Route
        path="/citizen/forgot-password"
        element={<CitizenLogin />}
      />

      {/* Citizen Reset Password
          Token comes from the email reset link */}
      <Route
        path="/reset-password/:token"
        element={<CitizenLogin />}
      />


      {/* ================= STAFF ================= */}

      {/* Staff Login */}
      <Route
        path="/staff/login"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-3xl font-bold">
              Staff Login Page
            </h1>
          </div>
        }
      />

      {/* Staff Register */}
      <Route
        path="/staff/register"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-3xl font-bold">
              Staff Register Page
            </h1>
          </div>
        }
      />


      {/* ================= OWNER ================= */}

      {/* Owner Login */}
      <Route
        path="/owner/login"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-3xl font-bold">
              Owner Login Page
            </h1>
          </div>
        }
      />

      {/* Owner Register */}
      <Route
        path="/owner/register"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-3xl font-bold">
              Owner Register Page
            </h1>
          </div>
        }
      />

    </Routes>
  );
}

export default App;