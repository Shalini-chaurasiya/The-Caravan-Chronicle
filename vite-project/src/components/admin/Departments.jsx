
import React, { useCallback, useEffect, useMemo, useState } from "react";

const API_BASE_URL = "http://localhost:3000/api";
const DEPARTMENT_API_URL = `${API_BASE_URL}/departments`;
const STAFF_API_URL = `${API_BASE_URL}/staff`;

const ICON_OPTIONS = [
  "💧", "🛣️", "⚡", "🚰", "🗑️", "🌿",
  "🚦", "🏢", "🏛️", "🔧", "🏥", "📚",
];

const EMPTY_FORM = {
  name: "",
  description: "",
  icon: "🏢",
  status: "Active",
};

const getToken = () =>
  localStorage.getItem("adminToken") ||
  localStorage.getItem("admin_token") ||
  localStorage.getItem("token") ||
  "";

const apiRequest = async (url, options = {}) => {
  const token = getToken();

  if (!token) {
    throw new Error("Admin token not found. Please log in again.");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
};

const getList = (data, key) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  return [];
};

const getStaffId = (member) =>
  member?._id || member?.id || member?.staffId || member?.email;

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [staff, setStaff] = useState([]);

  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [loadingSelectedStaff, setLoadingSelectedStaff] = useState(false);

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [departmentForm, setDepartmentForm] = useState(EMPTY_FORM);
  const [savingDepartment, setSavingDepartment] = useState(false);

  const [showStaffModal, setShowStaffModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [staffSearch, setStaffSearch] = useState("");
  const [staffModalError, setStaffModalError] = useState("");

  // ==================================================
  // FETCH DATA
  // ==================================================

  const fetchDepartments = useCallback(async () => {
    setLoadingDepartments(true);

    try {
      const data = await apiRequest(DEPARTMENT_API_URL);
      setDepartments(getList(data, "departments"));
      setError("");
    } catch (err) {
      setError(err.message || "Unable to load departments.");
    } finally {
      setLoadingDepartments(false);
    }
  }, []);

  const fetchStaff = useCallback(async () => {
    setLoadingStaff(true);

    try {
      const data = await apiRequest(STAFF_API_URL);
      setStaff(getList(data, "staff"));
    } catch (err) {
      setError(err.message || "Unable to load staff.");
    } finally {
      setLoadingStaff(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
    fetchStaff();
  }, [fetchDepartments, fetchStaff]);

  // ==================================================
  // DEPARTMENT STATISTICS
  // Uses backend complaint counts when provided.
  // ==================================================

  const departmentData = useMemo(() => {
    return departments.map((department) => {
      const departmentStaff = staff.filter(
        (member) =>
          String(member.department || "").trim().toLowerCase() ===
          String(department.name || "").trim().toLowerCase()
      );

      const activeStaff = departmentStaff.filter(
        (member) => member.status === "Active"
      ).length;

      const inactiveStaff = departmentStaff.filter(
        (member) => member.status === "Inactive"
      ).length;

      return {
        ...department,
        totalStaff: department.totalStaff ?? departmentStaff.length,
        activeStaff: department.activeStaff ?? activeStaff,
        inactiveStaff: department.inactiveStaff ?? inactiveStaff,
        complaints: Number(
          department.complaints ??
          department.assignedComplaints ??
          department.complaintCount ??
          0
        ),
        resolvedComplaints: Number(
          department.resolvedComplaints ??
          department.resolvedComplaintCount ??
          0
        ),
      };
    });
  }, [departments, staff]);

  const filteredDepartments = useMemo(() => {
    const term = search.trim().toLowerCase();

    return departmentData.filter((department) => {
      const matchesSearch =
        !term ||
        String(department.name || "").toLowerCase().includes(term) ||
        String(department.description || "").toLowerCase().includes(term);

      const matchesDepartment =
        !departmentFilter || department.name === departmentFilter;

      const matchesStatus =
        !statusFilter || department.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [departmentData, search, departmentFilter, statusFilter]);

  const selectedStaffFiltered = useMemo(() => {
    const term = staffSearch.trim().toLowerCase();

    return selectedStaff.filter((member) => {
      if (!term) return true;

      return [
        member.name,
        member.email,
        member.phone,
        member.staffId,
        member.role,
      ].some((value) => String(value || "").toLowerCase().includes(term));
    });
  }, [selectedStaff, staffSearch]);

  const totalDepartments = departments.length;
  const totalStaff = staff.length;

  // Each complaint should belong to one department for these totals
  // to represent unique complaints rather than duplicated assignments.
  const totalComplaints = departmentData.reduce(
    (sum, department) => sum + department.complaints,
    0
  );

  const totalResolved = departmentData.reduce(
    (sum, department) => sum + department.resolvedComplaints,
    0
  );

  const resolutionRate = totalComplaints
    ? Math.round((totalResolved / totalComplaints) * 100)
    : 0;

  // ==================================================
  // OPEN / CLOSE DEPARTMENT FORM
  // ==================================================

  const openAddDepartment = () => {
    setEditingDepartment(null);
    setDepartmentForm({ ...EMPTY_FORM });
    setShowDepartmentModal(true);
  };

  const openEditDepartment = (department) => {
    setEditingDepartment(department);

    setDepartmentForm({
      name: department.name || "",
      description: department.description || "",
      icon: department.icon || "🏢",
      status: department.status || "Active",
    });

    setShowDepartmentModal(true);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setDepartmentForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==================================================
  // CREATE / UPDATE DEPARTMENT
  // ==================================================

  const handleSaveDepartment = async (event) => {
    event.preventDefault();

    const name = departmentForm.name.trim();
    const description = departmentForm.description.trim();

    if (!name || !description) {
      window.alert("Department name and description are required.");
      return;
    }

    try {
      setSavingDepartment(true);
      setError("");

      const isEditing = Boolean(editingDepartment);
      const url = isEditing
        ? `${DEPARTMENT_API_URL}/${editingDepartment._id}`
        : DEPARTMENT_API_URL;

      await apiRequest(url, {
        method: isEditing ? "PUT" : "POST",
        body: JSON.stringify({
          name,
          description,
          icon: departmentForm.icon,
          status: departmentForm.status,
        }),
      });

      setShowDepartmentModal(false);
      setEditingDepartment(null);
      setDepartmentForm({ ...EMPTY_FORM });

      // Reload so staff totals and complaint statistics stay in sync.
      await Promise.all([fetchDepartments(), fetchStaff()]);
    } catch (err) {
      window.alert(err.message || "Unable to save department.");
    } finally {
      setSavingDepartment(false);
    }
  };

  // ==================================================
  // DELETE DEPARTMENT
  // ==================================================

  const handleDeleteDepartment = async (department) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${department.name}"?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await apiRequest(`${DEPARTMENT_API_URL}/${department._id}`, {
        method: "DELETE",
      });

      if (selectedDepartment?._id === department._id) {
        closeStaffModal();
      }

      await fetchDepartments();
    } catch (err) {
      window.alert(err.message || "Unable to delete department.");
    }
  };

  // ==================================================
  // VIEW DEPARTMENT STAFF
  // ==================================================

  const handleViewStaff = async (department) => {
    setSelectedDepartment(department);
    setSelectedStaff([]);
    setStaffSearch("");
    setStaffModalError("");
    setShowStaffModal(true);
    setLoadingSelectedStaff(true);

    try {
      const data = await apiRequest(
        `${DEPARTMENT_API_URL}/${department._id}/staff`
      );

      const departmentStaff = getList(data, "staff");

      setSelectedStaff(departmentStaff);

      // Refresh the main staff list separately.
      await fetchStaff();

      setSelectedDepartment((previous) =>
        previous
          ? {
              ...previous,
              totalStaff: data.totalStaff ?? data.count ?? departmentStaff.length,
              activeStaff:
                data.activeStaff ??
                departmentStaff.filter((m) => m.status === "Active").length,
              inactiveStaff:
                data.inactiveStaff ??
                departmentStaff.filter((m) => m.status === "Inactive").length,
              complaints: data.complaints ?? previous.complaints ?? 0,
              resolvedComplaints:
                data.resolvedComplaints ??
                previous.resolvedComplaints ??
                0,
            }
          : previous
      );
    } catch (err) {
      setStaffModalError(err.message || "Unable to load department staff.");
    } finally {
      setLoadingSelectedStaff(false);
    }
  };

  const closeStaffModal = () => {
    setShowStaffModal(false);
    setSelectedDepartment(null);
    setSelectedStaff([]);
    setStaffSearch("");
    setStaffModalError("");
  };

  const resetFilters = () => {
    setSearch("");
    setDepartmentFilter("");
    setStatusFilter("");
  };

  // Lock background scrolling while a modal is open.
  useEffect(() => {
    const isModalOpen = showDepartmentModal || showStaffModal;

    document.body.style.overflow = isModalOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [showDepartmentModal, showStaffModal]);

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-5 py-4 md:px-7">
        <div className="flex items-center gap-4">
          <div className="text-2xl text-blue-600">🏛️</div>

          <div className="min-w-0 flex-1">
            <p className="font-bold text-slate-900">Caravan Chronicle</p>
            <p className="text-xs text-slate-500">Municipal Administration</p>
          </div>

          <div className="relative hidden max-w-md flex-1 md:block">
            <span className="absolute left-4 top-1/2 -translate-y-1/2">🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search departments..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              👤
            </div>
            <span className="hidden text-sm font-semibold text-slate-800 sm:block">
              Admin
            </span>
          </div>
        </div>
      </header>

      <main className="p-5 md:p-7 lg:p-8">
        {/* Title */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Department Management
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage departments, staff allocation and complaint performance.
            </p>
          </div>

          <button
            onClick={openAddDepartment}
            className="w-fit rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            + Add Department
          </button>
        </div>

        {/* Summary cards */}
        <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Departments"
            value={loadingDepartments ? "…" : totalDepartments}
            subtitle="Departments in system"
            icon="🏢"
            bg="bg-blue-100"
            text="text-blue-600"
          />
          <StatCard
            title="Total Staff"
            value={loadingStaff ? "…" : totalStaff}
            subtitle="Across all departments"
            icon="👥"
            bg="bg-emerald-100"
            text="text-emerald-600"
          />
          <StatCard
            title="Total Complaints"
            value={loadingDepartments ? "…" : totalComplaints}
            subtitle="Assigned complaints"
            icon="📄"
            bg="bg-orange-100"
            text="text-orange-600"
          />
          <StatCard
            title="Resolved Complaints"
            value={loadingDepartments ? "…" : totalResolved}
            subtitle={`${resolutionRate}% resolution rate`}
            icon="✓"
            bg="bg-purple-100"
            text="text-purple-600"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={() => {
                fetchDepartments();
                fetchStaff();
              }}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Filters */}
        <section className="mt-7 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search departments..."
              className="h-11 rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
            />

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-blue-500"
            >
              <option value="">All Departments</option>
              {departments.map((department) => (
                <option key={department._id} value={department.name}>
                  {department.name}
                </option>
              ))}
            </select>

            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-11 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <button
                onClick={resetFilters}
                className="h-11 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Reset
              </button>
            </div>
          </div>
        </section>

        {/* Department list heading */}
        <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">All Departments</h2>
            <p className="mt-1 text-sm text-slate-500">
              View and manage municipal departments.
            </p>
          </div>
          <p className="text-sm text-slate-500">
            Showing <strong>{filteredDepartments.length}</strong> of{" "}
            <strong>{departments.length}</strong> departments
          </p>
        </div>

        {/* Cards */}
        {loadingDepartments ? (
          <LoadingPanel text="Loading departments..." />
        ) : filteredDepartments.length === 0 ? (
          <EmptyPanel
            icon="🔍"
            title="No departments found"
            text="Try changing your search or filters, or add a department."
          />
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {filteredDepartments.map((department) => (
              <DepartmentCard
                key={department._id}
                department={department}
                onViewStaff={handleViewStaff}
                onEdit={openEditDepartment}
                onDelete={handleDeleteDepartment}
              />
            ))}
          </div>
        )}
      </main>

      {/* ==================================================
          ADD / EDIT DEPARTMENT MODAL
      ================================================== */}
      {showDepartmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="my-auto max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingDepartment ? "Edit Department" : "Add Department"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Enter department details below.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDepartmentModal(false)}
                disabled={savingDepartment}
                className="h-9 w-9 rounded-full text-2xl text-slate-400 hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveDepartment} className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Department Name
                </label>
                <input
                  name="name"
                  value={departmentForm.name}
                  onChange={handleFormChange}
                  placeholder="e.g. Water Supply"
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={departmentForm.description}
                  onChange={handleFormChange}
                  rows={4}
                  placeholder="Describe the department's responsibilities..."
                  className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Department Icon
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {ICON_OPTIONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() =>
                        setDepartmentForm((previous) => ({
                          ...previous,
                          icon,
                        }))
                      }
                      className={`flex h-11 items-center justify-center rounded-lg border text-xl ${
                        departmentForm.icon === icon
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Status
                </label>
                <select
                  name="status"
                  value={departmentForm.status}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  disabled={savingDepartment}
                  onClick={() => setShowDepartmentModal(false)}
                  className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingDepartment}
                  className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
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
      {showStaffModal && selectedDepartment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 backdrop-blur-sm sm:p-5">
          <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-slate-200 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                    {selectedDepartment.icon || "🏢"}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {selectedDepartment.name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Staff assigned to this department
                    </p>
                  </div>
                </div>

                <button
                  onClick={closeStaffModal}
                  className="h-9 w-9 shrink-0 rounded-full text-2xl text-slate-400 hover:bg-slate-100"
                >
                  ×
                </button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <MiniStat
                  label="Total Staff"
                  value={selectedDepartment.totalStaff ?? selectedStaff.length}
                />
                <MiniStat
                  label="Active"
                  value={
                    selectedDepartment.activeStaff ??
                    selectedStaff.filter((m) => m.status === "Active").length
                  }
                />
                <MiniStat
                  label="Inactive"
                  value={
                    selectedDepartment.inactiveStaff ??
                    selectedStaff.filter((m) => m.status === "Inactive").length
                  }
                />
                <MiniStat
                  label="Complaints"
                  value={selectedDepartment.complaints ?? 0}
                />
              </div>
            </div>

            <div className="border-b border-slate-200 bg-slate-50 p-4 sm:px-6">
              <input
                value={staffSearch}
                onChange={(e) => setStaffSearch(e.target.value)}
                placeholder="Search by name, ID, email, phone or role..."
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
              {loadingSelectedStaff ? (
                <LoadingPanel text="Loading department staff..." />
              ) : staffModalError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                  <p>{staffModalError}</p>
                  <button
                    onClick={() => handleViewStaff(selectedDepartment)}
                    className="mt-3 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                  >
                    Retry
                  </button>
                </div>
              ) : selectedStaffFiltered.length === 0 ? (
                <EmptyPanel
                  icon="👥"
                  title="No staff found"
                  text={
                    staffSearch
                      ? "No staff members match your search."
                      : "No staff members are assigned to this department."
                  }
                />
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="hidden overflow-x-auto rounded-xl border border-slate-200 md:block">
                    <table className="w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          {["Staff", "Staff ID", "Contact", "Role", "Status"].map(
                            (heading) => (
                              <th
                                key={heading}
                                className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                              >
                                {heading}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedStaffFiltered.map((member) => (
                          <tr
                            key={getStaffId(member)}
                            className="hover:bg-slate-50"
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <Avatar name={member.name} />
                                <div>
                                  <p className="text-sm font-semibold text-slate-800">
                                    {member.name || "Unnamed Staff"}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {member.email || "No email"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-sm text-slate-600">
                              {member.staffId || "—"}
                            </td>
                            <td className="px-5 py-4">
                              <p className="text-sm text-slate-700">
                                {member.phone || "No phone"}
                              </p>
                              <p className="mt-1 max-w-[220px] truncate text-xs text-slate-400">
                                {member.address || ""}
                              </p>
                            </td>
                            <td className="px-5 py-4 text-sm text-slate-600">
                              {member.role || "Staff"}
                            </td>
                            <td className="px-5 py-4">
                              <StatusBadge status={member.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards */}
                  <div className="space-y-3 md:hidden">
                    {selectedStaffFiltered.map((member) => (
                      <div
                        key={getStaffId(member)}
                        className="rounded-xl border border-slate-200 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <Avatar name={member.name} />
                            <div>
                              <p className="font-semibold text-slate-800">
                                {member.name || "Unnamed Staff"}
                              </p>
                              <p className="text-xs text-slate-500">
                                {member.staffId || "No Staff ID"}
                              </p>
                            </div>
                          </div>
                          <StatusBadge status={member.status} />
                        </div>

                        <div className="mt-4 space-y-2 break-words text-sm text-slate-600">
                          <p><strong>Email:</strong> {member.email || "—"}</p>
                          <p><strong>Phone:</strong> {member.phone || "—"}</p>
                          <p><strong>Role:</strong> {member.role || "Staff"}</p>
                          {member.address && (
                            <p><strong>Address:</strong> {member.address}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
              <p className="text-sm text-slate-500">
                Showing <strong>{selectedStaffFiltered.length}</strong> staff member(s)
              </p>
              <button
                onClick={closeStaffModal}
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

// ==================================================
// REUSABLE COMPONENTS
// ==================================================

const StatCard = ({ title, value, subtitle, icon, bg, text }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
      </div>
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl ${bg} ${text}`}>
        {icon}
      </div>
    </div>
  </div>
);

const MiniStat = ({ label, value }) => (
  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
    <p className="text-xs text-slate-500">{label}</p>
    <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
  </div>
);

const LoadingPanel = ({ text }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
    <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
    <p className="mt-4 text-sm text-slate-500">{text}</p>
  </div>
);

const EmptyPanel = ({ icon, title, text }) => (
  <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
    <div className="text-4xl">{icon}</div>
    <h3 className="mt-3 font-semibold text-slate-800">{title}</h3>
    <p className="mt-2 text-sm text-slate-500">{text}</p>
  </div>
);

const Avatar = ({ name }) => (
  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
    {String(name || "S").charAt(0).toUpperCase()}
  </div>
);

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
      status === "Active"
        ? "bg-emerald-50 text-emerald-600"
        : status === "Inactive"
        ? "bg-red-50 text-red-500"
        : "bg-slate-100 text-slate-600"
    }`}
  >
    {status || "Unknown"}
  </span>
);

const DepartmentCard = ({ department, onViewStaff, onEdit, onDelete }) => {
  const {
    name,
    description,
    icon,
    status,
    totalStaff,
    complaints,
    resolvedComplaints,
  } = department;

  return (
    <div className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
            {icon || "🏢"}
          </div>
          <StatusBadge status={status} />
        </div>

        <h3 className="mt-5 text-base font-bold text-slate-900">{name}</h3>
        <p className="mt-2 min-h-12 text-sm leading-5 text-slate-500">
          {description || "No description available."}
        </p>

        <div className="mt-5 grid grid-cols-3 divide-x divide-slate-200 border-t border-slate-100 pt-4">
          <Metric icon="👥" value={totalStaff} label="Staff" />
          <Metric icon="📄" value={complaints} label="Complaints" />
          <Metric icon="✓" value={resolvedComplaints} label="Resolved" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-slate-100 bg-slate-50/70 p-4">
        <button
          onClick={() => onViewStaff(department)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-2 py-2.5 text-xs font-semibold text-white hover:bg-blue-700"
        >
          👥 View Staff
        </button>
        <button
          onClick={() => onEdit(department)}
          className="rounded-lg border border-blue-200 bg-white px-3 py-2.5 text-xs font-semibold text-blue-600 hover:bg-blue-50"
        >
          ✎ Edit
        </button>
        <button
          onClick={() => onDelete(department)}
          className="rounded-lg border border-red-200 bg-white px-3 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50"
        >
          🗑 Delete
        </button>
      </div>
    </div>
  );
};

const Metric = ({ icon, value, label }) => (
  <div className="px-2 first:pl-0 last:pr-0">
    <div className="flex items-center gap-1.5">
      <span className="text-sm">{icon}</span>
      <span className="text-sm font-bold text-slate-800">{value ?? 0}</span>
    </div>
    <p className="mt-1 text-xs text-slate-500">{label}</p>
  </div>
);

export default Departments;
