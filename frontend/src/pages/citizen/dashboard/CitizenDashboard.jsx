import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  Bell,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FilePlus2,
  MapPin,
  RefreshCw,
  Search,
} from "lucide-react";
import CitizenSidebar from "../../../components/citizen/CitizenSidebar";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/+$/, "");
const API_URL = API_BASE_URL.endsWith("/api")
  ? API_BASE_URL
  : `${API_BASE_URL}/api`;

const statusStyles = {
  Pending: "border-amber-200 bg-amber-50 text-amber-700",
  "In Progress": "border-blue-200 bg-blue-50 text-blue-700",
  Resolved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Rejected: "border-rose-200 bg-rose-50 text-rose-700",
};

const formatDate = (value) => {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getCitizenProfile = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return {
      name: user?.name?.trim() || "",
      image: user?.profileImage || "",
    };
  } catch (error) {
    console.error("Unable to read citizen profile from storage:", error);
    return { name: "", image: "" };
  }
};

const StatCard = ({ title, count, icon: Icon, tone }) => {
  const tones = {
    blue: "bg-blue-50 text-blue-700 ring-blue-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {count}
          </p>
        </div>
        <div className={`rounded-xl p-3 ring-1 ${tones[tone]}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
};

const QuickLink = ({ to, icon: Icon, title, description }) => (
  <Link
    to={to}
    className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
  >
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
      <Icon size={21} />
    </span>
    <span className="min-w-0 flex-1">
      <span className="block font-semibold text-slate-900">{title}</span>
      <span className="mt-1 block text-sm text-slate-500">{description}</span>
    </span>
    <ArrowRight
      size={18}
      className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-700"
    />
  </Link>
);

const CitizenDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(() =>
    Boolean(localStorage.getItem("token"))
  );
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsError, setNotificationsError] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const needsLogin = !token;
  const [citizenProfile, setCitizenProfile] = useState(getCitizenProfile);
  const [profileImageFailed, setProfileImageFailed] = useState(false);
  const citizenName = citizenProfile.name.split(/\s+/)[0] || "there";
  const citizenInitials = citizenProfile.name
    ? citizenProfile.name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
    : "C";
  const profileImageUrl = citizenProfile.image
    ? /^https?:\/\//i.test(citizenProfile.image)
      ? citizenProfile.image
      : `${API_BASE_URL.replace(/\/api$/, "")}${citizenProfile.image.startsWith("/") ? "" : "/"}${citizenProfile.image}`
    : "";

  useEffect(() => {
    if (!token) return undefined;
    const controller = new AbortController();
    const requestId = window.setTimeout(async () => {
      try {
        const response = await fetch(`${API_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        const data = await response.json();

        if (!response.ok || !data.success || !data.user) {
          throw new Error(data.message || "Unable to load your profile.");
        }

        const profile = {
          name: data.user.name?.trim() || "",
          image: data.user.profileImage || "",
        };
        setCitizenProfile(profile);
        localStorage.setItem("user", JSON.stringify(data.user));
        setProfileImageFailed(false);
      } catch (profileError) {
        if (profileError.name === "AbortError") return;
        console.error("Fetch citizen dashboard profile error:", profileError);
      }
    }, 0);

    return () => {
      window.clearTimeout(requestId);
      controller.abort();
    };
  }, [token]);

  const fetchComplaints = useCallback(async (signal) => {
    if (!token) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/complaints/my`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        throw new Error(data.message || "Your session has expired. Please log in again.");
      }

      if (!response.ok || !data.success || !Array.isArray(data.complaints)) {
        throw new Error(data.message || "Unable to load your complaints.");
      }

      setComplaints(data.complaints);
      setError("");
    } catch (fetchError) {
      if (fetchError.name === "AbortError") return;
      console.error("Fetch citizen dashboard complaints error:", fetchError);
      setError(fetchError.message || "Unable to load your dashboard.");
    }
  }, [token]);

  const fetchNotifications = useCallback(async (signal) => {
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
      }
      if (!response.ok || !data.success || !Array.isArray(data.notifications)) {
        throw new Error(data.message || "Unable to load notifications.");
      }

      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount || 0);
      setNotificationsError("");
    } catch (fetchError) {
      if (fetchError.name === "AbortError") return;
      console.error("Fetch citizen notifications error:", fetchError);
      setNotificationsError(fetchError.message || "Unable to load notifications.");
    }
  }, [token]);

  useEffect(() => {
    if (!token) return undefined;
    const controller = new AbortController();
    const requestId = window.setTimeout(() => {
      fetchComplaints(controller.signal).finally(() => setLoading(false));
    }, 0);
    return () => {
      window.clearTimeout(requestId);
      controller.abort();
    };
  }, [fetchComplaints, token]);

  useEffect(() => {
    if (!token) return undefined;
    const controller = new AbortController();
    const requestId = window.setTimeout(
      () => fetchNotifications(controller.signal),
      0
    );
    const intervalId = window.setInterval(
      () => fetchNotifications(controller.signal),
      30000
    );
    return () => {
      window.clearTimeout(requestId);
      window.clearInterval(intervalId);
      controller.abort();
    };
  }, [fetchNotifications, token]);

  const stats = useMemo(
    () => ({
      total: complaints.length,
      pending: complaints.filter((item) => item.status === "Pending").length,
      inProgress: complaints.filter((item) => item.status === "In Progress").length,
      resolved: complaints.filter((item) => item.status === "Resolved").length,
    }),
    [complaints]
  );

  const recentComplaints = complaints.slice(0, 5);

  const refreshDashboard = async () => {
    setRefreshing(true);
    setError("");
    try {
      await fetchComplaints();
    } finally {
      setRefreshing(false);
    }
  };

  const markAllNotificationsAsRead = async () => {
    if (!token || unreadCount === 0) return;
    try {
      const response = await fetch(`${API_URL}/notifications/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to mark notifications as read.");
      }
      setNotifications([]);
      setUnreadCount(0);
    } catch (markError) {
      console.error("Mark all citizen notifications as read error:", markError);
      setNotificationsError(
        markError.message || "Unable to update notifications."
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-slate-50 md:h-screen md:flex-row md:overflow-hidden">
      <CitizenSidebar />

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-7 lg:px-10 lg:py-9 md:h-screen md:overflow-y-auto">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <p className="mb-2 text-sm font-semibold text-blue-700">
                Citizen portal
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Welcome, {citizenName}
              </h1>
              <p className="mt-2 text-slate-500">
                Keep track of your requests and the latest updates from your city.
              </p>
            </div>
            <div className="flex items-center gap-3 self-start lg:self-auto">
              <button
                type="button"
                onClick={refreshDashboard}
                disabled={loading || refreshing || needsLogin}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={refreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setNotificationsOpen((open) => !open);
                    fetchNotifications();
                  }}
                  aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
                  aria-expanded={notificationsOpen}
                  aria-haspopup="dialog"
                  title="Notifications"
                  className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-blue-700 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>
                {notificationsOpen && (
                <div
                  role="dialog"
                  aria-label="Recent notifications"
                  className="absolute right-0 top-14 z-30 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                    <div>
                      <p className="font-semibold text-slate-900">Notifications</p>
                      <p className="text-xs text-slate-500">
                        {unreadCount} unread
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={markAllNotificationsAsRead}
                      disabled={unreadCount === 0}
                      aria-label="Mark all notifications as read"
                      className="rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
                    >
                      Mark all read
                    </button>
                  </div>
                  {notificationsError ? (
                    <p role="alert" className="px-4 py-5 text-sm text-rose-700">
                      {notificationsError}
                    </p>
                  ) : notifications.length ? (
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.slice(0, 5).map((notification) => (
                        <Link
                          key={notification._id}
                          to="/citizen/dashboard/notifications"
                          onClick={() => setNotificationsOpen(false)}
                          className="block border-b border-slate-100 px-4 py-3 transition hover:bg-blue-50"
                        >
                          <span className="flex items-start gap-3">
                            <span
                              className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                                notification.isRead ? "bg-slate-300" : "bg-blue-600"
                              }`}
                            />
                            <span className="min-w-0">
                              <span className="block text-sm font-semibold text-slate-900">
                                {notification.title}
                              </span>
                              <span className="mt-1 block text-xs leading-5 text-slate-600">
                                {notification.detail}
                              </span>
                              <span className="mt-1 block text-[11px] text-slate-400">
                                {formatDate(notification.createdAt)}
                              </span>
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="px-4 py-7 text-center text-sm text-slate-500">
                      You’re all caught up.
                    </p>
                  )}
                  <Link
                    to="/citizen/dashboard/notifications"
                    onClick={() => setNotificationsOpen(false)}
                    className="block bg-slate-50 px-4 py-3 text-center text-sm font-semibold text-blue-700 hover:bg-blue-50"
                  >
                    View all notifications
                  </Link>
                </div>
              )}
              </div>
              <Link
                to="/citizen/profile"
                aria-label="View citizen profile"
                title={citizenProfile.name || "Citizen profile"}
                className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-sm font-bold text-blue-800 ring-2 ring-white shadow-sm"
              >
                {profileImageUrl && !profileImageFailed ? (
                  <img
                    src={profileImageUrl}
                    alt={citizenProfile.name || "Citizen"}
                    className="h-full w-full object-cover"
                    onError={() => setProfileImageFailed(true)}
                  />
                ) : (
                  citizenInitials
                )}
              </Link>
            </div>
          </header>

          {needsLogin ? (
            <section className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-start gap-4">
                <span className="rounded-xl bg-amber-50 p-3 text-amber-700">
                  <AlertCircle size={22} />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Sign in to view your dashboard
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Your complaint updates will appear here after you log in.
                  </p>
                  <Link
                    to="/citizen/login"
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
                  >
                    Go to login <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </section>
          ) : (
            <>
              {error && (
                <div
                  role="alert"
                  className="mb-6 flex flex-col justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 sm:flex-row sm:items-center"
                >
                  <span>{error}</span>
                  <button
                    type="button"
                    onClick={refreshDashboard}
                    className="shrink-0 font-semibold underline underline-offset-2"
                  >
                    Try again
                  </button>
                </div>
              )}

              <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard title="Total complaints" count={loading ? "—" : stats.total} icon={ClipboardList} tone="blue" />
                <StatCard title="Pending" count={loading ? "—" : stats.pending} icon={Clock3} tone="amber" />
                <StatCard title="In progress" count={loading ? "—" : stats.inProgress} icon={RefreshCw} tone="blue" />
                <StatCard title="Resolved" count={loading ? "—" : stats.resolved} icon={CheckCircle2} tone="green" />
              </section>

              <section className="mb-7 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#10233f] via-[#174477] to-[#1d72e8] p-6 text-white shadow-lg shadow-blue-950/10 sm:p-8">
                  <div className="absolute -right-10 -top-14 h-48 w-48 rounded-full border-[24px] border-white/5" />
                  <div className="relative max-w-xl">
                    <p className="text-sm font-semibold text-blue-100">
                      Better neighborhoods start with you
                    </p>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                      Report an issue. Follow it through.
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-blue-100">
                      Submit civic concerns and stay informed as your complaint
                      moves toward a resolution.
                    </p>
                    <Link
                      to="/citizen/dashboard/new"
                      className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-blue-800 transition hover:bg-blue-50"
                    >
                      Submit a complaint <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-lg font-bold text-slate-900">
                    Quick actions
                  </h2>
                  <div className="mt-4 grid gap-3">
                    <QuickLink
                      to="/citizen/dashboard/new"
                      icon={FilePlus2}
                      title="New complaint"
                      description="Tell us about a local issue"
                    />
                    <QuickLink
                      to="/citizen/dashboard/track"
                      icon={Search}
                      title="Track a complaint"
                      description="See updates and progress"
                    />
                    <QuickLink
                      to="/citizen/dashboard/notifications"
                      icon={Bell}
                      title="Notifications"
                      description="View your latest messages"
                    />
                  </div>
                </div>
              </section>

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Recent complaints
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      A quick look at your latest submissions.
                    </p>
                  </div>
                  <Link
                    to="/citizen/dashboard/complaints"
                    className="inline-flex items-center gap-1 self-start text-sm font-semibold text-blue-700 hover:text-blue-900 sm:self-auto"
                  >
                    View all <ArrowRight size={16} />
                  </Link>
                </div>

                {loading ? (
                  <div className="space-y-3 p-5 sm:p-6" aria-label="Loading complaints">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="h-16 animate-pulse rounded-xl bg-slate-100"
                      />
                    ))}
                  </div>
                ) : recentComplaints.length === 0 ? (
                  <div className="px-5 py-12 text-center sm:px-6">
                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                      <ClipboardList size={23} />
                    </span>
                    <h3 className="mt-4 font-semibold text-slate-900">
                      No complaints yet
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Your submitted complaints will show up here.
                    </p>
                    <Link
                      to="/citizen/dashboard/new"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
                    >
                      Submit your first complaint <ArrowRight size={16} />
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {recentComplaints.map((complaint) => {
                      const complaintId = complaint._id || complaint.id;
                      return (
                        <Link
                          key={complaintId}
                          to={
                            complaintId
                              ? `/citizen/dashboard/complaints/${complaintId}`
                              : "/citizen/dashboard/complaints"
                          }
                          className="flex flex-col gap-3 px-5 py-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:px-6"
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                            <ClipboardList size={19} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-semibold text-slate-900">
                              {complaint.complaintType || "Complaint"}
                            </span>
                            <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                              <span className="inline-flex items-center gap-1">
                                <MapPin size={13} />
                                {complaint.location || "Location unavailable"}
                              </span>
                              <span>{formatDate(complaint.createdAt)}</span>
                            </span>
                          </span>
                          <span
                            className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                              statusStyles[complaint.status] ||
                              statusStyles.Pending
                            }`}
                          >
                            {complaint.status || "Pending"}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default CitizenDashboard;
