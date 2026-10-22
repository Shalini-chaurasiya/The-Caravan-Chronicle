
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

const API_BASE_URL = "http://localhost:3000/api";

const DEPARTMENT_API_URL =
  `${API_BASE_URL}/departments`;

const STAFF_API_URL =
  `${API_BASE_URL}/staff`;

// ======================================================
// ICON OPTIONS
// ======================================================

const ICON_OPTIONS = [
  "💧",
  "🛣️",
  "⚡",
  "🚰",
  "🗑️",
  "🌿",
  "🚦",
  "🏢",
  "🏛️",
  "🔧",
  "🏥",
  "📚",
];

// ======================================================
// AUTH
// ======================================================

const getToken = () => {
  return (
    localStorage.getItem("adminToken") ||
    localStorage.getItem("admin_token") ||
    localStorage.getItem("token") ||
    ""
  );
};

// ======================================================
// API REQUEST
// ======================================================

const apiRequest = async (
  url,
  options = {}
) => {
  const token = getToken();

  if (!token) {
    throw new Error(
      "Admin token not found. Please log in again."
    );
  }

  const response = await fetch(url, {
    ...options,

    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data =
    await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Something went wrong with the request."
    );
  }

  return data;
};

// ======================================================
// MAIN COMPONENT
// ======================================================

