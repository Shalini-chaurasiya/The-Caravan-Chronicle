// src/components/admin/ActionRequired.jsx

const ActionRequired = () => {
  return (
    <div className="dashboard-section action-section">
      <div className="section-header">
        <div>
          <h2>Action Required</h2>
          <p>Items that need admin attention</p>
        </div>

        <span className="attention-label">Attention</span>
      </div>

      <div className="action-list">
        <div className="action-item">
          <div className="action-icon red">!</div>

          <div className="action-content">
            <strong>12 complaints are unassigned</strong>
            <span>These complaints need staff assignment.</span>
          </div>

          <button className="action-btn">
            Assign Now
          </button>
        </div>

        <div className="action-item">
          <div className="action-icon orange">◷</div>

          <div className="action-content">
            <strong>5 complaints are close to SLA</strong>
            <span>Review before the deadline expires.</span>
          </div>

          <button className="action-btn secondary">
            View
          </button>
        </div>

        <div className="action-item">
          <div className="action-icon dark-red">!</div>

          <div className="action-content">
            <strong>3 complaints exceeded SLA</strong>
            <span>These complaints require escalation.</span>
          </div>

          <button className="action-btn danger">
            Escalated
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionRequired;