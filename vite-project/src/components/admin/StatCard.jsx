// src/components/admin/StatCard.jsx

const StatCard = ({
  title,
  value,
  icon,
  type,
  description,
}) => {
  return (
    <div className={`stat-card ${type}`}>
      <div className="stat-card-top">
        <div className="stat-icon">{icon}</div>

        <span className="stat-menu">•••</span>
      </div>

      <div className="stat-value">{value}</div>

      <div className="stat-title">{title}</div>

      <div className="stat-description">{description}</div>
    </div>
  );
};

export default StatCard;