const Departments = () => {
  // ----------------------------------------------------
  // DEPARTMENT STATE
  // ----------------------------------------------------

  const [departments, setDepartments] =
    useState([]);

  const [loadingDepartments, setLoadingDepartments] =
    useState(true);

  // ----------------------------------------------------
  // STAFF STATE
  // ----------------------------------------------------

  const [staff, setStaff] = useState([]);

  const [loadingStaff, setLoadingStaff] =
    useState(true);

  // ----------------------------------------------------
  // ERROR
  // ----------------------------------------------------

  const [error, setError] = useState("");

  // ----------------------------------------------------
  // SEARCH / FILTER
  // ----------------------------------------------------

  const [search, setSearch] = useState("");

  const [departmentFilter, setDepartmentFilter] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("");

  // ----------------------------------------------------
  // ADD / EDIT MODAL
  // ----------------------------------------------------

  const [
    showDepartmentModal,
    setShowDepartmentModal,
  ] = useState(false);

  const [
    editingDepartment,
    setEditingDepartment,
  ] = useState(null);

  const [
    departmentForm,
    setDepartmentForm,
  ] = useState({
    name: "",
    description: "",
    icon: "🏢",
    status: "Active",
  });

  const [
    savingDepartment,
    setSavingDepartment,
  ] = useState(false);

  // ----------------------------------------------------
  // VIEW STAFF MODAL
  // ----------------------------------------------------

  const [
    showStaffModal,
    setShowStaffModal,
  ] = useState(false);

  const [
    selectedDepartment,
    setSelectedDepartment,
  ] = useState(null);

  const [staffSearch, setStaffSearch] =
    useState("");

  // ====================================================
  // FETCH DEPARTMENTS
  // ====================================================

  const fetchDepartments = async () => {
    try {
      setLoadingDepartments(true);
      setError("");

      const data = await apiRequest(
        DEPARTMENT_API_URL
      );

      const departmentList =
        Array.isArray(data)
          ? data
          : Array.isArray(data.departments)
          ? data.departments
          : [];

      setDepartments(departmentList);
    } catch (err) {
      console.error(
        "Fetch departments error:",
        err
      );

      setError(
        err.message ||
          "Unable to load departments."
      );
    } finally {
      setLoadingDepartments(false);
    }
  };

  // ====================================================
  // FETCH STAFF
  // ====================================================

  const fetchStaff = async () => {
    try {
      setLoadingStaff(true);

      const data = await apiRequest(
        STAFF_API_URL
      );

      const members =
        Array.isArray(data)
          ? data
          : Array.isArray(data.staff)
          ? data.staff
          : [];

      setStaff(members);
    } catch (err) {
      console.error(
        "Fetch staff error:",
        err
      );

      setError(
        err.message ||
          "Unable to load staff information."
      );
    } finally {
      setLoadingStaff(false);
    }
  };

  // ====================================================
  // INITIAL DATA
  // ====================================================

  useEffect(() => {
    fetchDepartments();
    fetchStaff();
  }, []);

  // ====================================================
  // DEPARTMENT DATA
  // ====================================================

  const departmentData = useMemo(() => {
    return departments.map(
      (department) => {
        const departmentStaff =
          staff.filter(
            (member) =>
              String(
                member.department || ""
              ).trim() ===
              String(
                department.name || ""
              ).trim()
          );

        const activeStaff =
          departmentStaff.filter(
            (member) =>
              member.status === "Active"
          ).length;

        const inactiveStaff =
          departmentStaff.filter(
            (member) =>
              member.status === "Inactive"
          ).length;

        const complaints =
          department.complaints ??
          department.assignedComplaints ??
          department.complaintCount ??
          0;

        const resolvedComplaints =
          department.resolvedComplaints ??
          department.resolvedComplaintCount ??
          0;

        return {
          ...department,

          totalStaff:
            department.totalStaff ??
            departmentStaff.length,

          activeStaff:
            department.activeStaff ??
            activeStaff,

          inactiveStaff:
            department.inactiveStaff ??
            inactiveStaff,

          complaints:
            Number(complaints),

          resolvedComplaints:
            Number(
              resolvedComplaints
            ),
        };
      }
    );
  }, [departments, staff]);

  // ====================================================
  // FILTER DEPARTMENTS
  // ====================================================

  const filteredDepartments =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase();

      return departmentData.filter(
        (department) => {
          const departmentName =
            String(
              department.name || ""
            ).toLowerCase();

          const description =
            String(
              department.description ||
                ""
            ).toLowerCase();

          const matchesSearch =
            !term ||
            departmentName.includes(
              term
            ) ||
            description.includes(
              term
            );

          const matchesDepartment =
            !departmentFilter ||
            department.name ===
              departmentFilter;

          const matchesStatus =
            !statusFilter ||
            department.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesDepartment &&
            matchesStatus
          );
        }
      );
    }, [
      departmentData,
      search,
      departmentFilter,
      statusFilter,
    ]);

  // ====================================================
  // SELECTED DEPARTMENT STAFF
  // ====================================================

  const selectedDepartmentStaff =
    useMemo(() => {
      if (!selectedDepartment) {
        return [];
      }

      const term =
        staffSearch
          .trim()
          .toLowerCase();

      return staff.filter(
        (member) => {
          const sameDepartment =
            String(
              member.department || ""
            ).trim() ===
            String(
              selectedDepartment.name ||
                ""
            ).trim();

          if (!sameDepartment) {
            return false;
          }

          if (!term) {
            return true;
          }

          return (
            String(
              member.name || ""
            )
              .toLowerCase()
              .includes(term) ||
            String(
              member.email || ""
            )
              .toLowerCase()
              .includes(term) ||
            String(
              member.phone || ""
            )
              .toLowerCase()
              .includes(term) ||
            String(
              member.staffId || ""
            )
              .toLowerCase()
              .includes(term) ||
            String(
              member.role || ""
            )
              .toLowerCase()
              .includes(term)
          );
        }
      );
    }, [
      staff,
      selectedDepartment,
      staffSearch,
    ]);

  // ====================================================
  // STATISTICS
  // ====================================================

  const totalDepartments =
    departments.length;

  const totalStaff =
    staff.length;

  const totalComplaints =
    departmentData.reduce(
      (total, department) =>
        total +
        Number(
          department.complaints || 0
        ),
      0
    );

  const resolvedComplaints =
    departmentData.reduce(
      (total, department) =>
        total +
        Number(
          department.resolvedComplaints ||
            0
        ),
      0
    );

  const resolutionRate =
    totalComplaints > 0
      ? Math.round(
          (resolvedComplaints /
            totalComplaints) *
            100
        )
      : 0;

  // ====================================================
  // OPEN ADD DEPARTMENT
  // ====================================================

  const openAddDepartment = () => {
    setEditingDepartment(null);

    setDepartmentForm({
      name: "",
      description: "",
      icon: "🏢",
      status: "Active",
    });

    setShowDepartmentModal(true);
  };

  // ====================================================
  // OPEN EDIT DEPARTMENT
  // ====================================================

  const openEditDepartment = (
    department
  ) => {
    setEditingDepartment(
      department
    );

    setDepartmentForm({
      name:
        department.name || "",
      description:
        department.description ||
        "",
      icon:
        department.icon || "🏢",
      status:
        department.status ||
        "Active",
    });

    setShowDepartmentModal(true);
  };

  // ====================================================
  // FORM CHANGE
  // ====================================================

  const handleDepartmentFormChange =
    (e) => {
      const {
        name,
        value,
      } = e.target;

      setDepartmentForm(
        (previous) => ({
          ...previous,
          [name]: value,
        })
      );
    };

  // ====================================================
  // SAVE DEPARTMENT
  // ====================================================

  const handleSaveDepartment =
    async (e) => {
      e.preventDefault();

      const name =
        departmentForm.name.trim();

      const description =
        departmentForm.description.trim();

      if (!name) {
        window.alert(
          "Please enter department name."
        );
        return;
      }

      if (!description) {
        window.alert(
          "Please enter department description."
        );
        return;
      }

      try {
        setSavingDepartment(true);
        setError("");

        // ----------------------------------------------
        // EDIT
        // ----------------------------------------------

        if (editingDepartment) {
          const data =
            await apiRequest(
              `${DEPARTMENT_API_URL}/${editingDepartment._id}`,
              {
                method: "PUT",

                body: JSON.stringify({
                  name,
                  description,
                  icon:
                    departmentForm.icon,
                  status:
                    departmentForm.status,
                }),
              }
            );

          const updatedDepartment =
            data.department;

          setDepartments(
            (previous) =>
              previous.map(
                (department) =>
                  department._id ===
                  editingDepartment._id
                    ? {
                        ...department,
                        ...updatedDepartment,
                      }
                    : department
              )
          );

          // If department name changed,
          // refresh staff because backend
          // updates their department.
          await fetchStaff();

          setShowDepartmentModal(
            false
          );

          setEditingDepartment(
            null
          );

          return;
        }

        // ----------------------------------------------
        // ADD
        // ----------------------------------------------

        const data =
          await apiRequest(
            DEPARTMENT_API_URL,
            {
              method: "POST",

              body: JSON.stringify({
                name,
                description,
                icon:
                  departmentForm.icon,
                status:
                  departmentForm.status,
              }),
            }
          );

        const newDepartment =
          data.department;

        setDepartments(
          (previous) => [
            ...previous,
            newDepartment,
          ]
        );

        setShowDepartmentModal(
          false
        );

        setDepartmentForm({
          name: "",
          description: "",
          icon: "🏢",
          status: "Active",
        });
      } catch (err) {
        console.error(
          "Save department error:",
          err
        );

        window.alert(
          err.message ||
            "Unable to save department."
        );
      } finally {
        setSavingDepartment(false);
      }
    };

  // ====================================================
  // DELETE DEPARTMENT
  // ====================================================

  const handleDeleteDepartment =
    async (department) => {
      const confirmed =
        window.confirm(
          `Are you sure you want to delete "${department.name}"?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setError("");

        await apiRequest(
          `${DEPARTMENT_API_URL}/${department._id}`,
          {
            method: "DELETE",
          }
        );

        setDepartments(
          (previous) =>
            previous.filter(
              (item) =>
                item._id !==
                department._id
            )
        );

        if (
          selectedDepartment?._id ===
          department._id
        ) {
          setShowStaffModal(false);
          setSelectedDepartment(null);
        }
      } catch (err) {
        console.error(
          "Delete department error:",
          err
        );

        window.alert(
          err.message ||
            "Unable to delete department."
        );
      }
    };

  // ====================================================
  // VIEW STAFF
  // ====================================================

  const handleViewStaff =
    async (department) => {
      try {
        setError("");

        setSelectedDepartment(
          department
        );

        setStaffSearch("");

        setShowStaffModal(true);

        // ----------------------------------------------
        // Fetch latest staff specifically for department
        // ----------------------------------------------

        const data =
          await apiRequest(
            `${DEPARTMENT_API_URL}/${department._id}/staff`
          );

        const departmentStaff =
          Array.isArray(data.staff)
            ? data.staff
            : [];

        // Update the main staff list
        // with latest department data.
        setStaff(
          (previous) => {
            const otherStaff =
              previous.filter(
                (member) =>
                  String(
                    member.department ||
                      ""
                  ).trim() !==
                  String(
                    department.name ||
                      ""
                  ).trim()
              );

            return [
              ...otherStaff,
              ...departmentStaff,
            ];
          }
        );

        // Update selected department
        // statistics from backend.
        setSelectedDepartment(
          (previous) =>
            previous
              ? {
                  ...previous,
                  totalStaff:
                    data.count ??
                    department.totalStaff ??
                    departmentStaff.length,
                  activeStaff:
                    departmentStaff.filter(
                      (member) =>
                        member.status ===
                        "Active"
                    ).length,
                  inactiveStaff:
                    departmentStaff.filter(
                      (member) =>
                        member.status ===
                        "Inactive"
                    ).length,
                }
              : previous
        );
      } catch (err) {
        console.error(
          "View department staff error:",
          err
        );

        window.alert(
          err.message ||
            "Unable to load department staff."
        );
      }
    };

  // ====================================================
  // CLOSE STAFF MODAL
  // ====================================================

  const closeStaffModal = () => {
    setShowStaffModal(false);
    setSelectedDepartment(null);
    setStaffSearch("");
  };

  // ====================================================
  // RESET FILTERS
  // ====================================================

  const handleReset = () => {
    setSearch("");
    setDepartmentFilter("");
    setStatusFilter("");
  };

  // ====================================================
  // BODY SCROLL LOCK
  // ====================================================

  useEffect(() => {
    const modalOpen =
      showDepartmentModal ||
      showStaffModal;

    if (modalOpen) {
      document.body.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow =
        "";
    }

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [
    showDepartmentModal,
    showStaffModal,
  ]);

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="min-h-screen bg-[#f6f8fc]">

      {/* ==================================================
          TOP HEADER
      ================================================== */}

      <div className="border-b border-slate-200 bg-white px-5 py-4 md:px-7">

        <div className="flex items-center gap-4">

          <button
            type="button"
            className="text-2xl text-slate-700"
          >
            ☰
          </button>

          <div className="relative max-w-xl flex-1">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search departments, staff, or complaints..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />

          </div>

          <div className="ml-auto flex items-center gap-4">

            <button
              type="button"
              className="relative hidden text-xl text-slate-600 sm:block"
            >
              🔔

              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                3
              </span>
            </button>

            <div className="flex items-center gap-2">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-lg">
                👤
              </div>

              <span className="hidden text-sm font-semibold text-slate-800 sm:block">
                Admin
              </span>

              <span className="hidden text-slate-500 sm:block">
                ▾
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="p-5 md:p-7 lg:p-8">

        {/* ==================================================
            TITLE
        ================================================== */}

        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

          <div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Department Management
            </h1>

            <p className="mt-2 text-sm text-slate-500 md:text-base">
              Manage all departments, track performance and monitor staff allocation.
            </p>

          </div>

          <button
            onClick={
              openAddDepartment
            }
            className="flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
          >
            <span className="text-xl">
              +
            </span>

            Add Department
          </button>

        </div>

        {/* ==================================================
            STATISTICS
        ================================================== */}

        <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Total Departments"
            value={
              totalDepartments
            }
            subtitle="Departments in system"
            icon="🏢"
            bg="bg-blue-100"
            text="text-blue-600"
          />

          <StatCard
            title="Total Staff"
            value={totalStaff}
            subtitle="Across all departments"
            icon="👥"
            bg="bg-emerald-100"
            text="text-emerald-600"
          />

          <StatCard
            title="Total Complaints"
            value={
              totalComplaints
            }
            subtitle="Assigned complaints"
            icon="📄"
            bg="bg-orange-100"
            text="text-orange-600"
          />

          <StatCard
            title="Resolved Complaints"
            value={
              resolvedComplaints
            }
            subtitle={`${resolutionRate}% resolution rate`}
            icon="✓"
            bg="bg-purple-100"
            text="text-purple-600"
          />

        </div>

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4">

            <p className="text-sm text-red-700">
              {error}
            </p>

            <button
              onClick={() => {
                fetchDepartments();
                fetchStaff();
              }}
              className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
            >
              Retry
            </button>

          </div>
        )}

        {/* ==================================================
            FILTER BAR
        ================================================== */}

        <div className="mt-7 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px_180px_auto_auto]">

            {/* Search */}

            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                🔍
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search departments..."
                className="h-11 w-full rounded-lg border border-slate-200 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* Department Filter */}

            <select
              value={
                departmentFilter
              }
              onChange={(e) =>
                setDepartmentFilter(
                  e.target.value
                )
              }
              className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500"
            >

              <option value="">
                All Departments
              </option>

              {departments.map(
                (department) => (
                  <option
                    key={
                      department._id
                    }
                    value={
                      department.name
                    }
                  >
                    {
                      department.name
                    }
                  </option>
                )
              )}

            </select>

            {/* Status Filter */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500"
            >

              <option value="">
                All Status
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>

            </select>

            {/* Filter */}

            <button
              type="button"
              className="flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 px-5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              ⚱ Filter
            </button>

            {/* Reset */}

            <button
              onClick={
                handleReset
              }
              type="button"
              className="h-11 rounded-lg border border-slate-200 px-5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Reset
            </button>

          </div>

        </div>

        {/* ==================================================
            DEPARTMENT HEADING
        ================================================== */}

        <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-xl font-bold text-slate-900">
              All Departments
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View and manage your municipal departments.
            </p>

          </div>

          <p className="text-sm text-slate-500">

            Showing{" "}

            <span className="font-semibold text-slate-800">
              {
                filteredDepartments.length
              }
            </span>{" "}

            of{" "}

            <span className="font-semibold text-slate-800">
              {
                departments.length
              }
            </span>{" "}

            departments

          </p>

        </div>

        {/* ==================================================
            DEPARTMENT CARDS
        ================================================== */}

        {loadingDepartments ? (

          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-12 text-center">

            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm text-slate-500">
              Loading departments...
            </p>

          </div>

        ) : filteredDepartments.length ===
          0 ? (

          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-12 text-center">

            <div className="text-4xl">
              🔍
            </div>

            <h3 className="mt-4 font-semibold text-slate-800">
              No departments found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filters.
            </p>

          </div>

        ) : (

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

            {filteredDepartments.map(
              (department) => (

                <DepartmentCard
                  key={
                    department._id
                  }
                  department={
                    department
                  }
                  onViewStaff={
                    handleViewStaff
                  }
                  onEdit={
                    openEditDepartment
                  }
                  onDelete={
                    handleDeleteDepartment
                  }
                />

              )
            )}

          </div>

        )}

      </main>

      {/* ==================================================
          ADD / EDIT DEPARTMENT MODAL
      ================================================== */}

      {showDepartmentModal && (

        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm sm:items-center">

          <div className="my-auto flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}

            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>

                <h2 className="text-xl font-bold text-slate-900">

                  {editingDepartment
                    ? "Edit Department"
                    : "Add Department"}

                </h2>

                <p className="mt-1 text-sm text-slate-500">

                  {editingDepartment
                    ? "Update department information."
                    : "Create a new municipal department."}

                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowDepartmentModal(
                    false
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ×
              </button>

            </div>

            {/* Form */}

            <form
              onSubmit={
                handleSaveDepartment
              }
              className="min-h-0 overflow-y-auto p-6"
            >

              {/* Department Name */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Department Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={
                    departmentForm.name
                  }
                  onChange={
                    handleDepartmentFormChange
                  }
                  placeholder="e.g. Public Health"
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />

              </div>

              {/* Description */}

              <div className="mt-5">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    departmentForm.description
                  }
                  onChange={
                    handleDepartmentFormChange
                  }
                  rows="4"
                  placeholder="Enter a short description of this department..."
                  className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />

              </div>

              {/* Icon */}

              <div className="mt-5">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Department Icon
                </label>

                <div className="grid grid-cols-6 gap-2">

                  {ICON_OPTIONS.map(
                    (icon) => (

                      <button
                        key={icon}
                        type="button"
                        onClick={() =>
                          setDepartmentForm(
                            (previous) => ({
                              ...previous,
                              icon,
                            })
                          )
                        }
                        className={`flex h-11 items-center justify-center rounded-lg border text-xl transition ${
                          departmentForm.icon ===
                          icon
                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {icon}
                      </button>

                    )
                  )}

                </div>

              </div>

              {/* Status */}

              <div className="mt-5">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Status
                </label>

                <select
                  name="status"
                  value={
                    departmentForm.status
                  }
                  onChange={
                    handleDepartmentFormChange
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >

                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>

                </select>

              </div>

              {/* Buttons */}

              <div className="mt-7 flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setShowDepartmentModal(
                      false
                    )
                  }
                  disabled={
                    savingDepartment
                  }
                  className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    savingDepartment
                  }
                  className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {savingDepartment
                    ? "Saving..."
                    : editingDepartment
                    ? "Save Changes"
                    : "Add Department"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* ==================================================
          VIEW STAFF MODAL
      ================================================== */}

      {showStaffModal &&
        selectedDepartment && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">

            <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

              {/* ==================================================
                  STAFF MODAL HEADER
              ================================================== */}

              <div className="border-b border-slate-200 px-6 py-5">

                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-center gap-4">

                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                      {
                        selectedDepartment.icon ||
                        "🏢"
                      }
                    </div>

                    <div>

                      <h2 className="text-xl font-bold text-slate-900">
                        {
                          selectedDepartment.name
                        }
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Staff members assigned to this department
                      </p>

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={
                      closeStaffModal
                    }
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    ×
                  </button>

                </div>

                {/* STAFF SUMMARY */}

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">

                  <MiniStat
                    label="Total Staff"
                    value={
                      selectedDepartment.totalStaff ??
                      selectedDepartmentStaff.length
                    }
                  />

                  <MiniStat
                    label="Active"
                    value={
                      selectedDepartment.activeStaff ??
                      selectedDepartmentStaff.filter(
                        (member) =>
                          member.status ===
                          "Active"
                      ).length
                    }
                  />

                  <MiniStat
                    label="Inactive"
                    value={
                      selectedDepartment.inactiveStaff ??
                      selectedDepartmentStaff.filter(
                        (member) =>
                          member.status ===
                          "Inactive"
                      ).length
                    }
                  />

                  <MiniStat
                    label="Complaints"
                    value={
                      selectedDepartment.complaints ??
                      0
                    }
                  />

                </div>

              </div>

              {/* ==================================================
                  STAFF SEARCH
              ================================================== */}

              <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    🔍
                  </span>

                  <input
                    type="text"
                    value={
                      staffSearch
                    }
                    onChange={(e) =>
                      setStaffSearch(
                        e.target.value
                      )
                    }
                    placeholder="Search staff by name, ID, email, phone or role..."
                    className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

              </div>

              {/* ==================================================
                  STAFF LIST
              ================================================== */}

              <div className="flex-1 overflow-y-auto p-6">

                {loadingStaff ? (

                  <div className="py-12 text-center">

                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                    <p className="mt-3 text-sm text-slate-500">
                      Loading staff...
                    </p>

                  </div>

                ) : selectedDepartmentStaff.length ===
                  0 ? (

                  <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center">

                    <div className="text-4xl">
                      👥
                    </div>

                    <h3 className="mt-3 font-semibold text-slate-800">
                      No staff found
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">

                      {staffSearch
                        ? "No staff members match your search."
                        : "No staff members are currently assigned to this department."}

                    </p>

                  </div>

                ) : (

                  <div className="overflow-hidden rounded-xl border border-slate-200">

                    {/* Desktop Table */}

                    <div className="hidden overflow-x-auto md:block">

                      <table className="w-full">

                        <thead className="bg-slate-50">

                          <tr>

                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Staff
                            </th>

                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Staff ID
                            </th>

                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Contact
                            </th>

                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Role
                            </th>

                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Status
                            </th>

                          </tr>

                        </thead>

                        <tbody className="divide-y divide-slate-100">

                          {selectedDepartmentStaff.map(
                            (member) => (

                              <tr
                                key={
                                  member._id ||
                                  member.staffId ||
                                  member.email
                                }
                                className="transition hover:bg-slate-50"
                              >

                                {/* Staff */}

                                <td className="px-5 py-4">

                                  <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">

                                      {String(
                                        member.name ||
                                          "S"
                                      )
                                        .charAt(
                                          0
                                        )
                                        .toUpperCase()}

                                    </div>

                                    <div>

                                      <p className="text-sm font-semibold text-slate-800">
                                        {
                                          member.name ||
                                          "Unnamed Staff"
                                        }
                                      </p>

                                      <p className="text-xs text-slate-500">
                                        {
                                          member.email ||
                                          "No email"
                                        }
                                      </p>

                                    </div>

                                  </div>

                                </td>

                                {/* Staff ID */}

                                <td className="px-5 py-4 text-sm text-slate-600">
                                  {
                                    member.staffId ||
                                    "—"
                                  }
                                </td>

                                {/* Contact */}

                                <td className="px-5 py-4">

                                  <p className="text-sm text-slate-700">
                                    {
                                      member.phone ||
                                      "No phone"
                                    }
                                  </p>

                                  {member.address && (

                                    <p className="mt-1 max-w-[220px] truncate text-xs text-slate-400">
                                      {
                                        member.address
                                      }
                                    </p>

                                  )}

                                </td>

                                {/* Role */}

                                <td className="px-5 py-4 text-sm text-slate-600">
                                  {
                                    member.role ||
                                    "Staff"
                                  }
                                </td>

                                {/* Status */}

                                <td className="px-5 py-4">

                                  <span
                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                      member.status ===
                                      "Active"
                                        ? "bg-emerald-50 text-emerald-600"
                                        : "bg-red-50 text-red-500"
                                    }`}
                                  >
                                    {
                                      member.status ||
                                      "Unknown"
                                    }
                                  </span>

                                </td>

                              </tr>

                            )
                          )}

                        </tbody>

                      </table>

                    </div>

                    {/* Mobile Cards */}

                    <div className="divide-y divide-slate-100 md:hidden">

                      {selectedDepartmentStaff.map(
                        (member) => (

                          <div
                            key={
                              member._id ||
                              member.staffId ||
                              member.email
                            }
                            className="p-4"
                          >

                            <div className="flex items-start justify-between gap-3">

                              <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">

                                  {String(
                                    member.name ||
                                      "S"
                                  )
                                    .charAt(
                                      0
                                    )
                                    .toUpperCase()}

                                </div>

                                <div>

                                  <p className="text-sm font-semibold text-slate-800">
                                    {
                                      member.name ||
                                      "Unnamed Staff"
                                    }
                                  </p>

                                  <p className="text-xs text-slate-500">
                                    {
                                      member.staffId ||
                                      "No Staff ID"
                                    }
                                  </p>

                                </div>

                              </div>

                              <span
                                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                  member.status ===
                                  "Active"
                                    ? "bg-emerald-50 text-emerald-600"
                                    : "bg-red-50 text-red-500"
                                }`}
                              >
                                {
                                  member.status ||
                                  "Unknown"
                                }
                              </span>

                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-2 text-xs text-slate-500">

                              <p>

                                <span className="font-semibold text-slate-700">
                                  Email:
                                </span>{" "}

                                {
                                  member.email ||
                                  "No email"
                                }

                              </p>

                              <p>

                                <span className="font-semibold text-slate-700">
                                  Phone:
                                </span>{" "}

                                {
                                  member.phone ||
                                  "No phone"
                                }

                              </p>

                              <p>

                                <span className="font-semibold text-slate-700">
                                  Role:
                                </span>{" "}

                                {
                                  member.role ||
                                  "Staff"
                                }

                              </p>

                              {member.address && (

                                <p>

                                  <span className="font-semibold text-slate-700">
                                    Address:
                                  </span>{" "}

                                  {
                                    member.address
                                  }

                                </p>

                              )}

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  </div>

                )}

              </div>

              {/* ==================================================
                  MODAL FOOTER
              ================================================== */}

              <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">

                <p className="text-sm text-slate-500">

                  Showing{" "}

                  <span className="font-semibold text-slate-800">
                    {
                      selectedDepartmentStaff.length
                    }
                  </span>{" "}

                  staff member

                  {selectedDepartmentStaff.length !==
                  1
                    ? "s"
                    : ""}

                </p>

                <button
                  type="button"
                  onClick={
                    closeStaffModal
                  }
                  className="rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-900"
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        )}

    </div>
  );
};

