import { Link } from "react-router-dom";

const ActionRequired = ({ unassigned = 0, nearingSla = 0, exceededSla = 0 }) => {
  const actions = [
    {
      count: unassigned,
      icon: "!",
      iconStyle: "bg-red-50 text-red-500",
      title: `${unassigned} unassigned complaint${unassigned === 1 ? "" : "s"}`,
      description: "These complaints need staff assignment.",
      button: "Assign",
      buttonStyle: "bg-[#2879df] text-white hover:bg-blue-700",
    },
    {
      count: nearingSla,
      icon: "◷",
      iconStyle: "bg-amber-50 text-amber-500",
      title: `${nearingSla} complaint${nearingSla === 1 ? "" : "s"} nearing SLA`,
      description: "Review before the response deadline expires.",
      button: "Review",
      buttonStyle: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    },
    {
      count: exceededSla,
      icon: "!",
      iconStyle: "bg-red-50 text-red-600",
      title: `${exceededSla} complaint${exceededSla === 1 ? "" : "s"} past SLA`,
      description: "These complaints are past their response deadline.",
      button: "Review",
      buttonStyle: "bg-red-50 text-red-600 hover:bg-red-100",
    },
  ].filter((action) => action.count > 0);

  return (
    <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="mb-5 flex items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-[#172033]">
            Action Required
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Items that need admin attention
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-semibold ${
            actions.length
              ? "bg-red-50 text-red-500"
              : "bg-green-50 text-green-600"
          }`}
        >
          {actions.length ? "Attention" : "All clear"}
        </span>
      </div>

      {actions.length === 0 ? (
        <p className="py-4 text-sm text-slate-500">
          There are no complaints requiring immediate attention.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {actions.map((action) => (
            <div
              key={action.title}
              className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-100 p-3 sm:flex-nowrap"
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold ${action.iconStyle}`}
              >
                {action.icon}
              </div>

              <div className="min-w-0 flex-1">
                <strong className="block text-xs text-slate-800">
                  {action.title}
                </strong>
                <span className="mt-1 block text-[11px] text-slate-400">
                  {action.description}
                </span>
              </div>

              <Link
                to="/admin/complaints"
                className={`rounded-md px-3 py-2 text-[10px] font-semibold transition ${action.buttonStyle}`}
              >
                {action.button}
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ActionRequired;
