
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ClipboardList,
  Clock3,
  RefreshCw,
  CheckCircle2,
  MapPin,
  CalendarDays,
  ChevronRight,
  Megaphone,
  Droplets,
  Lightbulb,
  Trash2,
  FileText,
  AlertCircle,
  UserRound,
  X,
  BriefcaseBusiness,
  Award,
  BadgeCheck,
  Mail,
  Phone,
} from "lucide-react";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/+$/, "");
const API_URL = API_BASE_URL.endsWith("/api")
  ? API_BASE_URL
  : `${API_BASE_URL}/api`;
const API_ORIGIN = API_BASE_URL.replace(/\/api$/, "");

const formatDate = (value) => {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const mapComplaint = (complaint) => {
  const staff =
    complaint.assignedStaff && typeof complaint.assignedStaff === "object"
      ? complaint.assignedStaff
      : null;
  const category = complaint.complaintType || "Other";
  const normalizedCategory = category.toLowerCase();
  const Icon = /water|supply|leak|pipeline/.test(normalizedCategory)
    ? Droplets
    : /electric|street light|lighting|lamp/.test(normalizedCategory)
      ? Lightbulb
      : /garbage|sanitation|waste|cleanliness/.test(normalizedCategory)
        ? Trash2
        : FileText;
  const color =
    Icon === Trash2 ? "green" : Icon === Lightbulb ? "orange" : "blue";
  const statusHistory = Array.isArray(complaint.statusHistory)
    ? complaint.statusHistory
    : [];
  const updates = statusHistory.map((entry, index) => ({
    title:
      entry.note === "Complaint submitted"
        ? "Complaint Submitted"
        : entry.status,
    date: formatDate(entry.changedAt),
    completed: true,
    current:
      index === statusHistory.length - 1 &&
      entry.status === complaint.status,
  }));

  if (updates.length === 0) {
    updates.push({
      title: "Complaint Submitted",
      date: formatDate(complaint.createdAt),
      completed: true,
      current: complaint.status === "Pending",
    });

    if (complaint.status !== "Pending") {
      updates.push({
        title: `Current status: ${complaint.status}`,
        date: "Earlier status history not available",
        completed: true,
        current: true,
      });
    }
  }

  return {
    _id: complaint._id,
    complaintId: `CMP-${String(complaint._id).slice(-6).toUpperCase()}`,
    title: category,
    category,
    location: complaint.location || "Location not available",
    date: formatDate(complaint.createdAt),
    priority: complaint.priority || "Not configured",
    status: complaint.status || "Pending",
    description: complaint.description || "",
    department: staff?.department || "Not assigned",
    assignedStaff: staff?.name || "Not assigned",
    staffProfile: staff
      ? {
          staffId: staff.staffId,
          name: staff.name || "Assigned staff",
          department: staff.department || "Department not provided",
          role: staff.role || "Staff",
          gender: staff.gender || "",
          experience: staff.experience,
          email: staff.email || "",
          phone: staff.phone || "",
          photo: staff.photo
            ? staff.photo.startsWith("http")
              ? staff.photo
              : `${API_ORIGIN}${staff.photo.startsWith("/") ? "" : "/"}${staff.photo}`
            : "",
        }
      : null,
    icon: Icon,
    color,
    updates,
    resolutionOtp: complaint.resolutionOtp || null,
  };
};

const statusStyles = {
  Pending: "bg-orange-50 text-orange-600 border-orange-100",
  "In Progress": "bg-blue-50 text-blue-700 border-blue-100",
  Resolved: "bg-green-50 text-green-700 border-green-100",
  Rejected: "bg-red-50 text-red-600 border-red-100",
};

const priorityStyles = {
  High: "bg-red-50 text-red-600",
  Medium: "bg-orange-50 text-orange-600",
  Low: "bg-green-50 text-green-600",
  "Not set": "bg-slate-100 text-slate-600",
  "Not configured": "bg-slate-100 text-slate-600",
};

const iconStyles = {
  blue: "bg-blue-100 text-blue-600",
  orange: "bg-orange-100 text-orange-600",
  green: "bg-green-100 text-green-600",
};

const StatusBadge = ({ status }) => {
  const Icon =
    status === "Resolved"
      ? CheckCircle2
      : status === "Pending"
      ? Clock3
      : status === "Rejected"
      ? AlertCircle
      : RefreshCw;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
        statusStyles[status] || statusStyles.Pending
      }`}
    >
      <Icon size={14} />
      {status}
    </span>
  );
};

const StatCard = ({ title, count, icon: Icon, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-700",
    orange: "bg-amber-50 text-amber-700",
    purple: "bg-violet-50 text-violet-700",
    green: "bg-emerald-50 text-emerald-700",
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-200/40 transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          {count}
        </h3>
      </div>
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
          colors[color]
        }`}
      >
        <Icon size={23} strokeWidth={2} />
      </div>
    </div>
  );
};