// ======================================================
// STAT CARD
// ======================================================

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  bg,
  text,
}) => {
  return (

    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">

      <div className="flex items-start justify-between gap-4">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            {subtitle}
          </p>

        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl ${bg} ${text}`}
        >
          {icon}
        </div>

      </div>

    </div>

  );
};

// ======================================================
// MINI STAT
// ======================================================

const MiniStat = ({
  label,
  value,
}) => {
  return (

    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">

      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold text-slate-900">
        {value}
      </p>

    </div>

  );
};

// ======================================================
// DEPARTMENT CARD
// ======================================================

const DepartmentCard = ({
  department,
  onViewStaff,
  onEdit,
  onDelete,
}) => {

  const {
    name,
    description,
    icon,
    status,
    totalStaff,
    complaints,
    resolvedComplaints,
  } = department;

  const isActive =
    status === "Active";

  return (

    <div className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">

      {/* CARD BODY */}

      <div className="p-5">

        <div className="flex items-start justify-between gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
            {icon || "🏢"}
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isActive
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-500"
            }`}
          >
            {status}
          </span>

        </div>

        <h3 className="mt-5 text-base font-bold text-slate-900">
          {name}
        </h3>

        <p className="mt-2 min-h-[48px] text-sm leading-5 text-slate-500">
          {description}
        </p>

        {/* METRICS */}

        <div className="mt-5 grid grid-cols-3 divide-x divide-slate-200 border-t border-slate-100 pt-4">

          <div className="pr-2">

            <div className="flex items-center gap-1.5">

              <span className="text-sm">
                👥
              </span>

              <span className="text-sm font-bold text-slate-800">
                {totalStaff || 0}
              </span>

            </div>

            <p className="mt-1 text-xs text-slate-500">
              Staff
            </p>

          </div>

          <div className="px-2">

            <div className="flex items-center gap-1.5">

              <span className="text-sm">
                📄
              </span>

              <span className="text-sm font-bold text-slate-800">
                {complaints || 0}
              </span>

            </div>

            <p className="mt-1 text-xs text-slate-500">
              Complaints
            </p>

          </div>

          <div className="pl-2">

            <div className="flex items-center gap-1.5">

              <span className="text-sm">
                ✓
              </span>

              <span className="text-sm font-bold text-slate-800">
                {resolvedComplaints ||
                  0}
              </span>

            </div>

            <p className="mt-1 text-xs text-slate-500">
              Resolved
            </p>

          </div>

        </div>

      </div>

      {/* ACTIONS */}

      <div className="flex gap-2 border-t border-slate-100 bg-slate-50/70 p-4">

        <button
          type="button"
          onClick={() =>
            onViewStaff(
              department
            )
          }
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-2 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
        >
          <span>👥</span>
          <span>
            View Staff
          </span>
        </button>

        <button
          type="button"
          onClick={() =>
            onEdit(department)
          }
          className="flex items-center justify-center gap-1 rounded-lg border border-blue-200 bg-white px-3 py-2.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
        >
          <span>✎</span>
          <span>
            Edit
          </span>
        </button>

        <button
          type="button"
          onClick={() =>
            onDelete(department)
          }
          className="flex items-center justify-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-2.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
        >
          <span>🗑</span>
          <span>
            Delete
          </span>
        </button>

      </div>

    </div>

  );
};

export default Departments;
