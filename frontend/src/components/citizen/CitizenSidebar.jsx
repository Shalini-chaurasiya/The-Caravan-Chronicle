import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  FilePlus,
  Bell,
  Search,
  LogOut,
} from "lucide-react";

const CitizenSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/citizen/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/citizen/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Complaints",
      path: "/citizen/dashboard/complaints",
      icon: ClipboardList,
    },
    {
      name: "New Complaint",
      path: "/citizen/dashboard/new",
      icon: FilePlus,
    },
    {
      name: "Notifications",
      path: "/citizen/dashboard/notifications",
      icon: Bell,
    },
    {
      name: "Track Complaints",
      path: "/citizen/dashboard/track",
      icon: Search,
    },
  ];

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-slate-200 bg-white shadow-sm">

      {/* LOGO / TITLE */}
      <div className="border-b border-slate-200 px-6 py-5">
        <h1 className="text-xl font-bold text-blue-700">
          Citizen Portal
        </h1>

        <p className="mt-1 text-xs text-slate-500">
          Municipal Services
        </p>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-4 py-6">

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Menu
        </p>

        <div className="space-y-1">

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/citizen/dashboard"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"
                  }`
                }
              >
                <Icon size={19} />

                <span>{item.name}</span>
              </NavLink>
            );
          })}

        </div>
      </nav>

      {/* LOGOUT */}
      <div className="border-t border-slate-200 p-4">

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <LogOut size={19} />

          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
};

export default CitizenSidebar;