const complaints = [
  {
    id: "CMP101",
    type: "Road Damage",
    location: "Sector 5, Main Road",
    status: "IN PROGRESS",
    priority: "High",
    staff: "Rahul Singh",
    date: "26 Aug 2026",
  },
  {
    id: "CMP102",
    type: "Water Issue",
    location: "Sector 8",
    status: "ASSIGNED",
    priority: "Medium",
    staff: "Neha Verma",
    date: "25 Aug 2026",
  },
  {
    id: "CMP103",
    type: "Garbage",
    location: "Sector 2",
    status: "RESOLVED",
    priority: "Low",
    staff: "Amit Kumar",
    date: "24 Aug 2026",
  },
  {
    id: "CMP104",
    type: "Street Light",
    location: "Sector 1",
    status: "OPEN",
    priority: "High",
    staff: "Not Assigned",
    date: "24 Aug 2026",
  },
];

const statusStyles = {
  "IN PROGRESS": "bg-blue-50 text-blue-600",
  ASSIGNED: "bg-amber-50 text-amber-600",
  RESOLVED: "bg-green-50 text-green-600",
  OPEN: "bg-red-50 text-red-600",
};

const priorityStyles = {
  High: "bg-red-50 text-red-600",
  Medium: "bg-amber-50 text-amber-600",
  Low: "bg-green-50 text-green-600",
};

const ComplaintTable = () => {
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

        <button
          type="button"
          className="shrink-0 text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          View All →
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="bg-slate-50">
              {[
                "ID",
                "Complaint Type",
                "Location",
                "Status",
                "Priority",
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
            {complaints.map((complaint) => (
              <tr key={complaint.id} className="hover:bg-slate-50">
                <td className="border-b border-slate-100 px-3 py-4 text-xs font-semibold text-blue-600">
                  {complaint.id}
                </td>

                <td className="border-b border-slate-100 px-3 py-4 text-xs text-slate-600">
                  {complaint.type}
                </td>

                <td className="border-b border-slate-100 px-3 py-4 text-xs text-slate-600">
                  {complaint.location}
                </td>

                <td className="border-b border-slate-100 px-3 py-4">
                  <span
                    className={`inline-block rounded-full px-2 py-1 text-[9px] font-bold ${statusStyles[complaint.status]}`}
                  >
                    {complaint.status}
                  </span>
                </td>

                <td className="border-b border-slate-100 px-3 py-4">
                  <span
                    className={`inline-block rounded-full px-2 py-1 text-[9px] font-bold ${priorityStyles[complaint.priority]}`}
                  >
                    {complaint.priority}
                  </span>
                </td>

                <td className="border-b border-slate-100 px-3 py-4 text-xs text-slate-600">
                  {complaint.staff}
                </td>

                <td className="border-b border-slate-100 px-3 py-4 text-xs text-slate-600">
                  {complaint.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ComplaintTable;