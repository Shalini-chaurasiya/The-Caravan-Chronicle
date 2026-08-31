import React from "react";
import {
  Mail,
  MessageCircle,
} from "lucide-react";

const Footer = () => {
  return (
    <footer
      id="contact"
      className="bg-[#052f62] text-white"
    >

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3">

        {/* ================= LOGO / ABOUT ================= */}

        <div>

          <div className="flex items-center gap-3">

            <div className="text-4xl">
              🏛️
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Municipal Services
              </h2>

              <p className="text-sm text-blue-200">
                Grievance Management System
              </p>
            </div>

          </div>


          <p className="mt-5 max-w-sm leading-6 text-blue-100">
            Making it easier for citizens and
            municipalities to work together.
          </p>

        </div>


        {/* ================= LINKS ================= */}

        <div>

          <h3 className="mb-5 text-lg font-semibold">
            Quick Links
          </h3>


          <div className="flex flex-col gap-3 text-blue-100">

            <a
              href="#home"
              className="transition hover:text-white"
            >
              Home
            </a>


            <a
              href="#about"
              className="transition hover:text-white"
            >
              About
            </a>


            <a
              href="/citizen/complaints"
              className="transition hover:text-white"
            >
              Complaints
            </a>

          </div>

        </div>


        {/* ================= SOCIAL MEDIA ================= */}

        <div>

          <h3 className="mb-5 text-lg font-semibold">
            Connect With Us
          </h3>


          <div className="flex gap-4">

            {/* Gmail */}

            <a
              href="mailto:municipalservices@gmail.com"
              aria-label="Email"
              title="Email"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-red-500 transition hover:-translate-y-1"
            >
              <Mail size={21} />
            </a>


            {/* WhatsApp */}

            <a
              href="#"
              aria-label="WhatsApp"
              title="WhatsApp"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-green-500 transition hover:-translate-y-1"
            >
              <MessageCircle size={21} />
            </a>


            {/* Twitter / X */}

            <a
              href="#"
              aria-label="Twitter"
              title="Twitter"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sky-500 transition hover:-translate-y-1"
            >
              <span className="text-lg font-bold">
                𝕏
              </span>
            </a>


            {/* Facebook */}

            <a
              href="#"
              aria-label="Facebook"
              title="Facebook"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-blue-600 transition hover:-translate-y-1"
            >
              <span className="text-xl font-bold">
                f
              </span>
            </a>


            {/* Instagram */}

            <a
              href="#"
              aria-label="Instagram"
              title="Instagram"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-pink-500 transition hover:-translate-y-1"
            >
              <span className="text-xl font-bold">
                ◎
              </span>
            </a>

          </div>

        </div>

      </div>


      {/* ================= BOTTOM ================= */}

      <div className="border-t border-white/10">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-sm text-blue-200 md:flex-row">

          <p>
            © 2026 Municipal Services. All rights reserved.
          </p>

          <p>
            Building better cities together.
          </p>

        </div>

      </div>

    </footer>
  );
};

export default Footer;