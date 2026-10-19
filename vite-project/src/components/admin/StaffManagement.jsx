import React, { useState } from "react";
import StaffTable from "./StaffTable";
import AddStaffModal from "./AddStaffModal";

const StaffManagement = () => {
  const [showAddStaff, setShowAddStaff] = useState(false);

  const [staff, setStaff] = useState([
    {
      id: "ST001",
      name: "Rahul Sharma",
      email: "rahul@municipal.gov",
      phone: "9876543210",
      department: "Sanitation",
      role: "Staff",
      experience: 5,
      complaints: 4,
      status: "Active",
      gender: "Male",
      dob: "1996-05-12",
      address: "Civil Lines, Prayagraj",
      city: "Prayagraj",
      state: "Uttar Pradesh",
      pincode: "211001",
      photo: null,
    },

    {
      id: "ST002",
      name: "Anjali Verma",
      email: "anjali@municipal.gov",
      phone: "9876543211",
      department: "Roads & Infrastructure",
      role: "Senior Staff",
      experience: 3,
      complaints: 2,
      status: "Active",
      gender: "Female",
      dob: "1998-08-20",
      address: "Katra, Prayagraj",
      city: "Prayagraj",
      state: "Uttar Pradesh",
      pincode: "211002",
      photo: null,
    },

    {
      id: "ST003",
      name: "Amit Singh",
      email: "amit@municipal.gov",
      phone: "9876543212",
      department: "Water Supply",
      role: "Staff",
      experience: 7,
      complaints: 0,
      status: "Inactive",
      gender: "Male",
      dob: "1992-02-15",
      address: "Naini, Prayagraj",
      city: "Prayagraj",
      state: "Uttar Pradesh",
      pincode: "211003",
      photo: null,
    },

    {
      id: "ST004",
      name: "Priya Gupta",
      email: "priya@municipal.gov",
      phone: "9876543213",
      department: "Public Health",
      role: "Department Officer",
      experience: 6,
      complaints: 6,
      status: "Active",
      gender: "Female",
      dob: "1994-11-10",
      address: "George Town, Prayagraj",
      city: "Prayagraj",
      state: "Uttar Pradesh",
      pincode: "211004",
      photo: null,
    },
  ]);

  /* =========================
     ADD STAFF
  ========================= */

  const handleAddStaff = (newStaff) => {
    const newId = `ST${String(staff.length + 1).padStart(3, "0")}`;

    const staffMember = {
      ...newStaff,
      id: newId,
      complaints: 0,
      status: "Active",
    };

    setStaff((prev) => [...prev, staffMember]);
    setShowAddStaff(false);
  };

  /* =========================
     DELETE STAFF
  ========================= */

  const handleDeleteStaff = (staffId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this staff member?"
    );

    if (!confirmDelete) return;

    setStaff((prev) =>
      prev.filter((member) => member.id !== staffId)
    );
  };

  /* =========================
     ACTIVATE / DEACTIVATE
  ========================= */

  const handleToggleStatus = (staffId) => {
    setStaff((prev) =>
      prev.map((member) =>
        member.id === staffId
          ? {
              ...member,
              status:
                member.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : member
      )
    );
  };

  /* =========================
     EDIT STAFF
  ========================= */

  const handleEditStaff = (updatedStaff) => {
    setStaff((prev) =>
      prev.map((member) =>
        member.id === updatedStaff.id
          ? updatedStaff
          : member
      )
    );
  };

  /* =========================
     STATS
  ========================= */

  const totalStaff = staff.length;

  const activeStaff = staff.filter(
    (member) => member.status === "Active"
  ).length;

  const inactiveStaff = staff.filter(
    (member) => member.status === "Inactive"
  ).length;

  const assignedComplaints = staff.reduce(
    (total, member) => total + member.complaints,
    0
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">

      {/* =========================
          HEADER
      ========================= */}

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

      {/* =========================
          STAT CARDS
      ========================= */}

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Staff
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {totalStaff}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-xl">
              👥
            </div>

          </div>

        </div>

        {/* Active */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Active Staff
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                {activeStaff}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-xl">
              ✓
            </div>

          </div>

        </div>

        {/* Inactive */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Inactive Staff
              </p>

              <p className="mt-2 text-3xl font-bold text-orange-500">
                {inactiveStaff}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-xl">
              !
            </div>

          </div>

        </div>

        {/* Complaints */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Assigned Complaints
              </p>

              <p className="mt-2 text-3xl font-bold text-purple-600">
                {assignedComplaints}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-xl">
              📋
            </div>

          </div>

        </div>

      </div>

      {/* =========================
          SEARCH / FILTER
      ========================= */}

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex flex-col gap-4 lg:flex-row">

          <div className="relative flex-1">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search staff by name, email or staff ID..."
              className="w-full rounded-lg border border-slate-300 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          <select className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-blue-500">
            <option value="">All Departments</option>
            <option>Sanitation</option>
            <option>Roads & Infrastructure</option>
            <option>Water Supply</option>
            <option>Public Health</option>
            <option>Waste Management</option>
            <option>Street Lighting</option>
          </select>

          <select className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-blue-500">
            <option value="">All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>

        </div>

      </div>

      {/* =========================
          STAFF TABLE
      ========================= */}

      <div className="mt-6">

        <StaffTable
          staff={staff}
          onDelete={handleDeleteStaff}
          onToggleStatus={handleToggleStatus}
          onEdit={handleEditStaff}
        />

      </div>

      {/* =========================
          ADD STAFF MODAL
      ========================= */}

      {showAddStaff && (
        <AddStaffModal
          onClose={() => setShowAddStaff(false)}
          onAddStaff={handleAddStaff}
        />
      )}

    </div>
  );
};

export default StaffManagement;