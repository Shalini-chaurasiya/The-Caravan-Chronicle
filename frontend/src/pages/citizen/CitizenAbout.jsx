import { useEffect, useState } from "react";
import {
  Target,
  Eye,
  Users,
  FileText,
  Search,
  Bell,
  ShieldCheck,
  BarChart3,
  MapPin,
  Building2,
  CheckCircle2,
} from "lucide-react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import cityImage from "../../assets/upper.png";
import cityParkImage from "../../assets/lower.png";
import civicGuide from "../../assets/civic-guide.svg";
import "./CitizenAbout.css";

const guideMessages = [
  {
    label: "Why this portal exists",
    step: -1,
    text: "I connect residents with municipal teams, making it easier to report local concerns and get them resolved.",
  },
  {
    label: "Step 1 · Report it",
    step: 0,
    text: "Start by describing the issue and where it is. Add a photo or details to help the team understand.",
  },
  {
    label: "Step 2 · The team responds",
    step: 1,
    text: "Your report reaches the right department, so the people responsible can review it and take action.",
  },
  {
    label: "Step 3 · Follow progress",
    step: 2,
    text: "Check for updates anytime and follow your report until the issue is marked resolved.",
  },
];

const guideSteps = [
  {
    title: "Report it",
    description: "Describe the issue and its location.",
  },
  {
    title: "The team responds",
    description: "Your report reaches the right department.",
  },
  {
    title: "Track progress",
    description: "Stay updated until the issue is resolved.",
  },
];

