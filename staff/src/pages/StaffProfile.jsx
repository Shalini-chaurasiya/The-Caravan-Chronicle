
import React, { useState } from "react";
import StaffSidebar from "./components/StaffSidebar";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Building2,
  Edit,
  Save,
  X,
  ShieldCheck,
} from "lucide-react";

const StaffProfile = () => {
  const savedStaff = JSON.parse(localStorage.getItem("staff") || "{}");

  const initialProfile = {
    name: savedStaff.name || "",
    email: savedStaff.email || "",
    phone: savedStaff.phone || "",
    employeeId: savedStaff.employeeId || "",
    department: savedStaff.department || "",
    designation: savedStaff.designation || "",
    address: savedStaff.address || "",
    joiningDate: savedStaff.joiningDate || "",
  };

  const [staff, setStaff] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaff((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const updatedStaff = {
      ...savedStaff,
      ...staff,
    };

    localStorage.setItem("staff", JSON.stringify(updatedStaff));
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleCancel = () => {
    setStaff(initialProfile);
    setIsEditing(false);
  };

  const profileFields = [
    {
      label: "Full Name",
      name: "name",
      icon: User,
      type: "text",
    },
    {
      label: "Email Address",
      name: "email",
      icon: Mail,
      type: "email",
    },
    {
      label: "Phone Number",
      name: "phone",
      icon: Phone,
      type: "tel",
    },
    {
      label: "Employee ID",
      name: "employeeId",
      icon: Briefcase,
      type: "text",
    },
    {
      label: "Department",
      name: "department",
      icon: Building2,
      type: "text",
    },
    {
      label: "Designation",
      name: "designation",
      icon: Briefcase,
      type: "text",
    },
    {
      label: "Joining Date",
      name: "joiningDate",
      icon: Calendar,
      type: "date",
    },
    {
      label: "Address",
      name: "address",
      icon: MapPin,
      type: "text",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#f3f6fc]">
      <StaffSidebar />

      <main className="flex-1 min-w-0 p-5 md:p-8">
        <div className="max-w-6xl mx-auto">

          {/* Page Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#101f43]">
              My Profile
            </h1>
            <p className="text-slate-500 mt-2">
              Manage your personal and professional information.
            </p>
          </div>

          {/* Profile Banner */}
          <div className="bg-gradient-to-r from-[#101f43] to-blue-700 rounded-2xl p-6 md:p-8 mb-7 text-white shadow-md">
            <div className="flex flex-col sm:flex-row items-center gap-5">

              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-[#101f43] border-4 border-blue-200">
                <User size={48} />
              </div>

              <div className="text-center sm:text-left flex-1">
                <h2 className="text-2xl font-bold">
                  {staff.name || "Staff Member"}
                </h2>

                <p className="text-blue-100 mt-1">
                  {staff.designation || "Staff Designation"}
                </p>

                <p className="text-blue-200 text-sm mt-2">
                  Employee ID: {staff.employeeId || "Not assigned"}
                </p>
              </div>

              <div className="bg-green-500/20 text-green-100 px-4 py-2 rounded-full text-sm flex items-center gap-2">
                <ShieldCheck size={17} />
                Staff Account
              </div>

            </div>
          </div>

          {/* Personal Details Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">

            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-xl font-bold text-[#101f43]">
                  Personal Information
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Your registered account details
                </p>
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition"
                >
                  <Edit size={17} />
                  Edit Profile
                </button>
              )}
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {profileFields.map((field) => {
                const Icon = field.icon;

                const isReadOnly = [
                  "email",
                  "employeeId",
                  "department",
                ].includes(field.name);

                return (
                  <div key={field.name}>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">
                      {field.label}
                    </label>

                    <div className="flex items-center gap-3 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus-within:border-blue-500 transition">
                      <Icon size={19} className="text-blue-600 shrink-0" />

                      <input
                        type={field.type}
                        name={field.name}
                        value={staff[field.name]}
                        onChange={handleChange}
                        disabled={!isEditing || isReadOnly}
                        placeholder={`Enter ${field.label}`}
                        className="w-full bg-transparent outline-none text-slate-700 disabled:cursor-not-allowed disabled:text-slate-500"
                      />
                    </div>

                    {isEditing && isReadOnly && (
                      <p className="text-xs text-slate-400 mt-1">
                        Contact administrator to change this detail.
                      </p>
                    )}
                  </div>
                );
              })}

            </div>

            {/* Save and Cancel Buttons */}
            {isEditing && (
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-200">

                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
                >
                  <X size={17} />
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
                >
                  <Save size={17} />
                  Save Changes
                </button>

              </div>
            )}

          </div>

          {/* Account Information */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mt-7">
            <h2 className="text-lg font-bold text-[#101f43] mb-4">
              Account Information
            </h2>

            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <span className="text-slate-500 text-sm">
                Account Type
              </span>
              <span className="font-medium text-slate-700">
                Staff
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <span className="text-slate-500 text-sm">
                Portal
              </span>
              <span className="font-medium text-slate-700">
                Caravan Chronicle
              </span>
            </div>
          </div>

          <p className="text-center text-sm text-slate-400 mt-8">
            © 2026 Caravan Chronicle | Staff Management Portal
          </p>

        </div>
      </main>
    </div>
  );
};

export default StaffProfile;
