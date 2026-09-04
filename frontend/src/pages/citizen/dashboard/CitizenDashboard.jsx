import CitizenSidebar from "../../../components/citizen/CitizenSidebar";

const CitizenDashboard = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* SIDEBAR */}
      <CitizenSidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-slate-900">
            Dashboard
          </h1>

          <p className="mt-2 text-slate-600">
            Welcome to your citizen dashboard.
          </p>
        </div>
      </main>
    </div>
  );
};

export default CitizenDashboard;