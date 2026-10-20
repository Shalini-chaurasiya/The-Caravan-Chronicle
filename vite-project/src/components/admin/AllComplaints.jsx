
import React, { useMemo, useState } from "react";

// ==========================================
// DEFAULT STAFF RECORDS
// ==========================================

const defaultStaff = [
  {
    _id: "staff-1",
    staffId: "STF-1001",
    name: "Amit Kumar",
    department: "Roads & Infrastructure",
    role: "Field Officer",
    status: "Active",
  },
  {
    _id: "staff-2",
    staffId: "STF-1002",
    name: "Priya Singh",
    department: "Electrical",
    role: "Electrical Officer",
    status: "Active",
  },
  {
    _id: "staff-3",
    staffId: "STF-1003",
    name: "Rahul Verma",
    department: "Water Supply",
    role: "Water Supply Officer",
    status: "Active",
  },
  {
    _id: "staff-4",
    staffId: "STF-1004",
    name: "Neha Sharma",
    department: "Sanitation",
    role: "Sanitation Officer",
    status: "Active",
  },
  {
    _id: "staff-5",
    staffId: "STF-1005",
    name: "Vivek Yadav",
    department: "Roads & Infrastructure",
    role: "Field Officer",
    status: "Active",
  },
];

// ==========================================
// DEFAULT COMPLAINT RECORDS
// ==========================================

const defaultComplaints = [
  {
    _id: "complaint-1",
    complaintId: "CMP-2026-001",
    citizenName: "Rahul Sharma",
    email: "rahul@example.com",

    title: "Road Damage Near Main Market",

    description:
      "The road near the main market has several potholes and needs immediate repair.",

    complaintType: "Road Damage",

    department: "Roads & Infrastructure",

    priority: "High",

    status: "Pending",

    assignedStaff: null,

    complaintImage:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",

    location: {
      address: "Main Market, Lucknow",
      latitude: 26.8467,
      longitude: 80.9462,
    },

    createdAt: "2026-10-18",
  },

  {
    _id: "complaint-2",
    complaintId: "CMP-2026-002",
    citizenName: "Priya Verma",
    email: "priya@example.com",

    title: "Street Light Not Working",

    description:
      "The street light near Block B has not been working for the last few days.",

    complaintType: "Street Light",

    department: "Electrical",

    priority: "Medium",

    status: "In Progress",

    assignedStaff: defaultStaff[1],

    complaintImage:
      "https://images.unsplash.com/photo-1496715976403-7e36dc43f17b?auto=format&fit=crop&w=900&q=80",

    location: {
      address: "Block B, Gomti Nagar, Lucknow",
      latitude: 26.8519,
      longitude: 81.0078,
    },

    createdAt: "2026-10-17",
  },

  {
    _id: "complaint-3",
    complaintId: "CMP-2026-003",
    citizenName: "Aman Gupta",
    email: "aman@example.com",

    title: "Water Supply Problem",

    description:
      "There has been irregular water supply in our locality for the last three days.",

    complaintType: "Water Supply",

    department: "Water Supply",

    priority: "High",

    status: "Pending",

    assignedStaff: null,

    complaintImage:
      "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=900&q=80",

    location: {
      address: "Indira Nagar, Lucknow",
      latitude: 26.8718,
      longitude: 81.0076,
    },

    createdAt: "2026-10-16",
  },

  {
    _id: "complaint-4",
    complaintId: "CMP-2026-004",
    citizenName: "Sneha Singh",
    email: "sneha@example.com",

    title: "Garbage Not Collected",

    description:
      "Garbage has not been collected from our area for several days.",

    complaintType: "Garbage Collection",

    department: "Sanitation",

    priority: "Medium",

    status: "Resolved",

    assignedStaff: defaultStaff[3],

    complaintImage:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=900&q=80",

    location: {
      address: "Aliganj, Lucknow",
      latitude: 26.886,
      longitude: 80.9462,
    },

    createdAt: "2026-10-15",
  },

  {
    _id: "complaint-5",
    complaintId: "CMP-2026-005",
    citizenName: "Vikas Mishra",
    email: "vikas@example.com",

    title: "Large Pothole on Residential Road",

    description:
      "A large pothole is causing problems for vehicles and pedestrians.",

    complaintType: "Road Damage",

    department: "Roads & Infrastructure",

    priority: "High",

    status: "In Progress",

    assignedStaff: defaultStaff[0],

    complaintImage:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80",

    location: {
      address: "Hazratganj, Lucknow",
      latitude: 26.8501,
      longitude: 80.9496,
    },

    createdAt: "2026-10-14",
  },

  {
    _id: "complaint-6",
    complaintId: "CMP-2026-006",
    citizenName: "Kavita Gupta",
    email: "kavita@example.com",

    title: "Broken Street Light",

    description:
      "The street light outside the community park is broken.",

    complaintType: "Street Light",

    department: "Electrical",

    priority: "Low",

    status: "Rejected",

    assignedStaff: null,

    complaintImage:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80",

    location: {
      address: "Mahanagar, Lucknow",
      latitude: 26.885,
      longitude: 80.958,
    },

    createdAt: "2026-10-13",
  },

  {
    _id: "complaint-7",
    complaintId: "CMP-2026-007",
    citizenName: "Arjun Singh",
    email: "arjun@example.com",

    title: "Drainage Overflow",

    description:
      "The drainage system is overflowing during rainfall and needs attention.",

    complaintType: "Drainage",

    department: "Sanitation",

    priority: "High",

    status: "Pending",

    assignedStaff: null,

    complaintImage:
      "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=900&q=80",

    location: {
      address: "Jankipuram, Lucknow",
      latitude: 26.914,
      longitude: 80.953,
    },

    createdAt: "2026-10-12",
  },

  {
    _id: "complaint-8",
    complaintId: "CMP-2026-008",
    citizenName: "Meena Devi",
    email: "meena@example.com",

    title: "Water Pipeline Leakage",

    description:
      "There is a leakage in the main water pipeline near the colony.",

    complaintType: "Water Supply",

    department: "Water Supply",

    priority: "High",

    status: "Resolved",

    assignedStaff: defaultStaff[2],

    complaintImage:
      "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=900&q=80",

    location: {
      address: "Gomti Nagar Extension, Lucknow",
      latitude: 26.827,
      longitude: 81.02,
    },

    createdAt: "2026-10-11",
  },
];

