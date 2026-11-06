
import { useEffect, useRef, useState } from "react";
import StaffSidebar from "../components/StaffSidebar";
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
  Hash,
  Clock,
  Map,
  Award,
  Camera,
  Trash2,
} from "lucide-react";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/+$/, "");
const API_URL = API_BASE_URL.endsWith("/api")
  ? API_BASE_URL
  : `${API_BASE_URL}/api`;

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

const toProfile = (savedStaff) => {
  const profile = { ...savedStaff };
  delete profile.password;

  return {
    ...profile,
    _id: savedStaff._id || "",
    staffId: savedStaff.staffId || "",
    name: savedStaff.name || "",
    email: savedStaff.email || "",
    phone: savedStaff.phone || "",
    gender: savedStaff.gender || "",
    dob: formatDate(savedStaff.dob),
    department: savedStaff.department || "",
    role: savedStaff.role || "",
    experience: savedStaff.experience ?? "",
    address: savedStaff.address || "",
    city: savedStaff.city || "",
    state: savedStaff.state || "",
    pincode: savedStaff.pincode || "",
    photo: savedStaff.photo || "",
    status: savedStaff.status || "Active",
    createdAt: savedStaff.createdAt || "",
    updatedAt: savedStaff.updatedAt || "",
  };
};

const StaffProfile = () => {
  const photoInputRef = useRef(null);
  const [savedStaff, setSavedStaff] = useState(() =>
    JSON.parse(localStorage.getItem("staff") || "{}")
  );

  const [initialProfile, setInitialProfile] = useState(() =>
    toProfile(savedStaff)
  );
  const [staff, setStaff] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState("");

  const getPhotoUrl = (photo) => {
    if (!photo) return "";

    return photo.startsWith("http")
      ? photo
      : `${API_BASE_URL}${photo.startsWith("/") ? "" : "/"}${photo}`;
  };

  const photoUrl = photoPreview || getPhotoUrl(staff.photo);

  useEffect(() => {
    if (!photoPreview) return undefined;
    return () => URL.revokeObjectURL(photoPreview);
  }, [photoPreview]);

  useEffect(() => {
    const token = localStorage.getItem("staffToken");

    if (!token) {
      window.location.replace("/staff/login");
      return;
    }

    const controller = new AbortController();

    const loadProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/staff/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });
        const data = await response.json().catch(() => ({}));

        if (response.status === 401) {
          localStorage.removeItem("staffToken");
          localStorage.removeItem("staff");
          window.location.replace("/staff/login");
          return;
        }

        if (!response.ok || data.success === false || !data.staff) {
          throw new Error(data.message || "Unable to load your profile.");
        }

        const profile = toProfile(data.staff);
        setSavedStaff(data.staff);
        setInitialProfile(profile);
        setStaff(profile);
        localStorage.setItem("staff", JSON.stringify(data.staff));
        setLoadError("");
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Profile load error:", error);
          setLoadError(error.message || "Unable to load your profile.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();
    return () => controller.abort();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setStaff((prev) => ({
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

    setSelectedPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleRemovePhoto = () => {
    setSelectedPhoto(null);
    setPhotoPreview("");
    setStaff((prev) => ({ ...prev, photo: "" }));
    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  // Save profile
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("staffToken");

      if (!token) {
        alert("Please login again.");
        return;
      }

      setIsSaving(true);

      const profileUpdates = new FormData();
      profileUpdates.append("phone", staff.phone);
      profileUpdates.append("experience", staff.experience);
      profileUpdates.append("address", staff.address);
      profileUpdates.append("city", staff.city);
      profileUpdates.append("state", staff.state);
      profileUpdates.append("pincode", staff.pincode);
      profileUpdates.append("status", staff.status);

      if (selectedPhoto) {
        profileUpdates.append("photo", selectedPhoto);
      } else if (!staff.photo && savedStaff.photo) {
        profileUpdates.append("removePhoto", "true");
      }

      const response = await fetch(
        `${API_URL}/staff/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: profileUpdates,
        }
      );

      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        localStorage.removeItem("staffToken");
        localStorage.removeItem("staff");
        window.location.replace("/staff/login");
        return;
      }

      if (!response.ok || data.success === false || !data.staff) {
        throw new Error(data.message || "Unable to update profile.");
      }

      const updatedStaff = data.staff;
      const profile = toProfile(updatedStaff);
      setSavedStaff(updatedStaff);
      setInitialProfile(profile);
      setStaff(profile);
      localStorage.setItem("staff", JSON.stringify(updatedStaff));

      setSelectedPhoto(null);
      setPhotoPreview("");
      if (photoInputRef.current) photoInputRef.current.value = "";
      setIsEditing(false);

      alert("Profile updated successfully!");

    } catch (error) {
      console.error("Profile update error:", error);
      alert(error.message || "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setStaff(initialProfile);
    setSelectedPhoto(null);
    setPhotoPreview("");
    if (photoInputRef.current) photoInputRef.current.value = "";
    setIsEditing(false);
  };

  const profileFields = [
    {
      label: "Full Name",
      name: "name",
      icon: User,
      type: "text",
      readOnly: true,
    },
    {
      label: "Email Address",
      name: "email",
      icon: Mail,
      type: "email",
      readOnly: true,
    },
    {
      label: "Phone Number",
      name: "phone",
      icon: Phone,
      type: "tel",
    },
    {
      label: "Staff ID",
      name: "staffId",
      icon: Hash,
      type: "text",
      readOnly: true,
    },
    {
      label: "Gender",
      name: "gender",
      icon: User,
      type: "select",
      readOnly: true,
      options: ["Male", "Female", "Other"],
    },
    {
      label: "Date of Birth",
      name: "dob",
      icon: Calendar,
      type: "date",
      readOnly: true,
    },
    {
      label: "Department",
      name: "department",
      icon: Building2,
      type: "text",
      readOnly: true,
    },
    {
      label: "Role / Designation",
      name: "role",
      icon: Briefcase,
      type: "text",
      readOnly: true,
    },
    {
      label: "Experience (Years)",
      name: "experience",
      icon: Award,
      type: "number",
    },
    {
      label: "Address",
      name: "address",
      icon: MapPin,
      type: "text",
    },
    {
      label: "City",
      name: "city",
      icon: Map,
      type: "text",
    },
    {
      label: "State",
      name: "state",
      icon: Map,
      type: "text",
    },
    {
      label: "Pincode",
      name: "pincode",
      icon: Hash,
      type: "text",
    },
    {
      label: "Account Status",
      name: "status",
      icon: ShieldCheck,
      type: "select",
      options: ["Active", "Inactive"],
    },
  ];

  const formatDisplayDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="flex min-h-screen bg-[#f3f6fc]">
      <StaffSidebar />

      <main className="ml-64 flex-1 min-w-0 p-5 md:p-8">
        <div className="max-w-6xl mx-auto">

          {/* Page Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#101f43]">
              My Profile
            </h1>

            <p className="text-slate-500 mt-2">
              Manage your personal and professional information.
            </p>
            {isLoading && (
              <p className="mt-2 text-sm text-blue-600">
                Loading your profile...
              </p>
            )}
            {loadError && (
              <p role="alert" className="mt-2 text-sm text-red-600">
                {loadError}
              </p>
            )}
          </div>

          {/* Profile Banner */}
          <div className="bg-gradient-to-r from-[#101f43] to-blue-700 rounded-2xl p-6 md:p-8 mb-7 text-white shadow-md">
            <div className="flex flex-col sm:flex-row items-center gap-5">

              {/* Editable Profile Photo */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-[#101f43] border-4 border-blue-200 overflow-hidden">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Staff Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={48} />
                  )}
                </div>

                {isEditing && (
                  <>
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-blue-600 p-2 text-white hover:bg-blue-700"
                      aria-label="Change profile photo"
                    >
                      <Camera size={16} />
                    </button>
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    {photoUrl && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="absolute -right-1 -top-1 rounded-full border-2 border-white bg-red-600 p-1.5 text-white hover:bg-red-700"
                        aria-label="Remove profile photo"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </>
                )}
              </div>

              <div className="text-center sm:text-left flex-1">
                <h2 className="text-2xl font-bold">
                  {staff.name || "Staff Member"}
                </h2>

                <p className="text-blue-100 mt-1">
                  {staff.role || "Staff Designation"}
                </p>

                <p className="text-blue-200 text-sm mt-2">
                  Staff ID: {staff.staffId || "Not assigned"}
                </p>

                <p className="text-blue-200 text-sm mt-1">
                  {staff.department || "Department not assigned"}
                </p>

                {isEditing && (
                  <p className="mt-2 text-xs text-blue-200">
                    JPG, PNG, or WebP; maximum 2 MB.
                  </p>
                )}

              </div>

              <div className="bg-green-500/20 text-green-100 px-4 py-2 rounded-full text-sm flex items-center gap-2">
                <ShieldCheck size={17} />
                {staff.status || "Staff Account"}
              </div>

            </div>
          </div>

          {/* Personal and Professional Details */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">

            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-xl font-bold text-[#101f43]">
                  Personal & Professional Information
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Your registered account details
                </p>
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  disabled={isLoading || isSaving}
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

                return (
                  <div key={field.name}>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">
                      {field.label}
                    </label>

                    <div className="flex items-center gap-3 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus-within:border-blue-500 transition">

                      <Icon
                        size={19}
                        className="text-blue-600 shrink-0"
                      />

                      {field.type === "select" ? (
                        <select
                          name={field.name}
                          value={staff[field.name]}
                          onChange={handleChange}
                          disabled={!isEditing || field.readOnly}
                          className="w-full bg-transparent outline-none text-slate-700 disabled:cursor-not-allowed"
                        >
                          <option value="">
                            Select {field.label}
                          </option>

                          {field.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          name={field.name}
                          value={staff[field.name]}
                          onChange={handleChange}
                          disabled={!isEditing || field.readOnly}
                          placeholder={`Enter ${field.label}`}
                          min={field.type === "number" ? "0" : undefined}
                          className="w-full bg-transparent outline-none text-slate-700 disabled:cursor-not-allowed disabled:text-slate-500"
                        />
                      )}

                    </div>

                    {isEditing && field.readOnly && (
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
                  disabled={isLoading || isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={17} />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>

              </div>
            )}

          </div>

          {/* Account Information */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mt-7">

            <h2 className="text-lg font-bold text-[#101f43] mb-4">
              Account Information
            </h2>

            <div className="flex items-center justify-between py-3 border-b border-slate-100 gap-4">
              <span className="text-slate-500 text-sm">
                Account Type
              </span>
              <span className="font-medium text-slate-700">
                Staff
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-slate-100 gap-4">
              <span className="text-slate-500 text-sm flex items-center gap-2">
                <Clock size={15} />
                Account Created
              </span>
              <span className="font-medium text-slate-700 text-sm text-right">
                {formatDisplayDate(staff.createdAt)}
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-slate-100 gap-4">
              <span className="text-slate-500 text-sm">
                Last Updated
              </span>
              <span className="font-medium text-slate-700 text-sm text-right">
                {formatDisplayDate(staff.updatedAt)}
              </span>
            </div>

            <div className="flex items-center justify-between py-3 gap-4">
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
