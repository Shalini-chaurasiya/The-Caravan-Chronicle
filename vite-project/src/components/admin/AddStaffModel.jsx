import React, { useState } from "react";

const AddStaffModal = ({ onClose, onAddStaff }) => {

  const [photo, setPhoto] = useState(null);

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

    const file = e.target.files[0];

    if (file) {
      setPhoto(URL.createObjectURL(file));
    }

  };

  const handleSubmit = (e) => {

    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    onAddStaff({
      ...formData,
      photo: photo,
      experience: Number(formData.experience),
    });

  };

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

          <div>

            <h2 className="text-2xl font-bold text-slate-900">
              Add New Staff
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Create a new staff account for the municipal system.
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-2xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            ×
          </button>

        </div>

        {/* FORM BODY */}
        <div className="overflow-y-auto">

          <form
            onSubmit={handleSubmit}
            className="p-6"
          >

            {/* PERSONAL INFORMATION */}
            <section>

              <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-blue-600">
                Personal Information
              </h3>

              {/* PHOTO */}
              <div className="mb-7 flex items-center gap-6">

                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-slate-300 bg-slate-50">

                  {photo ? (

                    <img
                      src={photo}
                      alt="Preview"
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

                  <p className="mt-1 mb-3 text-xs text-slate-500">
                    JPG, PNG or JPEG. Recommended size 300×300.
                  </p>

                  <label className="inline-block cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">

                    Choose Photo

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />

                  </label>

                </div>

              </div>

              {/* PERSONAL FIELDS */}
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
                  options={[
                    "Male",
                    "Female",
                    "Other",
                  ]}
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

            {/* PROFESSIONAL INFORMATION */}
            <section className="mt-8 border-t border-slate-200 pt-7">

              <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-blue-600">
                Professional Information
              </h3>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <Input
                  label="Staff ID"
                  name="staffId"
                  placeholder="Example: ST005"
                />

                <Select
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Select department"
                  options={[
                    "Sanitation",
                    "Roads & Infrastructure",
                    "Water Supply",
                    "Public Health",
                    "Waste Management",
                    "Street Lighting",
                  ]}
                  required
                />

                <Select
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="Select role"
                  options={[
                    "Staff",
                    "Senior Staff",
                    "Department Officer",
                    "Supervisor",
                  ]}
                  required
                />

                <Input
                  label="Experience"
                  name="experience"
                  type="number"
                  min="0"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Years of experience"
                  required
                />

              </div>

            </section>

            {/* ADDRESS */}
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

            {/* ACCOUNT */}
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

            {/* BUTTONS */}
            <div className="mt-8 flex justify-end gap-3 border-t border-slate-200 pt-6">

              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                Create Staff
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>

  );
};


/* =========================
   REUSABLE INPUT
========================= */

const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  min,
}) => {

  return (

    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">

        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}

      </label>

      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

    </div>

  );
};


/* =========================
   REUSABLE SELECT
========================= */

const Select = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  required = false,
}) => {

  return (

    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">

        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}

      </label>

      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        required={required}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >

        <option value="">
          {placeholder}
        </option>

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

export default AddStaffModal;