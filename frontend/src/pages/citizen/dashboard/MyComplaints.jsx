import React, { useEffect, useMemo, useState } from "react";
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

  // =========================
  // FILTER STATES
  // =========================
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [categoryFilter, setCategoryFilter] =
    useState("All Categories");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // =========================
  // DATA STATES
  // =========================
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // PAGINATION
  // =========================
  const [currentPage, setCurrentPage] = useState(1);

  const complaintsPerPage = 5;

  // =========================
  // FETCH COMPLAINTS
  // =========================
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login first.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/complaints/my`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log("My Complaints Response:", data);

        if (!response.ok) {
          setError(
            data.message || "Failed to fetch complaints."
          );
          return;
        }

        setComplaints(data.complaints || []);
      } catch (err) {
        console.error("Fetch complaints error:", err);

        setError(
          "Unable to connect to backend. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // =========================
  // FORMAT COMPLAINT DATA
  // =========================
  const formattedComplaints = useMemo(() => {
    return complaints.map((complaint) => {
      const createdDate = new Date(complaint.createdAt);

      return {
        id: complaint._id || "",

        title:
          complaint.complaintType || "Complaint",

        category:
          complaint.complaintType || "Other",

        description:
          complaint.description || "",

        location:
          complaint.location ||
          "Location not available",

        rawDate: complaint.createdAt,

        date: createdDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),

        time: createdDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),

        status:
          complaint.status || "Pending",
      };
    });
  }, [complaints]);

  // =========================
  // FILTER COMPLAINTS
  // =========================
  const filteredComplaints = useMemo(() => {
    return formattedComplaints.filter((complaint) => {
      const searchValue = search
        .toLowerCase()
        .trim();

      // Search filter
      const matchesSearch =
        complaint.id
          .toLowerCase()
          .includes(searchValue) ||
        complaint.title
          .toLowerCase()
          .includes(searchValue) ||
        complaint.location
          .toLowerCase()
          .includes(searchValue);

      // Status filter
      const matchesStatus =
        statusFilter === "All Status" ||
        complaint.status === statusFilter;

      // Category filter
      const matchesCategory =
        categoryFilter === "All Categories" ||
        complaint.category === categoryFilter;

      // Date filter
      const complaintDate = new Date(
        complaint.rawDate
      );

      let matchesDate = true;

      // From date
      if (fromDate) {
        const startDate = new Date(fromDate);

        startDate.setHours(
          0,
          0,
          0,
          0
        );

        matchesDate =
          complaintDate >= startDate;
      }

      // To date
      if (toDate && matchesDate) {
        const endDate = new Date(toDate);

        endDate.setHours(
          23,
          59,
          59,
          999
        );

        matchesDate =
          complaintDate <= endDate;
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory &&
        matchesDate
      );
    });
  }, [
    formattedComplaints,
    search,
    statusFilter,
    categoryFilter,
    fromDate,
    toDate,
  ]);

  // =========================
  // PAGINATION
  // =========================
  const totalPages = Math.ceil(
    filteredComplaints.length /
      complaintsPerPage
  );

  const startIndex =
    (currentPage - 1) *
    complaintsPerPage;

  const currentComplaints =
    filteredComplaints.slice(
      startIndex,
      startIndex + complaintsPerPage
    );

  // =========================
  // RESET PAGE WHEN FILTER CHANGES
  // =========================
  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
    categoryFilter,
    fromDate,
    toDate,
  ]);

  // =========================
  // VIEW DETAILS
  // =========================
  const handleViewDetails = (
    complaintId
  ) => {
    navigate(
      `/citizen/dashboard/complaints/${complaintId}`
    );
  };

  // =========================
  // STATUS COLORS
  // =========================
  const getStatusClasses = (status) => {
    switch (status) {
      case "Pending":
        return {
          container:
            "border border-amber-100 bg-amber-50 text-amber-700",
          dot: "bg-amber-500",
        };

      case "In Progress":
        return {
          container:
            "border border-blue-100 bg-blue-50 text-blue-700",
          dot: "bg-blue-600",
        };

      case "Resolved":
        return {
          container:
            "border border-green-100 bg-green-50 text-green-700",
          dot: "bg-green-600",
        };

      case "Rejected":
        return {
          container:
            "border border-red-100 bg-red-50 text-red-700",
          dot: "bg-red-600",
        };

      default:
        return {
          container:
            "border border-slate-200 bg-slate-50 text-slate-600",
          dot: "bg-slate-500",
        };
    }
  };

  // =========================
  // LOADING UI
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              My Complaints
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              View and track all the complaints you
              have submitted.
            </p>
          </div>
        </header>

        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-slate-500">
            Loading complaints...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // MAIN UI
  // =========================
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* =========================
          PAGE HEADER
      ========================= */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            My Complaints
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            View and track all the complaints you
            have submitted.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-6 lg:px-8">

        {/* =========================
            ERROR
        ========================= */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* =========================
            FILTER BOX
        ========================= */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

            {/* SEARCH */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-600">
                Search
              </label>

              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
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
                  onChange={(e) => {
                    setStatusFilter(
                      e.target.value
                    );
                  }}
                  className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option>
                    All Status
                  </option>

                  <option>
                    Pending
                  </option>

                  <option>
                    In Progress
                  </option>

                  <option>
                    Resolved
                  </option>

                  <option>
                    Rejected
                  </option>
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
                  onChange={(e) => {
                    setCategoryFilter(
                      e.target.value
                    );
                  }}
                  className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option>
                    All Categories
                  </option>

                  <option>
                    Garbage
                  </option>

                  <option>
                    Street Lights
                  </option>

                  <option>
                    Roads
                  </option>

                  <option>
                    Water Supply
                  </option>

                  <option>
                    Drainage
                  </option>

                  <option>
                    Parks
                  </option>

                  <option>
                    Stray Animals
                  </option>

                  <option>
                    Traffic
                  </option>

                  <option>
                    Construction
                  </option>

                  <option>
                    Others
                  </option>
                </select>

                <ChevronDown
                  size={17}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
              </div>
            </div>

            {/* DATE RANGE */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-600">
                Date Range
              </label>

              <div className="grid grid-cols-2 gap-2">

                {/* FROM DATE */}
                <div className="relative">
                  <CalendarDays
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => {
                      const value =
                        e.target.value;

                      setFromDate(value);

                      // If selected From Date
                      // is after To Date,
                      // clear To Date.
                      if (
                        toDate &&
                        value > toDate
                      ) {
                        setToDate("");
                      }
                    }}
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-2 text-xs text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    title="From date"
                  />
                </div>

                {/* TO DATE */}
                <div className="relative">
                  <CalendarDays
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="date"
                    value={toDate}
                    min={fromDate || undefined}
                    onChange={(e) => {
                      setToDate(
                        e.target.value
                      );
                    }}
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-2 text-xs text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    title="To date"
                  />
                </div>

              </div>

              {/* CLEAR DATE */}
              {(fromDate || toDate) && (
                <button
                  type="button"
                  onClick={() => {
                    setFromDate("");
                    setToDate("");
                  }}
                  className="mt-2 text-xs font-semibold text-blue-600 transition hover:text-blue-800"
                >
                  Clear dates
                </button>
              )}
            </div>
          </div>

          {/* FILTER BUTTON */}
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter(
                  "All Status"
                );
                setCategoryFilter(
                  "All Categories"
                );
                setFromDate("");
                setToDate("");
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
            >
              <SlidersHorizontal size={17} />

              Clear Filters
            </button>
          </div>
        </div>

        {/* =========================
            COMPLAINT TABLE
        ========================= */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* TABLE HEADER */}
          <div
            className="
              hidden
              lg:grid
              lg:grid-cols-[145px_minmax(190px,1.3fr)_minmax(240px,1.7fr)_145px_125px_125px]
              items-center
              gap-5
              border-b
              border-slate-200
              bg-slate-50
              px-6
              py-4
              text-xs
              font-bold
              uppercase
              tracking-wide
              text-slate-500
            "
          >
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

            <div className="text-center">
              Action
            </div>
          </div>

          {/* COMPLAINT ROWS */}
          {currentComplaints.length > 0 ? (
            currentComplaints.map(
              (complaint) => {
                const statusStyle =
                  getStatusClasses(
                    complaint.status
                  );

                return (
                  <div
                    key={complaint.id}
                    className="
                      grid
                      gap-5
                      border-b
                      border-slate-100
                      px-6
                      py-5
                      transition
                      last:border-b-0
                      hover:bg-slate-50
                      lg:grid-cols-[145px_minmax(190px,1.3fr)_minmax(240px,1.7fr)_145px_125px_125px]
                      lg:items-center
                    "
                  >

                    {/* COMPLAINT ID */}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase text-slate-400 lg:hidden">
                        Complaint ID
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          handleViewDetails(
                            complaint.id
                          )
                        }
                        title={complaint.id}
                        className="
                          mt-1
                          block
                          max-w-full
                          truncate
                          text-sm
                          font-bold
                          text-blue-700
                          transition
                          hover:text-blue-900
                          hover:underline
                        "
                      >
                        {complaint.id}
                      </button>
                    </div>

                    {/* DETAILS */}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase text-slate-400 lg:hidden">
                        Details
                      </p>

                      <h3 className="mt-1 truncate text-sm font-bold text-slate-900">
                        {complaint.title}
                      </h3>

                      <p className="mt-1 truncate text-xs font-medium text-slate-500">
                        {complaint.category}
                      </p>

                      {complaint.description && (
                        <p
                          title={
                            complaint.description
                          }
                          className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500"
                        >
                          {complaint.description}
                        </p>
                      )}
                    </div>

                    {/* LOCATION */}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase text-slate-400 lg:hidden">
                        Location
                      </p>

                      <div className="mt-1 flex min-w-0 items-start gap-2">
                        <MapPin
                          size={16}
                          className="mt-0.5 shrink-0 text-slate-500"
                        />

                        <span
                          title={
                            complaint.location
                          }
                          className="
                            min-w-0
                            break-words
                            text-sm
                            leading-5
                            text-slate-600
                          "
                        >
                          {complaint.location}
                        </span>
                      </div>
                    </div>

                    {/* DATE */}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase text-slate-400 lg:hidden">
                        Date Submitted
                      </p>

                      <div className="mt-1 flex items-start gap-2">
                        <CalendarDays
                          size={16}
                          className="mt-0.5 shrink-0 text-slate-500"
                        />

                        <div className="min-w-0">
                          <p className="whitespace-nowrap text-sm font-medium text-slate-700">
                            {complaint.date}
                          </p>

                          <p className="mt-0.5 whitespace-nowrap text-xs text-slate-500">
                            {complaint.time}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* STATUS */}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase text-slate-400 lg:hidden">
                        Status
                      </p>

                      <span
                        className={`
                          mt-1
                          inline-flex
                          max-w-full
                          items-center
                          gap-2
                          rounded-lg
                          px-3
                          py-2
                          text-xs
                          font-semibold
                          whitespace-nowrap
                          ${statusStyle.container}
                        `}
                      >
                        <span
                          className={`
                            h-1.5
                            w-1.5
                            shrink-0
                            rounded-full
                            ${statusStyle.dot}
                          `}
                        />

                        {complaint.status}
                      </span>
                    </div>

                    {/* ACTION */}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase text-slate-400 lg:hidden">
                        Action
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          handleViewDetails(
                            complaint.id
                          )
                        }
                        className="
                          mt-1
                          inline-flex
                          w-full
                          items-center
                          justify-center
                          gap-2
                          whitespace-nowrap
                          rounded-lg
                          border
                          border-slate-200
                          bg-white
                          px-3
                          py-2.5
                          text-xs
                          font-semibold
                          text-blue-700
                          transition
                          hover:border-blue-300
                          hover:bg-blue-50
                        "
                      >
                        View Details

                        <ChevronRight
                          size={16}
                        />
                      </button>
                    </div>
                  </div>
                );
              }
            )
          ) : (
            /* NO COMPLAINTS */
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
                Try changing your search or filter
                options.
              </p>
            </div>
          )}

          {/* =========================
              PAGINATION
          ========================= */}
          {filteredComplaints.length > 0 && (
            <div className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-xs text-slate-500">
                Showing{" "}

                <span className="font-semibold text-slate-700">
                  {startIndex + 1}
                </span>

                {" "}to{" "}

                <span className="font-semibold text-slate-700">
                  {Math.min(
                    startIndex +
                      complaintsPerPage,
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
                  disabled={
                    currentPage === 1
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.max(
                          page - 1,
                          1
                        )
                    )
                  }
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                    text-slate-600
                    transition
                    hover:bg-slate-50
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  <ChevronLeft
                    size={17}
                  />
                </button>

                {/* PAGE NUMBERS */}
                {Array.from(
                  {
                    length: totalPages,
                  },
                  (_, index) =>
                    index + 1
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() =>
                      setCurrentPage(
                        page
                      )
                    }
                    className={`
                      flex
                      h-9
                      min-w-9
                      items-center
                      justify-center
                      rounded-lg
                      px-3
                      text-sm
                      font-semibold
                      transition
                      ${
                        currentPage ===
                        page
                          ? "bg-blue-600 text-white"
                          : "border border-transparent text-slate-600 hover:bg-slate-100"
                      }
                    `}
                  >
                    {page}
                  </button>
                ))}

                {/* NEXT */}
                <button
                  type="button"
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.min(
                          page + 1,
                          totalPages
                        )
                    )
                  }
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                    text-slate-600
                    transition
                    hover:bg-slate-50
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  <ChevronRight
                    size={17}
                  />
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