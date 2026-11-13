import RoleSelection from "../components/RoleSelection";

const Home = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-3 sm:p-4">

      {/* Main Container */}
      <div className="mx-auto w-full max-w-6xl min-h-[90vh] overflow-hidden rounded-xl bg-white shadow-md">

        <div className="flex min-h-[90vh] flex-col md:flex-row">

          {/* LEFT SIDE */}
          <div className="flex w-full items-center bg-slate-100 px-5 py-7 sm:px-8 sm:py-8 md:w-1/2 lg:px-12 lg:py-8">

            <div className="w-full">

              {/* Small Heading */}
              <p className="text-blue-600 font-semibold text-xs uppercase tracking-wider mb-3">
                Municipal Services
              </p>

              {/* Main Heading */}
              <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl lg:text-4xl">
                Welcome to
                <br />
                Municipal Grievance
                <br />
                Management System
              </h1>

              {/* Blue Line */}
              <div className="w-16 h-1 bg-blue-600 mt-4 mb-4"></div>

              {/* Description */}
              <p className="text-slate-600 text-sm leading-relaxed mb-3">
                This system helps citizens to report issues and
                track their complaints easily.
              </p>

              <p className="text-slate-600 text-sm leading-relaxed">
                Our staff works to resolve issues, while owners
                manage the overall system efficiently.
              </p>

              {/* Information */}
              <div className="mt-6 space-y-3">

                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">
                    For Citizens
                  </h3>

                  <p className="text-slate-500 text-xs mt-1">
                    Submit complaints and track their status.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">
                    For Staff
                  </h3>

                  <p className="text-slate-500 text-xs mt-1">
                    View assigned complaints and take action.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">
                    For Owners
                  </h3>

                  <p className="text-slate-500 text-xs mt-1">
                    Manage users, complaints and the system.
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="flex w-full items-center bg-white px-5 py-7 sm:px-8 sm:py-8 md:w-1/2 lg:px-12 lg:py-8">
            <RoleSelection />
          </div>

        </div>

      </div>

    </div>
  );
};

export default Home;