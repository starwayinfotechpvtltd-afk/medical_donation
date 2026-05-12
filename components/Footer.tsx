"use client";

import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Phone,
  Mail,
  MapPin,
  User,
  Stethoscope,
  Microscope,
  Heart,
  Shield,
} from "lucide-react";
import { hospitalInfo } from "@/data/hospital";
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/mefigurelogo.png"
                alt="Mefigure Siddhi Vadanta"
                width={55}
                height={55}
                priority
                className="object-contain"
              />

              <div className="hidden md:flex flex-row gap-1">
                <div className="flex gap-1">
                  <span className="text-emerald-600 font-medium text-base 2xl:text-lg">
                    Mefigure
                  </span>
                  <span className="text-orange-500 font-medium text-base 2xl:text-lg">
                    siddhi
                  </span>
                </div>
                <span className="text-blue-900 text-base 2xl:text-xl font-medium tracking-wide">
                  Vadanta
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Providing compassionate, high-quality healthcare services with the
              latest medical technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-slate-400 hover:text-emerald-400 text-sm transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-slate-400 hover:text-emerald-400 text-sm transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/doctors"
                  className="text-slate-400 hover:text-emerald-400 text-sm transition"
                >
                  Doctors
                </Link>
              </li>
              <li>
                <Link
                  href="/departments"
                  className="text-slate-400 hover:text-emerald-400 text-sm transition"
                >
                  Departments
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-400 hover:text-emerald-400 text-sm transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/appointment"
                  className="text-slate-400 hover:text-emerald-400 text-sm transition"
                >
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link
                  href="/departments"
                  className="text-slate-400 hover:text-emerald-400 text-sm transition"
                >
                  Specializations
                </Link>
              </li>
              <li>
                <Link
                  href="/doctors"
                  className="text-slate-400 hover:text-emerald-400 text-sm transition"
                >
                  Find Doctor
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="text-slate-400 hover:text-emerald-400 text-sm transition"
                >
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex gap-3">
                <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-slate-400 text-sm">
                    {hospitalInfo.contact.phone}
                  </p>
                  <p className="text-emerald-400 text-xs">
                    Emergency: {hospitalInfo.contact.emergencyPhone}
                  </p>
                </div>
              </div>
              {/* <div className="flex gap-3">
                <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                <p className="text-slate-400 text-sm">{hospitalInfo.contact.email}</p>
              </div> */}
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                <p className="text-slate-400 text-sm">
                  {hospitalInfo.address.street}, {hospitalInfo.address.city}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-700 mt-2 pt-3">
          {/* Top Row */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Legal Links */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
              <Link
                href="/terms"
                className="text-slate-400 hover:text-emerald-400 transition-colors"
              >
                Terms & Conditions
              </Link>

              <span className="text-slate-600">•</span>

              <Link
                href="/privacy
                "
                className="text-slate-400 hover:text-emerald-400 transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a
                href={hospitalInfo.socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-400 transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>

              <a
                href={hospitalInfo.socialMedia.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-400 transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>

              <a
                href={hospitalInfo.socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-400 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href={hospitalInfo.socialMedia.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-400 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
          {/* Bottom Row */}
          <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-center gap-3 text-sm">
            <p className="text-slate-500 text-center md:text-left">
              Copyright © {currentYear}. All rights reserved by {hospitalInfo.name}.
            </p>
          </div>
        </div>
      </div>
      {/* Bottom Footer */}

    </footer>
  );
}
