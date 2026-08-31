import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Contact = () => {
  return (
    <div className="min-h-screen bg-white text-slate-800">

      {/* ================= NAVBAR ================= */}
      <Navbar />


      {/* ================= CONTACT CONTENT ================= */}

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">

        <div className="mb-10 text-center">

          <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
            Get In Touch
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            Contact Us
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Have a question or need help with a municipal service?
            Get in touch with us and we will be happy to help.
          </p>

        </div>


        {/* ================= CONTACT CARDS ================= */}

        <div className="grid gap-6 md:grid-cols-3">

          {/* ADDRESS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-700">
              📍
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              Office Address
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Municipal Corporation Office
              <br />
              Main City Road
              <br />
              Your City
            </p>

          </div>


          {/* PHONE */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-700">
              📞
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              Phone
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              +91 12345 67890
              <br />
              Mon - Fri, 9:00 AM - 5:00 PM
            </p>

          </div>


          {/* EMAIL */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 text-purple-700">
              ✉️
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              Email
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              support@municipalservices.com
              <br />
              We usually reply within 24 hours.
            </p>

          </div>

        </div>


        {/* ================= CONTACT FORM ================= */}

        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

          <h2 className="text-2xl font-bold text-slate-900">
            Send Us a Message
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Fill in the form below and our team will get back to you.
          </p>


          <form className="mt-6 space-y-5">

            {/* NAME */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />

            </div>


            {/* EMAIL */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />

            </div>


            {/* MESSAGE */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Message
              </label>

              <textarea
                rows="5"
                placeholder="Write your message..."
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />

            </div>


            {/* BUTTON */}

            <button
              type="submit"
              className="rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
            >
              Send Message
            </button>

          </form>

        </div>

      </main>


      {/* ================= FOOTER ================= */}

      <Footer />

    </div>
  );
};

export default Contact;