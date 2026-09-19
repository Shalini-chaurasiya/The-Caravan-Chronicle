import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  Phone,
  Mail,
  User,
  FileText,
  Image as ImageIcon,
  Tag,
} from "lucide-react";

const ComplaintDetails = () => {
  const navigate = useNavigate();
  const { complaintId } = useParams();

  const API_URL = import.meta.env.VITE_API_URL;

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH COMPLAINT FROM BACKEND
  // =====================================================

  useEffect(() => {
    const fetchComplaintDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please login again.");
        }

        if (!complaintId) {
          throw new Error("Complaint ID is missing.");
        }

        console.log("Fetching complaint:", complaintId);

        const response = await fetch(
          `${API_URL}/api/complaints/${complaintId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log("Complaint Details Response:", data);

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            throw new Error("Session expired. Please login again.");
          }

          throw new Error(
            data.message || "Failed to fetch complaint details."
          );
        }

        if (!data.success || !data.complaint) {
          throw new Error("Complaint details not found.");
        }

        setComplaint(data.complaint);
      } catch (err) {
        console.error("Complaint Details Error:", err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaintDetails();
  }, [complaintId, API_URL]);

  // =====================================================
  // BACK BUTTON
  // =====================================================

  const handleBack = () => {
    navigate("/citizen/dashboard/complaints");
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>

          <p className="mt-4 text-sm font-medium text-slate-600">
            Loading complaint details...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !complaint) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <FileText size={22} className="text-red-500" />
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-900">
            Unable to Load Complaint
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error || "Complaint details could not be found."}
          </p>

          <button
            type="button"
            onClick={handleBack}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <ArrowLeft size={17} />
            Back to My Complaints
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // USER DATA FROM POPULATED BACKEND
  // =====================================================

  const user = complaint.user || {};

  // =====================================================
  // DATE / TIME
  // =====================================================

  const submittedDate = complaint.createdAt
    ? new Date(complaint.createdAt)
    : null;

  const formattedDate = submittedDate
    ? submittedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "N/A";

  const formattedTime = submittedDate
    ? submittedDate.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "N/A";

  // =====================================================
  // IMAGE URL
  // =====================================================

  let imageUrl = null;

  if (complaint.photo?.url) {
    if (complaint.photo.url.startsWith("http")) {
      imageUrl = complaint.photo.url;
    } else {
      imageUrl = `${API_URL}${complaint.photo.url}`;
    }
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-5 sm:px-6 lg:px-8">

          <button
            type="button"
            onClick={handleBack}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            Back to My Complaints
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div className="min-w-0">

              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Complaint Details
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {complaint.complaintType}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Information submitted with your complaint
              </p>

            </div>

            {/* COMPLAINT ID */}

            <div className="shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">

              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Complaint ID
              </p>

              <p className="mt-1 max-w-[220px] truncate text-sm font-bold text-blue-700">
                {complaint._id}
              </p>

            </div>

          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="mx-auto max-w-6xl px-5 py-7 sm:px-6 lg:px-8">

        <div className="grid gap-6 lg:grid-cols-3">

          {/* =================================================
              LEFT COLUMN
          ================================================= */}

          <div className="space-y-6 lg:col-span-2">

            {/* =================================================
                COMPLAINT INFORMATION
            ================================================= */}

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">

              <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                  <FileText
                    size={19}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Complaint Information
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Details provided while submitting the complaint
                  </p>
                </div>

              </div>

              <div className="p-5 sm:p-6">

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* COMPLAINT TYPE */}

                  <div>

                    <div className="mb-2 flex items-center gap-2">
                      <FileText
                        size={15}
                        className="text-slate-400"
                      />

                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Complaint Type
                      </p>
                    </div>

                    <p className="text-sm font-semibold text-slate-900">
                      {complaint.complaintType || "N/A"}
                    </p>

                  </div>

                  {/* CATEGORY */}

                  <div>

                    <div className="mb-2 flex items-center gap-2">
                      <Tag
                        size={15}
                        className="text-slate-400"
                      />

                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Status
                      </p>
                    </div>

                    <span className="inline-flex rounded-md bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                      {complaint.status || "Pending"}
                    </span>

                  </div>

                </div>

                {/* DESCRIPTION */}

                <div className="mt-6 border-t border-slate-100 pt-5">

                  <div className="mb-2 flex items-center gap-2">

                    <FileText
                      size={15}
                      className="text-slate-400"
                    />

                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Description
                    </p>

                  </div>

                  <p className="text-sm leading-7 text-slate-700">
                    {complaint.description || "No description provided."}
                  </p>

                </div>

              </div>
            </section>

            {/* =================================================
                LOCATION
            ================================================= */}

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">

              <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">

                  <MapPin
                    size={19}
                    className="text-emerald-600"
                  />

                </div>

                <div>

                  <h2 className="text-sm font-bold text-slate-900">
                    Location Information
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Location provided with your complaint
                  </p>

                </div>

              </div>

              <div className="p-5 sm:p-6">

                <div className="flex items-start gap-3">

                  <MapPin
                    size={19}
                    className="mt-0.5 shrink-0 text-red-500"
                  />

                  <div className="min-w-0">

                    <p className="break-words text-sm font-semibold text-slate-900">
                      {complaint.location || "Location not provided"}
                    </p>

                    {complaint.latitude !== null &&
                      complaint.longitude !== null && (
                        <p className="mt-2 text-xs text-slate-400">
                          Coordinates: {complaint.latitude},{" "}
                          {complaint.longitude}
                        </p>
                      )}

                  </div>

                </div>

              </div>
            </section>

            {/* =================================================
                UPLOADED IMAGE
            ================================================= */}

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">

              <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50">

                  <ImageIcon
                    size={19}
                    className="text-purple-600"
                  />

                </div>

                <div>

                  <h2 className="text-sm font-bold text-slate-900">
                    Uploaded Evidence
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Image submitted with your complaint
                  </p>

                </div>

              </div>

              <div className="p-5 sm:p-6">

                {imageUrl ? (
                  <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100">

                    <img
                      src={imageUrl}
                      alt="Complaint evidence"
                      className="max-h-[420px] w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />

                  </div>
                ) : (
                  <div className="flex min-h-[150px] items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50">

                    <div className="text-center">

                      <ImageIcon
                        size={28}
                        className="mx-auto text-slate-400"
                      />

                      <p className="mt-2 text-sm text-slate-500">
                        No image was uploaded
                      </p>

                    </div>

                  </div>
                )}

              </div>
            </section>

          </div>

          {/* =====================================================
              RIGHT COLUMN
          ===================================================== */}

          <aside className="space-y-6">

            {/* =================================================
                SUBMITTED BY
            ================================================= */}

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">

              <div className="border-b border-slate-100 px-5 py-4">

                <h2 className="text-sm font-bold text-slate-900">
                  Submitted By
                </h2>

              </div>

              <div className="divide-y divide-slate-100">

                {/* NAME */}

                <div className="flex items-center gap-3 px-5 py-4">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">

                    <User
                      size={17}
                      className="text-slate-600"
                    />

                  </div>

                  <div className="min-w-0">

                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Name
                    </p>

                    <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                      {user.name || "N/A"}
                    </p>

                  </div>

                </div>

                {/* EMAIL */}

                <div className="flex items-center gap-3 px-5 py-4">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">

                    <Mail
                      size={17}
                      className="text-slate-600"
                    />

                  </div>

                  <div className="min-w-0">

                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Email
                    </p>

                    <p className="mt-1 break-all text-sm font-medium text-slate-700">
                      {user.email || "N/A"}
                    </p>

                  </div>

                </div>

                {/* PHONE */}

                <div className="flex items-center gap-3 px-5 py-4">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">

                    <Phone
                      size={17}
                      className="text-slate-600"
                    />

                  </div>

                  <div className="min-w-0">

                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Phone
                    </p>

                    <p className="mt-1 break-words text-sm font-medium text-slate-700">
                      {user.contact || "Not provided"}
                    </p>

                  </div>

                </div>

                {/* ADDRESS */}

                <div className="flex items-start gap-3 px-5 py-4">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">

                    <MapPin
                      size={17}
                      className="text-slate-600"
                    />

                  </div>

                  <div className="min-w-0">

                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Address
                    </p>

                    <p className="mt-1 break-words text-sm font-medium leading-6 text-slate-700">
                      {user.address || "Not provided"}
                    </p>

                  </div>

                </div>

              </div>
            </section>

            {/* =================================================
                SUBMISSION INFORMATION
            ================================================= */}

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">

              <div className="border-b border-slate-100 px-5 py-4">

                <h2 className="text-sm font-bold text-slate-900">
                  Submission Information
                </h2>

              </div>

              <div className="divide-y divide-slate-100">

                {/* DATE */}

                <div className="flex items-center gap-3 px-5 py-4">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">

                    <CalendarDays
                      size={17}
                      className="text-blue-600"
                    />

                  </div>

                  <div>

                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Date Submitted
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {formattedDate}
                    </p>

                  </div>

                </div>

                {/* TIME */}

                <div className="flex items-center gap-3 px-5 py-4">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">

                    <Clock3
                      size={17}
                      className="text-blue-600"
                    />

                  </div>

                  <div>

                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Time Submitted
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {formattedTime}
                    </p>

                  </div>

                </div>

              </div>
            </section>

            {/* =================================================
                BACK BUTTON
            ================================================= */}

            <button
              type="button"
              onClick={handleBack}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <ArrowLeft size={17} />
              Back to My Complaints
            </button>

          </aside>
        </div>
      </main>
    </div>
  );
};

export default ComplaintDetails;