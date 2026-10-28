import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import StatCard from "./StatCard";
import ComplaintTable from "./ComplaintTable";
import WorkloadCard from "./WorkloadCard";
import ActionRequired from "./ActionRequired";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/+$/, "");
const API_URL = API_BASE_URL.endsWith("/api")
  ? API_BASE_URL
  : `${API_BASE_URL}/api`;

const quickActions = [
  { icon: "+", label: "Add Staff", path: "/admin/staff" },
  { icon: "+", label: "Add Department", path: "/admin/departments" },
  { icon: "▤", label: "View Complaints", path: "/admin/complaints" },
  { icon: "↗", label: "Assign Complaints", path: "/admin/complaints" },
  { icon: "▥", label: "View Reports", path: "/admin/reports" },
  { icon: "◷", label: "SLA Settings", path: "/admin/sla" },
];

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("7months");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const loadDashboard = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          throw new Error("Please log in to view the admin dashboard.");
        }

        const response = await fetch(
          `${API_URL}/admin/dashboard?period=${period}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }
        );
        const data = await response.json().catch(() => ({}));

        if (!response.ok || data.success === false || !data.dashboard) {
          throw new Error(data.message || "Unable to load dashboard data.");
        }

        if (active) {
          setDashboard(data.dashboard);
          setError("");
        }
      } catch (requestError) {
        if (active && requestError.name !== "AbortError") {
          setError(requestError.message || "Unable to load dashboard data.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadDashboard();

    return () => {
      active = false;
      controller.abort();
    };
  }, [period, retryCount]);

  const now = new Date();
  const greeting =
    now.getHours() < 12
      ? "Good Morning"
      : now.getHours() < 18
        ? "Good Afternoon"
        : "Good Evening";
  const dateLabel = now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const weekday = now.toLocaleDateString("en-IN", { weekday: "long" });
  const chart = dashboard?.chart || [];
  const chartMaximum = Math.max(1, ...chart.map((item) => item.total));
  const chartWidth = Math.max(100, chart.length * (period === "30days" ? 30 : 72));

  return (
    <div className="flex min-h-screen bg-[#f5f7fb] text-[#172033]">
      <AdminSidebar />

      <div className="min-h-screen min-w-0 flex-1">
        <AdminNavbar />

        <main className="mx-auto w-full max-w-[1700px] p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="mb-2 text-2xl font-bold text-[#172033]">
                {greeting}, {dashboard?.admin?.name || "Admin"}!
              </h1>
              <p className="text-sm text-slate-500">
                Here&apos;s what&apos;s happening with municipal grievances today.
              </p>
            </div>

            <div className="sm:text-right">
              <strong className="block text-sm text-slate-700">
                {dateLabel}
              </strong>
              <span className="text-xs text-slate-400">{weekday}</span>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  setRetryCount((count) => count + 1);
                }}
                className="rounded-md bg-white px-3 py-2 text-xs font-semibold text-red-700 shadow-sm hover:bg-red-100"
              >
                Retry
              </button>
            </div>
          )}

          {loading && !dashboard ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              Loading dashboard...
            </div>
          ) : !dashboard ? null : (
            <>
              <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  title="Total Complaints"
                  value={dashboard.stats.total}
                  icon="▣"
                  type="blue"
                  description="All complaints received"
                />
                <StatCard
                  title="Unassigned"
                  value={dashboard.stats.unassigned}
                  icon="!"
                  type="red"
                  description="Awaiting staff assignment"
                />
                <StatCard
                  title="In Progress"
                  value={dashboard.stats.inProgress}
                  icon="◷"
                  type="orange"
                  description="Currently being handled"
                />
                <StatCard
                  title="Resolved"
                  value={dashboard.stats.resolved}
                  icon="✓"
                  type="green"
                  description="Successfully resolved"
                />
              </div>

              <div className="mb-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.5fr_1fr]">
                <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-base font-semibold text-[#172033]">
                        Complaints Overview
                      </h2>
                      <p className="mt-1 text-xs text-slate-400">
                        Complaint statistics for the selected period
                      </p>
                    </div>

                    <select
                      aria-label="Chart period"
                      value={period}
                      onChange={(event) => {
                        setLoading(true);
                        setPeriod(event.target.value);
                      }}
                      className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 outline-none focus:border-blue-500"
                    >
                      <option value="7months">Last 7 Months</option>
                      <option value="30days">Last 30 Days</option>
                      <option value="year">This Year</option>
                    </select>
                  </div>

                  <div className="flex h-[245px]">
                    <div className="flex w-9 shrink-0 flex-col justify-between pb-7 text-[10px] text-slate-400">
                      <span>{chartMaximum}</span>
                      <span>{Math.round(chartMaximum * 0.75)}</span>
                      <span>{Math.round(chartMaximum * 0.5)}</span>
                      <span>{Math.round(chartMaximum * 0.25)}</span>
                      <span>0</span>
                    </div>

                    <div className="overflow-x-auto border-b border-l border-slate-200">
                      <div
                        className="relative h-full"
                        style={{ width: `${chartWidth}px` }}
                      >
                        <div className="absolute inset-x-0 top-0 border-t border-slate-100" />
                        <div className="absolute inset-x-0 top-1/4 border-t border-slate-100" />
                        <div className="absolute inset-x-0 top-1/2 border-t border-slate-100" />
                        <div className="absolute inset-x-0 top-3/4 border-t border-slate-100" />

                        <div className="absolute inset-0 flex items-end justify-around px-1 pb-6 sm:px-3">
                          {chart.map((item) => (
                            <div
                              key={item.key}
                              className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                            >
                              <div
                                className="flex h-full w-full items-end justify-center gap-0.5"
                                title={`${item.label}: ${item.total} total, ${item.resolved} resolved, ${item.new} new`}
                              >
                                {[
                                  ["total", "bg-[#2879df]"],
                                  ["resolved", "bg-green-600"],
                                  ["new", "bg-amber-500"],
                                ].map(([key, color]) => (
                                  <div
                                    key={key}
                                    className={`w-2 max-w-[30%] rounded-t-sm opacity-80 sm:w-3 ${color}`}
                                    style={{
                                      height: item[key]
                                        ? `${Math.max(
                                            2,
                                            (item[key] / chartMaximum) * 100
                                          )}%`
                                        : "0%",
                                    }}
                                  />
                                ))}
                              </div>
                              <span className="whitespace-nowrap text-[10px] text-slate-400">
                                {item.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-9 flex flex-wrap gap-x-5 gap-y-2">
                    {[
                      ["bg-[#2879df]", "Total"],
                      ["bg-green-600", "Resolved"],
                      ["bg-amber-500", "New"],
                    ].map(([color, label]) => (
                      <span
                        key={label}
                        className="flex items-center gap-2 text-xs text-slate-500"
                      >
                        <span className={`h-2 w-2 rounded-full ${color}`} />
                        {label}
                      </span>
                    ))}
                  </div>
                </section>

                <ActionRequired
                  unassigned={dashboard.stats.unassigned}
                  nearingSla={dashboard.attention.nearingSla}
                  exceededSla={dashboard.attention.exceededSla}
                />
              </div>

              <ComplaintTable complaints={dashboard.recentComplaints} />

              <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_1fr]">
                <WorkloadCard staff={dashboard.workload} />

                <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                  <div className="mb-5">
                    <h2 className="text-base font-semibold text-[#172033]">
                      Quick Actions
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">
                      Frequently used admin actions
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {quickActions.map((action) => (
                      <Link
                        key={action.label}
                        to={action.path}
                        className="flex min-h-[80px] flex-col items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-center text-xs text-slate-600 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <span className="text-xl text-blue-600">
                          {action.icon}
                        </span>
                        {action.label}
                      </Link>
                    ))}
                  </div>
                </section>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
