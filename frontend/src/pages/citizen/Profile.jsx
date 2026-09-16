import React, {
  useEffect,
  useRef,
  useState
} from "react";

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
  Pencil
} from "lucide-react";


const Profile = () => {

  // ==========================================
  // API URL
  // ==========================================

  const API_URL =
    import.meta.env.VITE_API_URL;


  // ==========================================
  // FILE INPUT
  // ==========================================

  const fileInputRef =
    useRef(null);


  // ==========================================
  // PROFILE IMAGE
  // ==========================================

  const [
    profileImage,
    setProfileImage
  ] = useState(null);


  const [
    selectedImage,
    setSelectedImage
  ] = useState(null);


  // ==========================================
  // EDIT MODE
  // ==========================================

  const [
    isEditing,
    setIsEditing
  ] = useState(false);


  // ==========================================
  // LOADING
  // ==========================================

  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    saving,
    setSaving
  ] = useState(false);


  // ==========================================
  // INITIAL DATA
  // ==========================================

  const initialData = {

    name: "",

    address: "",

    gender: "",

    contact: "",

    email: "",

    dob: ""

  };


  // ==========================================
  // FORM DATA
  // ==========================================

  const [
    formData,
    setFormData
  ] = useState(initialData);


  // ==========================================
  // SAVED DATA
  // ==========================================

  const [
    savedData,
    setSavedData
  ] = useState(initialData);


  // ==========================================
  // GET PROFILE
  // ==========================================

  useEffect(() => {

    const fetchProfile = async () => {

      try {

        const token =
          localStorage.getItem("token");


        if (!token) {

          alert(
            "Please login first"
          );

          setLoading(false);

          return;

        }


        const response =
          await fetch(
            `${API_URL}/api/profile`,
            {

              method: "GET",

              headers: {

                Authorization:
                  `Bearer ${token}`

              }

            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to fetch profile"
          );

        }


        // ==========================================
        // CONVERT BACKEND DATA
        // ==========================================

        const userData = {

          name:
            data.user.name || "",

          address:
            data.user.address || "",

          gender:
            data.user.gender || "",

          contact:
            data.user.contact || "",

          email:
            data.user.email || "",

          dob:
            data.user.dob
              ? data.user.dob.split("T")[0]
              : ""

        };


        setFormData(
          userData
        );


        setSavedData(
          userData
        );


        // ==========================================
        // PROFILE IMAGE
        // ==========================================

        if (
          data.user.profileImage
        ) {

          setProfileImage(
            `${API_URL}${data.user.profileImage}`
          );

        }


      } catch (error) {

        console.error(
          "Get Profile Error:",
          error
        );


        alert(
          error.message ||
          "Unable to load profile"
        );


      } finally {

        setLoading(false);

      }

    };


    fetchProfile();

  }, [API_URL]);


  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;


    setFormData(
      (prev) => ({

        ...prev,

        [name]: value

      })
    );

  };


  // ==========================================
  // HANDLE IMAGE CHANGE
  // ==========================================

  const handleImageChange = (e) => {

    const file =
      e.target.files[0];


    if (!file) {
      return;
    }


    // Save actual file

    setSelectedImage(
      file
    );


    // Show preview

    const imageUrl =
      URL.createObjectURL(file);


    setProfileImage(
      imageUrl
    );

  };


  // ==========================================
  // EDIT PROFILE
  // ==========================================

  const handleEdit = () => {

    setIsEditing(true);

  };


  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSave = async () => {

    try {

      setSaving(true);


      const token =
        localStorage.getItem("token");


      if (!token) {

        alert(
          "Please login first"
        );

        return;

      }


      // ==========================================
      // FORM DATA
      // ==========================================

      const data =
        new FormData();


      data.append(
        "name",
        formData.name
      );


      data.append(
        "email",
        formData.email
      );


      data.append(
        "address",
        formData.address
      );


      data.append(
        "gender",
        formData.gender
      );


      data.append(
        "contact",
        formData.contact
      );


      data.append(
        "dob",
        formData.dob
      );


      // ==========================================
      // PROFILE IMAGE
      // ==========================================

      if (selectedImage) {

        data.append(
          "profileImage",
          selectedImage
        );

      }


      // ==========================================
      // SEND TO BACKEND
      // ==========================================

      const response =
        await fetch(
          `${API_URL}/api/profile`,
          {

            method: "PUT",

            headers: {

              Authorization:
                `Bearer ${token}`

            },

            body: data

          }
        );


      const result =
        await response.json();


      if (!response.ok) {

        throw new Error(
          result.message ||
          "Failed to update profile"
        );

      }


      // ==========================================
      // UPDATED DATA
      // ==========================================

      const updatedData = {

        name:
          result.user.name || "",

        address:
          result.user.address || "",

        gender:
          result.user.gender || "",

        contact:
          result.user.contact || "",

        email:
          result.user.email || "",

        dob:
          result.user.dob
            ? result.user.dob.split("T")[0]
            : ""

      };


      setFormData(
        updatedData
      );


      setSavedData(
        updatedData
      );


      // ==========================================
      // UPDATED IMAGE
      // ==========================================

      if (
        result.user.profileImage
      ) {

        setProfileImage(
          `${API_URL}${result.user.profileImage}`
        );

      }


      setSelectedImage(
        null
      );


      setIsEditing(
        false
      );


      alert(
        "Profile updated successfully!"
      );


    } catch (error) {

      console.error(
        "Update Profile Error:",
        error
      );


      alert(
        error.message ||
        "Failed to update profile"
      );


    } finally {

      setSaving(false);

    }

  };


  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const handleCancel = () => {

    setFormData(
      savedData
    );


    setSelectedImage(
      null
    );


    // Restore saved image
    // by fetching profile again

    const token =
      localStorage.getItem("token");


    if (token) {

      fetch(
        `${API_URL}/api/profile`,
        {

          headers: {

            Authorization:
              `Bearer ${token}`

          }

        }
      )
        .then(
          (response) =>
            response.json()
        )
        .then(
          (data) => {

            if (
              data.user?.profileImage
            ) {

              setProfileImage(
                `${API_URL}${data.user.profileImage}`
              );

            }

          }
        )
        .catch(
          (error) =>
            console.error(
              error
            )
        );

    }


    setIsEditing(
      false
    );

  };


  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-gray-50">

        <div className="text-center">

          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600">
          </div>


          <p className="text-sm text-gray-500">

            Loading profile...

          </p>

        </div>

      </div>

    );

  }


  // ==========================================
  // PROFILE UI
  // ==========================================

  return (

    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">


      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="mx-auto mb-6 max-w-5xl">

        <h1 className="text-2xl font-bold text-[#063b7a]">

          My Profile

        </h1>


        <p className="mt-1 text-sm text-gray-500">

          View and update your personal information

        </p>

      </div>


      {/* ==========================================
          PROFILE CARD
      ========================================== */}

      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">


        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr]">


          {/* ========================================
              LEFT SIDE
          ========================================= */}

          <div className="flex flex-col items-center border-b border-gray-200 bg-[#f8fafc] px-6 py-8 md:border-b-0 md:border-r">


            {/* PROFILE IMAGE */}

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


              {/* CAMERA */}

              {isEditing && (

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-[#2563eb] text-white shadow-md transition hover:bg-blue-700"
                >

                  <Camera size={17} />

                </button>

              )}

            </div>


            {/* HIDDEN INPUT */}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleImageChange}
              className="hidden"
            />


            {/* CHANGE PHOTO */}

            {isEditing && (

              <>

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="mt-5 rounded-lg border border-blue-500 px-5 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                >

                  Change Photo

                </button>


                <p className="mt-2 text-xs text-gray-400">

                  JPG, PNG or JPEG • Max 5MB

                </p>

              </>

            )}


            {/* NAME */}

            <div className="mt-7 text-center">

              <h2 className="text-lg font-semibold text-gray-800">

                {formData.name ||
                  "Citizen"}

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


            {/* TITLE */}

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

                  <Pencil
                    size={16}
                  />

                  Edit Profile

                </button>

              )}

            </div>


            {/* ======================================
                FORM
            ======================================= */}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">


              {/* NAME */}

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


              {/* GENDER */}

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


              {/* ADDRESS */}

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


              {/* CONTACT */}

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


              {/* EMAIL */}

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


              {/* DOB */}

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
                SAVE / CANCEL
            ======================================= */}

            {isEditing && (

              <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6">


                {/* CANCEL */}

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                >

                  <X
                    size={17}
                  />

                  Cancel

                </button>


                {/* SAVE */}

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-[#063b7a] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#052f62] disabled:cursor-not-allowed disabled:opacity-70"
                >

                  <Save
                    size={17}
                  />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}

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