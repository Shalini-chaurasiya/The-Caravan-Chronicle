import NotificationDropdown from "./NotificationDropdown";

const AdminNavbar = ({ title = "Dashboard", enableNotificationPopup = false }) => {
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
        <NotificationDropdown enablePopup={enableNotificationPopup} />

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