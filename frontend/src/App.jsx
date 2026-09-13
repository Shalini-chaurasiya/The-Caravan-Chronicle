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
// CITIZEN DASHBOARD PAGES
// =====================================================

import CitizenDashboard from "./pages/citizen/dashboard/CitizenDashboard";
import MyComplaints from "./pages/citizen/dashboard/MyComplaints";
import NewComplaints from "./pages/citizen/dashboard/NewComplaints";
import ComplaintDetails from "./pages/citizen/dashboard/ComplaintDetails";
import Notifications from "./pages/citizen/dashboard/Notifications";
import TrackComplaints from "./pages/citizen/dashboard/TrackComplaints";

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
          MY COMPLAINTS
      ===================================================== */}

      <Route
        path="/citizen/dashboard/complaints"
        element={<MyComplaints />}
      />


      {/* =====================================================
          NEW COMPLAINT
      ===================================================== */}

      <Route
        path="/citizen/dashboard/new"
        element={<NewComplaints />}
      />


      {/* =====================================================
          COMPLAINT DETAILS
          
          Example:
          /citizen/dashboard/complaints/CMP-2026-00124
      ===================================================== */}

      <Route
        path="/citizen/dashboard/complaints/:complaintId"
        element={<ComplaintDetails />}
      />


      {/* =====================================================
          NOTIFICATIONS
      ===================================================== */}

      <Route
        path="/citizen/dashboard/notifications"
        element={<Notifications />}
      />


      {/* =====================================================
          TRACK COMPLAINTS
      ===================================================== */}

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

      {/* Staff Login */}

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


      {/* Staff Register */}

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

      {/* Owner Login */}

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


      {/* Owner Register */}

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