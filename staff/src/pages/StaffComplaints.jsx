import { useEffect, useMemo, useState } from "react";
import StaffSidebar from "../components/StaffSidebar";
import {
  Calendar,
  CheckCircle,
  ClipboardList,
  Clock,
  Eye,
  FileText,
  Filter,
  MapPin,
  ExternalLink,
  MessageSquareText,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/+$/, "");
const API_URL = API_BASE_URL.endsWith("/api")
  ? API_BASE_URL
  : `${API_BASE_URL}/api`;

const fetchWithStaffAuth = (url, options = {}) => {
  const headers = new Headers(options.headers);
  const token = localStorage.getItem("staffToken");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  } else {
    headers.delete("Authorization");
  }

  return fetch(url, { ...options, headers });
};

const getIdValue = (value) => {
  if (typeof value === "string") return value.trim();
  if (!value || typeof value !== "object") return "";
  if (typeof value.toHexString === "function") return value.toHexString();
  if (typeof value.$oid === "string") return value.$oid;
  return getIdValue(value._id || value.id);
};

const getComplaintId = (complaint) =>
  getIdValue(complaint?._id) ||
  getIdValue(complaint?.id) ||
  getIdValue(complaint?.complaint?._id) ||
  getIdValue(complaint?.complaint?.id);

const normalizeComplaint = (complaint) => {
  const id = getComplaintId(complaint);
  return { ...complaint, _id: id };
};

const formatDate = (date, includeTime = false) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Not available";

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(includeTime && { hour: "2-digit", minute: "2-digit" }),
  });
};

