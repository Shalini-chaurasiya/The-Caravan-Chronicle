import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Construction,
  Dog,
  Droplets,
  FileEdit,
  Lightbulb,
  MapPin,
  MoreHorizontal,
  Route,
  Search,
  Settings,
  ShieldCheck,
  TrafficCone,
  Trash2,
  Trees,
  Users,
} from "lucide-react";
import cityHero from "../../assets/city-hero.png";
import cityScene from "../../assets/city.png";
import municipalVehicle from "../../assets/municipal-service-vehicle.svg";
import citizenCharacter from "../../assets/civic-guide.svg";
import staffCharacter from "../../assets/civic-staff.svg";
import adminCharacter from "../../assets/civic-admin.svg";
import "./CitizenHome.css";

const categories = [
  { name: "Garbage", icon: Trash2, color: "text-emerald-700", bg: "bg-emerald-50" },
  { name: "Street Lights", icon: Lightbulb, color: "text-amber-700", bg: "bg-amber-50" },
  { name: "Roads", icon: Route, color: "text-slate-700", bg: "bg-slate-100" },
  { name: "Water Supply", icon: Droplets, color: "text-sky-700", bg: "bg-sky-50" },
  { name: "Drainage", icon: Construction, color: "text-indigo-700", bg: "bg-indigo-50" },
  { name: "Parks", icon: Trees, color: "text-green-700", bg: "bg-green-50" },
  { name: "Stray Animals", icon: Dog, color: "text-orange-700", bg: "bg-orange-50" },
  { name: "Traffic", icon: TrafficCone, color: "text-rose-700", bg: "bg-rose-50" },
  { name: "Construction", icon: Construction, color: "text-orange-700", bg: "bg-orange-50" },
  { name: "Other", icon: MoreHorizontal, color: "text-slate-600", bg: "bg-slate-100" },
];

const actions = [
  {
    title: "Report an issue",
    description: "Tell us what needs attention in your neighborhood.",
    label: "Submit a complaint",
    to: "/citizen/dashboard/new",
    icon: FileEdit,
    tone: "blue",
  },
  {
    title: "Track progress",
    description: "Follow updates and see what happens next.",
    label: "Track a complaint",
    to: "/citizen/dashboard/track",
    icon: Search,
    tone: "teal",
  },
  {
    title: "View your history",
    description: "Keep all your submitted and resolved reports together.",
    label: "My complaints",
    to: "/citizen/dashboard/complaints",
    icon: ClipboardList,
    tone: "violet",
  },
];

const steps = [
  {
    title: "Report",
    description: "Share the details and location of the issue.",
    icon: FileEdit,
  },
  {
    title: "Assigned",
    description: "Your report is sent to the right department.",
    icon: Users,
  },
  {
    title: "In progress",
    description: "The municipal team works on a resolution.",
    icon: Settings,
  },
  {
    title: "Resolved",
    description: "Get notified when the issue is closed.",
    icon: CheckCircle2,
  },
];

const reportJourney = [
  {
    role: "Citizen",
    title: "Submits a complaint",
    description: "Reports a local issue with its location and useful details.",
    image: citizenCharacter,
    alt: "Illustration of a citizen",
    tone: "blue",
    number: "01",
  },
  {
    role: "Administrator",
    title: "Assigns the right team",
    description: "Reviews the complaint and assigns it to the relevant staff.",
    image: adminCharacter,
    alt: "Illustration of a municipal administrator",
    tone: "violet",
    number: "02",
  },
  {
    role: "Municipal staff",
    title: "Resolves the issue",
    description: "Works on the assigned complaint and updates its status.",
    image: staffCharacter,
    alt: "Illustration of municipal staff",
    tone: "teal",
    number: "03",
  },
];

const sectionHeading = (eyebrow, title, description) => (
  <div className="mb-7 max-w-2xl">
    <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
      {eyebrow}
    </p>
    <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
      {title}
    </h2>
    <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
      {description}
    </p>
  </div>
);

