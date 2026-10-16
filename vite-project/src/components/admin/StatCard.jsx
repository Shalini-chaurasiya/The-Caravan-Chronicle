const StatCard = ({ title, value, icon, type, description }) => {
  const styles = {
    blue: {
      border: "border-t-[#2879df]",
      icon: "bg-blue-50 text-[#2879df]",
    },
    red: {
      border: "border-t-red-500",
      icon: "bg-red-50 text-red-500",
    },
    orange: {
      border: "border-t-amber-500",
      icon: "bg-amber-50 text-amber-500",
    },
    green: {
      border: "border-t-green-600",
      icon: "bg-green-50 text-green-600",
    },
  };

  const selectedStyle = styles[type] || styles.blue;

  return (
    <div
      className={`relative min-h-[155px] overflow-hidden rounded-xl border border-t-[3px] border-slate-200 bg-white p-5 ${selectedStyle.border}`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold ${selectedStyle.icon}`}
        >
          {icon}
        </div>

        <span className="text-sm text-slate-400">•••</span>
      </div>

      <div className="mt-4 text-3xl font-bold text-[#172033]">{value}</div>

      <div className="mt-1 text-xs text-slate-600">{title}</div>

      <div
        className={`mt-2 text-[11px] ${
          type === "red" ? "text-red-500" : "text-green-600"
        }`}
      >
        {description}
      </div>
    </div>
  );
};

export default StatCard;