import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import {
  FileEdit,
  Search,
  ClipboardList,
  Trash2,
  Lightbulb,
  Construction,
  Droplets,
  Trees,
  Dog,
  TrafficCone,
  Route,
  MoreHorizontal,
  Users,
  Settings,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

import cityHero from "../../assets/city-hero.png";

const CitizenHome = () => {
  const categories = [
    {
      name: "Garbage",
      icon: Trash2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      name: "Street Lights",
      icon: Lightbulb,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      name: "Roads",
      icon: Route,
      color: "text-slate-700",
      bg: "bg-slate-50",
    },
    {
      name: "Water Supply",
      icon: Droplets,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      name: "Drainage",
      icon: Construction,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      name: "Parks",
      icon: Trees,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      name: "Stray Animals",
      icon: Dog,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      name: "Traffic",
      icon: TrafficCone,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      name: "Construction",
      icon: Construction,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      name: "Other",
      icon: MoreHorizontal,
      color: "text-slate-500",
      bg: "bg-slate-100",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800">

      {/* ================= NAVBAR ================= */}
      <Navbar />


      {/* ================= HERO ================= */}
      <section
        id="home"
        className="border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-blue-50"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-6 px-6 py-8 lg:grid-cols-2 lg:px-8 lg:py-10">

          {/* LEFT */}
          <div className="max-w-xl">

            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-blue-700">
              Citizen Portal
            </p>

            <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 md:text-4xl">
              Welcome back, Citizen!
            </h1>

            <div className="mt-3 h-1 w-12 rounded-full bg-blue-700"></div>

            <h2 className="mt-4 text-xl font-bold leading-snug text-blue-800 md:text-2xl">
              Report local issues.
              <br />
              Track your complaints.
              <br />
              Make your city better.
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600">
              Have you noticed a problem in your area? Report it to the
              municipality and keep track of its progress from submission
              to resolution.
            </p>


            {/* BUTTONS */}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">

              <Link
                to="/citizen/complaints/new"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
              >
                <FileEdit size={18} />
                Report an Issue
              </Link>

              <Link
                to="/citizen/complaints/track"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-700 bg-white px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                <Search size={18} />
                Track My Complaints
              </Link>

            </div>


            {/* TRUST POINTS */}
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">

              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <CheckCircle2
                  size={18}
                  className="text-blue-700"
                />
                Secure & Reliable
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <Search
                  size={18}
                  className="text-blue-700"
                />
                Location Based
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <Settings
                  size={18}
                  className="text-blue-700"
                />
                Municipal Services
              </div>

            </div>

          </div>


          {/* RIGHT IMAGE */}
          <div className="flex items-center justify-center">

            <div className="w-full max-w-xl overflow-hidden rounded-2xl">

              <img
                src={cityHero}
                alt="Municipal city services"
                className="h-auto w-full object-contain"
              />

            </div>

          </div>

        </div>
      </section>


      {/* ================= QUICK ACTIONS ================= */}
      <section className="mx-auto max-w-7xl px-6 py-7 lg:px-8">

        <div className="mb-4">

          <h2 className="text-lg font-bold uppercase tracking-wide text-slate-900">
            Quick Actions
          </h2>

        </div>


        <div className="grid gap-4 md:grid-cols-3">

          {/* Submit */}
          <Link
            to="/citizen/complaints/new"
            className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-green-300 hover:shadow-md"
          >

            <div className="flex items-start gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-50">
                <FileEdit
                  size={27}
                  className="text-green-700"
                />
              </div>

              <div>

                <h3 className="text-base font-bold text-green-700">
                  Submit a Complaint
                </h3>

                <p className="mt-1.5 text-sm leading-5 text-slate-600">
                  Report issues such as garbage, roads, streetlights,
                  water supply, drainage and more.
                </p>

                <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-green-700">
                  Submit Complaint
                  <ArrowRight size={16} />
                </div>

              </div>

            </div>

          </Link>


          {/* Track */}
          <Link
            to="/citizen/complaints/track"
            className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
          >

            <div className="flex items-start gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-50">
                <Search
                  size={27}
                  className="text-blue-700"
                />
              </div>

              <div>

                <h3 className="text-base font-bold text-blue-700">
                  Track a Complaint
                </h3>

                <p className="mt-1.5 text-sm leading-5 text-slate-600">
                  Check the current status of your submitted complaints
                  and view updates.
                </p>

                <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-blue-700">
                  Track Complaints
                  <ArrowRight size={16} />
                </div>

              </div>

            </div>

          </Link>


          {/* My Complaints */}
          <Link
            to="/citizen/complaints"
            className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-purple-300 hover:shadow-md"
          >

            <div className="flex items-start gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-purple-50">
                <ClipboardList
                  size={27}
                  className="text-purple-700"
                />
              </div>

              <div>

                <h3 className="text-base font-bold text-purple-700">
                  My Complaints
                </h3>

                <p className="mt-1.5 text-sm leading-5 text-slate-600">
                  View your complete complaint history including
                  resolved and pending complaints.
                </p>

                <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-purple-700">
                  View History
                  <ArrowRight size={16} />
                </div>

              </div>

            </div>

          </Link>

        </div>

      </section>


      {/* ================= COMPLAINT CATEGORIES ================= */}
      <section
        id="complaints"
        className="mx-auto max-w-7xl px-6 pb-7 lg:px-8"
      >

        <div className="mb-4">

          <h2 className="text-lg font-bold uppercase tracking-wide text-slate-900">
            Complaint Categories
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Select a category when reporting a municipal issue.
          </p>

        </div>


        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">

          {categories.map((category) => {

            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                to={`/citizen/complaints/new?category=${encodeURIComponent(
                  category.name
                )}`}
                className="group flex min-h-[105px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
              >

                <div
                  className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full ${category.bg}`}
                >
                  <Icon
                    size={22}
                    strokeWidth={2}
                    className={category.color}
                  />
                </div>

                <span className="text-center text-xs font-semibold text-slate-700 group-hover:text-blue-700">
                  {category.name}
                </span>

              </Link>
            );

          })}

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section className="mx-auto max-w-7xl px-6 pb-8 lg:px-8">

        <div className="mb-4">

          <h2 className="text-lg font-bold uppercase tracking-wide text-slate-900">
            How It Works
          </h2>

        </div>


        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 md:p-6">

          <div className="grid gap-5 md:grid-cols-4">

            {/* STEP 1 */}
            <div className="flex gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
                <FileEdit
                  size={21}
                  className="text-blue-700"
                />
              </div>

              <div>

                <div className="mb-1 flex items-center gap-2">

                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-700 text-[10px] font-bold text-white">
                    1
                  </span>

                  <h3 className="text-sm font-bold text-slate-900">
                    Report
                  </h3>

                </div>

                <p className="text-xs leading-5 text-slate-600">
                  Submit a complaint with details and location.
                </p>

              </div>

            </div>


            {/* STEP 2 */}
            <div className="flex gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
                <Users
                  size={21}
                  className="text-blue-700"
                />
              </div>

              <div>

                <div className="mb-1 flex items-center gap-2">

                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-700 text-[10px] font-bold text-white">
                    2
                  </span>

                  <h3 className="text-sm font-bold text-slate-900">
                    Assigned
                  </h3>

                </div>

                <p className="text-xs leading-5 text-slate-600">
                  Your complaint is assigned to the concerned department.
                </p>

              </div>

            </div>


            {/* STEP 3 */}
            <div className="flex gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
                <Settings
                  size={21}
                  className="text-blue-700"
                />
              </div>

              <div>

                <div className="mb-1 flex items-center gap-2">

                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-700 text-[10px] font-bold text-white">
                    3
                  </span>

                  <h3 className="text-sm font-bold text-slate-900">
                    In Progress
                  </h3>

                </div>

                <p className="text-xs leading-5 text-slate-600">
                  The department works on resolving the issue.
                </p>

              </div>

            </div>


            {/* STEP 4 */}
            <div className="flex gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2
                  size={21}
                  className="text-green-700"
                />
              </div>

              <div>

                <div className="mb-1 flex items-center gap-2">

                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-700 text-[10px] font-bold text-white">
                    4
                  </span>

                  <h3 className="text-sm font-bold text-slate-900">
                    Resolved
                  </h3>

                </div>

                <p className="text-xs leading-5 text-slate-600">
                  The issue is resolved and the complaint is closed.
                </p>

              </div>

            </div>

          </div>


          <p className="mt-5 text-center text-xs text-slate-500">
            Report a problem in a few simple steps and follow its progress
            until it is resolved.
          </p>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <Footer />

    </div>
  );
};

export default CitizenHome;