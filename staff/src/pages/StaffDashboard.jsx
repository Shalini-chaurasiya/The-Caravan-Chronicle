import StaffSidebar from "../components/StaffSidebar";
import {
  ClipboardList,
  Clock,
  LoaderCircle,
  CheckCircle2,
  Bell,
  Search,
  ArrowUpRight,
  MapPin,
} from "lucide-react";

const StaffDashboard = () => {
  const staff = JSON.parse(localStorage.getItem("staff") || "{}");

  const stats = [
    {
      title: "Assigned Complaints",
      value: "24",
      subtitle: "Total assigned to you",
      icon: ClipboardList,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Pending",
      value: "08",
      subtitle: "Awaiting your action",
      icon: Clock,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "In Progress",
      value: "10",
      subtitle: "Currently being handled",
      icon: LoaderCircle,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Resolved",
      value: "06",
      subtitle: "Successfully completed",
      icon: CheckCircle2,
      color: "bg-green-100 text-green-600",
    },
  ];

  const complaints = [
    {
      id: "CMP1024",
      subject: "Garbage collection issue",
      department: "Sanitation",
      location: "Civil Lines",
      date: "05 Nov 2026",
      status: "Pending",
    },
    {
      id: "CMP1025",
      subject: "Street light not working",
      department: "Electricity",
      location: "George Town",
      date: "04 Nov 2026",
      status: "In Progress",
    },
    {
      id: "CMP1026",
      subject: "Water leakage",
      department: "Water Supply",
      location: "Tagore Town",
      date: "03 Nov 2026",
      status: "Resolved",
    },
    {
      id: "CMP1027",
      subject: "Damaged road",
      department: "Road Maintenance",
      location: "Katra",
      date: "02 Nov 2026",
      status: "Pending",
    },
  ];

  const getStatusStyle = (status) => {
    if (status === "Resolved") {
      return "bg-green-100 text-green-700";
    }

    if (status === "In Progress") {
      return "bg-purple-100 text-purple-700";
    }

    return "bg-orange-100 text-orange-700";
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      <StaffSidebar />

      {/* Main Content */}
      <main className="min-h-screen ml-64 p-8">
        {/* Top Navbar */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">
              Staff Portal / Dashboard
            </p>
            <h1 className="mt-1 text-2xl font-bold text-[#101c3a]">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative rounded-xl border border-slate-200 bg-white p-3 text-slate-600 hover:bg-slate-50">
              <Bell size={20} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                {(staff.name || "S").charAt(0).toUpperCase()}
              </div>

              <div>
                <p className="text-sm font-semibold text-[#101c3a]">
                  {staff.name || "Staff Member"}
                </p>
                <p className="text-xs text-slate-500">
                  {staff.department || "Staff"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Banner */}
        <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-[#101c3a] to-blue-700 p-7 text-white shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="mb-2 text-sm text-blue-200">
                Welcome back!
              </p>

              <h2 className="text-2xl font-bold">
                Hello, {staff.name || "Staff Member"} 👋
              </h2>

              <p className="mt-2 max-w-xl text-sm text-blue-100">
                Manage your assigned complaints, track progress, and help
                make your city better.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5">
              <ClipboardList size={42} />
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className={`rounded-xl p-3 ${item.color}`}>
                    <Icon size={23} />
                  </div>

                  <ArrowUpRight size={19} className="text-slate-400" />
                </div>

                <h3 className="text-sm font-medium text-slate-500">
                  {item.title}
                </h3>

                <p className="mt-1 text-3xl font-bold text-[#101c3a]">
                  {item.value}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  {item.subtitle}
                </p>
              </div>
            );
          })}
        </div>

        {/* Complaints Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-6">
            <div>
              <h2 className="text-lg font-bold text-[#101c3a]">
                Recent Complaints
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Overview of your recently assigned complaints
              </p>
            </div>

            <button
              onClick={() => (window.location.href = "/staff/complaints")}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Complaint ID</th>
                  <th className="px-6 py-4 font-semibold">Complaint</th>
                  <th className="px-6 py-4 font-semibold">Location</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {complaints.map((complaint) => (
                  <tr
                    key={complaint.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                      {complaint.id}
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-[#101c3a]">
                        {complaint.subject}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {complaint.department}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {complaint.location}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {complaint.date}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          complaint.status
                        )}`}
                      >
                        {complaint.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Information */}
        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
              <ClipboardList size={19} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#101c3a]">
                Reminder
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Keep your assigned complaints updated so citizens can
                track their grievance status.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;