const CivicGuide = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [characterIndex, setCharacterIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const currentMessage = guideMessages[messageIndex];
  const displayedText = reducedMotion
    ? currentMessage.text
    : currentMessage.text.slice(0, characterIndex);
  const isSpeaking =
    !reducedMotion && characterIndex < currentMessage.text.length;

  useEffect(() => {
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    const updateMotionPreference = (event) => {
      setReducedMotion(event.matches);
    };

    motionPreference.addEventListener("change", updateMotionPreference);
    return () =>
      motionPreference.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    let pauseTimer;
    const nextMessage = () => {
      setCharacterIndex(0);
      setMessageIndex((index) => (index + 1) % guideMessages.length);
    };

    if (reducedMotion) {
      return undefined;
    }

    let typedCharacters = 0;
    const typingTimer = window.setInterval(() => {
      typedCharacters += 1;
      setCharacterIndex(typedCharacters);

      if (typedCharacters >= currentMessage.text.length) {
        window.clearInterval(typingTimer);
        pauseTimer = window.setTimeout(nextMessage, 2600);
      }
    }, 28);

    return () => {
      window.clearInterval(typingTimer);
      window.clearTimeout(pauseTimer);
    };
  }, [currentMessage, reducedMotion]);

  return (
    <section className="px-6 py-7 sm:px-8 lg:px-10">
      <div className="about-guide-panel mx-auto max-w-[1350px] overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-blue-50 px-5 py-7 sm:px-8 sm:py-9 lg:px-12">
        <div className="grid items-center gap-6 md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr]">
          <div
            className={`about-guide-character mx-auto w-44 sm:w-52 md:w-full ${
              isSpeaking ? "is-speaking" : ""
            }`}
          >
            <img
              src={civicGuide}
              alt="Illustrated Civic Guide"
              className="h-auto w-full"
            />
            <span className="about-guide-speaking" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
              Meet your civic guide
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Let’s make your voice count.
            </h2>
            <div className="about-guide-bubble mt-4 rounded-2xl rounded-tl-sm border border-sky-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  {currentMessage.label}
                </span>
                <span className="about-guide-live inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Guide
                </span>
              </div>
              <p className="min-h-[5.5rem] text-sm leading-7 text-slate-700 sm:min-h-20 sm:text-base">
                “{displayedText}
                {!reducedMotion && <span className="about-guide-caret" aria-hidden="true" />}
                ”
              </p>
              <p className="sr-only">
                {guideMessages.map((message) => message.text).join(" ")}
              </p>
              <span
                className={`about-guide-dots mt-4 flex items-center gap-1.5 ${
                  isSpeaking ? "is-visible" : ""
                }`}
                aria-hidden="true"
              >
                <span />
                <span />
                <span />
              </span>
            </div>
          </div>
        </div>

        <div className="about-guide-steps mt-7 grid gap-3 sm:grid-cols-3">
          {guideSteps.map((step, index) => (
            <div
              className={`about-guide-step ${
                currentMessage.step === index ? "is-active" : ""
              }`}
              key={step.title}
              aria-current={currentMessage.step === index ? "step" : undefined}
            >
              <span className="about-guide-step-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CitizenAbout = () => {
  return (
    <div className="min-h-screen bg-white text-slate-800">

      {/* ================= NAVBAR ================= */}
      <Navbar />

      {/* ================= ABOUT HERO ================= */}
      <section className="mx-auto mt-5 max-w-[1450px] px-6 sm:px-8 lg:px-10">
        <div className="grid overflow-hidden rounded-3xl bg-[#eef7ff] shadow-sm lg:grid-cols-2">

          {/* Text */}
          <div className="about-enter flex flex-col justify-center px-7 py-8 sm:px-10 lg:px-12 lg:py-10">

            <p className="mb-3 text-sm font-bold uppercase tracking-wide text-blue-700">
              About Us
            </p>

            <h1 className="max-w-xl text-4xl font-bold leading-tight text-[#0b376f] sm:text-5xl">
              Building Better Cities
              <br />
              Together
            </h1>

            <div className="about-heading-accent my-5 h-1 w-14 rounded-full bg-blue-700" />

            <p className="max-w-xl text-base leading-7 text-slate-700">
              The Municipal Services Grievance Management System is designed
              to make it easier for citizens to report issues, track
              complaints, and help municipalities provide faster and more
              efficient resolutions.
            </p>

          </div>

          {/* Image */}
          <div className="about-image-frame min-h-[280px] overflow-hidden lg:min-h-[400px]">
            <img
              src={cityParkImage}
              alt="City park"
              className="about-image h-full w-full object-cover"
            />
          </div>

        </div>
      </section>


      {/* ================= MISSION / VISION / VALUES ================= */}
      <section className="mx-auto max-w-[1350px] px-6 py-7 sm:px-8 lg:px-10">

        <div className="about-stagger grid gap-5 md:grid-cols-3">

          {/* Mission */}
          <div className="about-card rounded-2xl bg-blue-50 p-6">

            <div className="about-card-icon mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <Target size={26} />
            </div>

            <h2 className="mb-3 text-xl font-bold text-blue-800">
              Our Mission
            </h2>

            <div className="about-heading-accent mb-4 h-1 w-12 bg-blue-700" />

            <p className="text-sm leading-6 text-slate-700">
              To create a transparent and efficient platform that connects
              citizens with municipal authorities for quick resolution of
              public issues.
            </p>

          </div>


          {/* Vision */}
          <div className="about-card rounded-2xl bg-green-50 p-6">

            <div className="about-card-icon mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
              <Eye size={26} />
            </div>

            <h2 className="mb-3 text-xl font-bold text-green-800">
              Our Vision
            </h2>

            <div className="about-heading-accent mb-4 h-1 w-12 bg-green-700" />

            <p className="text-sm leading-6 text-slate-700">
              To build smarter, cleaner, and more responsive cities through
              technology, collaboration, and citizen participation.
            </p>

          </div>


          {/* Values */}
          <div className="about-card rounded-2xl bg-purple-50 p-6">

            <div className="about-card-icon mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-700">
              <Users size={26} />
            </div>

            <h2 className="mb-3 text-xl font-bold text-purple-800">
              Our Values
            </h2>

            <div className="about-heading-accent mb-3 h-1 w-12 bg-purple-700" />

            <ul className="space-y-2 text-sm text-slate-700">
              <li>• Transparency</li>
              <li>• Accountability</li>
              <li>• Efficiency</li>
              <li>• Citizen First</li>
            </ul>

          </div>

        </div>

      </section>

      {/* ================= CIVIC IMPACT JOURNEY ================= */}
      <section className="px-6 py-7 sm:px-8 lg:px-10">
        <div className="about-ripple-panel mx-auto max-w-[1350px] overflow-hidden rounded-3xl bg-[#102b4e] px-6 py-8 text-white sm:px-10 sm:py-10">
          <div className="relative z-10 mx-auto mb-8 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-300">
              The civic ripple
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              One report can move a whole city forward.
            </h2>
            <p className="mt-3 text-sm leading-6 text-blue-100">
              Every concern creates a connection between the people who know
              their neighborhood and the teams who can improve it.
            </p>
          </div>

          <div className="about-ripple-journey">
            <div className="about-ripple-track" aria-hidden="true">
              <span className="about-ripple-line" />
              <span className="about-ripple-signal" />
            </div>

            <div className="about-ripple-stop">
              <span className="about-ripple-icon">
                <MapPin size={22} />
              </span>
              <span className="text-sm font-bold">You report it</span>
              <span className="text-xs text-blue-100">A local concern is shared</span>
            </div>

            <div className="about-ripple-stop">
              <span className="about-ripple-icon">
                <Building2 size={22} />
              </span>
              <span className="text-sm font-bold">Your city responds</span>
              <span className="text-xs text-blue-100">The right team takes action</span>
            </div>

            <div className="about-ripple-stop">
              <span className="about-ripple-icon">
                <CheckCircle2 size={22} />
              </span>
              <span className="text-sm font-bold">Everyone moves forward</span>
              <span className="text-xs text-blue-100">Together, the city improves</span>
            </div>
          </div>
        </div>
      </section>

      <CivicGuide />


      {/* ================= KEY FEATURES ================= */}
      <section className="mx-auto max-w-[1350px] px-6 py-6 sm:px-8 lg:px-10">

        <h2 className="mb-7 text-center text-3xl font-bold text-[#0b376f]">
          Key Features
        </h2>

        <div className="about-stagger grid gap-5 md:grid-cols-5">

          {/* Feature 1 */}
          <Feature
            icon={<FileText size={30} />}
            title="Easy Reporting"
            text="Report issues in just a few steps with details and photos."
          />

          {/* Feature 2 */}
          <Feature
            icon={<Search size={30} />}
            title="Real-time Tracking"
            text="Track the status of your complaints transparently."
          />

          {/* Feature 3 */}
          <Feature
            icon={<Bell size={30} />}
            title="Timely Updates"
            text="Get notified about important complaint updates."
          />

          {/* Feature 4 */}
          <Feature
            icon={<ShieldCheck size={30} />}
            title="Secure & Reliable"
            text="Your information is protected with privacy and security."
          />

          {/* Feature 5 */}
          <Feature
            icon={<BarChart3 size={30} />}
            title="Data-Driven Insights"
            text="Helps municipalities analyze data and improve services."
          />

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section className="mt-5 bg-[#eef7ff] px-6 py-7 sm:px-8 lg:px-10">

        <div className="mx-auto max-w-[1200px]">

          <h2 className="mb-7 text-center text-3xl font-bold text-[#0b376f]">
            How It Works
          </h2>

          <div className="about-stagger grid gap-7 md:grid-cols-4">

            <Step
              number="1"
              title="Report"
              text="Submit a complaint with details and location."
              icon={<FileText size={30} />}
            />

            <Step
              number="2"
              title="Assigned"
              text="Your complaint is assigned to the concerned department."
              icon={<Users size={30} />}
            />

            <Step
              number="3"
              title="In Progress"
              text="The department works on resolving the issue."
              icon={<Target size={30} />}
            />

            <Step
              number="4"
              title="Resolved"
              text="The issue is resolved and the complaint is closed."
              icon={<ShieldCheck size={30} />}
            />

          </div>

        </div>

      </section>


      {/* ================= ABOUT PLATFORM ================= */}
      <section className="mx-auto max-w-[1350px] px-6 py-7 sm:px-8 lg:px-10">

        <div className="grid items-center gap-7 lg:grid-cols-2">

          {/* Text */}
          <div className="about-enter">

            <h2 className="text-3xl font-bold text-[#0b376f]">
              About the Platform
            </h2>

            <div className="about-heading-accent my-4 h-1 w-12 bg-blue-700" />

            <p className="mb-3 text-base leading-7 text-slate-700">
              This platform is built to strengthen the connection between
              citizens and municipal authorities.
            </p>

            <p className="mb-3 text-base leading-7 text-slate-700">
              Whether it is a pothole on the road, a broken streetlight,
              garbage collection issue, or water supply problem — your voice
              matters, and we are here to act on it.
            </p>

            <p className="text-base font-medium leading-7 text-slate-700">
              Together, we can build a cleaner, safer and better city.
            </p>

          </div>


          {/* Image */}
          <div className="about-image-frame overflow-hidden rounded-2xl">
            <img
              src={cityImage}
              alt="Modern city"
              className="about-image h-[260px] w-full object-cover"
            />
          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <Footer />

    </div>
  );
};


/* ================= FEATURE COMPONENT ================= */

const Feature = ({ icon, title, text }) => {
  return (
    <div className="about-feature border-r border-slate-200 px-4 py-2 text-center last:border-r-0">

      <div className="about-feature-icon mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-700">
        {icon}
      </div>

      <h3 className="mb-2 text-base font-bold text-[#0b376f]">
        {title}
      </h3>

      <p className="text-sm leading-6 text-slate-600">
        {text}
      </p>

    </div>
  );
};


/* ================= STEP COMPONENT ================= */

const Step = ({ number, title, text, icon }) => {
  return (
    <div className="about-step relative text-center">

      <div className="about-step-icon mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border-2 border-blue-200 bg-white text-blue-700">
        {icon}
      </div>

      <span className="absolute left-1/2 top-[-7px] -ml-9 flex h-6 w-6 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white">
        {number}
      </span>

      <h3 className="mb-2 text-lg font-bold text-[#0b376f]">
        {title}
      </h3>

      <p className="mx-auto max-w-[220px] text-sm leading-6 text-slate-600">
        {text}
      </p>

    </div>
  );
};


export default CitizenAbout;