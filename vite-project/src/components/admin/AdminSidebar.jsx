import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: "⌂" },
  { name: "All Complaints", path: "/admin/complaints", icon: "▤" },
  { name: "Staff Management", path: "/admin/staff", icon: "♟" },
  { name: "Departments", path: "/admin/departments", icon: "▦" },
  { name: "SLA & Escalation", path: "/admin/sla", icon: "◷" },
  { name: "Reports & Analytics", path: "/admin/reports", icon: "▥" },
  { name: "Public Portal", path: "/admin/public-portal", icon: "◎" },
  { name: "Profile", path: "/admin/profile", icon: "♙" },
];

const AdminSidebar = () => {
  return (
    <aside className="sticky top-0 z-40 flex h-screen w-[70px] shrink-0 flex-col bg-[#10233f] text-white md:w-[255px]">
      {/* Logo */}
      <div className="flex h-[82px] shrink-0 items-center justify-center gap-3 border-b border-white/10 md:justify-start md:px-[22px]">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1d72e8] text-xl">
          🏛
        </div>

        <div className="hidden md:block">
          <h2 className="text-[15px] font-bold">Municipal</h2>
          <span className="mt-1 block text-[10px] text-slate-300">
            Grievance System
          </span>
        </div>
      </div>

      {/* Main Menu */}
      <div className="hidden px-[22px] pb-2 pt-6 text-[10px] font-bold tracking-widest text-slate-400 md:block">
        MAIN MENU
      </div>

      {/* Navigation - scrollbar hidden */}
      <nav className="sidebar-scroll flex-1 space-y-1 overflow-y-auto overflow-x-hidden px-2 pt-5 md:pt-0">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            title={item.name}
            className={({ isActive }) =>
              `flex h-[46px] items-center justify-center gap-3 rounded-lg px-2 text-sm font-medium transition md:justify-start md:px-3 ${
                isActive
                  ? "bg-[#1d72e8] text-white shadow-lg shadow-blue-900/20"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <span className="w-[22px] shrink-0 text-center text-lg">
              {item.icon}
            </span>

            <span className="hidden md:inline">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="shrink-0 border-t border-white/10 px-2 py-4 md:px-3 md:py-5">
        <button
          type="button"
          title="Logout"
          className="flex h-11 w-full items-center justify-center gap-3 rounded-lg px-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white md:justify-start"
        >
          <span className="w-[22px] shrink-0 text-center text-lg">
            ↪
          </span>
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;