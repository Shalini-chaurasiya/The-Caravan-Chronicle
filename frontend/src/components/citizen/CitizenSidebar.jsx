import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  FilePlus,
  Bell,
  Search,
  LogOut,
  Building2,
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
    <aside className="flex min-h-screen w-64 flex-col bg-[#10233f] text-white shadow-lg">

      {/* =========================
          LOGO / BRAND
      ========================== */}
      <div className="flex h-[82px] items-center gap-3 border-b border-white/10 px-5">

        {/* Logo */}
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1d72e8]">
          <Building2 size={21} />
        </div>

        {/* Title */}
        <div>
          <h1 className="text-[15px] font-bold tracking-wide">
            Municipal
          </h1>

          <p className="mt-0.5 text-[10px] text-slate-400">
            Grievance System
          </p>
        </div>

      </div>

      {/* =========================
          MENU
      ========================== */}
      <nav className="flex-1 px-3 py-6">

        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[1px] text-slate-500">
          Main Menu
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
                  `group flex h-[46px] items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#1d72e8] text-white shadow-md shadow-blue-900/20"
                      : "text-slate-300 hover:bg-white/[0.07] hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      strokeWidth={isActive ? 2.4 : 2}
                    />

                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}

        </div>
      </nav>

      {/* =========================
          USER INFO
      ========================== */}
     

      {/* =========================
          LOGOUT
      ========================== */}
      <div className="border-t border-white/10 p-3">

        <button
          type="button"
          onClick={handleLogout}
          className="flex h-[46px] w-full items-center gap-3 rounded-lg px-3 text-[13px] font-medium text-slate-300 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={18} />

          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
};

export default CitizenSidebar;