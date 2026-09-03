import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  };

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await fetch(
        "http://localhost:3000/api/contact/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      // Read response safely
      const text = await response.text();

      let data = {};

      try {
        data = JSON.parse(text);
      } catch {
        // Backend returned HTML/non-JSON
        throw new Error(
          `Contact API returned ${response.status}. Please check the backend route.`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to send message."
        );
      }

      // ================= SUCCESS =================
      setSuccess(
        data.message ||
          "Your message has been sent successfully!"
      );

      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (err) {
      console.error("Contact form error:", err);

      setError(
        err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800">

      {/* ================= NAVBAR ================= */}
      <Navbar />

      {/* ================= CONTENT ================= */}
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">

        {/* ================= HEADER ================= */}
        <div className="mb-10 text-center">

          <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
            Get In Touch
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            Contact Us
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Have a question or need help with a municipal
            service? Get in touch with us and we will be
            happy to help.
          </p>

        </div>

        {/* ================= CONTACT CARDS ================= */}
        <div className="grid gap-6 md:grid-cols-3">

          {/* ADDRESS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-xl">
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

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-xl">
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

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 text-xl">
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

        {/* ================= FORM ================= */}
        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

          <h2 className="text-2xl font-bold text-slate-900">
            Send Us a Message
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Fill in the form below and our team will get back
            to you.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
          >

            {/* NAME */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                disabled={loading}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                disabled={loading}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />
            </div>

            {/* MESSAGE */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Message
              </label>

              <textarea
                rows="5"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message..."
                required
                disabled={loading}
                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />
            </div>

            {/* SUCCESS */}
            {success && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700">
                {success}
              </div>
            )}

            {/* ERROR */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Message"}
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
