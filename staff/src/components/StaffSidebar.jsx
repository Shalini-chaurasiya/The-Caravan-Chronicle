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
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-[#101c3a] text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
        <div className="rounded-xl bg-blue-600 p-2">
          <Building2 size={25} />
        </div>

        <div>
          <h1 className="text-lg font-bold">Caravan Chronicle</h1>
          <p className="text-xs text-blue-200">Staff Portal</p>
        </div>
      </div>

      {/* Menu */}
      <div className="px-4 py-6">
        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Main Menu
        </p>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
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
      <div className="mt-auto border-t border-white/10 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-red-500/15 hover:text-red-300"
        >
          <LogOut size={19} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default StaffSidebar;