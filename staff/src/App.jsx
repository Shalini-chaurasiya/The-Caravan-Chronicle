import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import StaffLogin from "./pages/StaffLogin";
import StaffDashboard from "./pages/StaffDashboard";

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