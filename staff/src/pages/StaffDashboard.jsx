import { useEffect, useState } from "react";
import StaffSidebar from "../components/StaffSidebar";
import {
  ClipboardList,
  Clock,
  LoaderCircle,
  CheckCircle2,
  Bell,
  ArrowUpRight,
  MapPin,
} from "lucide-react";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/+$/, "");
const API_URL = API_BASE_URL.endsWith("/api")
  ? API_BASE_URL
  : `${API_BASE_URL}/api`;

const formatDate = (date) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Not available";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getPhotoUrl = (photo) => {
  if (!photo) return "";
  if (/^https?:\/\//i.test(photo)) return photo;
  return `${API_BASE_URL}${photo.startsWith("/") ? "" : "/"}${photo}`;
};

const StaffDashboard = () => {
  const [dashboard, setDashboard] = useState({
    staff: JSON.parse(localStorage.getItem("staff") || "{}"),
    stats: { total: 0, pending: 0, inProgress: 0, resolved: 0 },
    recentComplaints: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [staffNotifications, setStaffNotifications] = useState([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [activeNotification, setActiveNotification] = useState(null);
  const [notificationError, setNotificationError] = useState("");
  const [isDismissingNotification, setIsDismissingNotification] =
    useState(false);

  useEffect(() => {
    const token = localStorage.getItem("staffToken");

    if (!token) {
      window.location.replace("/staff/login");
      return undefined;
    }

    const controller = new AbortController();

    const loadDashboard = async () => {
      try {
        const response = await fetch(`${API_URL}/staff/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        const data = await response.json().catch(() => ({}));

        if (response.status === 401) {
          localStorage.removeItem("staffToken");
          localStorage.removeItem("staff");
          window.location.replace("/staff/login");
          return;
        }

        if (
          !response.ok ||
          data.success === false ||
          !data.staff ||
          !data.stats ||
          !Array.isArray(data.recentComplaints)
        ) {
          throw new Error(data.message || "Unable to load your dashboard.");
        }

        setDashboard(data);
        localStorage.setItem("staff", JSON.stringify(data.staff));
        setLoadError("");
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Load staff dashboard error:", error);
          setLoadError(error.message || "Unable to load your dashboard.");
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    loadDashboard();
    const refreshInterval = window.setInterval(loadDashboard, 15000);
    return () => {
      controller.abort();
      window.clearInterval(refreshInterval);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("staffToken");
    if (!token) return undefined;

    const controller = new AbortController();

    const loadNotifications = async () => {
      try {
        const response = await fetch(`${API_URL}/staff/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        const data = await response.json().catch(() => ({}));

        if (response.status === 401) {
          localStorage.removeItem("staffToken");
          localStorage.removeItem("staff");
          window.location.replace("/staff/login");
          return;
        }

        if (
          !response.ok ||
          data.success === false ||
          !Array.isArray(data.notifications)
        ) {
          throw new Error(data.message || "Unable to load notifications.");
        }

        setStaffNotifications(data.notifications);
        setUnreadNotificationCount(
          Number.isFinite(data.unreadCount)
            ? data.unreadCount
            : data.notifications.length
        );
        setActiveNotification((current) => current || data.notifications[0] || null);
        setNotificationError("");
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Load staff notifications error:", error);
          setNotificationError(error.message || "Unable to load notifications.");
        }
      }
    };

    loadNotifications();
    const intervalId = window.setInterval(loadNotifications, 15000);

    return () => {
      controller.abort();
      window.clearInterval(intervalId);
    };
  }, []);

  const handleDismissNotification = async (notification) => {
    const token = localStorage.getItem("staffToken");
    if (!token) {
      window.location.replace("/staff/login");
      return false;
    }

    setIsDismissingNotification(true);
    setNotificationError("");

    try {
      const response = await fetch(
        `${API_URL}/staff/notifications/${notification._id}/read`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        localStorage.removeItem("staffToken");
        localStorage.removeItem("staff");
        window.location.replace("/staff/login");
        return false;
      }

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Unable to dismiss notification.");
      }

      const remaining = staffNotifications.filter(
        (item) => item._id !== notification._id
      );
      setStaffNotifications(remaining);
      setUnreadNotificationCount((count) => Math.max(0, count - 1));
      setActiveNotification(remaining[0] || null);
      return true;
    } catch (error) {
      console.error("Dismiss staff notification error:", error);
      setNotificationError(error.message || "Unable to dismiss notification.");
      return false;
    } finally {
      setIsDismissingNotification(false);
    }
  };

  const { staff, stats, recentComplaints } = dashboard;

  const statCards = [
    {
      title: "Assigned Complaints",
      value: stats.total,
      subtitle: "Total assigned to you",
      icon: ClipboardList,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Pending",
      value: stats.pending,
      subtitle: "Awaiting your action",
      icon: Clock,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      subtitle: "Currently being handled",
      icon: LoaderCircle,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Resolved",
      value: stats.resolved,
      subtitle: "Successfully completed",
      icon: CheckCircle2,
      color: "bg-green-100 text-green-600",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-purple-100 text-purple-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-orange-100 text-orange-700";
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      <StaffSidebar />

      {/* Main Content */}
      <main className="min-h-screen min-w-0 p-4 sm:p-6 md:ml-64 lg:p-8">
        {/* Top Navbar */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm text-slate-500">
              Staff Portal / Dashboard
            </p>
            <h1 className="mt-1 text-2xl font-bold text-[#101c3a]">
              Dashboard
            </h1>
          </div>

          <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-start sm:gap-4">
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setIsNotificationPanelOpen((isOpen) => !isOpen)
                }
                aria-label={`Notifications, ${unreadNotificationCount} unread`}
                aria-expanded={isNotificationPanelOpen}
                aria-controls="staff-notification-panel"
                className="relative rounded-xl border border-slate-200 bg-white p-3 text-slate-600 hover:bg-slate-50"
              >
                <Bell size={20} />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {unreadNotificationCount > 99
                      ? "99+"
                      : unreadNotificationCount}
                  </span>
                )}
              </button>

              {isNotificationPanelOpen && (
                <section
                  id="staff-notification-panel"
                  aria-label="Unread notifications"
                  className="absolute right-0 top-full z-40 mt-3 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                    <div>
                      <h2 className="text-sm font-bold text-[#101c3a]">
                        Notifications
                      </h2>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {unreadNotificationCount} unread
                      </p>
                    </div>
                    <Bell size={17} className="text-blue-600" />
                  </div>

                  {staffNotifications.length > 0 ? (
                    <ul className="max-h-96 divide-y divide-slate-100 overflow-y-auto">
                      {staffNotifications.map((notification) => (
                        <li key={notification._id}>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveNotification(notification);
                              setIsNotificationPanelOpen(false);
                            }}
                            className="w-full px-4 py-3 text-left transition hover:bg-blue-50"
                          >
                            <span className="flex items-start gap-3">
                              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                              <span className="min-w-0 flex-1">
                                <span className="block text-sm font-semibold text-[#101c3a]">
                                  {notification.title}
                                </span>
                                <span className="mt-1 block text-xs text-slate-600">
                                  {notification.detail}
                                </span>
                                {notification.complaint && (
                                  <span className="mt-1 block truncate text-xs text-slate-500">
                                    {notification.complaint.complaintType}
                                    {notification.complaint.location
                                      ? ` · ${notification.complaint.location}`
                                      : ""}
                                  </span>
                                )}
                                <span className="mt-2 block text-[11px] text-slate-400">
                                  {formatDate(notification.createdAt)}
                                </span>
                              </span>
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="px-4 py-8 text-center text-sm text-slate-500">
                      You're all caught up.
                    </p>
                  )}
                </section>
              )}
            </div>

            <div className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-2 sm:gap-3 sm:px-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                {staff.photo ? (
                  <img
                    src={getPhotoUrl(staff.photo)}
                    alt=""
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  (staff.name || "S").charAt(0).toUpperCase()
                )}
              </div>

              <div className="min-w-0">
                <p className="max-w-40 truncate text-sm font-semibold text-[#101c3a]">
                  {staff.name || "Staff Member"}
                </p>
                <p className="max-w-40 truncate text-xs text-slate-500">
                  {staff.department || "Staff"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {loadError && (
          <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {loadError}
          </div>
        )}
        {notificationError && (
          <div role="alert" className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            {notificationError}
          </div>
        )}

        {/* Welcome Banner */}
        <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-[#101c3a] to-blue-700 p-5 text-white shadow-lg sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="mb-2 text-sm text-blue-200">
                Welcome back!
              </p>

              <h2 className="text-2xl font-bold">
                Hello, {staff.name || "Staff Member"}
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
          {statCards.map((item) => {
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
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-4 sm:p-6">
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
                {recentComplaints.map((complaint) => (
                  <tr
                    key={complaint._id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                      {complaint._id}
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-[#101c3a]">
                        {complaint.complaintType}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {complaint.assignedStaff?.department || staff.department || "Not assigned"}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {complaint.location}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatDate(complaint.createdAt)}
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

                {!isLoading && recentComplaints.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-sm text-slate-500">
                      {loadError
                        ? "Dashboard data could not be loaded."
                        : "No complaints have been assigned to you yet."}
                    </td>
                  </tr>
                )}

                {isLoading && (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-sm text-slate-500">
                      Loading dashboard...
                    </td>
                  </tr>
                )}
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

      {activeNotification && (
        <div
          role="alertdialog"
          aria-labelledby="staff-task-notification-title"
          aria-describedby="staff-task-notification-detail"
          className="fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-blue-100 bg-white p-5 shadow-2xl"
        >
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Bell size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <h2
                id="staff-task-notification-title"
                className="font-bold text-[#101c3a]"
              >
                {activeNotification.title}
              </h2>
              <p
                id="staff-task-notification-detail"
                className="mt-1 text-sm text-slate-600"
              >
                {activeNotification.detail}
              </p>
              {activeNotification.complaint && (
                <p className="mt-2 text-xs text-slate-500">
                  {activeNotification.complaint.complaintType}
                  {activeNotification.complaint.location
                    ? ` · ${activeNotification.complaint.location}`
                    : ""}
                </p>
              )}
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  disabled={isDismissingNotification}
                  onClick={() => handleDismissNotification(activeNotification)}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-60"
                >
                  {isDismissingNotification ? "Saving..." : "Dismiss"}
                </button>
                <button
                  type="button"
                  disabled={isDismissingNotification}
                  onClick={async () => {
                    const dismissed =
                      await handleDismissNotification(activeNotification);
                    if (dismissed) {
                      window.location.href = "/staff/complaints";
                    }
                  }}
                  className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  View task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;