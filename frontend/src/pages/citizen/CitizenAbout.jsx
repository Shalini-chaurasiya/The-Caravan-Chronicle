import React from "react";
import {
  Target,
  Eye,
  Users,
  FileText,
  Search,
  Bell,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import cityImage from "../../assets/upper.png";
import cityParkImage from "../../assets/lower.png";

const CitizenAbout = () => {
  return (
    <div className="min-h-screen bg-white text-slate-800">

      {/* ================= NAVBAR ================= */}
      <Navbar />

      {/* ================= ABOUT HERO ================= */}
      <section className="mx-auto mt-5 max-w-[1450px] px-6 sm:px-8 lg:px-10">
        <div className="grid overflow-hidden rounded-3xl bg-[#eef7ff] lg:grid-cols-2">

          {/* Text */}
          <div className="flex flex-col justify-center px-7 py-8 sm:px-10 lg:px-12 lg:py-10">

            <p className="mb-3 text-sm font-bold uppercase tracking-wide text-blue-700">
              About Us
            </p>

            <h1 className="max-w-xl text-4xl font-bold leading-tight text-[#0b376f] sm:text-5xl">
              Building Better Cities
              <br />
              Together
            </h1>

            <div className="my-5 h-1 w-14 rounded-full bg-blue-700" />

            <p className="max-w-xl text-base leading-7 text-slate-700">
              The Municipal Services Grievance Management System is designed
              to make it easier for citizens to report issues, track
              complaints, and help municipalities provide faster and more
              efficient resolutions.
            </p>

          </div>

          {/* Image */}
          <div className="min-h-[280px] lg:min-h-[400px]">
            <img
              src={cityParkImage}
              alt="City park"
              className="h-full w-full object-cover"
            />
          </div>

        </div>
      </section>


      {/* ================= MISSION / VISION / VALUES ================= */}
      <section className="mx-auto max-w-[1350px] px-6 py-7 sm:px-8 lg:px-10">

        <div className="grid gap-5 md:grid-cols-3">

          {/* Mission */}
          <div className="rounded-2xl bg-blue-50 p-6">

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <Target size={26} />
            </div>

            <h2 className="mb-3 text-xl font-bold text-blue-800">
              Our Mission
            </h2>

            <div className="mb-4 h-1 w-12 bg-blue-700" />

            <p className="text-sm leading-6 text-slate-700">
              To create a transparent and efficient platform that connects
              citizens with municipal authorities for quick resolution of
              public issues.
            </p>

          </div>


          {/* Vision */}
          <div className="rounded-2xl bg-green-50 p-6">

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
              <Eye size={26} />
            </div>

            <h2 className="mb-3 text-xl font-bold text-green-800">
              Our Vision
            </h2>

            <div className="mb-4 h-1 w-12 bg-green-700" />

            <p className="text-sm leading-6 text-slate-700">
              To build smarter, cleaner, and more responsive cities through
              technology, collaboration, and citizen participation.
            </p>

          </div>


          {/* Values */}
          <div className="rounded-2xl bg-purple-50 p-6">

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-700">
              <Users size={26} />
            </div>

            <h2 className="mb-3 text-xl font-bold text-purple-800">
              Our Values
            </h2>

            <div className="mb-3 h-1 w-12 bg-purple-700" />

            <ul className="space-y-2 text-sm text-slate-700">
              <li>• Transparency</li>
              <li>• Accountability</li>
              <li>• Efficiency</li>
              <li>• Citizen First</li>
            </ul>

          </div>

        </div>

      </section>


      {/* ================= KEY FEATURES ================= */}
      <section className="mx-auto max-w-[1350px] px-6 py-6 sm:px-8 lg:px-10">

        <h2 className="mb-7 text-center text-3xl font-bold text-[#0b376f]">
          Key Features
        </h2>

        <div className="grid gap-5 md:grid-cols-5">

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

          <div className="grid gap-7 md:grid-cols-4">

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
          <div>

            <h2 className="text-3xl font-bold text-[#0b376f]">
              About the Platform
            </h2>

            <div className="my-4 h-1 w-12 bg-blue-700" />

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
          <div className="overflow-hidden rounded-2xl">
            <img
              src={cityImage}
              alt="Modern city"
              className="h-[260px] w-full object-cover"
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
    <div className="border-r border-slate-200 px-4 py-2 text-center last:border-r-0">

      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-700">
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
    <div className="relative text-center">

      <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border-2 border-blue-200 bg-white text-blue-700">
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