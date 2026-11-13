import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  CheckCheck,
  CircleCheck,
  Clock3,
  RefreshCw,
} from "lucide-react";
import CitizenSidebar from "../../../components/citizen/CitizenSidebar";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/+$/, "");
const API_URL = API_BASE_URL.endsWith("/api")
  ? API_BASE_URL
  : `${API_BASE_URL}/api`;

const formatDate = (value) => {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const fetchNotifications = useCallback(async (signal) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to view your notifications.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      const data = await response.json();

      if (!response.ok || !data.success || !Array.isArray(data.notifications)) {
        throw new Error(data.message || "Unable to load your notifications.");
      }

      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount || 0);
      setError("");
    } catch (fetchError) {
      if (fetchError.name === "AbortError") return;
      console.error("Fetch citizen notifications error:", fetchError);
      setError(fetchError.message || "Unable to load your notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const requestId = window.setTimeout(
      () => fetchNotifications(controller.signal),
      0
    );
    return () => {
      window.clearTimeout(requestId);
      controller.abort();
    };
  }, [fetchNotifications]);

  const markAllAsRead = async () => {
    const token = localStorage.getItem("token");
    if (!token || unreadCount === 0) return;

    setBusy(true);
    setError("");
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
      setError(markError.message || "Unable to update notifications.");
    } finally {
      setBusy(false);
    }
  };

  const markAsRead = async (id) => {
    if (!id || !localStorage.getItem("token")) return;
    try {
      const response = await fetch(`${API_URL}/notifications/${id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to mark notification as read.");
      }
      setNotifications((current) =>
        current.filter((notification) => notification._id !== id)
      );
      setUnreadCount((count) => Math.max(0, count - 1));
    } catch (markError) {
      console.error("Mark citizen notification as read error:", markError);
      setError(markError.message || "Unable to update this notification.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-slate-50 md:h-screen md:flex-row md:overflow-hidden">
      <CitizenSidebar />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-7 lg:px-10 lg:py-9 md:h-screen md:overflow-y-auto">
        <div className="mx-auto max-w-5xl">
          <header className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Bell size={23} />
              </span>
              <div>
                <p className="text-sm font-semibold text-blue-700">
                  Citizen portal
                </p>
                <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">
                  Notifications
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
                {unreadCount} unread
              </span>
              <button
                type="button"
                onClick={markAllAsRead}
                disabled={busy || unreadCount === 0}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCheck size={16} />
                Mark all read
              </button>
            </div>
          </header>

          {error && (
            <div
              role="alert"
              className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  fetchNotifications();
                }}
                className="inline-flex shrink-0 items-center gap-1 font-semibold"
              >
                <RefreshCw size={14} /> Retry
              </button>
            </div>
          )}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {loading ? (
              <div className="space-y-3 p-5" aria-label="Loading notifications">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-20 animate-pulse rounded-xl bg-slate-100"
                  />
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-5 py-14 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                  <CircleCheck size={24} />
                </span>
                <h2 className="mt-4 font-semibold text-slate-900">
                  You’re all caught up
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Updates about your complaint progress will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((notification) => {
                  const complaintId =
                    notification.complaint?._id || notification.complaint;
                  return (
                    <Link
                      key={notification._id}
                      to={
                        complaintId
                          ? `/citizen/dashboard/complaints/${complaintId}`
                          : "/citizen/dashboard/notifications"
                      }
                      onClick={() =>
                        !notification.isRead && markAsRead(notification._id)
                      }
                      className={`flex gap-4 px-5 py-4 transition hover:bg-blue-50/60 sm:px-6 ${
                        notification.isRead ? "bg-white" : "bg-blue-50/40"
                      }`}
                    >
                      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                        {notification.isRead ? (
                          <Bell size={19} />
                        ) : (
                          <Clock3 size={19} />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-slate-900">
                            {notification.title}
                          </span>
                          {!notification.isRead && (
                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                              New
                            </span>
                          )}
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-slate-600">
                          {notification.detail}
                        </span>
                        <span className="mt-2 block text-xs text-slate-400">
                          {formatDate(notification.createdAt)}
                        </span>
                      </span>
                      <ArrowRight
                        size={18}
                        className="mt-2 shrink-0 text-slate-400"
                      />
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Notifications;
