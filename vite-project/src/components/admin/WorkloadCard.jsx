import { Link } from "react-router-dom";

const WorkloadCard = ({ staff = [] }) => {
  const maximumAssigned = Math.max(
    1,
    ...staff.map((member) => member.assigned)
  );

  return (
    <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[#172033]">
            Staff Workload
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Current active complaint assignments
          </p>
        </div>

        <Link
          to="/admin/staff"
          className="shrink-0 text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          Manage Staff →
        </Link>
      </div>

      {staff.length === 0 ? (
        <p className="py-4 text-sm text-slate-500">
          No active staff members to show.
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {staff.map((member) => {
            const percentage = (member.assigned / maximumAssigned) * 100;

            return (
              <div key={String(member._id)}>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                    {member.name.charAt(0)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <strong className="block text-xs text-slate-800">
                      {member.name}
                    </strong>
                    <span className="mt-1 block text-[11px] text-slate-400">
                      {member.department}
                    </span>
                  </div>

                  <b className="shrink-0 text-xs text-slate-600">
                    {member.assigned} assigned
                  </b>
                </div>

                <div
                  className="ml-12 mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"
                  aria-label={`${member.assigned} active complaints assigned`}
                >
                  <div
                    className="h-full rounded-full bg-[#2879df] transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default WorkloadCard;
