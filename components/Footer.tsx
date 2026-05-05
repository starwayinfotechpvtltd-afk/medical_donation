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

              <div className="hidden sm:flex flex-row gap-1">
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

        {/* Login Portals Section */}
        <div className="border-t border-slate-700 pt-8 mb-8">
          <h4 className="text-white font-semibold mb-4 text-center">
            Login Portals
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Link
              href="/patient/login"
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg transition-colors group"
            >
              <User className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300" />
              <span className="text-sm font-medium">Patient Login</span>
            </Link>
            <Link
              href="/doctorLogin"
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg transition-colors group"
            >
              <Stethoscope className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
              <span className="text-sm font-medium">Doctor Login</span>
            </Link>
            <Link
              href="/labtechLogin"
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg transition-colors group"
            >
              <Microscope className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
              <span className="text-sm font-medium">Lab Login</span>
            </Link>
            <Link
              href="/nurse/login"
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg transition-colors group"
            >
              <Heart className="w-4 h-4 text-pink-400 group-hover:text-pink-300" />
              <span className="text-sm font-medium">Nurse Login</span>
            </Link>
            <Link
              href="/adminLogin"
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg transition-colors group"
            >
              <Shield className="w-4 h-4 text-slate-400 group-hover:text-slate-300" />
              <span className="text-sm font-medium">Admin Login</span>
            </Link>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-slate-700 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex gap-4 mb-4 sm:mb-0">
            <a
              href={hospitalInfo.socialMedia.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-emerald-400 transition"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href={hospitalInfo.socialMedia.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-emerald-400 transition"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href={hospitalInfo.socialMedia.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-emerald-400 transition"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href={hospitalInfo.socialMedia.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-emerald-400 transition"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
          <div>
            <p className="text-slate-400 text-sm text-center sm:text-left">
              Designed by{" "}
              <a
                href="https://starwaywebdigital.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 font-medium hover:underline"
              >
                Starway
              </a>
            </p>{" "}
          </div>
          <p className="text-slate-400 text-sm text-center sm:text-right">
            Copyright © {currentYear}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
