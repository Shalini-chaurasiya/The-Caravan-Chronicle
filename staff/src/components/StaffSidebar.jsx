import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  UserRound,
  LogOut,
  Building2,
} from "lucide-react";

const StaffSidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/staff/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Complaints",
      path: "/staff/complaints",
      icon: ClipboardList,
    },
    {
      name: "My Profile",
      path: "/staff/profile",
      icon: UserRound,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("staffToken");
    localStorage.removeItem("staff");
    navigate("/staff/login");
  };

  return (
    <aside className="relative z-40 flex w-full flex-col bg-[#101c3a] text-white shadow-md md:fixed md:left-0 md:top-0 md:h-screen md:w-64 md:shadow-none">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4 sm:px-6 md:py-6">
        <div className="rounded-xl bg-blue-600 p-2">
          <Building2 size={25} />
        </div>

        <div>
          <h1 className="text-lg font-bold">Caravan Chronicle</h1>
          <p className="text-xs text-blue-200">Staff Portal</p>
        </div>
      </div>

      {/* Menu */}
      <div className="px-3 py-3 md:px-4 md:py-6">
        <p className="mb-4 hidden px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 md:block">
          Main Menu
        </p>

        <nav className="flex gap-2 overflow-x-auto md:block md:space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                aria-label={item.name}
                title={item.name}
                className={({ isActive }) =>
                  `flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition sm:text-sm md:gap-3 md:px-4 md:py-3 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="mt-auto border-t border-white/10 p-2 md:p-4">
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Logout"
          title="Logout"
          className="flex min-h-11 w-full items-center justify-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-red-500/15 hover:text-red-300 md:justify-start md:px-4 md:py-3"
        >
          <LogOut size={19} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default StaffSidebar;