import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/+$/, "");
const API_URL = API_BASE_URL.endsWith("/api")
  ? API_BASE_URL
  : `${API_BASE_URL}/api`;
const SERVER_URL = API_URL.slice(0, -4);

const getImageUrl = (image) => {
  if (!image) {
    return "";
  }

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  return `${SERVER_URL}${image.startsWith("/") ? "" : "/"}${image}`;
};

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "Not available";
  }

  const date = new Date(dateValue);
  return Number.isNaN(date.getTime())
    ? "Not available"
    : date.toLocaleString();
};

export default function ComplaintDetails() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadComplaint = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("adminToken");
        if (!token) {
          throw new Error("Please sign in to view complaint details.");
        }

        const response = await fetch(`${API_URL}/admin/complaints/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok || data.success === false) {
          throw new Error(data.message || "Unable to load complaint details.");
        }

        if (!data.complaint) {
          throw new Error("Complaint details were not returned by the server.");
        }

        setComplaint(data.complaint);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message || "Unable to load complaint details.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void loadComplaint();
    return () => controller.abort();
  }, [id]);

  const complaintReference = complaint?.complaintId
    || `CMP-${String(complaint?._id || id).slice(-6).toUpperCase()}`;
  const location =
    typeof complaint?.location === "string"
      ? complaint.location
      : complaint?.location?.address || "Location not available";
  const image = complaint?.photo?.url || complaint?.complaintImage;

  return (
    <div className="flex min-h-screen bg-[#f5f7fb] text-[#172033]">
      <AdminSidebar />

      <div className="min-h-screen min-w-0 flex-1">
        <AdminNavbar title="Complaint Details" />

        <main className="mx-auto w-full max-w-[1700px] p-4 sm:p-6 lg:p-8">
          <Link
            to="/admin/complaints"
            className="mb-6 inline-flex text-sm font-medium text-blue-700 hover:text-blue-800"
          >
            &larr; Back to complaints
          </Link>

          {loading && (
            <p className="rounded-xl bg-white p-6 text-sm text-slate-600">
              Loading complaint details...
            </p>
          )}

          {!loading && error && (
            <p role="alert" className="rounded-xl bg-white p-6 text-sm text-red-600">
              {error}
            </p>
          )}

          {!loading && !error && complaint && (
            <>
              <header className="mb-7">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-blue-700">
                  Municipal Services · {complaintReference}
                </p>
                <h1 className="text-2xl font-semibold text-[#172033]">
                  {complaint.complaintType || "Complaint"}
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  Submitted {formatDate(complaint.createdAt)}
                </p>
              </header>

              <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
                <section className="space-y-6">
                  <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                      <h2 className="text-lg font-semibold">Complaint information</h2>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                        {complaint.status || "Pending"}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-700">
                      Description
                    </h3>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                      {complaint.description || "No description provided."}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h2 className="mb-4 text-lg font-semibold">Location</h2>
                    <p className="text-sm text-slate-700">{location}</p>
                    {complaint.latitude != null && complaint.longitude != null && (
                      <p className="mt-2 text-xs text-slate-500">
                        {complaint.latitude}, {complaint.longitude}
                      </p>
                    )}
                  </div>

                  {image && (
                    <div className="rounded-xl border border-slate-200 bg-white p-6">
                      <h2 className="mb-4 text-lg font-semibold">Complaint photo</h2>
                      <img
                        src={getImageUrl(image)}
                        alt="Submitted complaint"
                        className="max-h-[420px] w-full rounded-lg object-contain"
                      />
                    </div>
                  )}
                </section>

                <aside className="h-fit space-y-6">
                  <section className="rounded-xl border border-slate-200 bg-white p-6">
                    <h2 className="mb-4 text-lg font-semibold">Citizen</h2>
                    <p className="text-sm font-medium text-slate-800">
                      {complaint.user?.name || "Name not available"}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      {complaint.user?.email || "Email not available"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {complaint.user?.contact || "Contact not available"}
                    </p>
                  </section>

                  <section className="rounded-xl border border-slate-200 bg-white p-6">
                    <h2 className="mb-4 text-lg font-semibold">Assigned staff</h2>
                    {complaint.assignedStaff ? (
                      <>
                        <p className="text-sm font-medium text-slate-800">
                          {complaint.assignedStaff.name}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {complaint.assignedStaff.department || "Department not available"}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-slate-500">No staff assigned</p>
                    )}
                  </section>
                </aside>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
