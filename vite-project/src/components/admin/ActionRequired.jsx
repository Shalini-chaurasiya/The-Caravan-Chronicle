const actions = [
  {
    icon: "!",
    iconStyle: "bg-red-50 text-red-500",
    title: "12 complaints are unassigned",
    description: "These complaints need staff assignment.",
    button: "Assign Now",
    buttonStyle: "bg-[#2879df] text-white hover:bg-blue-700",
  },
  {
    icon: "◷",
    iconStyle: "bg-amber-50 text-amber-500",
    title: "5 complaints are close to SLA",
    description: "Review before the deadline expires.",
    button: "View",
    buttonStyle: "bg-blue-50 text-blue-600 hover:bg-blue-100",
  },
  {
    icon: "!",
    iconStyle: "bg-red-50 text-red-600",
    title: "3 complaints exceeded SLA",
    description: "These complaints require escalation.",
    button: "Escalated",
    buttonStyle: "bg-red-50 text-red-600",
  },
];

const ActionRequired = () => {
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

        <span className="shrink-0 rounded-full bg-red-50 px-3 py-1.5 text-[10px] font-semibold text-red-500">
          Attention
        </span>
      </div>

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

            <button
              type="button"
              className={`rounded-md px-3 py-2 text-[10px] font-semibold transition ${action.buttonStyle}`}
            >
              {action.button}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ActionRequired;