const ComplaintIcon = ({ complaint }) => {
  const Icon = complaint.icon || FileText;

  return (
    <div
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
        iconStyles[complaint.color] || iconStyles.blue
      }`}
    >
      <Icon size={23} strokeWidth={1.8} />
    </div>
  );
};

const ProgressTimeline = ({ updates }) => {
  return (
    <div className="mt-5">
      <h3 className="mb-4 font-bold text-slate-900">
        Progress Timeline
      </h3>

      <div className="space-y-0">
        {updates.map((update, index) => (
          <div key={`${update.title}-${update.date}-${index}`} className="relative flex gap-3">
            {index !== updates.length - 1 && (
              <div
                className={`absolute left-[10px] top-6 h-full w-0.5 ${
                  update.completed ? "bg-emerald-300" : "bg-slate-200"
                }`}
              />
            )}

            <div className="relative z-10 mt-0.5">
              {update.completed ? (
                <CheckCircle2
                  size={21}
                  className={
                    update.current
                      ? "fill-blue-600 text-white"
                      : "fill-emerald-500 text-white"
                  }
                />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-slate-300 bg-white" />
              )}
            </div>

            <div className="flex min-h-10 flex-1 flex-wrap items-start justify-between gap-1 pb-4">
              <p
                className={`text-sm ${
                  update.current
                    ? "font-bold text-blue-700"
                    : update.completed
                    ? "font-medium text-slate-700"
                    : "text-slate-400"
                }`}
              >
                {update.title}
              </p>

              <span className="text-xs text-slate-500">
                {update.date}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TrackComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showStaffProfile, setShowStaffProfile] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchComplaints = async (showLoading = true) => {
      if (showLoading) {
        setLoading(true);
        setError("");
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Please log in to view your complaints.");
        }

        const response = await fetch(
          `${API_URL}/complaints/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch your complaints.");
        }

        if (!data.success || !Array.isArray(data.complaints)) {
          throw new Error("The server returned an invalid complaints response.");
        }

        if (!cancelled) {
          setComplaints(data.complaints.map(mapComplaint));
        }
      } catch (fetchError) {
        if (showLoading) {
          console.error("Fetch track complaints error:", fetchError);
        }
        if (!cancelled && showLoading) {
          setError(fetchError.message || "Unable to load your complaints.");
        }
      } finally {
        if (!cancelled && showLoading) {
          setLoading(false);
        }
      }
    };

    fetchComplaints();
    const refreshInterval = window.setInterval(
      () => fetchComplaints(false),
      15000
    );
    return () => {
      cancelled = true;
      window.clearInterval(refreshInterval);
    };
  }, [retryCount]);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        complaint.complaintId.toLowerCase().includes(searchText) ||
        complaint.title.toLowerCase().includes(searchText) ||
        complaint.category.toLowerCase().includes(searchText) ||
        complaint.location.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All Status" ||
        complaint.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [complaints, search, statusFilter]);
  const activeComplaint =
    filteredComplaints.find(
      (complaint) => complaint._id === selectedComplaintId
    ) || filteredComplaints[0] || null;

  const total = complaints.length;
  const pending = complaints.filter(
    (c) => c.status === "Pending"
  ).length;
  const inProgress = complaints.filter(
    (c) => c.status === "In Progress"
  ).length;
  const resolved = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-[1500px] items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <Search size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
              Citizen portal
            </p>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Track Your Complaints
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">
          {/* Page heading */}
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-sm font-semibold text-blue-700">Your service requests</p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                Track complaints
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
                Follow every update from submission to resolution, all in one place.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setRetryCount((count) => count + 1)}
                disabled={loading}
                className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                Refresh updates
              </button>
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {total} complaints
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            <StatCard
              title="Total Complaints"
              count={total}
              icon={ClipboardList}
              color="blue"
            />

            <StatCard
              title="Pending"
              count={pending}
              icon={Clock3}
              color="orange"
            />

            <StatCard
              title="In Progress"
              count={inProgress}
              icon={RefreshCw}
              color="purple"
            />

            <StatCard
              title="Resolved"
              count={resolved}
              icon={CheckCircle2}
              color="green"
            />
          </div>

          {/* Banner */}
          <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-[#10233f] via-[#163d70] to-[#1d5ca6] px-5 py-5 text-white shadow-lg shadow-blue-950/10 sm:px-7">
            <div className="relative z-10 flex items-start gap-4 sm:items-center sm:gap-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                <Megaphone size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold md:text-xl">
                  Your Voice Matters!
                </h2>

                <p className="mt-1 max-w-3xl text-sm leading-6 text-blue-100">
                  We’ll keep you informed as your concerns move through the city’s resolution process.
                </p>
              </div>
            </div>

            <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/5" />
            <div className="absolute -bottom-24 right-32 h-48 w-48 rounded-full bg-white/5" />
          </div>

          {/* Complaints and details */}
          <div className="grid grid-cols-1 items-start gap-5 2xl:grid-cols-[minmax(0,1.15fr)_minmax(390px,0.85fr)]">
            {/* Left: Complaint list */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-200/50 md:p-5">
              <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                <h2 className="text-lg font-bold text-slate-900">
                  My Complaints
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Select a request to see its latest status and timeline.
                </p>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                  {filteredComplaints.length} shown
                </span>
              </div>

              {/* Search and filter */}
              <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search
                    size={19}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search ID, title, category or location"
                    aria-label="Search complaints"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  aria-label="Filter complaints by status"
                  className="h-11 rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                >
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                  <option>Rejected</option>
                </select>
              </div>

              {/* Complaint cards */}
              <div className="space-y-3">
                {loading ? (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 py-12 text-center text-sm text-slate-500">
                    Loading your complaints...
                  </div>
                ) : error ? (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-center"
                  >
                    <p className="text-sm font-medium text-red-700">{error}</p>
                    <button
                      type="button"
                      onClick={() => setRetryCount((count) => count + 1)}
                      className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                      Try again
                    </button>
                  </div>
                ) : filteredComplaints.length > 0 ? (
                  filteredComplaints.map((complaint) => {
                    const isSelected =
                      activeComplaint?._id === complaint._id;

                    return (
                      <button
                        key={complaint._id}
                        type="button"
                        onClick={() => {
                          setSelectedComplaintId(complaint._id);
                          setShowStaffProfile(false);
                        }}
                        className={`group w-full rounded-xl border p-3 text-left transition duration-200 sm:p-4 ${
                          isSelected
                            ? "border-blue-300 bg-blue-50/60 shadow-sm ring-1 ring-blue-200"
                            : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50/80"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <ComplaintIcon complaint={complaint} />

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="text-xs font-medium text-slate-500">
                                {complaint.complaintId}
                              </p>

                              <StatusBadge status={complaint.status} />
                            </div>

                            <h3 className="mt-1 text-base font-bold text-[#10234b] md:text-lg">
                              {complaint.title}
                            </h3>

                            <span className="mt-1 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                              {complaint.category}
                            </span>

                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 md:text-sm">
                              <span className="inline-flex items-center gap-1">
                                <CalendarDays size={14} />
                                {complaint.date}
                              </span>

                              <span className="inline-flex items-center gap-1">
                                <MapPin size={14} />
                                {complaint.location}
                              </span>
                            </div>
                          </div>

                          <ChevronRight
                            size={23}
                            className="hidden shrink-0 text-slate-500 transition group-hover:translate-x-1 sm:block"
                          />
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center">
                    <FileText
                      size={38}
                      className="mx-auto text-slate-300"
                    />

                    <h3 className="mt-3 font-semibold text-slate-700">
                      No complaints found
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Try changing your search or status filter.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Right: Complaint details */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-200/50 md:p-5 2xl:sticky 2xl:top-24">
              {loading ? (
                <div className="py-16 text-center text-sm text-slate-500">
                  Loading complaint details...
                </div>
              ) : activeComplaint ? (
                <>
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <h2 className="text-lg font-bold text-slate-900">
                      Complaint Details
                    </h2>

                    <StatusBadge status={activeComplaint.status} />
                  </div>

                  {/* Selected complaint */}
                  <div className="mb-5 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                    <ComplaintIcon complaint={activeComplaint} />

                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-slate-900">
                        {activeComplaint.title}
                      </h3>

                      <p className="mt-1 text-xs font-semibold tracking-wide text-slate-500">
                        {activeComplaint.complaintId}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-3 border-b border-slate-200 pb-5">
                    <div className="rounded-lg bg-slate-50 p-3">
                      <span className="block text-xs text-slate-500">Category</span>
                      <span className="mt-1 block text-sm font-semibold text-slate-800">
                        {activeComplaint.category}
                      </span>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <span className="block text-xs text-slate-500">Priority</span>
                      <span className="mt-1 block">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                            priorityStyles[activeComplaint.priority] ||
                            priorityStyles["Not configured"]
                          }`}
                        >
                          {activeComplaint.priority}
                        </span>
                      </span>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <span className="block text-xs text-slate-500">Location</span>
                      <span className="mt-1 block text-sm font-semibold leading-5 text-slate-800">
                        {activeComplaint.location}
                      </span>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <span className="block text-xs text-slate-500">Submitted on</span>
                      <span className="mt-1 block text-sm font-semibold text-slate-800">
                        {activeComplaint.date}
                      </span>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <span className="block text-xs text-slate-500">Department</span>
                      <span className="mt-1 block text-sm font-semibold leading-5 text-slate-800">
                        {activeComplaint.department}
                      </span>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <span className="block text-xs text-slate-500">Assigned staff</span>
                      <span className="mt-1 block text-sm font-semibold text-slate-800">
                        {activeComplaint.assignedStaff}
                      </span>
                      {activeComplaint.staffProfile && (
                        <button
                          type="button"
                          onClick={() => setShowStaffProfile(true)}
                          className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 transition hover:text-blue-900"
                          aria-haspopup="dialog"
                        >
                          <UserRound size={15} />
                          View staff profile
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-5">
                    <h3 className="mb-2 font-bold text-slate-900">
                      Description
                    </h3>

                    <p className="text-sm leading-6 text-slate-600">
                      {activeComplaint.description}
                    </p>
                  </div>

                  {activeComplaint.status === "In Progress" &&
                    activeComplaint.resolutionOtp?.sentAt && (
                      <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle2
                            size={21}
                            className="mt-0.5 shrink-0 text-emerald-700"
                          />
                          <div>
                            <h3 className="font-semibold text-emerald-950">
                              Confirm the work is complete
                            </h3>
                            <p className="mt-1 text-sm leading-5 text-emerald-800">
                              A verification code was sent to your registered email. If the work is complete, give the code to the assigned staff member so they can verify it and update this complaint.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  {/* Timeline */}
                  <ProgressTimeline updates={activeComplaint.updates} />

                  {/* Footer */}
                  <div className="mt-2 rounded-xl border border-blue-100 bg-blue-50/70 p-3">
                    <p className="text-xs leading-5 text-blue-800">
                      <strong>Note:</strong> Complaint status and progress
                      are displayed here so you can stay informed about
                      the resolution process.
                    </p>
                  </div>
                </>
              ) : (
                <div className="py-16 text-center">
                  <FileText
                    size={40}
                    className="mx-auto text-slate-300"
                  />
                  <p className="mt-3 text-sm text-slate-500">
                    Select a complaint to view its details.
                  </p>
                </div>
              )}
            </section>
          </div>
      </main>
      {showStaffProfile && activeComplaint?.staffProfile && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4"
          onClick={() => setShowStaffProfile(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="staff-profile-title"
            className="my-auto flex max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative shrink-0 bg-gradient-to-r from-[#10233f] to-[#1d5ca6] px-6 pb-6 pt-7 text-center text-white">
              <button
                type="button"
                onClick={() => setShowStaffProfile(false)}
                className="absolute right-4 top-4 rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
                aria-label="Close staff profile"
              >
                <X size={20} />
              </button>
              {activeComplaint.staffProfile.photo ? (
                <img
                  src={activeComplaint.staffProfile.photo}
                  alt=""
                  className="mx-auto block h-24 w-24 shrink-0 rounded-full border-4 border-white/30 object-cover"
                />
              ) : (
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/30 bg-white/15">
                  <UserRound size={42} />
                </div>
              )}
              <h2
                id="staff-profile-title"
                className="mt-4 text-xl font-bold"
              >
                {activeComplaint.staffProfile.name}
              </h2>
              <p className="mt-1 text-sm text-blue-100">
                {activeComplaint.staffProfile.role}
              </p>
            </div>
            <div className="min-h-0 space-y-3 overflow-y-auto p-6">
              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                <BriefcaseBusiness
                  size={19}
                  className="mt-0.5 shrink-0 text-blue-700"
                />
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Department
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {activeComplaint.staffProfile.department}
                  </p>
                </div>
              </div>
              {activeComplaint.staffProfile.staffId && (
                <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                  <BadgeCheck
                    size={19}
                    className="mt-0.5 shrink-0 text-blue-700"
                  />
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Staff ID
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {activeComplaint.staffProfile.staffId}
                    </p>
                  </div>
                </div>
              )}
              {activeComplaint.staffProfile.gender && (
                <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                  <UserRound
                    size={19}
                    className="mt-0.5 shrink-0 text-blue-700"
                  />
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Gender
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {activeComplaint.staffProfile.gender}
                    </p>
                  </div>
                </div>
              )}
              {activeComplaint.staffProfile.email && (
                <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                  <Mail
                    size={19}
                    className="mt-0.5 shrink-0 text-blue-700"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-500">
                      Email
                    </p>
                    <a
                      href={`mailto:${activeComplaint.staffProfile.email}`}
                      className="mt-1 block break-all text-sm font-semibold text-blue-700 hover:text-blue-900"
                    >
                      {activeComplaint.staffProfile.email}
                    </a>
                  </div>
                </div>
              )}
              {activeComplaint.staffProfile.phone && (
                <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                  <Phone
                    size={19}
                    className="mt-0.5 shrink-0 text-blue-700"
                  />
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Phone
                    </p>
                    <a
                      href={`tel:${activeComplaint.staffProfile.phone}`}
                      className="mt-1 block text-sm font-semibold text-blue-700 hover:text-blue-900"
                    >
                      {activeComplaint.staffProfile.phone}
                    </a>
                  </div>
                </div>
              )}
              {activeComplaint.staffProfile.experience !== undefined && (
                <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                  <Award
                    size={19}
                    className="mt-0.5 shrink-0 text-blue-700"
                  />
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Experience
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {activeComplaint.staffProfile.experience}{" "}
                      {activeComplaint.staffProfile.experience === 1
                        ? "year"
                        : "years"}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="shrink-0 border-t border-slate-100 px-6 py-4 text-right">
              <button
                type="button"
                onClick={() => setShowStaffProfile(false)}
                className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                Done
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default TrackComplaints;
