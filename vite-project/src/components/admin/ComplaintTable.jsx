// src/components/admin/ComplaintTable.jsx

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

const ComplaintTable = () => {
  return (
    <div className="dashboard-section">
      <div className="section-header">
        <div>
          <h2>Recent Complaints</h2>
          <p>Latest complaints submitted by citizens</p>
        </div>

        <button className="view-all-btn">
          View All →
        </button>
      </div>

      <div className="table-container">
        <table className="complaint-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Complaint Type</th>
              <th>Location</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Assigned To</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint.id}>
                <td>
                  <strong>{complaint.id}</strong>
                </td>

                <td>{complaint.type}</td>

                <td>{complaint.location}</td>

                <td>
                  <span
                    className={`status-badge ${complaint.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {complaint.status}
                  </span>
                </td>

                <td>
                  <span
                    className={`priority-badge ${complaint.priority.toLowerCase()}`}
                  >
                    {complaint.priority}
                  </span>
                </td>

                <td>{complaint.staff}</td>

                <td>{complaint.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplaintTable;