import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/+$/, "");
const API_URL = API_BASE_URL.endsWith("/api")
  ? API_BASE_URL
  : `${API_BASE_URL}/api`;

const formatTime = (dateValue) => {
  const timestamp = new Date(dateValue).getTime();

  if (!Number.isFinite(timestamp)) {
    return "";
  }

  const elapsedSeconds = Math.round((timestamp - Date.now()) / 1000);
  const units = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
  ];
  const [unit, secondsPerUnit] =
    units.find(([, seconds]) => Math.abs(elapsedSeconds) >= seconds) || [
      "second",
      1,
    ];

  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
    Math.round(elapsedSeconds / secondsPerUnit),
    unit
  );
};

const notificationColors = {
  new_complaint: "bg-red-500",
  status_update: "bg-green-600",
  sla_exceeded: "bg-amber-500",
};

const NotificationDropdown = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [markingRead, setMarkingRead] = useState(false);
  const [markingNotificationId, setMarkingNotificationId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const loadNotifications = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          throw new Error("Please sign in to view notifications.");
        }

        const response = await fetch(`${API_URL}/admin/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok || data.success === false) {
          throw new Error(data.message || "Unable to load notifications.");
        }

        if (active) {
          setNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
          setError("");
        }
      } catch (requestError) {
        if (active && requestError.name !== "AbortError") {
          setError(requestError.message || "Unable to load notifications.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadNotifications();
    window.addEventListener("admin-notifications-updated", loadNotifications);
    const refreshInterval = window.setInterval(
      () => void loadNotifications(),
      30_000
    );

    return () => {
      active = false;
      controller.abort();
      window.removeEventListener(
        "admin-notifications-updated",
        loadNotifications
      );

      window.clearInterval(refreshInterval);
    };
  }, [isOpen]);

  const markAsRead = async (notificationId) => {
    try {
      setMarkingNotificationId(notificationId);
      const token = localStorage.getItem("adminToken");
      if (!token) {
        throw new Error("Please sign in to update notifications.");
      }

      const response = await fetch(
        `${API_URL}/admin/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Unable to mark notification as read.");
      }

      setNotifications((current) =>
        current.filter((notification) => notification._id !== notificationId)
      );
      setUnreadCount((current) => Math.max(0, current - 1));
      setError("");
      window.dispatchEvent(new Event("admin-notifications-updated"));
      return true;
    } catch (requestError) {
      setError(requestError.message || "Unable to update notification.");
      return false;
    } finally {
      setMarkingNotificationId(null);
    }
  };

  const openNotification = async (event, notification) => {
    event.preventDefault();

    if (await markAsRead(notification._id)) {
      setIsOpen(false);
      navigate(
        `/admin/complaints/${notification.complaint?._id || notification.complaint}`
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      setMarkingRead(true);
      const token = localStorage.getItem("adminToken");
      if (!token) {
        throw new Error("Please sign in to update notifications.");
      }

      const response = await fetch(`${API_URL}/admin/notifications/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Unable to mark notifications as read.");
      }

      setNotifications([]);
      setUnreadCount(0);
      setError("");
      window.dispatchEvent(new Event("admin-notifications-updated"));
    } catch (requestError) {
      setError(requestError.message || "Unable to update notifications.");
    } finally {
      setMarkingRead(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-lg hover:bg-slate-50"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[9px] text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[52px] z-50 w-[min(350px,calc(100vw-100px))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 p-4">
            <h3 className="text-sm font-semibold">Notifications</h3>
            <button
              type="button"
              onClick={markAllAsRead}
              disabled={
                unreadCount === 0 ||
                markingRead ||
                markingNotificationId !== null
              }
              className="text-[11px] text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed disabled:text-slate-400"
            >
              {markingRead ? "Marking..." : "Mark all as read"}
            </button>
          </div>

          {error && (
            <p role="alert" className="px-4 py-3 text-xs text-red-600">
              {error}
            </p>
          )}

          {loading && (
            <p className="px-4 py-6 text-center text-xs text-slate-500">
              Loading notifications...
            </p>
          )}

          {!loading && !error && notifications.length === 0 && (
            <p className="px-4 py-6 text-center text-xs text-slate-500">
              You&apos;re all caught up.
            </p>
          )}

          {!loading &&
            notifications.map((notification) => (
              <div
                key={notification._id}
                className="flex gap-3 border-b border-slate-100 bg-blue-50/50 px-4 py-3"
              >
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                    notificationColors[notification.type] || "bg-slate-400"
                  }`}
                />
                <Link
                  to={`/admin/complaints/${notification.complaint?._id || notification.complaint}`}
                  onClick={(event) => void openNotification(event, notification)}
                  className="min-w-0 flex-1 text-left"
                >
                  <strong className="block text-xs text-slate-800">
                    {notification.title}
                  </strong>
                  <p className="mt-1 text-xs text-slate-500">
                    {notification.detail}
                  </p>
                  <small className="text-[10px] text-slate-400">
                    {formatTime(notification.createdAt)}
                  </small>
                </Link>
                <button
                  type="button"
                  onClick={() => markAsRead(notification._id)}
                  disabled={
                    markingRead || markingNotificationId !== null
                  }
                  className="ml-auto shrink-0 self-center text-[10px] text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed disabled:text-slate-400"
                >
                  {markingNotificationId === notification._id
                    ? "Marking..."
                    : "Mark as read"}
                </button>
              </div>
            ))}

          <div className="p-3 text-center text-[11px] text-slate-400">
            Showing the latest 10 unread notifications
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;