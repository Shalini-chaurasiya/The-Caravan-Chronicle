// src/components/admin/AdminDashboard.jsx

import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import StatCard from "./StatCard";
import ComplaintTable from "./ComplaintTable";
import WorkloadCard from "./WorkloadCard";
import ActionRequired from "./ActionRequired";

const AdminDashboard = () => {
  return (
    <div className="admin-layout">

      <AdminSidebar />

      <div className="admin-main">

        <AdminNavbar />

        <main className="dashboard-content">

          <div className="dashboard-heading">
            <div>
              <h1>Good Morning, Admin! 👋</h1>
              <p>
                Here's what's happening with municipal grievances today.
              </p>
            </div>

            <div className="dashboard-date">
              <strong>04 October 2026</strong>
              <span>Sunday</span>
            </div>
          </div>

          <div className="stats-grid">

            <StatCard
              title="Total Complaints"
              value="523"
              icon="▣"
              type="blue"
              description="↑ 12% from last month"
            />

            <StatCard
              title="Unassigned"
              value="32"
              icon="!"
              type="red"
              description="Needs attention"
            />

            <StatCard
              title="In Progress"
              value="178"
              icon="◷"
              type="orange"
              description="↑ 8% from last month"
            />

            <StatCard
              title="Resolved"
              value="213"
              icon="✓"
              type="green"
              description="↑ 15% from last month"
            />

          </div>

          <div className="dashboard-grid">

            <div className="dashboard-section chart-section">

              <div className="section-header">
                <div>
                  <h2>Complaints Overview</h2>
                  <p>Complaint statistics for the last 7 months</p>
                </div>

                <select className="chart-select">
                  <option>Last 7 Months</option>
                  <option>Last 30 Days</option>
                  <option>This Year</option>
                </select>
              </div>

              <div className="fake-chart">

                <div className="chart-y-axis">
                  <span>200</span>
                  <span>150</span>
                  <span>100</span>
                  <span>50</span>
                  <span>0</span>
                </div>

                <div className="chart-area">

                  <div className="chart-grid-line"></div>
                  <div className="chart-grid-line"></div>
                  <div className="chart-grid-line"></div>
                  <div className="chart-grid-line"></div>
                  <div className="chart-grid-line"></div>

                  <div className="chart-bars">
                    <div className="bar-wrapper">
                      <div className="bar total" style={{ height: "35%" }}></div>
                      <span>Apr</span>
                    </div>

                    <div className="bar-wrapper">
                      <div className="bar total" style={{ height: "48%" }}></div>
                      <span>May</span>
                    </div>

                    <div className="bar-wrapper">
                      <div className="bar total" style={{ height: "60%" }}></div>
                      <span>Jun</span>
                    </div>

                    <div className="bar-wrapper">
                      <div className="bar total" style={{ height: "57%" }}></div>
                      <span>Jul</span>
                    </div>

                    <div className="bar-wrapper">
                      <div className="bar total" style={{ height: "72%" }}></div>
                      <span>Aug</span>
                    </div>

                    <div className="bar-wrapper">
                      <div className="bar total" style={{ height: "84%" }}></div>
                      <span>Sep</span>
                    </div>

                    <div className="bar-wrapper">
                      <div className="bar total" style={{ height: "95%" }}></div>
                      <span>Oct</span>
                    </div>
                  </div>

                </div>
              </div>

              <div className="chart-legend">
                <span>
                  <i className="legend-dot blue-dot"></i>
                  Total
                </span>

                <span>
                  <i className="legend-dot green-dot"></i>
                  Resolved
                </span>

                <span>
                  <i className="legend-dot orange-dot"></i>
                  New
                </span>
              </div>

            </div>

            <ActionRequired />

          </div>

          <ComplaintTable />

          <div className="bottom-grid">

            <WorkloadCard />

            <div className="dashboard-section quick-actions">

              <div className="section-header">
                <div>
                  <h2>Quick Actions</h2>
                  <p>Frequently used admin actions</p>
                </div>
              </div>

              <div className="quick-action-grid">

                <button>
                  <span>+</span>
                  Add Staff
                </button>

                <button>
                  <span>+</span>
                  Add Department
                </button>

                <button>
                  <span>▤</span>
                  View Complaints
                </button>

                <button>
                  <span>↗</span>
                  Assign Complaints
                </button>

                <button>
                  <span>▥</span>
                  View Reports
                </button>

                <button>
                  <span>◷</span>
                  SLA Settings
                </button>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
};

export default AdminDashboard;