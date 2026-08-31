import React, { useState } from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Bell,
  ChevronDown,
  User,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Building2,
} from "lucide-react";

const Navbar = () => {

  // =====================================================
  // STATES
  // =====================================================

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // =====================================================
  // ROUTER
  // =====================================================

  const location = useLocation();
  const navigate = useNavigate();

  // =====================================================
  // ACTIVE PAGE
  // =====================================================

  const isHome = location.pathname === "/citizen";

  const isAbout = location.pathname === "/citizen/about";

  const isContact = location.pathname === "/contact";

  // =====================================================
  // CLOSE MENUS
  // =====================================================

  const closeMenus = () => {
    setMobileOpen(false);
    setProfileOpen(false);
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    // IMPORTANT:
    // Only remove token here if you actually want logout.
    // Contact does NOT call this function.

    localStorage.removeItem("token");

    setProfileOpen(false);
    setMobileOpen(false);

    navigate("/citizen/login");
  };

  return (
    <div className="px-6 pt-3 sm:px-8 lg:px-12">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="mx-auto max-w-[1450px] overflow-visible rounded-[50px] bg-[#063b7a] text-white shadow-lg">

        {/* =====================================================
            MAIN NAVBAR
        ===================================================== */}

        <div className="flex h-20 items-center justify-between px-7 sm:px-10 lg:px-12">

          {/* =================================================
              LOGO
          ================================================== */}

          <Link
            to="/citizen"
            onClick={closeMenus}
            className="flex items-center gap-3"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
              <Building2 size={25} />
            </div>

            <div>

              <h1 className="text-lg font-bold tracking-wide">
                Municipal Services
              </h1>

              <p className="mt-0.5 text-[11px] text-blue-100">
                Grievance Management System
              </p>

            </div>

          </Link>


          {/* =================================================
              DESKTOP NAVIGATION
          ================================================== */}

          <div className="hidden items-center gap-2 md:flex">

            {/* ================= HOME ================= */}

            <Link
              to="/citizen"
              className={`rounded-xl px-6 py-2.5 text-sm font-semibold transition ${
                isHome
                  ? "bg-white/15 text-white"
                  : "text-blue-100 hover:bg-white/10 hover:text-white"
              }`}
            >
              Home
            </Link>


            {/* ================= ABOUT ================= */}

            <Link
              to="/citizen/about"
              className={`rounded-xl px-6 py-2.5 text-sm font-medium transition ${
                isAbout
                  ? "bg-white/15 text-white"
                  : "text-blue-100 hover:bg-white/10 hover:text-white"
              }`}
            >
              About
            </Link>


            {/* ================= CONTACT ================= */}

            <Link
              to="/contact"
              onClick={closeMenus}
              className={`rounded-xl px-6 py-2.5 text-sm font-medium transition ${
                isContact
                  ? "bg-white/15 text-white"
                  : "text-blue-100 hover:bg-white/10 hover:text-white"
              }`}
            >
              Contact
            </Link>

          </div>


          {/* =================================================
              RIGHT SIDE
          ================================================== */}

          <div className="hidden items-center gap-4 md:flex">

            {/* ================= NOTIFICATION ================= */}

            <button
              type="button"
              className="relative flex h-11 w-11 items-center justify-center rounded-xl text-blue-100 transition hover:bg-white/10 hover:text-white"
              title="Notifications"
            >

              <Bell size={21} />

              <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-[#063b7a]">
                3
              </span>

            </button>


            {/* ================= DIVIDER ================= */}

            <div className="h-8 w-px bg-white/15" />


            {/* ================= PROFILE ================= */}

            <div className="relative">

              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 rounded-2xl px-2.5 py-1.5 transition hover:bg-white/10"
              >

                <img
                  src="https://i.pravatar.cc/100?img=47"
                  alt="Profile"
                  className="h-10 w-10 rounded-full border-2 border-white/80 object-cover"
                />

                <div className="hidden text-left lg:block">

                  <p className="text-sm font-semibold">
                    Citizen
                  </p>

                  <p className="mt-0.5 text-[10px] text-blue-200">
                    Citizen Account
                  </p>

                </div>

                <ChevronDown
                  size={17}
                  className={`transition-transform duration-200 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />

              </button>


              {/* ================= DROPDOWN ================= */}

              {profileOpen && (

                <div className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white text-gray-700 shadow-2xl">

                  {/* Profile Header */}

                  <div className="border-b border-slate-100 bg-slate-50 px-4 py-4">

                    <div className="flex items-center gap-3">

                      <img
                        src="https://i.pravatar.cc/100?img=47"
                        alt="Profile"
                        className="h-11 w-11 rounded-full object-cover"
                      />

                      <div>

                        <p className="font-semibold text-slate-900">
                          Citizen
                        </p>

                        <p className="text-xs text-slate-500">
                          Citizen Account
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* Options */}

                  <div className="p-2">

                    {/* Profile */}

                    <button
                      type="button"
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition hover:bg-slate-100"
                    >

                      <User
                        size={18}
                        className="text-slate-500"
                      />

                      Profile

                    </button>


                    {/* Dashboard */}

                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/citizen/dashboard");
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition hover:bg-slate-100"
                    >

                      <LayoutDashboard
                        size={18}
                        className="text-slate-500"
                      />

                      Dashboard

                    </button>

                  </div>


                  {/* Logout */}

                  <div className="border-t border-slate-100 p-2">

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >

                      <LogOut size={18} />

                      Logout

                    </button>

                  </div>

                </div>

              )}

            </div>

          </div>


          {/* =================================================
              MOBILE BUTTON
          ================================================== */}

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-xl transition hover:bg-white/10 md:hidden"
          >

            {mobileOpen ? (
              <X size={26} />
            ) : (
              <Menu size={26} />
            )}

          </button>

        </div>


        {/* =====================================================
            MOBILE MENU
        ====================================================== */}

        {mobileOpen && (

          <div className="rounded-b-[28px] border-t border-white/10 bg-[#052f62] px-6 py-5 md:hidden">

            <div className="flex flex-col gap-2">

              {/* ================= HOME ================= */}

              <Link
                to="/citizen"
                onClick={closeMenus}
                className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                  isHome
                    ? "bg-white/10 text-white"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                Home
              </Link>


              {/* ================= ABOUT ================= */}

              <Link
                to="/citizen/about"
                onClick={closeMenus}
                className={`rounded-xl px-4 py-3 text-sm font-medium ${
                  isAbout
                    ? "bg-white/10 text-white"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                About
              </Link>


              {/* ================= CONTACT ================= */}

              <Link
                to="/contact"
                onClick={closeMenus}
                className={`rounded-xl px-4 py-3 text-sm font-medium ${
                  isContact
                    ? "bg-white/10 text-white"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                Contact
              </Link>


              {/* ================= DIVIDER ================= */}

              <div className="my-2 h-px bg-white/10" />


              {/* ================= NOTIFICATIONS ================= */}

              <button
                type="button"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-blue-100 hover:bg-white/10"
              >

                <Bell size={19} />

                Notifications

                <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold">
                  3
                </span>

              </button>


              {/* ================= PROFILE ================= */}

              <button
                type="button"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-blue-100 hover:bg-white/10"
              >

                <User size={19} />

                Profile

              </button>


              {/* ================= DASHBOARD ================= */}

              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/citizen/dashboard");
                }}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-blue-100 hover:bg-white/10"
              >

                <LayoutDashboard size={19} />

                Dashboard

              </button>


              {/* ================= LOGOUT ================= */}

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-300 hover:bg-red-500/10"
              >

                <LogOut size={19} />

                Logout

              </button>

            </div>

          </div>

        )}

      </nav>

    </div>
  );
};

export default Navbar;