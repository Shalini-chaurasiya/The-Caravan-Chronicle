
import React, { useState, useEffect, useCallback, useMemo } from "react";
import StaffTable from "./StaffTable";
import AddStaffModal from "./AddStaffModel";

const API_URL = "http://localhost:3000/api/staff";
const SERVER_URL = "http://localhost:3000";

const departments = [
  "Roads & Infrastructure",
  "Electrical & Street Lighting",
  "Water Supply",
  "Sanitation",
  "Drainage & Sewerage",
  "Parks & Horticulture",
  "Traffic Management",
  "Building & Construction",
  "General Administration",
];

const normalizeStaff = (member) => ({
  ...member,
  id: member._id,
  staffId: member.staffId,
  complaints: member.complaints ?? 0,
  photo: member.photo
    ? member.photo.startsWith("http")
      ? member.photo
      : `${SERVER_URL}${member.photo}`
    : null,
});

const StaffManagement = () => {
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Read the admin token saved by your login page.
  const getToken = () => localStorage.getItem("adminToken");

  // Common authenticated API request.
  const apiRequest = async (url, options = {}) => {
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
        ...(options.body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error(
          data.message || "Admin authentication failed. Please log in again."
        );
      }

      throw new Error(
        data.message || "Something went wrong with the request."
      );
    }

    return data;
  };

  // Fetch staff from MongoDB.
  const fetchStaff = useCallback(async () => {
    try {
      setError("");

      const data = await apiRequest(API_URL);

      const members = Array.isArray(data)
        ? data
        : data.staff || [];

      setStaff(members.map(normalizeStaff));
    } catch (err) {
      setError(err.message || "Unable to fetch staff members.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  // ADD STAFF
  // AddStaffModal performs the POST request.
  // This callback refreshes the list after a successful addition.
  const handleAddStaff = async () => {
    setShowAddStaff(false);
    await fetchStaff();
  };

  // DELETE STAFF
  const handleDeleteStaff = async (staffId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this staff member?"
    );

    if (!confirmed) return;

    try {
      await apiRequest(`${API_URL}/${staffId}`, {
        method: "DELETE",
      });

      await fetchStaff();
      window.alert("Staff member deleted successfully.");
    } catch (err) {
      window.alert(err.message);
    }
  };

  // ACTIVATE / DEACTIVATE STAFF
  const handleToggleStatus = async (staffId) => {
    const member = staff.find(
      (item) => item.id === staffId || item.staffId === staffId
    );

    if (!member) {
      window.alert("Staff member not found.");
      return;
    }

    const nextStatus =
      member.status === "Active" ? "Inactive" : "Active";

    try {
      await apiRequest(`${API_URL}/${member.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });

      await fetchStaff();
    } catch (err) {
      window.alert(err.message);
    }
  };

  // EDIT STAFF
  // StaffTable must pass the edited staff object to this callback.
  const handleEditStaff = async (updatedStaff) => {
    const staffId = updatedStaff._id || updatedStaff.id;

    if (!staffId) {
      window.alert("Staff ID is missing. Unable to update staff.");
      return;
    }

    try {
      const body = new FormData();

      const editableFields = [
        "name",
        "email",
        "phone",
        "gender",
        "dob",
        "department",
        "role",
        "experience",
        "address",
        "city",
        "state",
        "pincode",
      ];

      editableFields.forEach((field) => {
        if (updatedStaff[field] !== undefined) {
          body.append(field, updatedStaff[field] ?? "");
        }
      });

      // Optional replacement photo.
      if (updatedStaff.photoFile instanceof File) {
        body.append("photo", updatedStaff.photoFile);
      }

      await apiRequest(`${API_URL}/${staffId}`, {
        method: "PUT",
        body,
      });

      await fetchStaff();
      window.alert("Staff details updated successfully.");
    } catch (err) {
      window.alert(err.message);
    }
  };

  // SEARCH AND FILTER
  const filteredStaff = useMemo(() => {
    const term = search.trim().toLowerCase();

    return staff.filter((member) => {
      const matchesSearch =
        !term ||
        [
          member.name,
          member.email,
          member.staffId,
          member.phone,
          member.department,
        ].some((value) =>
          String(value || "").toLowerCase().includes(term)
        );

      const matchesDepartment =
        !departmentFilter ||
        member.department === departmentFilter;

      const matchesStatus =
        !statusFilter || member.status === statusFilter;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus
      );
    });
  }, [staff, search, departmentFilter, statusFilter]);

  const totalStaff = staff.length;

  const activeStaff = staff.filter(
    (member) => member.status === "Active"
  ).length;

  const inactiveStaff = staff.filter(
    (member) => member.status === "Inactive"
  ).length;

  const assignedComplaints = staff.reduce(
    (total, member) => total + Number(member.complaints || 0),
    0
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Municipal Services
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Staff Management
          </h1>

          <p className="mt-2 text-slate-500">
            Manage staff accounts, roles, and complaint assignments.
          </p>
        </div>

        <button
          onClick={() => setShowAddStaff(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <span className="text-xl leading-none">+</span>
          Add Staff
        </button>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>{error}</p>

          <button
            onClick={fetchStaff}
            className="mt-2 font-semibold underline"
          >
            Retry loading staff
          </button>
        </div>
      )}

      {/* STAT CARDS */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Staff" value={totalStaff} icon="👥" />
        <StatCard title="Active Staff" value={activeStaff} icon="✓" color="text-green-600" />
        <StatCard title="Inactive Staff" value={inactiveStaff} icon="!" color="text-orange-500" />
        <StatCard title="Assigned Complaints" value={assignedComplaints} icon="📋" color="text-purple-600" />
      </div>

      {/* SEARCH / FILTER */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, email, phone or staff ID..."
            className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <select
            value={departmentFilter}
            onChange={(event) => setDepartmentFilter(event.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-blue-500"
          >
            <option value="">All Departments</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* STAFF TABLE */}
      <div className="mt-6">
        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500">
            Loading staff members...
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
            <p className="font-semibold text-slate-700">
              No staff members found
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Add a staff member or change your search filters.
            </p>
          </div>
        ) : (
          <StaffTable
            staff={filteredStaff}
            onDelete={handleDeleteStaff}
            onToggleStatus={handleToggleStatus}
            onEdit={handleEditStaff}
          />
        )}
      </div>

      {/* ADD STAFF MODAL */}
      {showAddStaff && (
        <AddStaffModal
          onClose={() => setShowAddStaff(false)}
          onAddStaff={handleAddStaff}
        />
      )}
    </div>
  );
};

const StatCard = ({
  title,
  value,
  icon,
  color = "text-slate-900",
}) => (
  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        <p className={`mt-2 text-3xl font-bold ${color}`}>
          {value}
        </p>
      </div>

      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-xl">
        {icon}
      </div>
    </div>
  </div>
);

export default StaffManagement;