// ==========================================
// MAIN COMPONENT
// ==========================================

const AllComplaints = () => {
  const [complaints, setComplaints] =
    useState(defaultComplaints);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("");

  const [departmentFilter, setDepartmentFilter] =
    useState("");

  const [priorityFilter, setPriorityFilter] =
    useState("");

  const [selectedComplaint, setSelectedComplaint] =
    useState(null);

  const [showDetailsModal, setShowDetailsModal] =
    useState(false);

  const [showAssignModal, setShowAssignModal] =
    useState(false);

  const [selectedStaff, setSelectedStaff] =
    useState("");

  // ==========================================
  // STATISTICS
  // ==========================================

  const total = complaints.length;

  const pending = complaints.filter(
    (complaint) => complaint.status === "Pending"
  ).length;

  const inProgress = complaints.filter(
    (complaint) =>
      complaint.status === "In Progress"
  ).length;

  const resolved = complaints.filter(
    (complaint) =>
      complaint.status === "Resolved"
  ).length;

  const rejected = complaints.filter(
    (complaint) =>
      complaint.status === "Rejected"
  ).length;

  const unassigned = complaints.filter(
    (complaint) =>
      !complaint.assignedStaff
  ).length;

  // ==========================================
  // DEPARTMENTS
  // ==========================================

  const departments = [
    ...new Set(
      complaints
        .map(
          (complaint) =>
            complaint.department
        )
        .filter(Boolean)
    ),
  ];

  // ==========================================
  // FILTER COMPLAINTS
  // ==========================================

  const filteredComplaints = useMemo(() => {
    const term = search
      .toLowerCase()
      .trim();

    return complaints.filter(
      (complaint) => {

        const matchesSearch =
          !term ||
          complaint.complaintId
            .toLowerCase()
            .includes(term) ||
          complaint.citizenName
            .toLowerCase()
            .includes(term) ||
          complaint.title
            .toLowerCase()
            .includes(term) ||
          complaint.complaintType
            .toLowerCase()
            .includes(term);

        const matchesStatus =
          !statusFilter ||
          complaint.status ===
            statusFilter;

        const matchesDepartment =
          !departmentFilter ||
          complaint.department ===
            departmentFilter;

        const matchesPriority =
          !priorityFilter ||
          complaint.priority ===
            priorityFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesDepartment &&
          matchesPriority
        );
      }
    );
  }, [
    complaints,
    search,
    statusFilter,
    departmentFilter,
    priorityFilter,
  ]);

  // ==========================================
  // VIEW DETAILS
  // ==========================================

  const openDetailsModal = (complaint) => {
    setSelectedComplaint(complaint);
    setShowDetailsModal(true);
  };

  // ==========================================
  // ASSIGN STAFF MODAL
  // ==========================================

  const openAssignModal = (complaint) => {
    setSelectedComplaint(complaint);

    setSelectedStaff(
      complaint.assignedStaff
        ? complaint.assignedStaff._id
        : ""
    );

    setShowAssignModal(true);
  };

  // ==========================================
  // ASSIGN STAFF
  // ==========================================

  const handleAssignStaff = () => {
    if (!selectedStaff) {
      alert("Please select a staff member.");
      return;
    }

    const staffMember =
      defaultStaff.find(
        (member) =>
          member._id === selectedStaff
      );

    if (!staffMember) return;

    setComplaints(
      (previousComplaints) =>
        previousComplaints.map(
          (complaint) =>
            complaint._id ===
            selectedComplaint._id
              ? {
                  ...complaint,
                  assignedStaff:
                    staffMember,
                }
              : complaint
        )
    );

    setShowAssignModal(false);
    setSelectedComplaint(null);
    setSelectedStaff("");

    alert("Staff assigned successfully.");
  };

  // ==========================================
  // UPDATE STATUS
  // ==========================================

  const handleStatusChange = (
    complaintId,
    newStatus
  ) => {
    setComplaints(
      (previousComplaints) =>
        previousComplaints.map(
          (complaint) =>
            complaint._id === complaintId
              ? {
                  ...complaint,
                  status: newStatus,
                }
              : complaint
        )
    );
  };

  // ==========================================
  // DELETE COMPLAINT
  // ==========================================

  const handleDelete = (complaintId) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this complaint?"
      );

    if (!confirmed) return;

    setComplaints(
      (previousComplaints) =>
        previousComplaints.filter(
          (complaint) =>
            complaint._id !==
            complaintId
        )
    );
  };

  // ==========================================
  // RESET FILTERS
  // ==========================================

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("");
    setDepartmentFilter("");
    setPriorityFilter("");
  };

  // ==========================================
  // MAP
  // ==========================================

  const openMap = (location) => {
    if (
      !location ||
      !location.latitude ||
      !location.longitude
    ) {
      return;
    }

    const mapUrl =
      `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;

    window.open(
      mapUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-5 md:p-8">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="mb-8">

        <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
          Complaint Management
        </p>

        <div className="mt-2 flex flex-col justify-between gap-3 md:flex-row md:items-center">

          <div>

            <h1 className="text-3xl font-bold text-slate-900">
              All Complaints
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              View, manage, assign and track all
              citizen complaints.
            </p>

          </div>

          <div className="rounded-lg bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
            Admin Panel
          </div>

        </div>

      </div>

      {/* ======================================
          STAT CARDS
      ====================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

        <StatCard
          title="Total Complaints"
          value={total}
          icon="📋"
        />

        <StatCard
          title="Pending"
          value={pending}
          icon="⏳"
        />

        <StatCard
          title="In Progress"
          value={inProgress}
          icon="🔄"
        />

        <StatCard
          title="Resolved"
          value={resolved}
          icon="✓"
        />

        <StatCard
          title="Rejected"
          value={rejected}
          icon="✕"
        />

        <StatCard
          title="Unassigned"
          value={unassigned}
          icon="👤"
        />

      </div>

      {/* ======================================
          FILTERS
      ====================================== */}

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">

          <div>

            <h2 className="font-semibold text-slate-900">
              Search & Filter
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Find complaints quickly.
            </p>

          </div>

          <button
            onClick={resetFilters}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Clear Filters
          </button>

        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

          {/* SEARCH */}

          <div>

            <label className="mb-2 block text-xs font-semibold text-slate-600">
              Search
            </label>

            <div className="relative">

              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                🔍
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="ID, citizen, title..."
                className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

          </div>

          {/* STATUS */}

          <div>

            <label className="mb-2 block text-xs font-semibold text-slate-600">
              Status
            </label>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
            >

              <option value="">
                All Status
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Resolved">
                Resolved
              </option>

              <option value="Rejected">
                Rejected
              </option>

            </select>

          </div>

          {/* DEPARTMENT */}

          <div>

            <label className="mb-2 block text-xs font-semibold text-slate-600">
              Department
            </label>

            <select
              value={departmentFilter}
              onChange={(e) =>
                setDepartmentFilter(
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
            >

              <option value="">
                All Departments
              </option>

              {departments.map(
                (department) => (
                  <option
                    key={department}
                    value={department}
                  >
                    {department}
                  </option>
                )
              )}

            </select>

          </div>

          {/* PRIORITY */}

          <div>

            <label className="mb-2 block text-xs font-semibold text-slate-600">
              Priority
            </label>

            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
            >

              <option value="">
                All Priorities
              </option>

              <option value="High">
                High
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="Low">
                Low
              </option>

            </select>

          </div>

        </div>

      </div>

      {/* ======================================
          COMPLAINT TABLE
      ====================================== */}

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 px-5 py-5 md:flex-row md:items-center">

          <div>

            <h2 className="font-semibold text-slate-900">
              Complaint Records
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredComplaints.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {complaints.length}
              </span>{" "}
              complaints
            </p>

          </div>

          <button
            onClick={resetFilters}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            ↻ Reset
          </button>

        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1200px]">

            <thead className="bg-slate-50">

              <tr className="text-left text-xs font-bold uppercase tracking-wider text-slate-500">

                <th className="px-5 py-4">
                  Complaint
                </th>

                <th className="px-5 py-4">
                  Citizen
                </th>

                <th className="px-5 py-4">
                  Department
                </th>

                <th className="px-5 py-4">
                  Priority
                </th>

                <th className="px-5 py-4">
                  Assigned Staff
                </th>

                <th className="px-5 py-4">
                  Status
                </th>

                <th className="px-5 py-4 text-right">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredComplaints.map(
                (complaint) => (

                  <tr
                    key={complaint._id}
                    className="transition hover:bg-slate-50"
                  >

                    {/* COMPLAINT */}

                    <td className="px-5 py-5">

                      <div className="flex items-start gap-3">

                        {/* IMAGE PREVIEW */}

                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">

                          <img
                            src={
                              complaint.complaintImage
                            }
                            alt="Complaint"
                            className="h-full w-full object-cover"
                          />

                        </div>

                        <div>

                          <p className="font-bold text-slate-800">
                            {
                              complaint.complaintId
                            }
                          </p>

                          <p className="mt-1 max-w-[220px] truncate text-sm font-medium text-slate-700">
                            {
                              complaint.title
                            }
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {formatDate(
                              complaint.createdAt
                            )}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* CITIZEN */}

                    <td className="px-5 py-5">

                      <p className="font-semibold text-slate-700">
                        {
                          complaint.citizenName
                        }
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {complaint.email}
                      </p>

                    </td>

                    {/* DEPARTMENT */}

                    <td className="px-5 py-5">

                      <span className="inline-block max-w-[190px] rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {
                          complaint.department
                        }
                      </span>

                    </td>

                    {/* PRIORITY */}

                    <td className="px-5 py-5">

                      <PriorityBadge
                        priority={
                          complaint.priority
                        }
                      />

                    </td>

                    {/* STAFF */}

                    <td className="px-5 py-5">

                      {complaint.assignedStaff ? (

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                            {complaint.assignedStaff.name.charAt(
                              0
                            )}
                          </div>

                          <div>

                            <p className="font-semibold text-slate-700">
                              {
                                complaint
                                  .assignedStaff
                                  .name
                              }
                            </p>

                            <p className="text-xs text-slate-400">
                              {
                                complaint
                                  .assignedStaff
                                  .staffId
                              }
                            </p>

                          </div>

                        </div>

                      ) : (

                        <button
                          onClick={() =>
                            openAssignModal(
                              complaint
                            )
                          }
                          className="rounded-lg bg-orange-50 px-3 py-2 text-xs font-bold text-orange-600 transition hover:bg-orange-100"
                        >
                          + Assign Staff
                        </button>

                      )}

                    </td>

                    {/* STATUS */}

                    <td className="px-5 py-5">

                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                          complaint.status
                        )}`}
                      >
                        {
                          complaint.status
                        }
                      </span>

                    </td>

                    {/* ACTION */}

                    <td className="px-5 py-5">

                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() =>
                            openDetailsModal(
                              complaint
                            )
                          }
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100"
                        >
                          View
                        </button>

                        <button
                          onClick={() =>
                            openAssignModal(
                              complaint
                            )
                          }
                          className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-50"
                        >
                          {complaint.assignedStaff
                            ? "Change"
                            : "Assign"}
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              complaint._id
                            )
                          }
                          className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

        {filteredComplaints.length === 0 && (

          <div className="p-12 text-center">

            <div className="text-4xl">
              📋
            </div>

            <h3 className="mt-3 font-semibold text-slate-700">
              No complaints found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filters.
            </p>

          </div>

        )}

      </div>

      {/* ======================================
          VIEW DETAILS MODAL
      ====================================== */}

      {showDetailsModal &&
        selectedComplaint && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">

            <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

              {/* HEADER */}

              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">

                <div>

                  <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                    Complaint Details
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    {
                      selectedComplaint.complaintId
                    }
                  </h2>

                </div>

                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedComplaint(null);
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  ×
                </button>

              </div>

              <div className="space-y-6 p-6">

                {/* TITLE + STATUS */}

                <div className="flex flex-col justify-between gap-4 rounded-xl bg-slate-50 p-5 md:flex-row md:items-center">

                  <div>

                    <h3 className="text-xl font-bold text-slate-900">
                      {
                        selectedComplaint.title
                      }
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Submitted on{" "}
                      {formatDate(
                        selectedComplaint.createdAt
                      )}
                    </p>

                  </div>

                  <div className="flex gap-2">

                    <PriorityBadge
                      priority={
                        selectedComplaint.priority
                      }
                    />

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                        selectedComplaint.status
                      )}`}
                    >
                      {
                        selectedComplaint.status
                      }
                    </span>

                  </div>

                </div>

                {/* CITIZEN + COMPLAINT INFO */}

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                  <InfoSection title="Citizen Information">

                    <InfoRow
                      label="Name"
                      value={
                        selectedComplaint.citizenName
                      }
                    />

                    <InfoRow
                      label="Email"
                      value={
                        selectedComplaint.email
                      }
                    />

                  </InfoSection>

                  <InfoSection title="Complaint Information">

                    <InfoRow
                      label="Complaint Type"
                      value={
                        selectedComplaint.complaintType
                      }
                    />

                    <InfoRow
                      label="Department"
                      value={
                        selectedComplaint.department
                      }
                    />

                    <InfoRow
                      label="Priority"
                      value={
                        selectedComplaint.priority
                      }
                    />

                  </InfoSection>

                </div>

                {/* DESCRIPTION */}

                <InfoSection title="Complaint Description">

                  <p className="text-sm leading-7 text-slate-600">
                    {
                      selectedComplaint.description
                    }
                  </p>

                </InfoSection>

                {/* IMAGE + LOCATION */}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                  {/* IMAGE */}

                  <div>

                    <h3 className="mb-3 text-sm font-bold text-slate-800">
                      📷 Complaint Image
                    </h3>

                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">

                      <img
                        src={
                          selectedComplaint.complaintImage
                        }
                        alt="Citizen complaint"
                        className="h-[280px] w-full object-cover"
                      />

                    </div>

                  </div>

                  {/* LOCATION */}

                  <div>

                    <h3 className="mb-3 text-sm font-bold text-slate-800">
                      📍 Complaint Location
                    </h3>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

                      <p className="font-semibold text-slate-800">
                        {
                          selectedComplaint
                            .location.address
                        }
                      </p>

                      <div className="mt-4 grid grid-cols-2 gap-3">

                        <div className="rounded-lg bg-white p-3">

                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Latitude
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-700">
                            {
                              selectedComplaint
                                .location
                                .latitude
                            }
                          </p>

                        </div>

                        <div className="rounded-lg bg-white p-3">

                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Longitude
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-700">
                            {
                              selectedComplaint
                                .location
                                .longitude
                            }
                          </p>

                        </div>

                      </div>

                      <button
                        onClick={() =>
                          openMap(
                            selectedComplaint.location
                          )
                        }
                        className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                      >
                        📍 View on Google Maps
                      </button>

                    </div>

                  </div>

                </div>

                {/* ASSIGNED STAFF */}

                <InfoSection title="Assigned Staff">

                  {selectedComplaint.assignedStaff ? (

                    <div className="flex items-center justify-between rounded-xl border border-green-100 bg-green-50 p-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                          {
                            selectedComplaint
                              .assignedStaff
                              .name
                              .charAt(0)
                          }
                        </div>

                        <div>

                          <p className="font-bold text-slate-800">
                            {
                              selectedComplaint
                                .assignedStaff
                                .name
                            }
                          </p>

                          <p className="text-xs text-slate-500">
                            {
                              selectedComplaint
                                .assignedStaff
                                .staffId
                            }{" "}
                            •{" "}
                            {
                              selectedComplaint
                                .assignedStaff
                                .role
                            }
                          </p>

                        </div>

                      </div>

                      <button
                        onClick={() => {
                          setShowDetailsModal(
                            false
                          );
                          openAssignModal(
                            selectedComplaint
                          );
                        }}
                        className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50"
                      >
                        Change Staff
                      </button>

                    </div>

                  ) : (

                    <div className="flex flex-col justify-between gap-4 rounded-xl border border-orange-100 bg-orange-50 p-4 md:flex-row md:items-center">

                      <div>

                        <p className="font-semibold text-orange-700">
                          No staff assigned
                        </p>

                        <p className="mt-1 text-xs text-orange-600">
                          Assign a staff member to handle
                          this complaint.
                        </p>

                      </div>

                      <button
                        onClick={() => {
                          setShowDetailsModal(
                            false
                          );
                          openAssignModal(
                            selectedComplaint
                          );
                        }}
                        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
                      >
                        + Assign Staff
                      </button>

                    </div>

                  )}

                </InfoSection>

                {/* STATUS */}

                <InfoSection title="Update Complaint Status">

                  <div className="flex flex-wrap gap-3">

                    {[
                      "Pending",
                      "In Progress",
                      "Resolved",
                      "Rejected",
                    ].map((status) => (

                      <button
                        key={status}
                        onClick={() => {
                          handleStatusChange(
                            selectedComplaint._id,
                            status
                          );

                          setSelectedComplaint(
                            {
                              ...selectedComplaint,
                              status,
                            }
                          );
                        }}
                        className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                          selectedComplaint.status ===
                          status
                            ? getStatusButtonClass(
                                status
                              )
                            : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {status}
                      </button>

                    ))}

                  </div>

                </InfoSection>

              </div>

              {/* FOOTER */}

              <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">

                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedComplaint(null);
                  }}
                  className="rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-900"
                >
                  Close
                </button>

              </div>

            </div>

          </div>
        )}

      {/* ======================================
          ASSIGN STAFF MODAL
      ====================================== */}

      {showAssignModal &&
        selectedComplaint && (

          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4">

            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

              {/* HEADER */}

              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                <div>

                  <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                    Staff Assignment
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    Assign Staff
                  </h2>

                </div>

                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedComplaint(null);
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  ×
                </button>

              </div>

              {/* BODY */}

              <div className="space-y-5 px-6 py-6">

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Complaint
                  </p>

                  <p className="mt-1 font-bold text-slate-800">
                    {
                      selectedComplaint
                        .complaintId
                    }
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {
                      selectedComplaint.title
                    }
                  </p>

                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Department
                  </p>

                  <div className="mt-2 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">

                    <p className="text-sm font-semibold text-blue-700">
                      {
                        selectedComplaint
                          .department
                      }
                    </p>

                  </div>

                </div>

                <div>

                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Select Staff Member
                  </label>

                  <select
                    value={selectedStaff}
                    onChange={(e) =>
                      setSelectedStaff(
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >

                    <option value="">
                      Select a staff member
                    </option>

                    {defaultStaff
                      .filter(
                        (member) =>
                          member.status ===
                            "Active" &&
                          member.department ===
                            selectedComplaint.department
                      )
                      .map((member) => (

                        <option
                          key={member._id}
                          value={member._id}
                        >
                          {member.name} —{" "}
                          {member.staffId}
                        </option>

                      ))}

                  </select>

                </div>

                {selectedComplaint.assignedStaff && (

                  <div className="rounded-lg border border-green-100 bg-green-50 p-3">

                    <p className="text-xs text-green-600">
                      Currently Assigned
                    </p>

                    <p className="mt-1 text-sm font-bold text-green-700">
                      {
                        selectedComplaint
                          .assignedStaff
                          .name
                      }
                    </p>

                  </div>

                )}

              </div>

              {/* FOOTER */}

              <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">

                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedComplaint(null);
                  }}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleAssignStaff}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Assign Staff
                </button>

              </div>

            </div>

          </div>
        )}

    </div>
  );
};

// ==========================================
// STAT CARD
// ==========================================

const StatCard = ({
  title,
  value,
  icon,
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>

        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-lg">
          {icon}
        </div>

      </div>

    </div>
  );
};

// ==========================================
// INFO SECTION
// ==========================================

const InfoSection = ({
  title,
  children,
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white">

      <div className="border-b border-slate-100 px-5 py-4">

        <h3 className="text-sm font-bold text-slate-800">
          {title}
        </h3>

      </div>

      <div className="space-y-3 p-5">
        {children}
      </div>

    </div>
  );
};

// ==========================================
// INFO ROW
// ==========================================

const InfoRow = ({
  label,
  value,
}) => {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">

      <span className="text-xs font-medium text-slate-400">
        {label}
      </span>

      <span className="text-sm font-semibold text-slate-700 sm:text-right">
        {value || "Not available"}
      </span>

    </div>
  );
};

// ==========================================
// PRIORITY BADGE
// ==========================================

const PriorityBadge = ({
  priority,
}) => {

  const classes = {
    High: "bg-red-50 text-red-600",
    Medium:
      "bg-yellow-50 text-yellow-600",
    Low: "bg-green-50 text-green-600",
  };

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
        classes[priority] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      {priority}
    </span>
  );
};

// ==========================================
// STATUS CLASS
// ==========================================

const getStatusClass = (status) => {

  switch (status) {

    case "Pending":
      return "bg-yellow-50 text-yellow-700";

    case "In Progress":
      return "bg-blue-50 text-blue-700";

    case "Resolved":
      return "bg-green-50 text-green-700";

    case "Rejected":
      return "bg-red-50 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
};

// ==========================================
// STATUS BUTTON CLASS
// ==========================================

const getStatusButtonClass = (
  status
) => {

  switch (status) {

    case "Pending":
      return "bg-yellow-500 text-white";

    case "In Progress":
      return "bg-blue-600 text-white";

    case "Resolved":
      return "bg-green-600 text-white";

    case "Rejected":
      return "bg-red-600 text-white";

    default:
      return "bg-slate-700 text-white";
  }
};

// ==========================================
// DATE FORMAT
// ==========================================

const formatDate = (date) => {

  if (!date) {
    return "No date";
  }

  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

export default AllComplaints;