const CitizenHome = () => (
  <div className="min-h-screen bg-white text-slate-800">
    <Navbar />

    <main>
      <section id="home" className="bg-slate-50 px-4 pb-10 pt-5 sm:px-6 sm:pb-14 lg:px-8 lg:pt-8">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[28px] bg-white shadow-[0_24px_70px_-38px_rgba(15,35,65,0.35)] ring-1 ring-slate-200/80 lg:min-h-[490px] lg:grid-cols-[1.02fr_0.98fr]">
          <div className="civic-intro flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
            <div className="civic-reveal mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800">
              <Building2 size={14} />
              Municipal citizen portal
            </div>

            <h1 className="civic-reveal civic-delay-1 max-w-xl text-4xl font-bold leading-[1.12] tracking-tight text-slate-950 sm:text-5xl">
              A better city starts with{" "}
              <span className="text-blue-700">your voice.</span>
            </h1>
            <p className="civic-reveal civic-delay-2 mt-5 max-w-lg text-base leading-7 text-slate-600">
              Report local issues, stay informed, and help your municipality
              make your neighborhood a better place to live.
            </p>

            <div className="civic-reveal civic-delay-3 mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/citizen/dashboard/new"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/15 transition hover:-translate-y-0.5 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200"
              >
                <FileEdit size={18} />
                Report an issue
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/citizen/dashboard/track"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                <Search size={18} />
                Track a complaint
              </Link>
            </div>

            <div className="civic-reveal civic-delay-4 mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-slate-100 pt-5">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <ShieldCheck size={17} className="text-emerald-600" />
                Secure submissions
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <MapPin size={17} className="text-blue-700" />
                Location based
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <Clock3 size={17} className="text-blue-700" />
                Progress updates
              </div>
            </div>
          </div>

          <div className="relative min-h-[260px] bg-blue-100 sm:min-h-[340px] lg:min-h-full">
            <img
              src={cityHero}
              alt="A thriving city supported by municipal services"
              className="civic-hero-image absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />
            <div className="civic-reveal civic-delay-3 absolute bottom-5 left-5 right-5 rounded-2xl border border-white/50 bg-white/90 p-4 shadow-xl backdrop-blur sm:bottom-7 sm:left-7 sm:right-7 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <CheckCircle2 size={21} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Your report makes a difference
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Every report helps the right team understand what your
                    neighborhood needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="civic-reveal mx-auto grid max-w-7xl overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col justify-center px-6 py-7 sm:px-8 sm:py-8 lg:px-10">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
              Better neighborhoods, together
            </p>
            <h2 className="mt-2 max-w-md text-2xl font-bold leading-tight tracking-tight text-slate-950 sm:text-3xl">
              Your voice keeps the city moving.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
              Report a concern and help municipal teams create a cleaner, safer,
              more welcoming community.
            </p>
          </div>

          <div className="p-3 pt-0 sm:p-5 sm:pt-0 lg:pl-0 lg:pt-5">
            <div
              className="civic-animation relative h-36 overflow-hidden rounded-2xl border border-slate-200 bg-sky-50 sm:h-44 lg:h-full lg:min-h-52"
            >
              <img
                src={cityScene}
                alt=""
                aria-hidden="true"
                className="civic-skyline absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-sky-50/15" aria-hidden="true" />
              <div className="absolute inset-x-0 bottom-0 h-8 border-t border-slate-300/70 bg-slate-200/90 sm:h-10" />
              <div className="absolute inset-x-0 bottom-[15px] border-t-2 border-dashed border-white sm:bottom-[19px]" />
              <div className="civic-vehicle absolute bottom-2 z-10 sm:bottom-3" aria-hidden="true">
                <img
                  src={municipalVehicle}
                  alt=""
                  className="civic-truck"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {sectionHeading(
          "Get started",
          "What would you like to do?",
          "Everything you need to raise an issue and keep up with its progress."
        )}

        <div className="grid gap-4 md:grid-cols-3">
          {actions.map(({ title, description, label, to, icon: Icon, tone }, index) => {
            const tones = {
              blue: "bg-blue-50 text-blue-700 group-hover:bg-blue-700",
              teal: "bg-teal-50 text-teal-700 group-hover:bg-teal-700",
              violet: "bg-violet-50 text-violet-700 group-hover:bg-violet-700",
            };
            const linkTones = {
              blue: "text-blue-700",
              teal: "text-teal-700",
              violet: "text-violet-700",
            };

            return (
              <Link
                key={title}
                to={to}
                className="civic-reveal civic-action-card group rounded-2xl border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/60 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:p-6"
                style={{ animationDelay: `${0.08 * index}s` }}
              >
                <div className={`civic-action-icon mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-colors group-hover:text-white ${tones[tone]}`}>
                  <Icon size={22} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">
                  {description}
                </p>
                <span className={`mt-5 inline-flex items-center gap-2 text-sm font-semibold ${linkTones[tone]}`}>
                  {label}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="complaints" className="border-y border-slate-100 bg-slate-50/80">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          {sectionHeading(
            "Report a concern",
            "Choose a complaint category",
            "Select the category that best matches the issue. You can add details when you submit your report."
          )}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {categories.map(({ name, icon: Icon, color, bg }, index) => (
              <Link
                key={name}
                to={`/citizen/dashboard/new?category=${encodeURIComponent(name)}`}
                style={{ animationDelay: `${0.05 * index}s` }}
                className="civic-reveal civic-category-card group flex min-h-32 flex-col items-start justify-between rounded-2xl border border-slate-200 bg-white p-4 transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:p-5"
              >
                <span className={`civic-category-icon flex h-10 w-10 items-center justify-center rounded-xl ${bg} ${color}`}>
                  <Icon size={20} strokeWidth={2} />
                </span>
                <span className="mt-5 flex w-full items-center justify-between gap-2 text-sm font-semibold text-slate-700 group-hover:text-blue-800">
                  {name}
                  <ArrowRight size={15} className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-700" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {sectionHeading(
          "Simple and transparent",
          "How it works",
          "From the moment you report an issue, you can follow it through each step."
        )}

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 lg:p-10">
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ title, description, icon: Icon }, index) => (
              <div key={title} className="civic-reveal relative flex gap-4" style={{ animationDelay: `${0.08 * index}s` }}>
                <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Icon size={21} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-1 text-base font-bold text-slate-900">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-slate-600">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl bg-slate-50 p-5 sm:flex-row sm:items-center sm:px-6">
            <p className="max-w-2xl text-sm leading-6 text-slate-600">
              You can check your complaint history and see status updates at any time.
            </p>
            <Link
              to="/citizen/dashboard/track"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              Track a complaint
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-100 bg-slate-50/80">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mb-7 max-w-2xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
              A team effort
            </p>
            <h2
              className="civic-journey-title text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl"
              aria-label="Your complaint reaches the admin, gets assigned to staff, and is resolved."
            >
              <span aria-hidden="true">
                <span>Your</span>{" "}
                <span>report.</span>{" "}
                <span>Admin</span>{" "}
                <span>assigns.</span>{" "}
                <span>Staff</span>{" "}
                <span>resolves.</span>
              </span>
            </h2>
            <div className="civic-journey-accent mt-3 h-1 w-16 rounded-full bg-blue-600" />
            <p className="civic-journey-description mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              A citizen submits a complaint, an administrator assigns it to
              the right staff member, and staff works to resolve the issue.
            </p>
          </div>

          <div className="civic-journey-grid relative grid gap-4 md:grid-cols-3">
            <div className="civic-complaint-route" aria-hidden="true">
              <span className="civic-complaint-route-line" />
              <span className="civic-route-stage civic-route-stage-1">
                <FileEdit size={13} />
              </span>
              <span className="civic-route-stage civic-route-stage-2">
                <Users size={13} />
              </span>
              <span className="civic-route-stage civic-route-stage-3">
                <CheckCircle2 size={13} />
              </span>
              <span className="civic-complaint-ticket">
                <FileEdit size={14} />
                <span>Complaint</span>
              </span>
            </div>
            {reportJourney.map((person, index) => (
              <article
                key={person.role}
                className={`civic-person-card civic-person-${person.tone} civic-reveal`}
                style={{ animationDelay: `${0.12 * index}s` }}
              >
                <div className="civic-person-art">
                  <span className="civic-person-number">{person.number}</span>
                  <img src={person.image} alt={person.alt} />
                </div>
                <div className="p-5 sm:p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
                    {person.role}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-slate-950">
                    {person.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {person.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
);

export default CitizenHome;
