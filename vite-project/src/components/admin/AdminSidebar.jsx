// src/components/admin/AdminSidebar.jsx

import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: "⌂" },
  { name: "All Complaints", path: "/admin/complaints", icon: "▤" },
  { name: "Staff Management", path: "/admin/staff", icon: "♟" },
  { name: "Departments", path: "/admin/departments", icon: "▦" },
  { name: "SLA & Escalation", path: "/admin/sla", icon: "◷" },
  { name: "Reports & Analytics", path: "/admin/reports", icon: "▥" },
  { name: "Public Portal", path: "/admin/public-portal", icon: "◎" },
  { name: "Profile", path: "/admin/profile", icon: "♙" },
];

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">🏛</div>

        <div>
          <h2>Municipal</h2>
          <span>Grievance System</span>
        </div>
      </div>

      <div className="sidebar-menu-title">MAIN MENU</div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button className="logout-btn">
          <span className="sidebar-icon">↪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;