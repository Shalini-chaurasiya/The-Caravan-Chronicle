
import React, { useState } from "react";
import StaffSidebar from "./components/StaffSidebar";
import {
  Search,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  MapPin,
  Calendar,
  X,
} from "lucide-react";

const initialComplaints = [
  {
    id: "CMP001",
    title: "Water Supply Problem",
    citizen: "Rahul Sharma",
    category: "Water Supply",
    location: "Civil Lines, Prayagraj",
    date: "2026-10-20",
    priority: "High",
    status: "Pending",
    description: "There is no regular water supply in our locality.",
  },
  {
    id: "CMP002",
    title: "Street Light Not Working",
    citizen: "Priya Singh",
    category: "Electricity",
    location: "George Town, Prayagraj",
    date: "2026-10-22",
    priority: "Medium",
    status: "In Progress",
    description: "Street lights are not working properly.",
  },
  {
    id: "CMP003",
    title: "Garbage Collection Issue",
    citizen: "Amit Verma",
    category: "Sanitation",
    location: "Naini, Prayagraj",
    date: "2026-10-24",
    priority: "High",
    status: "Resolved",
    description: "Garbage has not been collected from our street.",
  },
  {
    id: "CMP004",
    title: "Road Damage Complaint",
    citizen: "Neha Gupta",
    category: "Road Maintenance",
    location: "Tagore Town, Prayagraj",
    date: "2026-10-25",
    priority: "Low",
    status: "Pending",
    description: "The road surface is damaged and needs repair.",
  },
];

const StaffComplaints = () => {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.id.toLowerCase().includes(search.toLowerCase()) ||
      complaint.title.toLowerCase().includes(search.toLowerCase()) ||
      complaint.citizen.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || complaint.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const updateStatus = (id, newStatus) => {
    setComplaints((prev) =>
      prev.map((complaint) =>
        complaint.id === id
          ? { ...complaint, status: newStatus }
          : complaint
      )
    );

    setSelectedComplaint((prev) =>
      prev && prev.id === id
        ? { ...prev, status: newStatus }
        : prev
    );
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f3f6fc]">
      <StaffSidebar />

      <main className="flex-1 min-w-0 p-5 md:p-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#101f43]">
              Assigned Complaints
            </h1>
            <p className="text-slate-500 mt-2">
              View and manage complaints assigned to your department.
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

            <div className="bg-white p-5 rounded-xl border shadow-sm">
              <div className="flex justify-between">
                <p className="text-slate-500 text-sm">Total Complaints</p>
                <AlertCircle className="text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-[#101f43] mt-3">
                {complaints.length}
              </h2>
            </div>

            <div className="bg-white p-5 rounded-xl border shadow-sm">
              <div className="flex justify-between">
                <p className="text-slate-500 text-sm">Pending</p>
                <Clock className="text-yellow-600" />
              </div>
              <h2 className="text-3xl font-bold text-yellow-600 mt-3">
                {complaints.filter(c => c.status === "Pending").length}
              </h2>
            </div>

            <div className="bg-white p-5 rounded-xl border shadow-sm">
              <div className="flex justify-between">
                <p className="text-slate-500 text-sm">In Progress</p>
                <Clock className="text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-blue-600 mt-3">
                {complaints.filter(c => c.status === "In Progress").length}
              </h2>
            </div>

            <div className="bg-white p-5 rounded-xl border shadow-sm">
              <div className="flex justify-between">
                <p className="text-slate-500 text-sm">Resolved</p>
                <CheckCircle className="text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-green-600 mt-3">
                {complaints.filter(c => c.status === "Resolved").length}
              </h2>
            </div>

          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-xl border shadow-sm p-5 mb-6">
            <div className="flex flex-col md:flex-row gap-4">

              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-slate-400" size={19} />
                <input
                  type="text"
                  placeholder="Search by complaint ID, title or citizen..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border rounded-lg pl-10 pr-4 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter size={19} className="text-slate-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border rounded-lg px-4 py-2.5 outline-none focus:border-blue-500"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

            </div>
          </div>

          {/* Complaints Table */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">

            <div className="p-5 border-b">
              <h2 className="text-lg font-bold text-[#101f43]">
                Complaint Records
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[850px]">
                <thead className="bg-slate-50 text-slate-600 text-sm">
                  <tr>
                    <th className="p-4">Complaint ID</th>
                    <th className="p-4">Complaint Details</th>
                    <th className="p-4">Citizen</th>
                    <th className="p-4">Priority</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredComplaints.map((complaint) => (
                    <tr key={complaint.id} className="border-t hover:bg-slate-50">

                      <td className="p-4 font-semibold text-blue-700">
                        {complaint.id}
                      </td>

                      <td className="p-4">
                        <p className="font-semibold text-slate-800">
                          {complaint.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {complaint.category}
                        </p>
                      </td>

                      <td className="p-4">
                        <p className="text-slate-700">{complaint.citizen}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {complaint.date}
                        </p>
                      </td>

                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityStyle(complaint.priority)}`}>
                          {complaint.priority}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(complaint.status)}`}>
                          {complaint.status}
                        </span>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => setSelectedComplaint(complaint)}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                        >
                          <Eye size={17} /> View
                        </button>
                      </td>

                    </tr>
                  ))}

                  {filteredComplaints.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-slate-500">
                        No complaints found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>

      {/* Complaint Details Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-xl">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#101f43]">
                Complaint Details
              </h2>

              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-slate-500 hover:text-red-600"
              >
                <X size={22} />
              </button>
            </div>

            <h3 className="text-lg font-semibold text-slate-800">
              {selectedComplaint.title}
            </h3>

            <p className="text-sm text-blue-600 mt-1">
              {selectedComplaint.id}
            </p>

            <div className="space-y-4 mt-5 text-sm">

              <p>
                <strong>Citizen:</strong> {selectedComplaint.citizen}
              </p>

              <p>
                <strong>Category:</strong> {selectedComplaint.category}
              </p>

              <p className="flex gap-2">
                <MapPin size={17} className="text-blue-600 shrink-0" />
                {selectedComplaint.location}
              </p>

              <p className="flex gap-2">
                <Calendar size={17} className="text-blue-600 shrink-0" />
                {selectedComplaint.date}
              </p>

              <p>
                <strong>Priority:</strong> {selectedComplaint.priority}
              </p>

              <div>
                <strong>Description:</strong>
                <p className="text-slate-600 mt-1">
                  {selectedComplaint.description}
                </p>
              </div>

              <div>
                <label className="block font-semibold mb-2">
                  Update Complaint Status
                </label>

                <select
                  value={selectedComplaint.status}
                  onChange={(e) =>
                    updateStatus(selectedComplaint.id, e.target.value)
                  }
                  className="w-full border rounded-lg p-3 outline-none focus:border-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

            </div>

            <button
              onClick={() => setSelectedComplaint(null)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg mt-6"
            >
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default StaffComplaints;
