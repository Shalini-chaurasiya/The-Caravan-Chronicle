import { useState } from "react";

const AdminNavbar = ({ title = "Dashboard" }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-[82px] items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          className="text-xl text-slate-600 md:hidden"
          aria-label="Menu"
        >
          ☰
        </button>

        <div>
          <p className="mb-1 text-[11px] text-slate-400">Admin Panel</p>
          <h1 className="text-lg font-semibold text-[#172033] sm:text-xl">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="relative">
          <button
            type="button"
            aria-label="Notifications"
            aria-expanded={showNotifications}
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-lg hover:bg-slate-50"
          >
            🔔
            <span className="absolute -right-1 -top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-white bg-red-500 text-[9px] text-white">
              3
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-[52px] z-50 w-[min(350px,calc(100vw-100px))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 p-4">
                <h3 className="text-sm font-semibold">Notifications</h3>
                <button
                  type="button"
                  className="text-[11px] text-blue-600 hover:text-blue-700"
                >
                  Mark all as read
                </button>
              </div>

              {[
                {
                  color: "bg-red-500",
                  title: "New complaint submitted",
                  detail: "CMP101 · Road Damage",
                  time: "10 minutes ago",
                },
                {
                  color: "bg-amber-500",
                  title: "Complaint exceeded SLA",
                  detail: "CMP099 · Water Issue",
                  time: "35 minutes ago",
                },
                {
                  color: "bg-green-600",
                  title: "Complaint resolved",
                  detail: "CMP095 · Garbage",
                  time: "1 hour ago",
                },
              ].map((notification) => (
                <div
                  key={notification.title}
                  className="flex gap-3 border-b border-slate-100 px-4 py-3"
                >
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${notification.color}`}
                  />
                  <div>
                    <strong className="block text-xs text-slate-800">
                      {notification.title}
                    </strong>
                    <p className="mt-1 text-xs text-slate-500">
                      {notification.detail}
                    </p>
                    <small className="text-[10px] text-slate-400">
                      {notification.time}
                    </small>
                  </div>
                </div>
              ))}

              <div className="p-3 text-center text-xs font-semibold text-blue-600">
                View all notifications →
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-blue-50 font-bold text-blue-600">
            A
          </div>

          <div className="hidden sm:block">
            <strong className="block text-xs text-slate-800">Admin</strong>
            <span className="mt-1 block text-[10px] text-slate-400">
              Administrator
            </span>
          </div>

          <span className="hidden text-slate-500 sm:inline">⌄</span>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;