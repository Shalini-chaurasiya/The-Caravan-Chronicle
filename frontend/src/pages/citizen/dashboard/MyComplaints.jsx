import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  CalendarDays,
  MapPin,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
  ClipboardList,
} from "lucide-react";

const MyComplaints = () => {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [categoryFilter, setCategoryFilter] =
    useState("All Categories");
  const [currentPage, setCurrentPage] = useState(1);

  const complaintsPerPage = 5;

  // =====================================================
  // COMPLAINT DATA
  // =====================================================

  const complaints = [
    {
      id: "CMP-2026-00124",
      title: "Garbage not collected",
      category: "Garbage",
      description:
        "Garbage has not been collected from our locality for several days.",
      location: "Civil Lines, Prayagraj",
      date: "02 Sep 2026",
      time: "10:30 AM",
      status: "Pending",
    },
    {
      id: "CMP-2026-00118",
      title: "Street light not working",
      category: "Street Lights",
      description:
        "Street light near the main road has stopped working.",
      location: "George Town, Prayagraj",
      date: "30 Aug 2026",
      time: "08:15 PM",
      status: "In Progress",
    },
    {
      id: "CMP-2026-00105",
      title: "Water supply issue",
      category: "Water Supply",
      description:
        "There is no water supply in our area during the morning.",
      location: "Tagore Town, Prayagraj",
      date: "25 Aug 2026",
      time: "09:45 AM",
      status: "Resolved",
    },
    {
      id: "CMP-2026-00097",
      title: "Road damage",
      category: "Roads",
      description:
        "Large potholes have developed on the main road.",
      location: "Katra, Prayagraj",
      date: "20 Aug 2026",
      time: "04:20 PM",
      status: "In Progress",
    },
    {
      id: "CMP-2026-00081",
      title: "Drainage blockage",
      category: "Drainage",
      description:
        "Drainage water is overflowing near residential buildings.",
      location: "Naini, Prayagraj",
      date: "15 Aug 2026",
      time: "11:10 AM",
      status: "Resolved",
    },
    {
      id: "CMP-2026-00072",
      title: "Park maintenance issue",
      category: "Parks",
      description:
        "The park requires cleaning and regular maintenance.",
      location: "Civil Lines, Prayagraj",
      date: "12 Aug 2026",
      time: "09:30 AM",
      status: "Pending",
    },
    {
      id: "CMP-2026-00065",
      title: "Stray animals issue",
      category: "Stray Animals",
      description:
        "Several stray animals are creating problems near the residential area.",
      location: "Ashok Nagar, Prayagraj",
      date: "10 Aug 2026",
      time: "06:20 PM",
      status: "In Progress",
    },
  ];

  // =====================================================
  // FILTER COMPLAINTS
  // =====================================================

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        complaint.id.toLowerCase().includes(searchValue) ||
        complaint.title.toLowerCase().includes(searchValue) ||
        complaint.location.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All Status" ||
        complaint.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All Categories" ||
        complaint.category === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [search, statusFilter, categoryFilter]);

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.ceil(
    filteredComplaints.length / complaintsPerPage
  );

  const startIndex =
    (currentPage - 1) * complaintsPerPage;

  const currentComplaints = filteredComplaints.slice(
    startIndex,
    startIndex + complaintsPerPage
  );

  // =====================================================
  // VIEW DETAILS
  // =====================================================

  const handleViewDetails = (complaintId) => {
    navigate(
      `/citizen/dashboard/complaints/${complaintId}`
    );
  };

  // =====================================================
  // FILTER CHANGE
  // =====================================================

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(1);
  };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* =================================================
          TOP HEADER
      ================================================= */}

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            My Complaints
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            View and track all the complaints you have submitted.
          </p>

        </div>

      </header>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="mx-auto max-w-7xl px-6 py-6 lg:px-8">

        {/* =================================================
            FILTER SECTION
        ================================================= */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="grid gap-4 lg:grid-cols-4">

            {/* SEARCH */}

            <div>

              <label className="mb-2 block text-xs font-semibold text-slate-600">
                Search
              </label>

              <div className="relative">

                <Search
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Search by ID, title or location..."
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

            </div>

            {/* STATUS */}

            <div>

              <label className="mb-2 block text-xs font-semibold text-slate-600">
                Status
              </label>

              <div className="relative">

                <select
                  value={statusFilter}
                  onChange={handleStatusChange}
                  className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>

                <ChevronDown
                  size={17}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

              </div>

            </div>

            {/* CATEGORY */}

            <div>

              <label className="mb-2 block text-xs font-semibold text-slate-600">
                Category
              </label>

              <div className="relative">

                <select
                  value={categoryFilter}
                  onChange={handleCategoryChange}
                  className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option>All Categories</option>
                  <option>Garbage</option>
                  <option>Street Lights</option>
                  <option>Roads</option>
                  <option>Water Supply</option>
                  <option>Drainage</option>
                  <option>Parks</option>
                  <option>Stray Animals</option>
                  <option>Traffic</option>
                  <option>Construction</option>
                  <option>Other</option>
                </select>

                <ChevronDown
                  size={17}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

              </div>

            </div>

            {/* DATE */}

            <div>

              <label className="mb-2 block text-xs font-semibold text-slate-600">
                Date Range
              </label>

              <button
                type="button"
                className="flex h-11 w-full items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 text-left text-sm text-slate-500 transition hover:border-blue-300"
              >
                <CalendarDays size={18} />
                Select Date Range
              </button>

            </div>

          </div>

          {/* FILTER BUTTON */}

          <div className="mt-4 flex justify-end">

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
            >
              <SlidersHorizontal size={17} />
              Filters
            </button>

          </div>

        </div>

        {/* =================================================
            COMPLAINT TABLE
        ================================================= */}

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* TABLE HEADER */}

          <div className="hidden grid-cols-[150px_1.7fr_1fr_150px_140px_140px] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500 lg:grid">

            <div>
              Complaint ID
            </div>

            <div>
              Details
            </div>

            <div>
              Location
            </div>

            <div>
              Date Submitted
            </div>

            <div>
              Status
            </div>

            <div>
              Action
            </div>

          </div>

          {/* =================================================
              TABLE ROWS
          ================================================= */}

          {currentComplaints.length > 0 ? (

            currentComplaints.map((complaint) => (

              <div
                key={complaint.id}
                className="grid gap-4 border-b border-slate-100 px-5 py-5 transition last:border-b-0 hover:bg-slate-50 lg:grid-cols-[150px_1.7fr_1fr_150px_140px_140px] lg:items-center"
              >

                {/* COMPLAINT ID */}

                <div>

                  <p className="text-xs font-semibold uppercase text-slate-400 lg:hidden">
                    Complaint ID
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      handleViewDetails(complaint.id)
                    }
                    className="mt-1 text-sm font-bold text-blue-700 transition hover:text-blue-900 hover:underline"
                  >
                    {complaint.id}
                  </button>

                </div>

                {/* DETAILS */}

                <div>

                  <p className="text-xs font-semibold uppercase text-slate-400 lg:hidden">
                    Details
                  </p>

                  <h3 className="mt-1 text-sm font-bold text-slate-900">
                    {complaint.title}
                  </h3>

                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {complaint.category}
                  </p>

                  <p className="mt-1 line-clamp-1 text-xs leading-5 text-slate-500">
                    {complaint.description}
                  </p>

                </div>

                {/* LOCATION */}

                <div>

                  <p className="text-xs font-semibold uppercase text-slate-400 lg:hidden">
                    Location
                  </p>

                  <div className="mt-1 flex items-start gap-2">

                    <MapPin
                      size={16}
                      className="mt-0.5 shrink-0 text-slate-500"
                    />

                    <span className="text-sm leading-5 text-slate-600">
                      {complaint.location}
                    </span>

                  </div>

                </div>

                {/* DATE */}

                <div>

                  <p className="text-xs font-semibold uppercase text-slate-400 lg:hidden">
                    Date Submitted
                  </p>

                  <div className="mt-1 flex items-start gap-2">

                    <CalendarDays
                      size={16}
                      className="mt-0.5 shrink-0 text-slate-500"
                    />

                    <div>

                      <p className="text-sm font-medium text-slate-700">
                        {complaint.date}
                      </p>

                      <p className="text-xs text-slate-500">
                        {complaint.time}
                      </p>

                    </div>

                  </div>

                </div>

                {/* STATUS */}

                <div>

                  <p className="text-xs font-semibold uppercase text-slate-400 lg:hidden">
                    Status
                  </p>

                  <span
                    className={`mt-1 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${
                      complaint.status === "Pending"
                        ? "border border-amber-100 bg-amber-50 text-amber-700"
                        : complaint.status === "In Progress"
                        ? "border border-blue-100 bg-blue-50 text-blue-700"
                        : "border border-green-100 bg-green-50 text-green-700"
                    }`}
                  >

                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        complaint.status === "Pending"
                          ? "bg-amber-500"
                          : complaint.status === "In Progress"
                          ? "bg-blue-600"
                          : "bg-green-600"
                      }`}
                    />

                    {complaint.status}

                  </span>

                </div>

                {/* ACTION */}

                <div>

                  <p className="text-xs font-semibold uppercase text-slate-400 lg:hidden">
                    Action
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      handleViewDetails(complaint.id)
                    }
                    className="mt-1 inline-flex w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50 lg:w-auto"
                  >
                    View Details

                    <ChevronRight size={17} />

                  </button>

                </div>

              </div>

            ))

          ) : (

            /* =================================================
               EMPTY STATE
            ================================================= */

            <div className="px-6 py-16 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">

                <ClipboardList
                  size={26}
                  className="text-slate-400"
                />

              </div>

              <h3 className="mt-4 text-base font-bold text-slate-900">
                No complaints found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filter options.
              </p>

            </div>

          )}

          {/* =================================================
              PAGINATION
          ================================================= */}

          {filteredComplaints.length > 0 && (

            <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-xs text-slate-500">

                Showing{" "}

                <span className="font-semibold text-slate-700">
                  {startIndex + 1}
                </span>

                {" "}to{" "}

                <span className="font-semibold text-slate-700">
                  {Math.min(
                    startIndex + complaintsPerPage,
                    filteredComplaints.length
                  )}
                </span>

                {" "}of{" "}

                <span className="font-semibold text-slate-700">
                  {filteredComplaints.length}
                </span>

                {" "}complaints

              </p>

              <div className="flex items-center gap-2">

                {/* PREVIOUS */}

                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.max(page - 1, 1)
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={17} />
                </button>

                {/* PAGE NUMBERS */}

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (

                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-semibold transition ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "border border-transparent text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {page}
                  </button>

                ))}

                {/* NEXT */}

                <button
                  type="button"
                  disabled={
                    currentPage === totalPages
                  }
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(page + 1, totalPages)
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight size={17} />
                </button>

              </div>

            </div>

          )}

        </div>

      </main>

    </div>
  );
};

export default MyComplaints;