const getPhotoUrl = (photo) => {
  const photoPath = typeof photo === "string" ? photo : photo?.url;
  if (!photoPath) return "";
  if (/^https?:\/\//i.test(photoPath)) return photoPath;
  return `${API_BASE_URL}${photoPath.startsWith("/") ? "" : "/"}${photoPath}`;
};

const getMapUrl = (complaint) => {
  const { latitude, longitude, location } = complaint;
  const hasCoordinates =
    Number.isFinite(Number(latitude)) &&
    Number.isFinite(Number(longitude)) &&
    latitude !== null &&
    latitude !== "" &&
    longitude !== null &&
    longitude !== "";
  const query = hasCoordinates
    ? `${latitude},${longitude}`
    : location;

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || "")}`;
};

const StaffComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [statusError, setStatusError] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isSendingResolutionOtp, setIsSendingResolutionOtp] = useState(false);
  const [resolutionOtpMessage, setResolutionOtpMessage] = useState("");
  const [resolutionEmail, setResolutionEmail] = useState("");
  const [resolutionCode, setResolutionCode] = useState("");
  const [isVerifyingResolutionOtp, setIsVerifyingResolutionOtp] = useState(false);
  const [resolutionVerificationMessage, setResolutionVerificationMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("staffToken");
    if (!token) {
      window.location.replace("/staff/login");
      return undefined;
    }

    const controller = new AbortController();

    const loadComplaints = async (showError = true) => {
      try {
        const response = await fetch(`${API_URL}/staff/complaints`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        const data = await response.json().catch(() => ({}));

        if (response.status === 401) {
          localStorage.removeItem("staffToken");
          localStorage.removeItem("staff");
          window.location.replace("/staff/login");
          return;
        }

        if (!response.ok || data.success === false || !Array.isArray(data.complaints)) {
          throw new Error(data.message || "Unable to load assigned complaints.");
        }

        const normalizedComplaints = data.complaints.map(normalizeComplaint);
        setComplaints(normalizedComplaints);
        setSelectedComplaint((current) => {
          if (!current) return current;
          return (
            normalizedComplaints.find(
              (complaint) =>
                getComplaintId(complaint) === getComplaintId(current)
            ) || current
          );
        });
        if (showError) setLoadError("");
      } catch (error) {
        if (showError && error.name !== "AbortError") {
          console.error("Load assigned complaints error:", error);
          setLoadError(error.message || "Unable to load assigned complaints.");
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    loadComplaints();
    const refreshInterval = window.setInterval(
      () => loadComplaints(false),
      15000
    );
    return () => {
      controller.abort();
      window.clearInterval(refreshInterval);
    };
  }, []);

  const filteredComplaints = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return complaints
      .filter((complaint) => {
        const matchesSearch = [
          complaint._id,
          complaint.complaintType,
          complaint.description,
          complaint.location,
          complaint.user?.name,
          complaint.user?.email,
          complaint.user?.contact,
        ].some((value) => String(value || "").toLowerCase().includes(normalizedSearch));
        const matchesStatus =
          filterStatus === "All" || complaint.status === filterStatus;
        const matchesPriority =
          filterPriority === "All" || complaint.priority === filterPriority;

        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [complaints, search, filterStatus, filterPriority]);

  const oldHighPriorityComplaints = useMemo(
    () =>
      complaints
        .filter(
          (complaint) =>
            complaint.priority === "High" &&
            !["Resolved", "Rejected"].includes(complaint.status)
        )
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
    [complaints]
  );

  const stats = {
    total: complaints.length,
    pending: complaints.filter((complaint) => complaint.status === "Pending").length,
    progress: complaints.filter((complaint) => complaint.status === "In Progress").length,
    resolved: complaints.filter((complaint) => complaint.status === "Resolved").length,
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-50 text-green-700 border-green-200";
      case "In Progress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-50 text-red-700 border-red-200";
      case "Medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Low":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const updateStatus = async (newStatus) => {
    const complaintId = getComplaintId(selectedComplaint);
    if (!complaintId || newStatus === selectedComplaint.status) return;

    const token = localStorage.getItem("staffToken");
    setIsUpdatingStatus(true);
    setStatusError("");

    try {
      const response = await fetch(
        `${API_URL}/staff/complaints/${complaintId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        localStorage.removeItem("staffToken");
        localStorage.removeItem("staff");
        window.location.replace("/staff/login");
        return;
      }

      if (!response.ok || data.success === false || !data.complaint) {
        throw new Error(data.message || "Unable to update complaint status.");
      }

      setComplaints((current) =>
        current.map((complaint) =>
          getComplaintId(complaint) === getComplaintId(data.complaint)
            ? normalizeComplaint(data.complaint)
            : complaint
        )
      );
      setSelectedComplaint(normalizeComplaint(data.complaint));
    } catch (error) {
      console.error("Update complaint status error:", error);
      setStatusError(error.message || "Unable to update complaint status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const sendResolutionOtp = async () => {
    const complaint = selectedComplaint;
    const normalizedComplaint = normalizeComplaint(complaint);
    const complaintId = normalizedComplaint._id;
    if (!complaintId) {
      setStatusError(
        "This complaint record is missing its database ID. Refresh the complaint list and try again."
      );
      return;
    }

    if (!/^[a-f\d]{24}$/i.test(complaintId)) {
      setStatusError(
        "This complaint has an invalid database ID. Refresh the complaint list and try again."
      );
      return;
    }

    if (!resolutionEmail.trim()) {
      setStatusError("Enter the citizen's registered email address.");
      return;
    }

    const token = localStorage.getItem("staffToken");
    setIsSendingResolutionOtp(true);
    setStatusError("");
    setResolutionOtpMessage("");
    setResolutionVerificationMessage("");
    setResolutionCode("");
    setSelectedComplaint(normalizedComplaint);

    try {
      const response = await fetch(
        `${API_URL}/staff/complaints/${complaintId}/resolution-otp`,
        {
          method: "POST",
          body: new URLSearchParams({ email: resolutionEmail.trim() }),
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        localStorage.removeItem("staffToken");
        localStorage.removeItem("staff");
        window.location.replace("/staff/login");
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to send the verification code.");
      }

      const updatedComplaint = {
        ...normalizedComplaint,
        resolutionOtp: {
          ...normalizedComplaint.resolutionOtp,
          sentAt: new Date().toISOString(),
          expiresAt: data.expiresAt,
        },
      };
      setComplaints((current) =>
        current.map((item) =>
          getComplaintId(item) === complaintId ? updatedComplaint : item
        )
      );
      setSelectedComplaint(updatedComplaint);
      setResolutionOtpMessage(
        `${data.message} Sent to ${data.sentTo}.`
      );
    } catch (error) {
      console.error("Send resolution OTP error:", error);
      setStatusError(error.message || "Unable to send the verification code.");
    } finally {
      setIsSendingResolutionOtp(false);
    }
  };

  const verifyResolutionOtp = async (event) => {
    event.preventDefault();
    const complaintId = getComplaintId(selectedComplaint);
    if (!complaintId || resolutionCode.length !== 6) return;

    setIsVerifyingResolutionOtp(true);
    setStatusError("");
    setResolutionVerificationMessage("");

    try {
      const response = await fetchWithStaffAuth(
        `${API_URL}/staff/complaints/${complaintId}/verify-resolution-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: resolutionCode }),
        }
      );
      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        localStorage.removeItem("staffToken");
        localStorage.removeItem("staff");
        window.location.replace("/staff/login");
        return;
      }

      if (
        !response.ok ||
        !data.success ||
        !data.complaint ||
        data.complaint.status !== "Resolved"
      ) {
        throw new Error(data.message || "Unable to verify the code.");
      }

      setComplaints((current) =>
        current.map((complaint) =>
          getComplaintId(complaint) === complaintId
            ? {
                ...complaint,
                ...data.complaint,
                statusHistory:
                  data.complaint.statusHistory || complaint.statusHistory,
              }
            : complaint
        )
      );
      setSelectedComplaint((current) =>
        current && getComplaintId(current) === complaintId
          ? {
              ...current,
              ...data.complaint,
              statusHistory:
                data.complaint.statusHistory || current.statusHistory,
            }
          : current
      );
      setResolutionCode("");
      setResolutionVerificationMessage(data.message);

      try {
        const refreshResponse = await fetchWithStaffAuth(
          `${API_URL}/staff/complaints`
        );
        const refreshedData = await refreshResponse.json().catch(() => ({}));
        const persistedComplaint = refreshedData.complaints?.find(
          (complaint) => getComplaintId(complaint) === complaintId
        );
        if (
          refreshResponse.ok &&
          persistedComplaint &&
          persistedComplaint.status !== "Resolved"
        ) {
          setStatusError(
            "The server accepted the code, but the complaint is still not marked Resolved. Contact your administrator."
          );
        }
        if (persistedComplaint?.status === "Resolved") {
          const refreshedComplaint = normalizeComplaint(persistedComplaint);
          setComplaints((current) =>
            current.map((complaint) =>
              getComplaintId(complaint) === complaintId
                ? refreshedComplaint
                : complaint
            )
          );
          setSelectedComplaint(refreshedComplaint);
        }
      } catch (refreshError) {
        console.error(
          "Complaint resolved, but refreshing the staff complaint list failed:",
          refreshError
        );
      }
    } catch (error) {
      console.error("Verify resolution OTP error:", error);
      setStatusError(error.message || "Unable to verify the code.");
    } finally {
      setIsVerifyingResolutionOtp(false);
    }
  };

  const statCards = [
    { title: "Total Assigned", value: stats.total, icon: ClipboardList, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Pending", value: stats.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "In Progress", value: stats.progress, icon: RefreshCw, color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: "Resolved", value: stats.resolved, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#f3f6fc] md:flex-row">
      <StaffSidebar />

      <main className="min-w-0 flex-1 p-4 sm:p-5 md:ml-64 md:p-8">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8">
            <p className="mb-2 text-xs font-bold tracking-wider text-blue-600">
              STAFF WORKSPACE
            </p>
            <h1 className="text-3xl font-bold text-[#101f43]">
              Complaint Management
            </h1>
            <p className="mt-2 text-slate-500">
              View and update complaints assigned to you.
            </p>
          </header>

          {loadError && (
            <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {loadError}
            </div>
          )}

          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map(({ title, value, icon: Icon, color, bg }) => (
              <div key={title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">{title}</p>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bg}`}>
                    <Icon size={20} className={color} />
                  </div>
                </div>
                <h2 className="mt-4 text-3xl font-bold text-[#101f43]">{value}</h2>
              </div>
            ))}
          </div>

          <section className="mb-8">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#101f43]">
                  Older High-Priority Complaints
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Unresolved complaints past their department SLA, oldest first.
                </p>
              </div>
              <span className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                {oldHighPriorityComplaints.length} overdue
              </span>
            </div>

            {oldHighPriorityComplaints.length ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {oldHighPriorityComplaints.map((complaint) => (
                  <article
                    key={complaint._id}
                    className="rounded-xl border border-red-100 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-blue-600">
                          {complaint._id}
                        </p>
                        <h3 className="mt-1 font-bold text-slate-800">
                          {complaint.complaintType}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {complaint.location}
                        </p>
                      </div>
                      <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${getPriorityStyle(complaint.priority)}`}>
                        High Priority
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <div className="text-sm text-slate-500">
                        <p>Submitted {formatDate(complaint.createdAt)}</p>
                        <p className="mt-1">
                          Citizen: {complaint.user?.name || "Not provided"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedComplaint(complaint);
                          setResolutionEmail(complaint.user?.email || "");
                          setStatusError("");
                          setResolutionOtpMessage("");
                          setResolutionCode("");
                          setResolutionVerificationMessage("");
                        }}
                        className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800"
                      >
                        Review <Eye size={16} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-green-200 bg-white p-6 text-sm text-slate-600">
                No overdue high-priority complaints.
              </div>
            )}
          </section>

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div>
                  <h2 className="text-xl font-bold text-[#101f43]">
                    All Assigned Complaints
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {filteredComplaints.length} complaints
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search ID, type, citizen, or location"
                      className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Filter size={17} className="text-slate-400" />
                    <select
                      value={filterStatus}
                      onChange={(event) => setFilterStatus(event.target.value)}
                      className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <select
                    value={filterPriority}
                    onChange={(event) => setFilterPriority(event.target.value)}
                    className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    aria-label="Filter by priority"
                  >
                    <option value="All">All Priorities</option>
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                    <option value="Not configured">Not Configured</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="p-4">Complaint</th>
                    <th className="p-4">Citizen</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Submitted</th>
                    <th className="p-4">Priority</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Review</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.map((complaint) => (
                    <tr key={complaint._id} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="p-4">
                        <p className="font-semibold text-slate-800">{complaint.complaintType}</p>
                        <p className="mt-1 text-xs text-blue-600">
                          {complaint._id}
                        </p>
                      </td>
                      <td className="p-4 text-sm text-slate-700">
                        {complaint.user?.name || "Citizen"}
                      </td>
                      <td className="p-4 text-sm text-slate-600">
                        {complaint.location}
                      </td>
                      <td className="p-4 text-sm text-slate-600">
                        {formatDate(complaint.createdAt)}
                      </td>
                      <td className="p-4">
                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getPriorityStyle(complaint.priority)}`}>
                          {complaint.priority || "Not configured"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(complaint.status)}`}>
                          {complaint.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setStatusError("");
                            setResolutionOtpMessage("");
                            setSelectedComplaint(complaint);
                            setResolutionEmail(complaint.user?.email || "");
                            setResolutionCode("");
                            setResolutionVerificationMessage("");
                          }}
                          className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800"
                        >
                          <Eye size={16} /> View details
                        </button>
                        {complaint.status === "In Progress" && (
                          <button
                            type="button"
                            onClick={() => {
                              setStatusError("");
                              setResolutionOtpMessage("");
                              setSelectedComplaint(complaint);
                              setResolutionEmail(complaint.user?.email || "");
                              setResolutionCode("");
                              setResolutionVerificationMessage("");
                            }}
                            disabled={isSendingResolutionOtp}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <MessageSquareText size={15} />
                            {isSendingResolutionOtp ? "Sending..." : "Send OTP"}
                          </button>
                        )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {!isLoading && filteredComplaints.length === 0 && (
                    <tr>
                      <td colSpan="7" className="p-12 text-center">
                        <FileText size={32} className="mx-auto mb-3 text-slate-300" />
                        <p className="font-semibold text-slate-600">
                          {loadError ? "Complaints could not be loaded" : "No assigned complaints found"}
                        </p>
                        {!loadError && (
                          <p className="mt-1 text-sm text-slate-400">
                            Assigned complaints will appear here.
                          </p>
                        )}
                      </td>
                    </tr>
                  )}

                  {isLoading && (
                    <tr>
                      <td colSpan="7" className="p-12 text-center text-sm text-slate-500">
                        Loading assigned complaints...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {selectedComplaint && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#101f43]/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedComplaint(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="complaint-details-title"
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-center justify-between border-b border-slate-100 p-6">
              <div>
                <p className="text-xs font-bold text-blue-600">
                  Complaint ID: {selectedComplaint._id}
                </p>
                <h2 id="complaint-details-title" className="mt-1 text-xl font-bold text-[#101f43]">
                  Complaint Details
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close complaint details"
                onClick={() => setSelectedComplaint(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-red-600"
              >
                <X size={21} />
              </button>
            </header>

            <div className="space-y-6 p-6">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-lg font-bold text-slate-800">
                  {selectedComplaint.complaintType}
                </h3>
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(selectedComplaint.status)}`}>
                  {selectedComplaint.status}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Detail label="Location" value={selectedComplaint.location} icon={MapPin} />
                <Detail label="Submitted" value={formatDate(selectedComplaint.createdAt, true)} icon={Calendar} />
                <Detail label="Last Updated" value={formatDate(selectedComplaint.updatedAt, true)} icon={Clock} />
                <Detail label="Citizen" value={selectedComplaint.user?.name} />
                <Detail label="Citizen Email" value={selectedComplaint.user?.email} />
                <Detail label="Citizen Phone" value={selectedComplaint.user?.contact} />
                <Detail label="Citizen Address" value={selectedComplaint.user?.address} />
                <Detail label="Assigned Staff" value={selectedComplaint.assignedStaff?.name} />
                <Detail label="Department" value={selectedComplaint.assignedStaff?.department} />
                <Detail label="Latitude" value={selectedComplaint.latitude} />
                <Detail label="Longitude" value={selectedComplaint.longitude} />
                <Detail
                  label="Priority"
                  value={selectedComplaint.priority || "Not configured"}
                />
                <Detail
                  label="SLA Due"
                  value={formatDate(selectedComplaint.slaDueAt, true)}
                />
              </div>

              <div>
                <h4 className="mb-2 text-sm font-semibold text-slate-700">
                  Complaint Address
                </h4>
                <p className="mb-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                  {selectedComplaint.location || "No address provided."}
                </p>
                {selectedComplaint.location && (
                  <a
                    href={getMapUrl(selectedComplaint)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <MapPin size={16} />
                    View on Google Maps
                    <ExternalLink size={15} />
                  </a>
                )}
              </div>

              <div>
                <h4 className="mb-2 text-sm font-semibold text-slate-700">
                  Description
                </h4>
                <p className="whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                  {selectedComplaint.description || "No description provided."}
                </p>
              </div>

              {getPhotoUrl(selectedComplaint.photo) && (
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-slate-700">
                    Attached Photo
                  </h4>
                  <a
                    href={getPhotoUrl(selectedComplaint.photo)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block"
                  >
                    <img
                      src={getPhotoUrl(selectedComplaint.photo)}
                      alt={`Photo for ${selectedComplaint.complaintType}`}
                      className="max-h-96 max-w-full rounded-xl border border-slate-200 object-contain"
                    />
                  </a>
                </div>
              )}

              <div>
                <label htmlFor="complaint-status" className="mb-2 block text-sm font-semibold text-slate-700">
                  Update Complaint Status
                </label>
                {selectedComplaint.status === "Resolved" ? (
                  <p className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700">
                    Resolution verified using the citizen-provided email code.
                  </p>
                ) : (
                  <select
                    id="complaint-status"
                    value={selectedComplaint.status}
                    onChange={(event) => updateStatus(event.target.value)}
                    disabled={isUpdatingStatus}
                    className="w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-blue-500 disabled:opacity-60"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                )}
                {isUpdatingStatus && (
                  <p className="mt-2 text-sm text-slate-500">Saving status...</p>
                )}
                {selectedComplaint.status === "In Progress" && (
                  <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-4">
                    <p className="text-sm leading-5 text-blue-900">
                      Enter the citizen’s registered email to send a one-time verification code. The citizen must provide that code to you before you can verify the resolution.
                    </p>
                    <label
                      htmlFor="resolution-email"
                      className="mb-1 mt-3 block text-sm font-semibold text-slate-700"
                    >
                      Citizen’s registered email
                    </label>
                    <input
                      id="resolution-email"
                      type="email"
                      value={resolutionEmail}
                      onChange={(event) => setResolutionEmail(event.target.value)}
                      autoComplete="email"
                      required
                      disabled={isSendingResolutionOtp}
                      placeholder="citizen@example.com"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={sendResolutionOtp}
                      disabled={isSendingResolutionOtp || !resolutionEmail.trim()}
                      className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <MessageSquareText size={17} />
                      {isSendingResolutionOtp
                        ? "Sending code..."
                        : "Send resolution OTP"}
                    </button>
                    {resolutionOtpMessage && (
                      <p role="status" className="mt-3 text-sm text-green-700">
                        {resolutionOtpMessage}
                      </p>
                    )}
                    {selectedComplaint.resolutionOtp?.sentAt && (
                      <form onSubmit={verifyResolutionOtp} className="mt-4 border-t border-blue-200 pt-4">
                        <label
                          htmlFor="resolution-code"
                          className="mb-1.5 block text-sm font-semibold text-slate-700"
                        >
                          Enter the code provided by the citizen
                        </label>
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <input
                            id="resolution-code"
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={6}
                            pattern="[0-9]{6}"
                            value={resolutionCode}
                            onChange={(event) => {
                              setResolutionCode(
                                event.target.value.replace(/\D/g, "").slice(0, 6)
                              );
                              setStatusError("");
                            }}
                            placeholder="Enter 6-digit code"
                            disabled={isVerifyingResolutionOtp}
                            className="h-11 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm tracking-[0.2em] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
                          />
                          <button
                            type="submit"
                            disabled={
                              isVerifyingResolutionOtp || resolutionCode.length !== 6
                            }
                            className="inline-flex h-11 items-center justify-center rounded-lg bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isVerifyingResolutionOtp ? "Verifying..." : "Verify and resolve"}
                          </button>
                        </div>
                        {resolutionVerificationMessage && (
                          <p role="status" className="mt-3 text-sm font-medium text-emerald-700">
                            {resolutionVerificationMessage}
                          </p>
                        )}
                      </form>
                    )}
                  </div>
                )}
                {statusError && (
                  <p role="alert" className="mt-2 text-sm text-red-600">{statusError}</p>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

const Detail = ({ label, value, icon: Icon }) => (
  <div className="rounded-xl bg-slate-50 p-4">
    <p className="mb-1 flex items-center gap-2 text-xs text-slate-400">
      {Icon && <Icon size={14} />}
      {label}
    </p>
    <p className="break-words text-sm font-semibold text-slate-800">
      {value || "Not provided"}
    </p>
  </div>
);

export default StaffComplaints;
