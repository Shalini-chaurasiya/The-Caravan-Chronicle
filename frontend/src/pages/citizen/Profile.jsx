import React, { useRef, useState } from "react";
import {
  User,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  VenusAndMars,
  Save,
  X,
  Pencil,
} from "lucide-react";

const Profile = () => {
  const fileInputRef = useRef(null);

  // ==========================================
  // PROFILE IMAGE
  // ==========================================

  const [profileImage, setProfileImage] = useState(null);

  // ==========================================
  // EDIT MODE
  // ==========================================

  const [isEditing, setIsEditing] = useState(false);

  // ==========================================
  // USER DATA
  // ==========================================

  const initialData = {
    name: "Shalini Chaurasiya",
    address: "Prayagraj, Uttar Pradesh",
    gender: "Female",
    contact: "+91 98765 43210",
    email: "shalini@example.com",
    dob: "2005-03-15",
  };

  const [formData, setFormData] = useState(initialData);

  const [savedData, setSavedData] = useState(initialData);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // HANDLE PROFILE IMAGE
  // ==========================================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);

      setProfileImage(imageUrl);
    }
  };

  // ==========================================
  // EDIT PROFILE
  // ==========================================

  const handleEdit = () => {
    setIsEditing(true);
  };

  // ==========================================
  // SAVE CHANGES
  // ==========================================

  const handleSave = () => {
    setSavedData(formData);

    setIsEditing(false);

    alert("Profile updated successfully!");
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const handleCancel = () => {
    setFormData(savedData);

    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">

      {/* ==========================================
          PAGE HEADER
      =========================================== */}

      <div className="mx-auto mb-6 max-w-5xl">

        <h1 className="text-2xl font-bold text-[#063b7a]">
          My Profile
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View and update your personal information
        </p>

      </div>


      {/* ==========================================
          MAIN PROFILE CARD
      =========================================== */}

      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr]">


          {/* ========================================
              LEFT PROFILE SECTION
          ========================================= */}

          <div className="flex flex-col items-center border-b border-gray-200 bg-[#f8fafc] px-6 py-8 md:border-b-0 md:border-r">

            {/* Profile Image */}

            <div className="relative">

              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-blue-100">

                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User
                    size={65}
                    className="text-blue-500"
                  />
                )}

              </div>


              {/* Camera button only in edit mode */}

              {isEditing && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-[#2563eb] text-white shadow-md transition hover:bg-blue-700"
                >
                  <Camera size={17} />
                </button>
              )}

            </div>


            {/* Hidden file input */}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />


            {/* Change Photo */}

            {isEditing && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="mt-5 rounded-lg border border-blue-500 px-5 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                >
                  Change Photo
                </button>

                <p className="mt-2 text-xs text-gray-400">
                  JPG, PNG or JPEG
                </p>
              </>
            )}


            {/* User Name */}

            <div className="mt-7 text-center">

              <h2 className="text-lg font-semibold text-gray-800">
                {formData.name}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Citizen
              </p>

            </div>

          </div>


          {/* ========================================
              RIGHT SIDE
          ========================================= */}

          <div className="p-6 md:p-8">


            {/* ======================================
                TITLE + EDIT BUTTON
            ======================================= */}

            <div className="mb-7 flex items-center justify-between">

              <div className="flex items-center gap-2">

                <User
                  size={22}
                  className="text-blue-600"
                />

                <h2 className="text-xl font-semibold text-gray-800">
                  Personal Information
                </h2>

              </div>


              {/* EDIT BUTTON */}

              {!isEditing && (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="flex items-center gap-2 rounded-lg bg-[#063b7a] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#052f62]"
                >
                  <Pencil size={16} />
                  Edit Profile
                </button>
              )}

            </div>


            {/* ======================================
                FORM
            ======================================= */}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">


              {/* ==================================
                  FULL NAME
              =================================== */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>

                <div className="relative">

                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full rounded-lg border py-3 pl-10 pr-4 text-sm outline-none transition ${
                      isEditing
                        ? "border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        : "border-gray-200 bg-gray-50 text-gray-600"
                    }`}
                  />

                </div>

              </div>


              {/* ==================================
                  GENDER
              =================================== */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Gender
                </label>

                <div className="relative">

                  <VenusAndMars
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full appearance-none rounded-lg border py-3 pl-10 pr-4 text-sm outline-none transition ${
                      isEditing
                        ? "border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        : "border-gray-200 bg-gray-50 text-gray-600"
                    }`}
                  >
                    <option value="">
                      Select Gender
                    </option>

                    <option value="Female">
                      Female
                    </option>

                    <option value="Male">
                      Male
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>

              </div>


              {/* ==================================
                  ADDRESS
              =================================== */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Address
                </label>

                <div className="relative">

                  <MapPin
                    size={18}
                    className="absolute left-3 top-3 text-gray-400"
                  />

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows="3"
                    className={`w-full resize-none rounded-lg border py-3 pl-10 pr-4 text-sm outline-none transition ${
                      isEditing
                        ? "border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        : "border-gray-200 bg-gray-50 text-gray-600"
                    }`}
                  />

                </div>

              </div>


              {/* ==================================
                  CONTACT NUMBER
              =================================== */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Contact Number
                </label>

                <div className="relative">

                  <Phone
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full rounded-lg border py-3 pl-10 pr-4 text-sm outline-none transition ${
                      isEditing
                        ? "border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        : "border-gray-200 bg-gray-50 text-gray-600"
                    }`}
                  />

                </div>

              </div>


              {/* ==================================
                  EMAIL
              =================================== */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full rounded-lg border py-3 pl-10 pr-4 text-sm outline-none transition ${
                      isEditing
                        ? "border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        : "border-gray-200 bg-gray-50 text-gray-600"
                    }`}
                  />

                </div>

              </div>


              {/* ==================================
                  DATE OF BIRTH
              =================================== */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>

                <div className="relative">

                  <Calendar
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full rounded-lg border py-3 pl-10 pr-4 text-sm outline-none transition ${
                      isEditing
                        ? "border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        : "border-gray-200 bg-gray-50 text-gray-600"
                    }`}
                  />

                </div>

              </div>

            </div>


            {/* ======================================
                SAVE / CANCEL BUTTONS
                ONLY SHOW IN EDIT MODE
            ======================================= */}

            {isEditing && (
              <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6">

                {/* CANCEL */}

                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                >
                  <X size={17} />
                  Cancel
                </button>


                {/* SAVE */}

                <button
                  type="button"
                  onClick={handleSave}
                  className="flex items-center gap-2 rounded-lg bg-[#063b7a] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#052f62]"
                >
                  <Save size={17} />
                  Save Changes
                </button>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;