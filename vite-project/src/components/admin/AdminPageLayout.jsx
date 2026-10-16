import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

const AdminPageLayout = ({ title, description }) => {
  return (
    <div className="flex min-h-screen bg-[#f5f7fb] text-[#172033]">
      <AdminSidebar />

      <div className="min-h-screen min-w-0 flex-1">
        <AdminNavbar title={title} />

        <main className="mx-auto w-full max-w-[1700px] p-4 sm:p-6 lg:p-8">
          <header className="mb-7">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-blue-700">
              Municipal Services
            </p>
            <h1 className="text-2xl font-semibold text-[#172033]">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              {description}
            </p>
          </header>

          <section className="min-h-60 border-t border-slate-200 px-1 py-8 sm:px-3 sm:py-10">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-700">
                In progress
              </p>
              <h2 className="mt-3 text-lg font-semibold text-slate-800">
                This workspace is being prepared.
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                This section will be available here once it is ready.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminPageLayout;