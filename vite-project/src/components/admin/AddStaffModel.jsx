
import React, { useState } from "react";

const API_URL = "http://localhost:3000/api/staff";

const DEPARTMENTS = [
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

const ROLES = [
  "Staff",
  "Senior Staff",
  "Department Officer",
  "Supervisor",
];

const AddStaffModal = ({ onClose, onAddStaff }) => {
  const [photo, setPhoto] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    dob: "",
    phone: "",
    email: "",
    department: "",
    role: "",
    experience: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Please select a JPG, PNG, or WebP image.");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Photo size must not exceed 2 MB.");
      e.target.value = "";
      return;
    }

    if (photo) {
      URL.revokeObjectURL(photo);
    }

    setPhoto(URL.createObjectURL(file));
    setPhotoFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error(
          "Admin token not found. Please log in again or check your login token key."
        );
      }

      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (photoFile) {
        data.append("photo", photoFile);
      }

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to create staff account."
        );
      }

      // The backend has successfully saved this staff member.
      // The parent callback should update the UI only, not POST again.
      if (onAddStaff) {
        await onAddStaff(result.staff);
      }

      alert(result.message || "Staff added successfully!");

      if (photo) {
        URL.revokeObjectURL(photo);
      }

      onClose();
    } catch (error) {
      console.error("Add staff error:", error);
      alert(error.message || "Unable to connect to the backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;

    if (photo) {
      URL.revokeObjectURL(photo);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Add New Staff
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Create a staff account and assign a municipal department.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex h-9 w-9 items-center justify-center rounded-full text-2xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6">

            {/* Personal Information */}
            <section>
              <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-blue-600">
                Personal Information
              </h3>

              <div className="mb-7 flex items-center gap-6">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-slate-300 bg-slate-50">
                  {photo ? (
                    <img
                      src={photo}
                      alt="Staff preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl text-slate-400">
                      👤
                    </span>
                  )}
                </div>

                <div>
                  <p className="font-semibold text-slate-800">
                    Profile Photo
                  </p>
                  <p className="mb-3 mt-1 text-xs text-slate-500">
                    JPG, PNG or WebP. Maximum 2 MB.
                  </p>

                  <label className="inline-block cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    Choose Photo
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handlePhotoChange}
                      disabled={isSubmitting}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />

                <Select
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  placeholder="Select gender"
                  options={["Male", "Female", "Other"]}
                  required
                />

                <Input
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                />

                <div className="md:col-span-2">
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="staff@municipal.gov"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Professional Information */}
            <section className="mt-8 border-t border-slate-200 pt-7">
              <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-blue-600">
                Professional Information
              </h3>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Select
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Select department"
                    options={DEPARTMENTS}
                    required
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    Choose the department responsible for the complaint
                    categories this staff member will handle.
                  </p>
                </div>

                <Select
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="Select role"
                  options={ROLES}
                  required
                />

                <Input
                  label="Experience (years)"
                  name="experience"
                  type="number"
                  min="0"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Enter years of experience"
                  required
                />
              </div>
            </section>

            {/* Address */}
            <section className="mt-8 border-t border-slate-200 pt-7">
              <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-blue-600">
                Address
              </h3>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Full Address
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Enter complete address"
                    className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                />

                <Input
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                />

                <Input
                  label="Pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Enter pincode"
                />
              </div>
            </section>

            {/* Account Information */}
            <section className="mt-8 border-t border-slate-200 pt-7">
              <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-blue-600">
                Account Information
              </h3>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create password"
                  required
                />

                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required
                />
              </div>
            </section>

            {/* Footer */}
            <div className="mt-8 flex justify-end gap-3 border-t border-slate-200 pt-6">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Creating Staff..." : "Create Staff"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  min,
}) => (
  <div>
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>

    <input
      type={type}
      name={name}
      value={value ?? ""}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      min={min}
      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />
  </div>
);

const Select = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  required = false,
}) => (
  <div>
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>

    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    >
      <option value="">{placeholder}</option>

      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export default AddStaffModal;
