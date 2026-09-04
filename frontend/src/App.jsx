import { Routes, Route, Link } from "react-router-dom";

// =====================================================
// MAIN PAGES
// =====================================================

import Home from "./pages/Home";
import Contact from "./pages/Contact";

// =====================================================
// CITIZEN PAGES
// =====================================================

import CitizenHome from "./pages/citizen/CitizenHome";
import CitizenAbout from "./pages/citizen/CitizenAbout";
import CitizenLogin from "./pages/citizen/CitizenLogin";
import CitizenRegister from "./pages/citizen/CitizenRegister";

// =====================================================
// CITIZEN DASHBOARD
// =====================================================

import CitizenDashboard from "./pages/citizen/dashboard/CitizenDashboard";
import NewComplaint from "./pages/citizen/dashboard/NewComplaints";

// =====================================================
// TEMPORARY DASHBOARD PAGES
// =====================================================

function MyComplaints() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800">
        My Complaints
      </h1>

      <p className="mt-2 text-gray-600">
        View your submitted complaints here.
      </p>
    </div>
  );
}

function Notifications() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800">
        Notifications
      </h1>

      <p className="mt-2 text-gray-600">
        Your notifications will appear here.
      </p>
    </div>
  );
}

function TrackComplaints() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800">
        Track Complaints
      </h1>

      <p className="mt-2 text-gray-600">
        Track the status of your complaints here.
      </p>
    </div>
  );
}

// =====================================================
// APP
// =====================================================

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
          CONTACT
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

      {/* =====================================================
          CITIZEN DASHBOARD
      ===================================================== */}

      <Route
        path="/citizen/dashboard"
        element={<CitizenDashboard />}
      />

      {/* =====================================================
          DASHBOARD SIDEBAR ROUTES
      ===================================================== */}

      {/* My Complaints */}
      <Route
        path="/citizen/dashboard/complaints"
        element={<MyComplaints />}
      />

      {/* New Complaint */}
      <Route
        path="/citizen/dashboard/new"
        element={<NewComplaint />}
      />

      {/* Notifications */}
      <Route
        path="/citizen/dashboard/notifications"
        element={<Notifications />}
      />

      {/* Track Complaints */}
      <Route
        path="/citizen/dashboard/track"
        element={<TrackComplaints />}
      />

      {/* =====================================================
          FORGOT PASSWORD
      ===================================================== */}

      <Route
        path="/citizen/forgot-password"
        element={<CitizenLogin />}
      />

      {/* =====================================================
          RESET PASSWORD
      ===================================================== */}

      <Route
        path="/reset-password/:token"
        element={<CitizenLogin />}
      />

      {/* =====================================================
          STAFF
      ===================================================== */}

      <Route
        path="/staff/login"
        element={
          <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <h1 className="text-3xl font-bold text-gray-800">
              Staff Login Page
            </h1>
          </div>
        }
      />

      <Route
        path="/staff/register"
        element={
          <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <h1 className="text-3xl font-bold text-gray-800">
              Staff Register Page
            </h1>
          </div>
        }
      />

      {/* =====================================================
          OWNER
      ===================================================== */}

      <Route
        path="/owner/login"
        element={
          <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <h1 className="text-3xl font-bold text-gray-800">
              Owner Login Page
            </h1>
          </div>
        }
      />

      <Route
        path="/owner/register"
        element={
          <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <h1 className="text-3xl font-bold text-gray-800">
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
                to="/citizen/dashboard"
                className="mt-6 inline-block rounded-lg bg-blue-700 px-6 py-3 font-medium text-white transition hover:bg-blue-800"
              >
                Go to Dashboard
              </Link>

            </div>
          </div>
        }
      />

    </Routes>
  );
}

export default App;