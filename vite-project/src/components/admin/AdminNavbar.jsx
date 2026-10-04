// src/components/admin/AdminNavbar.jsx

import { useState } from "react";

const AdminNavbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="admin-navbar">
      <div className="navbar-left">
        <button className="mobile-menu-btn">☰</button>

        <div>
          <p className="breadcrumb">Admin Panel</p>
          <h1>Dashboard</h1>
        </div>
      </div>

      <div className="navbar-right">
        <div className="notification-wrapper">
          <button
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            🔔
            <span className="notification-count">3</span>
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h3>Notifications</h3>
                <button>Mark all as read</button>
              </div>

              <div className="notification-item">
                <div className="notification-dot red"></div>
                <div>
                  <strong>New complaint submitted</strong>
                  <p>CMP101 · Road Damage</p>
                  <small>10 minutes ago</small>
                </div>
              </div>

              <div className="notification-item">
                <div className="notification-dot orange"></div>
                <div>
                  <strong>Complaint exceeded SLA</strong>
                  <p>CMP099 · Water Issue</p>
                  <small>35 minutes ago</small>
                </div>
              </div>

              <div className="notification-item">
                <div className="notification-dot green"></div>
                <div>
                  <strong>Complaint resolved</strong>
                  <p>CMP095 · Garbage</p>
                  <small>1 hour ago</small>
                </div>
              </div>

              <div className="notification-footer">
                View all notifications →
              </div>
            </div>
          )}
        </div>

        <div className="admin-profile">
          <div className="admin-avatar">A</div>

          <div className="admin-info">
            <strong>Admin</strong>
            <span>Administrator</span>
          </div>

          <span className="profile-arrow">⌄</span>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;