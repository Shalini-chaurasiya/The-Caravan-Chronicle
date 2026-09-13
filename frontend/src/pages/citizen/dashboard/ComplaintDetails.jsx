import React from "react";
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

  // =====================================================
  // TEMPORARY COMPLAINT DATA
  // =====================================================
  // Later this data can come from your backend API.

  const complaint = {
    id: complaintId || "CMP-2026-00124",

    name: "Citizen",

    email: "citizen@example.com",

    phone: "+91 98765 43210",

    title: "Garbage not collected",

    category: "Garbage",

    description:
      "Garbage has not been collected from our locality for several days. The garbage bins are completely full and waste is spreading around the area. Kindly arrange garbage collection as soon as possible.",

    location: "Civil Lines, Prayagraj",

    address:
      "Near Civil Lines Park, Civil Lines, Prayagraj, Uttar Pradesh",

    date: "02 September 2026",

    time: "10:30 AM",

    image:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=900&q=80",
  };

  // =====================================================
  // BACK BUTTON
  // =====================================================

  const handleBack = () => {
    navigate("/citizen/dashboard/complaints");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-5 sm:px-6 lg:px-8">

          {/* BACK */}
          <button
            type="button"
            onClick={handleBack}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            Back to My Complaints
          </button>

          {/* HEADER CONTENT */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div className="min-w-0">

              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Complaint Details
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {complaint.title}
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

              <p className="mt-1 text-sm font-bold text-blue-700">
                {complaint.id}
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

          {/* =====================================================
              LEFT COLUMN
          ===================================================== */}

          <div className="space-y-6 lg:col-span-2">

            {/* =================================================
                COMPLAINT INFORMATION
            ================================================= */}

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">

              {/* SECTION HEADER */}

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

              {/* CONTENT */}

              <div className="p-5 sm:p-6">

                {/* TITLE + CATEGORY */}

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* TITLE */}

                  <div>

                    <div className="mb-2 flex items-center gap-2">

                      <FileText
                        size={15}
                        className="text-slate-400"
                      />

                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Complaint Title
                      </p>

                    </div>

                    <p className="text-sm font-semibold text-slate-900">
                      {complaint.title}
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
                        Category
                      </p>

                    </div>

                    <span className="inline-flex rounded-md bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                      {complaint.category}
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
                    {complaint.description}
                  </p>

                </div>

              </div>

            </section>

            {/* =================================================
                LOCATION
            ================================================= */}

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">

              {/* HEADER */}

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

              {/* CONTENT */}

              <div className="p-5 sm:p-6">

                <div className="flex items-start gap-3">

                  <MapPin
                    size={19}
                    className="mt-0.5 shrink-0 text-red-500"
                  />

                  <div className="min-w-0">

                    <p className="text-sm font-semibold text-slate-900">
                      {complaint.location}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {complaint.address}
                    </p>

                  </div>

                </div>

              </div>

            </section>

            {/* =================================================
                UPLOADED IMAGE
            ================================================= */}

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">

              {/* HEADER */}

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

              {/* IMAGE */}

              <div className="p-5 sm:p-6">

                {complaint.image ? (
                  <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100">

                    <img
                      src={complaint.image}
                      alt="Complaint evidence"
                      className="max-h-[420px] w-full object-cover"
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

              {/* HEADER */}

              <div className="border-b border-slate-100 px-5 py-4">

                <h2 className="text-sm font-bold text-slate-900">
                  Submitted By
                </h2>

              </div>

              {/* USER DETAILS */}

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

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {complaint.name}
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
                      {complaint.email}
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

                  <div>

                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Phone
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {complaint.phone}
                    </p>

                  </div>

                </div>

              </div>

            </section>

            {/* =================================================
                SUBMISSION INFORMATION
            ================================================= */}

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">

              {/* HEADER */}

              <div className="border-b border-slate-100 px-5 py-4">

                <h2 className="text-sm font-bold text-slate-900">
                  Submission Information
                </h2>

              </div>

              {/* DETAILS */}

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
                      {complaint.date}
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
                      {complaint.time}
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