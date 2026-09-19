import { useState } from "react";
import {
  MapPin,
  Upload,
  Send,
  Navigation,
  Search,
  X,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const NewComplaint = () => {

  const navigate = useNavigate();

  // =====================================================
  // FORM STATE
  // =====================================================

  const [formData, setFormData] = useState({
    complaintType: "",
    customComplaintType: "",
    location: "",
    latitude: null,
    longitude: null,
    description: "",
    photo: null,
  });

  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);


  // =====================================================
  // LOCATION STATES
  // =====================================================

  const [locationOpen, setLocationOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");


  // =====================================================
  // COMPLAINT TYPE
  // =====================================================

  const complaintTypes = [
    "Road Damage",
    "Street Light",
    "Water Supply",
    "Garbage",
    "Drainage",
    "Sewage",
    "Electricity",
    "Parks",
    "Traffic",
    "Construction",
    "Other",
  ];


  // =====================================================
  // HANDLE NORMAL INPUT
  // =====================================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };


  // =====================================================
  // HANDLE COMPLAINT TYPE
  // =====================================================

  const handleComplaintTypeChange = (e) => {

    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,

      complaintType: value,

      customComplaintType:
        value === "Other"
          ? prev.customComplaintType
          : "",
    }));

  };


  // =====================================================
  // HANDLE FILE
  // =====================================================

  const handleFileChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;


    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];


    if (!allowedTypes.includes(file.type)) {

      alert(
        "Please upload a JPG, JPEG or PNG image."
      );

      e.target.value = "";

      return;
    }


    if (file.size > 5 * 1024 * 1024) {

      alert(
        "Image size must be less than 5MB."
      );

      e.target.value = "";

      return;
    }


    setFormData((prev) => ({
      ...prev,
      photo: file,
    }));


    setFileName(file.name);

  };


  // =====================================================
  // REMOVE PHOTO
  // =====================================================

  const removePhoto = () => {

    setFormData((prev) => ({
      ...prev,
      photo: null,
    }));


    setFileName("");


    const input =
      document.getElementById("photo");


    if (input) {
      input.value = "";
    }

  };


  // =====================================================
  // OPEN LOCATION BOX
  // =====================================================

  const openLocationBox = () => {

    setLocationOpen(true);

    setLocationError("");

  };


  // =====================================================
  // CLOSE LOCATION BOX
  // =====================================================

  const closeLocationBox = () => {

    setLocationOpen(false);

    setLocationError("");

  };


  // =====================================================
  // USE CURRENT LOCATION
  // =====================================================

  const handleCurrentLocation = () => {

    setLocationError("");


    if (!navigator.geolocation) {

      setLocationError(
        "Geolocation is not supported by your browser."
      );

      return;
    }


    setLocationLoading(true);


    navigator.geolocation.getCurrentPosition(

      async (position) => {

        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;


        try {

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                Accept:
                  "application/json",
              },
            }
          );


          if (!response.ok) {

            throw new Error(
              "Unable to get address"
            );

          }


          const data =
            await response.json();


          const address =
            data.display_name ||
            `${latitude}, ${longitude}`;


          setFormData((prev) => ({
            ...prev,

            location:
              address,

            latitude,

            longitude,
          }));


          setLocationSearch(address);

          setLocationOpen(false);


        } catch (error) {

          console.error(
            "Location Error:",
            error
          );


          setFormData((prev) => ({
            ...prev,

            location:
              `${latitude}, ${longitude}`,

            latitude,

            longitude,
          }));


          setLocationSearch(
            `${latitude}, ${longitude}`
          );


          setLocationOpen(false);

        } finally {

          setLocationLoading(false);

        }

      },


      (error) => {

        console.error(
          "Geolocation Error:",
          error
        );


        setLocationLoading(false);


        if (error.code === 1) {

          setLocationError(
            "Location permission denied. Please allow location access."
          );

        } else if (error.code === 2) {

          setLocationError(
            "Unable to detect your location."
          );

        } else if (error.code === 3) {

          setLocationError(
            "Location request timed out."
          );

        } else {

          setLocationError(
            "Unable to get your current location."
          );

        }

      },


      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }

    );

  };


  // =====================================================
  // MANUAL LOCATION
  // =====================================================

  const handleManualLocation = () => {

    const value =
      locationSearch.trim();


    if (!value) {

      setLocationError(
        "Please enter a location."
      );

      return;
    }


    setFormData((prev) => ({
      ...prev,

      location: value,

      latitude: null,

      longitude: null,
    }));


    setLocationOpen(false);

    setLocationError("");

  };


  // =====================================================
  // SUBMIT COMPLAINT
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    if (submitting) return;


    // =====================================================
    // GET JWT TOKEN
    // =====================================================

    const token =
      localStorage.getItem("token");


    console.log(
      "Complaint Token:",
      token
    );


    // =====================================================
    // CHECK TOKEN
    // =====================================================

    if (!token) {

      alert(
        "Please login first."
      );

      navigate("/login");

      return;

    }


    // =====================================================
    // FINAL COMPLAINT TYPE
    // =====================================================

    const finalComplaintType =
      formData.complaintType === "Other"

        ? formData.customComplaintType.trim()

        : formData.complaintType;


    // =====================================================
    // VALIDATION
    // =====================================================

    if (!finalComplaintType) {

      alert(
        "Please select or enter a complaint type."
      );

      return;

    }


    if (!formData.location.trim()) {

      alert(
        "Please select or enter a location."
      );

      return;

    }


    if (!formData.description.trim()) {

      alert(
        "Please describe the complaint."
      );

      return;

    }


    try {

      setSubmitting(true);


      // =====================================================
      // CREATE FORMDATA
      // =====================================================

      const data =
        new FormData();


      data.append(
        "complaintType",
        finalComplaintType
      );


      data.append(
        "location",
        formData.location
      );


      // =====================================================
      // LATITUDE
      // =====================================================

      if (
        formData.latitude !== null &&
        formData.latitude !== undefined
      ) {

        data.append(
          "latitude",
          formData.latitude
        );

      }


      // =====================================================
      // LONGITUDE
      // =====================================================

      if (
        formData.longitude !== null &&
        formData.longitude !== undefined
      ) {

        data.append(
          "longitude",
          formData.longitude
        );

      }


      // =====================================================
      // DESCRIPTION
      // =====================================================

      data.append(
        "description",
        formData.description.trim()
      );


      // =====================================================
      // PHOTO
      // =====================================================

      if (formData.photo) {

        data.append(
          "photo",
          formData.photo
        );

      }


      // =====================================================
      // DEBUG
      // =====================================================

      console.log(
        "Submitting complaint..."
      );


      for (
        const [key, value]
        of data.entries()
      ) {

        console.log(
          key,
          value instanceof File
            ? value.name
            : value
        );

      }


      // =====================================================
      // API REQUEST
      // =====================================================

      const response =
        await fetch(

          `${import.meta.env.VITE_API_URL}/api/complaints`,

          {

            method: "POST",

            headers: {

              // IMPORTANT
              // Do NOT add Content-Type here.
              // Browser sets multipart boundary automatically.

              Authorization:
                `Bearer ${token}`,

            },

            body: data,

          }

        );


      // =====================================================
      // RESPONSE
      // =====================================================

      const result =
        await response.json();


      console.log(
        "Backend response:",
        result
      );


      // =====================================================
      // AUTH ERROR
      // =====================================================

      if (
        response.status === 401
      ) {

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );


        alert(
          "Your session has expired. Please login again."
        );


        navigate("/login");

        return;

      }


      // =====================================================
      // OTHER ERROR
      // =====================================================

      if (
        !response.ok ||
        !result.success
      ) {

        throw new Error(

          result.message ||

          result.error ||

          "Failed to submit complaint"

        );

      }


      // =====================================================
      // SUCCESS
      // =====================================================

      alert(
        "Complaint submitted successfully!"
      );


      // =====================================================
      // RESET FORM
      // =====================================================

      setFormData({

        complaintType: "",

        customComplaintType: "",

        location: "",

        latitude: null,

        longitude: null,

        description: "",

        photo: null,

      });


      setFileName("");

      setLocationSearch("");

      setLocationError("");


      const input =
        document.getElementById("photo");


      if (input) {

        input.value = "";

      }


      // =====================================================
      // GO TO MY COMPLAINTS
      // =====================================================

      navigate(
        "/citizen/dashboard/my-complaints"
      );


    } catch (error) {

      console.error(
        "Complaint Submission Error:",
        error
      );


      alert(

        error.message ||

        "Failed to submit complaint. Please try again."

      );


    } finally {

      setSubmitting(false);

    }

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="min-h-screen bg-slate-50">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="border-b border-slate-200 bg-white px-5 py-5 sm:px-8">

        <div className="mx-auto flex max-w-4xl items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white shadow-sm">

            S

          </div>


          <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">

            Submit New Complaint

          </h1>

        </div>

      </div>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="flex justify-center px-5 py-8">

        <div className="w-full max-w-2xl">


          {/* =====================================================
              CARD
          ===================================================== */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">


            {/* HEADING */}

            <div className="mb-7">

              <h2 className="text-2xl font-bold text-slate-800">

                Submit New Complaint

              </h2>


              <p className="mt-1 text-sm text-slate-500">

                Provide the details of your complaint below.

              </p>

            </div>


            {/* =====================================================
                FORM
            ===================================================== */}

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >


              {/* =================================================
                  COMPLAINT TYPE
              ================================================= */}

              <div>

                <label
                  htmlFor="complaintType"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >

                  Complaint Type

                </label>


                <div className="relative">

                  <select
                    id="complaintType"
                    name="complaintType"
                    value={
                      formData.complaintType
                    }
                    onChange={
                      handleComplaintTypeChange
                    }
                    required
                    className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  >

                    <option value="">

                      Select Type

                    </option>


                    {complaintTypes.map(
                      (type) => (

                        <option
                          key={type}
                          value={type}
                        >

                          {type}

                        </option>

                      )
                    )}

                  </select>


                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                </div>

              </div>


              {/* =================================================
                  OTHER COMPLAINT TYPE
              ================================================= */}

              {formData.complaintType ===
                "Other" && (

                <div className="rounded-xl border border-green-200 bg-green-50 p-4">

                  <label
                    htmlFor="customComplaintType"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >

                    Enter Complaint Type

                  </label>


                  <input
                    id="customComplaintType"
                    type="text"
                    name="customComplaintType"
                    value={
                      formData.customComplaintType
                    }
                    onChange={handleChange}
                    placeholder="Enter your complaint type"
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />


                  <p className="mt-2 text-xs text-slate-500">

                    Please enter the type of issue you want to report.

                  </p>

                </div>

              )}


              {/* =================================================
                  LOCATION
              ================================================= */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">

                  Location

                </label>


                <button
                  type="button"
                  onClick={openLocationBox}
                  className="flex w-full items-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 text-left transition hover:border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                >

                  <MapPin
                    size={20}
                    className="shrink-0 text-green-600"
                  />


                  <div className="min-w-0 flex-1">

                    {formData.location ? (

                      <>

                        <p className="text-[11px] font-medium text-green-600">

                          Selected Location

                        </p>


                        <p className="truncate text-sm text-slate-700">

                          {formData.location}

                        </p>

                      </>

                    ) : (

                      <p className="text-sm text-slate-400">

                        Search for area, street, landmark...

                      </p>

                    )}

                  </div>


                  <Search
                    size={18}
                    className="shrink-0 text-slate-400"
                  />

                </button>


                {/* =================================================
                    LOCATION PANEL
                ================================================= */}

                {locationOpen && (

                  <div className="relative z-20 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">

                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">

                      <div>

                        <h3 className="text-sm font-bold text-slate-800">

                          Select Location

                        </h3>


                        <p className="text-xs text-slate-400">

                          Choose your complaint location

                        </p>

                      </div>


                      <button
                        type="button"
                        onClick={closeLocationBox}
                        className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100"
                      >

                        <X
                          size={18}
                          className="text-slate-500"
                        />

                      </button>

                    </div>


                    <div className="p-4">


                      {/* LOCATION SEARCH */}

                      <div className="relative">

                        <Search
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />


                        <input
                          type="text"
                          value={
                            locationSearch
                          }
                          onChange={(e) => {

                            setLocationSearch(
                              e.target.value
                            );

                            setLocationError("");

                          }}
                          placeholder="Search area, street, landmark..."
                          className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          autoFocus
                        />

                      </div>


                      {/* CURRENT LOCATION */}

                      <button
                        type="button"
                        onClick={
                          handleCurrentLocation
                        }
                        disabled={
                          locationLoading
                        }
                        className="mt-3 flex w-full items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-left transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">

                          {locationLoading ? (

                            <Loader2
                              size={19}
                              className="animate-spin text-blue-700"
                            />

                          ) : (

                            <Navigation
                              size={19}
                              className="text-blue-700"
                            />

                          )}

                        </div>


                        <div>

                          <p className="text-sm font-semibold text-blue-700">

                            {locationLoading

                              ? "Detecting location..."

                              : "Use my current location"}

                          </p>


                          <p className="mt-0.5 text-xs text-blue-500">

                            Allow location access to detect automatically

                          </p>

                        </div>

                      </button>


                      {/* DIVIDER */}

                      <div className="my-4 flex items-center gap-3">

                        <div className="h-px flex-1 bg-slate-200" />

                        <span className="text-xs text-slate-400">

                          OR

                        </span>

                        <div className="h-px flex-1 bg-slate-200" />

                      </div>


                      {/* MANUAL LOCATION */}

                      <button
                        type="button"
                        onClick={
                          handleManualLocation
                        }
                        disabled={
                          !locationSearch.trim()
                        }
                        className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                      >

                        Use This Location

                      </button>


                      {/* ERROR */}

                      {locationError && (

                        <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">

                          {locationError}

                        </div>

                      )}

                    </div>

                  </div>

                )}

              </div>


              {/* =================================================
                  LOCATION INFORMATION
              ================================================= */}

              {formData.location && (

                <div className="rounded-lg bg-green-50 px-4 py-3">

                  <div className="flex items-start gap-2">

                    <MapPin
                      size={17}
                      className="mt-0.5 shrink-0 text-green-600"
                    />


                    <div>

                      <p className="text-xs font-semibold text-green-700">

                        Complaint Location

                      </p>


                      <p className="mt-1 text-xs leading-5 text-slate-600">

                        {formData.location}

                      </p>


                      {formData.latitude !== null &&
                        formData.longitude !== null && (

                          <p className="mt-1 text-[10px] text-slate-400">

                            Coordinates:{" "}

                            {formData.latitude.toFixed(6)}

                            ,{" "}

                            {formData.longitude.toFixed(6)}

                          </p>

                        )}

                    </div>

                  </div>

                </div>

              )}


              {/* =================================================
                  DESCRIPTION
              ================================================= */}

              <div>

                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >

                  Description

                </label>


                <textarea
                  id="description"
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Describe the issue..."
                  className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />

              </div>


              {/* =================================================
                  PHOTO
              ================================================= */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">

                  Upload Photo

                </label>


                <label
                  htmlFor="photo"
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-4 transition hover:border-green-500 hover:bg-green-50"
                >

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100">

                    <Upload
                      size={19}
                      className="text-green-600"
                    />

                  </div>


                  <div className="flex-1 overflow-hidden">

                    <p className="truncate text-sm font-medium text-slate-700">

                      {fileName ||
                        "Choose a photo"}

                    </p>


                    <p className="text-xs text-slate-400">

                      JPG, PNG or JPEG • Max 5MB

                    </p>

                  </div>


                  {fileName ? (

                    <button
                      type="button"
                      onClick={(e) => {

                        e.preventDefault();

                        removePhoto();

                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-red-50"
                    >

                      <X
                        size={17}
                        className="text-red-500"
                      />

                    </button>

                  ) : (

                    <span className="rounded-md bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm">

                      Browse

                    </span>

                  )}


                  <input
                    id="photo"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={
                      handleFileChange
                    }
                    className="hidden"
                  />

                </label>

              </div>


              {/* =================================================
                  SUBMIT
              ================================================= */}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {submitting ? (

                  <>

                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                    Submitting...

                  </>

                ) : (

                  <>

                    <Send size={18} />

                    Submit Complaint

                  </>

                )}

              </button>


            </form>

          </div>

        </div>

      </main>

    </div>

  );
};
export default NewComplaint;