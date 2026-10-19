import React, { useState } from "react";

const StaffTable = ({
  staff,
  onDelete,
  onToggleStatus,
  onEdit,
}) => {

  const [openMenu, setOpenMenu] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showComplaints, setShowComplaints] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  /* =========================
     VIEW DETAILS
  ========================= */

  const handleViewDetails = (member) => {
    setSelectedStaff(member);
    setShowDetails(true);
    setOpenMenu(null);
  };

  /* =========================
     VIEW COMPLAINTS
  ========================= */

  const handleViewComplaints = (member) => {
    setSelectedStaff(member);
    setShowComplaints(true);
    setOpenMenu(null);
  };

  /* =========================
     EDIT
  ========================= */

  const handleEdit = (member) => {
    setSelectedStaff(member);
    setShowEdit(true);
    setOpenMenu(null);
  };

  /* =========================
     SAVE EDIT
  ========================= */

  const handleSaveEdit = (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    const updatedStaff = {
      ...selectedStaff,
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      department: form.get("department"),
      role: form.get("role"),
      experience: Number(form.get("experience")),
      gender: form.get("gender"),
      dob: form.get("dob"),
      address: form.get("address"),
      city: form.get("city"),
      state: form.get("state"),
      pincode: form.get("pincode"),
    };

    onEdit(updatedStaff);

    setShowEdit(false);
    setSelectedStaff(null);
  };

  return (
    <>
      {/* =========================
          TABLE
      ========================= */}

      <div className="overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Staff Members
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View and manage municipal staff members.
            </p>
          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">
            {staff.length} Staff
          </span>

        </div>

        {/* Table */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px]">

            <thead>

              <tr className="border-b border-slate-200 bg-slate-50">

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Staff
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Staff ID
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Department
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Role
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Experience
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Complaints
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {staff.map((member) => (

                <tr
                  key={member.id}
                  className="border-b border-slate-100 transition hover:bg-slate-50"
                >

                  {/* STAFF */}

                  <td className="px-6 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 font-bold text-blue-600">

                        {member.photo ? (

                          <img
                            src={member.photo}
                            alt={member.name}
                            className="h-full w-full object-cover"
                          />

                        ) : (

                          member.name
                            .charAt(0)
                            .toUpperCase()

                        )}

                      </div>

                      <div>

                        <p className="font-semibold text-slate-800">
                          {member.name}
                        </p>

                        <p className="text-sm text-slate-500">
                          {member.email}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* ID */}

                  <td className="px-6 py-4">

                    <span className="font-medium text-slate-700">
                      {member.id}
                    </span>

                  </td>

                  {/* DEPARTMENT */}

                  <td className="px-6 py-4">

                    <span className="text-sm text-slate-700">
                      {member.department}
                    </span>

                  </td>

                  {/* ROLE */}

                  <td className="px-6 py-4">

                    <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      {member.role}
                    </span>

                  </td>

                  {/* EXPERIENCE */}

                  <td className="px-6 py-4 text-sm text-slate-700">
                    {member.experience} years
                  </td>

                  {/* COMPLAINTS */}

                  <td className="px-6 py-4">

                    <span className="font-semibold text-slate-800">
                      {member.complaints}
                    </span>

                  </td>

                  {/* STATUS */}

                  <td className="px-6 py-4">

                    {member.status === "Active" ? (

                      <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">

                        <span className="h-2 w-2 rounded-full bg-green-500" />

                        Active

                      </span>

                    ) : (

                      <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">

                        <span className="h-2 w-2 rounded-full bg-red-500" />

                        Inactive

                      </span>

                    )}

                  </td>

                  {/* ACTION */}

                  <td className="relative px-6 py-4">

                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenu(
                          openMenu === member.id
                            ? null
                            : member.id
                        )
                      }
                      className="rounded-lg px-3 py-2 text-xl font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                    >
                      ⋮
                    </button>

                    {/* DROPDOWN */}

                    {openMenu === member.id && (

                      <div className="absolute right-6 top-14 z-30 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl">

                        {/* View Details */}

                        <button
                          onClick={() =>
                            handleViewDetails(member)
                          }
                          className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <span>👁️</span>
                          View Details
                        </button>

                        {/* Edit */}

                        <button
                          onClick={() =>
                            handleEdit(member)
                          }
                          className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <span>✏️</span>
                          Edit Staff
                        </button>

                        {/* View Complaints */}

                        <button
                          onClick={() =>
                            handleViewComplaints(member)
                          }
                          className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <span>📋</span>
                          View Complaints
                        </button>

                        <div className="my-1 border-t border-slate-100" />

                        {/* Activate / Deactivate */}

                        <button
                          onClick={() => {
                            onToggleStatus(member.id);
                            setOpenMenu(null);
                          }}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <span>🔄</span>

                          {member.status === "Active"
                            ? "Deactivate Staff"
                            : "Activate Staff"}
                        </button>

                        {/* Delete */}

                        <button
                          onClick={() => {
                            onDelete(member.id);
                            setOpenMenu(null);
                          }}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
                        >
                          <span>🗑️</span>
                          Delete Staff
                        </button>

                      </div>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* Empty */}

        {staff.length === 0 && (

          <div className="px-6 py-12 text-center">

            <div className="text-4xl">
              👥
            </div>

            <h3 className="mt-3 font-semibold text-slate-800">
              No staff members found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Add a staff member to get started.
            </p>

          </div>

        )}

      </div>


      {/* ==================================================
          VIEW DETAILS MODAL
      ================================================== */}

      {showDetails && selectedStaff && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Staff Details
                </h2>

                <p className="text-sm text-slate-500">
                  {selectedStaff.id}
                </p>
              </div>

              <button
                onClick={() => setShowDetails(false)}
                className="text-2xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>

            </div>

            {/* Profile */}

            <div className="p-6">

              <div className="flex items-center gap-5 border-b border-slate-200 pb-6">

                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-2xl font-bold text-blue-600">

                  {selectedStaff.photo ? (

                    <img
                      src={selectedStaff.photo}
                      alt={selectedStaff.name}
                      className="h-full w-full object-cover"
                    />

                  ) : (

                    selectedStaff.name
                      .charAt(0)
                      .toUpperCase()

                  )}

                </div>

                <div>

                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedStaff.name}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {selectedStaff.role}
                  </p>

                  <span className="mt-2 inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    {selectedStaff.status}
                  </span>

                </div>

              </div>

              {/* Information */}

              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">

                <Detail
                  label="Email"
                  value={selectedStaff.email}
                />

                <Detail
                  label="Phone"
                  value={selectedStaff.phone}
                />

                <Detail
                  label="Gender"
                  value={selectedStaff.gender}
                />

                <Detail
                  label="Date of Birth"
                  value={selectedStaff.dob}
                />

                <Detail
                  label="Department"
                  value={selectedStaff.department}
                />

                <Detail
                  label="Role"
                  value={selectedStaff.role}
                />

                <Detail
                  label="Experience"
                  value={`${selectedStaff.experience} years`}
                />

                <Detail
                  label="Assigned Complaints"
                  value={selectedStaff.complaints}
                />

                <Detail
                  label="City"
                  value={selectedStaff.city}
                />

                <Detail
                  label="State"
                  value={selectedStaff.state}
                />

                <Detail
                  label="Pincode"
                  value={selectedStaff.pincode}
                />

                <div className="md:col-span-2">
                  <Detail
                    label="Address"
                    value={selectedStaff.address}
                  />
                </div>

              </div>

            </div>

          </div>

        </div>

      )}


      {/* ==================================================
          VIEW COMPLAINTS MODAL
      ================================================== */}

      {showComplaints && selectedStaff && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Assigned Complaints
                </h2>

                <p className="text-sm text-slate-500">
                  Complaints assigned to {selectedStaff.name}
                </p>
              </div>

              <button
                onClick={() => setShowComplaints(false)}
                className="text-2xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>

            </div>

            <div className="p-6">

              {selectedStaff.complaints > 0 ? (

                <div className="space-y-3">

                  {Array.from({
                    length: selectedStaff.complaints,
                  }).map((_, index) => (

                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
                    >

                      <div>

                        <p className="font-semibold text-slate-800">
                          CMP{1024 + index}
                        </p>

                        <p className="text-sm text-slate-500">
                          Municipal complaint
                        </p>

                      </div>

                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                        Assigned
                      </span>

                    </div>

                  ))}

                </div>

              ) : (

                <div className="py-10 text-center">

                  <div className="text-4xl">
                    📋
                  </div>

                  <p className="mt-3 font-semibold text-slate-800">
                    No complaints assigned
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    This staff member currently has no assigned complaints.
                  </p>

                </div>

              )}

            </div>

          </div>

        </div>

      )}


      {/* ==================================================
          EDIT STAFF MODAL
      ================================================== */}

      {showEdit && selectedStaff && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Edit Staff
                </h2>

                <p className="text-sm text-slate-500">
                  Update staff information
                </p>

              </div>

              <button
                onClick={() => setShowEdit(false)}
                className="text-2xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSaveEdit}
              className="p-6"
            >

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <EditInput
                  label="Full Name"
                  name="name"
                  defaultValue={selectedStaff.name}
                />

                <EditInput
                  label="Email"
                  name="email"
                  type="email"
                  defaultValue={selectedStaff.email}
                />

                <EditInput
                  label="Phone"
                  name="phone"
                  defaultValue={selectedStaff.phone}
                />

                <EditInput
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  defaultValue={selectedStaff.dob}
                />

                <EditSelect
                  label="Gender"
                  name="gender"
                  defaultValue={selectedStaff.gender}
                  options={[
                    "Male",
                    "Female",
                    "Other",
                  ]}
                />

                <EditSelect
                  label="Department"
                  name="department"
                  defaultValue={selectedStaff.department}
                  options={[
                    "Sanitation",
                    "Roads & Infrastructure",
                    "Water Supply",
                    "Public Health",
                    "Waste Management",
                    "Street Lighting",
                  ]}
                />

                <EditSelect
                  label="Role"
                  name="role"
                  defaultValue={selectedStaff.role}
                  options={[
                    "Staff",
                    "Senior Staff",
                    "Department Officer",
                    "Supervisor",
                  ]}
                />

                <EditInput
                  label="Experience"
                  name="experience"
                  type="number"
                  defaultValue={selectedStaff.experience}
                />

                <EditInput
                  label="City"
                  name="city"
                  defaultValue={selectedStaff.city}
                />

                <EditInput
                  label="State"
                  name="state"
                  defaultValue={selectedStaff.state}
                />

                <EditInput
                  label="Pincode"
                  name="pincode"
                  defaultValue={selectedStaff.pincode}
                />

                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Address
                  </label>

                  <textarea
                    name="address"
                    defaultValue={selectedStaff.address}
                    rows="3"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

              </div>

              <div className="mt-7 flex justify-end gap-3 border-t border-slate-200 pt-6">

                <button
                  type="button"
                  onClick={() => setShowEdit(false)}
                  className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Save Changes
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </>
  );
};


/* =========================
   DETAIL COMPONENT
========================= */

const Detail = ({ label, value }) => {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-800">
        {value || "Not provided"}
      </p>
    </div>
  );
};


/* =========================
   EDIT INPUT
========================= */

const EditInput = ({
  label,
  name,
  type = "text",
  defaultValue,
}) => {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

    </div>
  );
};


/* =========================
   EDIT SELECT
========================= */

const EditSelect = ({
  label,
  name,
  defaultValue,
  options,
}) => {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <select
        name={name}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}

      </select>

    </div>
  );
};

export default StaffTable;    