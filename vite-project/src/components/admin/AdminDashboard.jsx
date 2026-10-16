import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import StatCard from "./StatCard";
import ComplaintTable from "./ComplaintTable";
import WorkloadCard from "./WorkloadCard";
import ActionRequired from "./ActionRequired";

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-[#f5f7fb] text-[#172033]">
      <AdminSidebar />

      <div className="min-h-screen min-w-0 flex-1">
        <AdminNavbar />

        <main className="mx-auto w-full max-w-[1700px] p-4 sm:p-6 lg:p-8">
          {/* Dashboard heading */}
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="mb-2 text-2xl font-bold text-[#172033]">
                Good Morning, Admin! 👋
              </h1>
              <p className="text-sm text-slate-500">
                Here's what's happening with municipal grievances today.
              </p>
            </div>

            <div className="sm:text-right">
              <strong className="block text-sm text-slate-700">
                04 October 2026
              </strong>
              <span className="text-xs text-slate-400">Sunday</span>
            </div>
          </div>

          {/* Statistics */}
          <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

          {/* Chart and actions */}
          <div className="mb-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.5fr_1fr]">
            <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-[#172033]">
                    Complaints Overview
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Complaint statistics for the last 7 months
                  </p>
                </div>

                <select className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 outline-none focus:border-blue-500">
                  <option>Last 7 Months</option>
                  <option>Last 30 Days</option>
                  <option>This Year</option>
                </select>
              </div>

              {/* Simple bar chart */}
              <div className="flex h-[245px]">
                <div className="flex w-9 shrink-0 flex-col justify-between pb-7 text-[10px] text-slate-400">
                  <span>200</span>
                  <span>150</span>
                  <span>100</span>
                  <span>50</span>
                  <span>0</span>
                </div>

                <div className="relative min-w-0 flex-1 border-b border-l border-slate-200">
                  <div className="absolute inset-x-0 top-0 border-t border-slate-100" />
                  <div className="absolute inset-x-0 top-1/4 border-t border-slate-100" />
                  <div className="absolute inset-x-0 top-1/2 border-t border-slate-100" />
                  <div className="absolute inset-x-0 top-3/4 border-t border-slate-100" />

                  <div className="absolute inset-0 flex items-end justify-around px-1 pb-6 sm:px-3">
                    {[
                      { month: "Apr", height: "35%" },
                      { month: "May", height: "48%" },
                      { month: "Jun", height: "60%" },
                      { month: "Jul", height: "57%" },
                      { month: "Aug", height: "72%" },
                      { month: "Sep", height: "84%" },
                      { month: "Oct", height: "95%" },
                    ].map((item) => (
                      <div
                        key={item.month}
                        className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                      >
                        <div
                          className="w-4 max-w-full rounded-t-md bg-[#2879df] opacity-80 sm:w-6"
                          style={{ height: item.height }}
                        />
                        <span className="text-[10px] text-slate-400">
                          {item.month}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-9 flex flex-wrap gap-x-5 gap-y-2">
                <span className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-[#2879df]" />
                  Total
                </span>
                <span className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-green-600" />
                  Resolved
                </span>
                <span className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  New
                </span>
              </div>
            </section>

            <ActionRequired />
          </div>

          {/* Recent complaints */}
          <ComplaintTable />

          {/* Workload and quick actions */}
          <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_1fr]">
            <WorkloadCard />

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
                {[
                  { icon: "+", label: "Add Staff" },
                  { icon: "+", label: "Add Department" },
                  { icon: "▤", label: "View Complaints" },
                  { icon: "↗", label: "Assign Complaints" },
                  { icon: "▥", label: "View Reports" },
                  { icon: "◷", label: "SLA Settings" },
                ].map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    className="flex min-h-[80px] flex-col items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-center text-xs text-slate-600 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <span className="text-xl text-blue-600">
                      {action.icon}
                    </span>
                    {action.label}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;