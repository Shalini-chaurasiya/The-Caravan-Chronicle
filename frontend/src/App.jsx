import { Routes, Route } from "react-router-dom";

// ================= HOME =================
import Home from "./pages/Home";

// ================= CITIZEN =================
import CitizenHome from "./pages/citizen/CitizenHome";
import CitizenAbout from "./pages/citizen/CitizenAbout";
import CitizenLogin from "./pages/citizen/CitizenLogin";
import CitizenRegister from "./pages/citizen/CitizenRegister";


function App() {
  return (
    <Routes>

      {/* ================= MAIN HOME ================= */}

      <Route
        path="/"
        element={<Home />}
      />


      {/* ================= CITIZEN ================= */}

      {/* Citizen Home / Landing Page */}
      <Route
        path="/citizen"
        element={<CitizenHome />}
      />

      {/* Citizen About Page */}
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

      {/* Citizen Forgot Password */}
      <Route
        path="/citizen/forgot-password"
        element={<CitizenLogin />}
      />

      {/* Citizen Reset Password */}
      <Route
        path="/reset-password/:token"
        element={<CitizenLogin />}
      />


      {/* ================= STAFF ================= */}

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


      {/* ================= OWNER ================= */}

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


      {/* ================= 404 ================= */}

      <Route
        path="*"
        element={
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">

              <h1 className="text-5xl font-bold text-gray-800">
                404
              </h1>

              <p className="mt-3 text-gray-600">
                Page not found
              </p>

              <a
                href="/"
                className="mt-5 inline-block rounded-lg bg-blue-700 px-5 py-2 text-white hover:bg-blue-800"
              >
                Go Home
              </a>

            </div>
          </div>
        }
      />

    </Routes>
  );
}

export default App;