// src/components/admin/WorkloadCard.jsx

const staff = [
  {
    name: "Rahul Singh",
    department: "Road Maintenance",
    assigned: 12,
    max: 20,
  },
  {
    name: "Neha Verma",
    department: "Water Department",
    assigned: 8,
    max: 20,
  },
  {
    name: "Amit Kumar",
    department: "Sanitation",
    assigned: 15,
    max: 20,
  },
];

const WorkloadCard = () => {
  return (
    <div className="dashboard-section workload-section">
      <div className="section-header">
        <div>
          <h2>Staff Workload</h2>
          <p>Current assigned complaints</p>
        </div>

        <button className="view-all-btn">
          Manage Staff →
        </button>
      </div>

      <div className="workload-list">
        {staff.map((member) => {
          const percentage = (member.assigned / member.max) * 100;

          return (
            <div className="workload-item" key={member.name}>
              <div className="workload-info">
                <div className="staff-avatar">
                  {member.name.charAt(0)}
                </div>

                <div>
                  <strong>{member.name}</strong>
                  <span>{member.department}</span>
                </div>

                <b>
                  {member.assigned}/{member.max}
                </b>
              </div>

              <div className="workload-bar">
                <div
                  className="workload-progress"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkloadCard;