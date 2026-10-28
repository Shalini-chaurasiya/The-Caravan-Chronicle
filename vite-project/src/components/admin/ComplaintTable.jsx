import { Link } from "react-router-dom";

const statusStyles = {
  "IN PROGRESS": "bg-blue-50 text-blue-600",
  PENDING: "bg-amber-50 text-amber-600",
  RESOLVED: "bg-green-50 text-green-600",
  REJECTED: "bg-red-50 text-red-600",
};

const formatDate = (value) => {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const ComplaintTable = ({ complaints = [] }) => {
  return (
    <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[#172033]">
            Recent Complaints
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Latest complaints submitted by citizens
          </p>
        </div>

        <Link
          to="/admin/complaints"
          className="shrink-0 text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          View All →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left">
          <thead>
            <tr className="bg-slate-50">
              {[
                "ID",
                "Complaint Type",
                "Location",
                "Status",
                "Assigned To",
                "Date",
              ].map((heading) => (
                <th
                  key={heading}
                  className="border-b border-slate-200 px-3 py-3 text-[11px] font-semibold text-slate-500"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {complaints.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-8 text-center text-sm text-slate-500"
                >
                  No complaints have been submitted yet.
                </td>
              </tr>
            ) : (
              complaints.map((complaint) => {
                const status = complaint.status?.toUpperCase() || "PENDING";
                const complaintId = String(complaint._id);

                return (
                  <tr key={complaintId} className="hover:bg-slate-50">
                    <td className="border-b border-slate-100 px-3 py-4 text-xs font-semibold text-blue-600">
                      CMP{complaintId.slice(-6).toUpperCase()}
                    </td>

                    <td className="border-b border-slate-100 px-3 py-4 text-xs text-slate-600">
                      {complaint.complaintType}
                    </td>

                    <td className="border-b border-slate-100 px-3 py-4 text-xs text-slate-600">
                      {complaint.location}
                    </td>

                    <td className="border-b border-slate-100 px-3 py-4">
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-[9px] font-bold ${
                          statusStyles[status] || "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className="border-b border-slate-100 px-3 py-4 text-xs text-slate-600">
                      {complaint.assignedStaff?.name || "Not Assigned"}
                    </td>

                    <td className="border-b border-slate-100 px-3 py-4 text-xs text-slate-600">
                      {formatDate(complaint.createdAt)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ComplaintTable;
