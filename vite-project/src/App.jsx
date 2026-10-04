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

        {/* Default */}
        <Route
          path="/"
          element={<Navigate to="/admin/login" replace />}
        />

        {/* Admin Login */}
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        {/* Admin Pages */}
        <Route
          path="/admin/complaints"
          element={<AllComplaints />}
        />

        <Route
          path="/admin/complaints/:id"
          element={<ComplaintDetails />}
        />

        <Route
          path="/admin/staff"
          element={<StaffManagement />}
        />

        <Route
          path="/admin/departments"
          element={<Departments />}
        />

        <Route
          path="/admin/sla"
          element={<SLASettings />}
        />

        <Route
          path="/admin/reports"
          element={<ReportsAnalytics />}
        />

        <Route
          path="/admin/public-portal"
          element={<PublicPortal />}
        />

        <Route
          path="/admin/activity-log"
          element={<ActivityLog />}
        />

        <Route
          path="/admin/profile"
          element={<Profile />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;