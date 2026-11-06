
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import StaffLogin from "./pages/StaffLogin";
import StaffDashboard from "./pages/StaffDashboard";
import StaffProfile from "./pages/StaffProfile";
import StaffComplaints from "./pages/StaffComplaints";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default Route */}
        <Route
          path="/"
          element={<Navigate to="/staff/login" replace />}
        />

        {/* Staff Login */}
        <Route
          path="/staff/login"
          element={<StaffLogin />}
        />

        {/* Staff Dashboard */}
        <Route
          path="/staff/dashboard"
          element={<StaffDashboard />}
        />

        {/* Staff Profile */}
        <Route
          path="/staff/profile"
          element={<StaffProfile />}
        />

        {/* Staff Complaints */}
        <Route
          path="/staff/complaints"
          element={<StaffComplaints />}
        />

        {/* Invalid Route */}
        <Route
          path="*"
          element={<Navigate to="/staff/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
