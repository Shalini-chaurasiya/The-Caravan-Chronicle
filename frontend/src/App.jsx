import { Routes, Route, Link } from "react-router-dom";

// ================= HOME =================
import Home from "./pages/Home";

// ================= CONTACT =================
import Contact from "./pages/Contact";

// ================= CITIZEN =================
import CitizenHome from "./pages/citizen/CitizenHome";
import CitizenAbout from "./pages/citizen/CitizenAbout";
import CitizenLogin from "./pages/citizen/CitizenLogin";
import CitizenRegister from "./pages/citizen/CitizenRegister";

function App() {
  return (
    <Routes>

      {/* =====================================================
          MAIN HOME
      ===================================================== */}
      <Route
        path="/"
        element={<Home />}
      />


      {/* =====================================================
          CONTACT PAGE

          File:
          src/pages/Contact.jsx

          URL:
          http://localhost:5174/contact
      ===================================================== */}
      <Route
        path="/contact"
        element={<Contact />}
      />


      {/* =====================================================
          CITIZEN
      ===================================================== */}

      {/* Citizen Home */}
      <Route
        path="/citizen"
        element={<CitizenHome />}
      />

      {/* Citizen About */}
      <Route
        path="/citizen/about"
        element={<CitizenAbout />}
      />

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

      {/* Forgot Password */}
      <Route
        path="/citizen/forgot-password"
        element={<CitizenLogin />}
      />

      {/* Reset Password */}
      <Route
        path="/reset-password/:token"
        element={<CitizenLogin />}
      />


      {/* =====================================================
          STAFF
      ===================================================== */}

      {/* Staff Login */}
      <Route
        path="/staff/login"
        element={
          <div className="flex min-h-screen items-center justify-center">
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
          <div className="flex min-h-screen items-center justify-center">
            <h1 className="text-3xl font-bold">
              Staff Register Page
            </h1>
          </div>
        }
      />


      {/* =====================================================
          OWNER
      ===================================================== */}

      {/* Owner Login */}
      <Route
        path="/owner/login"
        element={
          <div className="flex min-h-screen items-center justify-center">
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
          <div className="flex min-h-screen items-center justify-center">
            <h1 className="text-3xl font-bold">
              Owner Register Page
            </h1>
          </div>
        }
      />


      {/* =====================================================
          404 PAGE
      ===================================================== */}
      <Route
        path="*"
        element={
          <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="text-center">

              <h1 className="text-6xl font-bold text-gray-800">
                404
              </h1>

              <p className="mt-3 text-gray-600">
                Page not found
              </p>

              <Link
                to="/"
                className="mt-6 inline-block rounded-lg bg-blue-700 px-6 py-3 font-medium text-white transition hover:bg-blue-800"
              >
                Go Home
              </Link>

            </div>
          </div>
        }
      />

    </Routes>
  );
}

export default App;