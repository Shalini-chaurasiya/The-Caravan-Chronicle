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
  // GET USER DETAILS
  // =====================================================

  /*
    We try different localStorage keys because your
    login/register code may store the user differently.
  */

  const getUserDetails = () => {
    try {
      const storedUser =
        localStorage.getItem("user") ||
        localStorage.getItem("currentUser") ||
        localStorage.getItem("userData");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        return {
          name:
            parsedUser.name ||
            parsedUser.fullName ||
            parsedUser.username ||
            parsedUser.firstName ||
            "Citizen",

          email: parsedUser.email || "",
        };
      }
    } catch (error) {
      console.error("Error reading user data:", error);
    }

    // Fallback if user data is stored directly
    const name =
      localStorage.getItem("name") ||
      localStorage.getItem("fullName") ||
      localStorage.getItem("username") ||
      "Citizen";

    const email = localStorage.getItem("email") || "";

    return {
      name,
      email,
    };
  };

  const user = getUserDetails();

  // =====================================================
  // FIRST LETTER OF USER NAME
  // =====================================================

  const getInitial = (name) => {
    if (!name) return "C";

    return name.trim().charAt(0).toUpperCase();
  };

  const userInitial = getInitial(user.name);

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
    // Remove authentication token
    localStorage.removeItem("token");

    // Remove stored user information
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userData");

    localStorage.removeItem("name");
    localStorage.removeItem("fullName");
    localStorage.removeItem("username");
    localStorage.removeItem("email");

    setProfileOpen(false);
    setMobileOpen(false);

    navigate("/citizen/login");
  };

  // =====================================================
  // PROFILE INITIAL COMPONENT
  // =====================================================

  const ProfileInitial = ({ size = "h-10 w-10" }) => {
    return (
      <div
        className={`${size} flex items-center justify-center rounded-full border-2 border-white/80 bg-white text-lg font-bold text-[#063b7a]`}
      >
        {userInitial}
      </div>
    );
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
              onClick={closeMenus}
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
              onClick={closeMenus}
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

                {/* USER FIRST LETTER */}

                <ProfileInitial />

                <div className="hidden text-left lg:block">

                  

                 

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

                      {/* USER FIRST LETTER */}

                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#063b7a] text-lg font-bold text-white">
                        {userInitial}
                      </div>

                      <div>

                        <p className="font-semibold text-slate-900">
                          {user.name}
                        </p>

                        <p className="text-xs text-slate-500">
                          {user.email || "Citizen Account"}
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* Options */}

                  <div className="p-2">

                    {/* ================= PROFILE ================= */}

                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/citizen/profile");
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition hover:bg-slate-100"
                    >

                      <User
                        size={18}
                        className="text-slate-500"
                      />

                      Profile

                    </button>


                    {/* ================= DASHBOARD ================= */}

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


                  {/* ================= LOGOUT ================= */}

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

              {/* ================= USER INFO ================= */}

              <div className="mb-2 flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-lg font-bold text-[#063b7a]">
                  {userInitial}
                </div>

                <div>

                  <p className="text-sm font-semibold text-white">
                    {user.name}
                  </p>

                  <p className="text-xs text-blue-200">
                    Citizen Account
                  </p>

                </div>

              </div>


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
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/citizen/profile");
                }}
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