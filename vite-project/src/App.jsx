import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";

import AllComplaints from "./components/admin/AllComplaints";
import ComplaintDetails from "./components/admin/ComplaintDetails";
import StaffManagement from "./components/admin/StaffManagement";
import Departments from "./components/admin/Departments";
import SLASettings from "./components/admin/SLASettings";
import ReportsAnalytics from "./components/admin/ReportsAnalytics";
import PublicPortal from "./components/admin/PublicPortal";
import ActivityLog from "./components/admin/ActivityLog";
import Profile from "./components/admin/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            DEFAULT ROUTE
        ========================= */}
        <Route
          path="/"
          element={<Navigate to="/admin/login" replace />}
        />

        {/* =========================
            ADMIN LOGIN
        ========================= */}
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* =========================
            ADMIN DASHBOARD
        ========================= */}
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        {/* =========================
            COMPLAINTS
        ========================= */}

        {/* All Complaints */}
        <Route
          path="/admin/complaints"
          element={<AllComplaints />}
        />

        {/* Complaint Details */}
        <Route
          path="/admin/complaints/:id"
          element={<ComplaintDetails />}
        />

        {/* =========================
            STAFF MANAGEMENT
        ========================= */}

        <Route
          path="/admin/staff"
          element={<StaffManagement />}
        />

        {/* =========================
            DEPARTMENTS
        ========================= */}

        <Route
          path="/admin/departments"
          element={<Departments />}
        />

        {/* =========================
            SLA & ESCALATION
        ========================= */}

        <Route
          path="/admin/sla"
          element={<SLASettings />}
        />

        {/* =========================
            REPORTS & ANALYTICS
        ========================= */}

        <Route
          path="/admin/reports"
          element={<ReportsAnalytics />}
        />

        {/* =========================
            PUBLIC PORTAL
        ========================= */}

        <Route
          path="/admin/public-portal"
          element={<PublicPortal />}
        />

        {/* =========================
            ACTIVITY LOG
        ========================= */}

        <Route
          path="/admin/activity-log"
          element={<ActivityLog />}
        />

        {/* =========================
            ADMIN PROFILE
        ========================= */}

        <Route
          path="/admin/profile"
          element={<Profile />}
        />

        {/* =========================
            INVALID ADMIN ROUTE
        ========================= */}

        <Route
          path="/admin/*"
          element={<Navigate to="/admin/dashboard" replace />}
        />

        {/* =========================
            INVALID ROUTE
        ========================= */}

        <Route
          path="*"
          element={<Navigate to="/admin/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;