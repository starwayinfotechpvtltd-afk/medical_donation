"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, LogOut, User, Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { DonationModal } from "./DonationModal";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
    setIsOpen(false);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/doctors", label: "Doctors" },
    { href: "/departments", label: "Departments" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              M
            </div>
            <div className="hidden sm:block">
              <h1 className="text-slate-900 font-bold text-lg">Medical Care</h1>
              <p className="text-emerald-500 text-xs font-semibold">Hospital</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-700 font-medium text-sm hover:text-emerald-500 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{user?.name}</span>
                </div>
                {user?.role === "patient" ? (
                  <Link
                    href="/patient"
                    className="bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium text-sm hover:bg-emerald-600 transition-colors"
                  >
                    My Portal
                  </Link>
                ) : user?.role === "doctor" ? (
                  <Link
                    href="/doctor"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
                  >
                    Doctor Portal
                  </Link>
                ) : user?.role === "lab_technician" ? (
                  <Link
                    href="/labtech"
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium text-sm hover:bg-purple-700 transition-colors"
                  >
                    Lab Portal
                  </Link>
                ) : user?.role === "nurse" ? (
                  <Link
                    href="/nurse"
                    className="bg-pink-600 text-white px-6 py-2 rounded-lg font-medium text-sm hover:bg-pink-700 transition-colors"
                  >
                    Nurse Portal
                  </Link>
                ) : (
                  <Link
                    href="/admin"
                    className="bg-slate-800 text-white px-6 py-2 rounded-lg font-medium text-sm hover:bg-slate-900 transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-red-600 border border-red-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/appointment"
                  className="bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium text-sm hover:bg-emerald-600 transition-colors"
                >
                  Book Appointment
                </Link>
                <div className="flex gap-2">
                  <Link
                    href="/patient/login"
                    className="text-emerald-500 border border-emerald-500 px-3 py-2 rounded-lg font-medium text-xs hover:bg-emerald-50 transition-colors"
                  >
                    Patient
                  </Link>
                  <Link
                    href="/doctor/login"
                    className="text-blue-600 border border-blue-600 px-3 py-2 rounded-lg font-medium text-xs hover:bg-blue-50 transition-colors"
                  >
                    Doctor
                  </Link>
                  <Link
                    href="/labtech/login"
                    className="text-purple-600 border border-purple-600 px-3 py-2 rounded-lg font-medium text-xs hover:bg-purple-50 transition-colors"
                  >
                    Lab
                  </Link>
                  <Link
                    href="/nurse/login"
                    className="text-pink-600 border border-pink-600 px-3 py-2 rounded-lg font-medium text-xs hover:bg-pink-50 transition-colors"
                  >
                    Nurse
                  </Link>
                  <Link
                    href="/admin/login"
                    className="text-slate-700 border border-slate-300 px-3 py-2 rounded-lg font-medium text-xs hover:bg-slate-50 transition-colors"
                  >
                    Admin
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-slate-700" />
            ) : (
              <Menu className="w-6 h-6 text-slate-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-slate-200">
            <div className="flex flex-col gap-2 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-slate-700 font-medium px-4 py-2 hover:bg-slate-50 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 text-sm text-slate-700 font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {user?.name}
                  </div>
                  {user?.role === "patient" ? (
                    <Link
                      href="/patient"
                      className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-emerald-600 transition-colors mx-4"
                      onClick={() => setIsOpen(false)}
                    >
                      My Portal
                    </Link>
                  ) : user?.role === "doctor" ? (
                    <Link
                      href="/doctor"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors mx-4"
                      onClick={() => setIsOpen(false)}
                    >
                      Doctor Portal
                    </Link>
                  ) : user?.role === "lab_technician" ? (
                    <Link
                      href="/labtech"
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-purple-700 transition-colors mx-4"
                      onClick={() => setIsOpen(false)}
                    >
                      Lab Portal
                    </Link>
                  ) : user?.role === "nurse" ? (
                    <Link
                      href="/nurse"
                      className="bg-pink-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-pink-700 transition-colors mx-4"
                      onClick={() => setIsOpen(false)}
                    >
                      Nurse Portal
                    </Link>
                  ) : (
                    <Link
                      href="/admin"
                      className="bg-slate-800 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-slate-900 transition-colors mx-4"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-red-600 border border-red-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-red-50 transition-colors mx-4 flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/appointment"
                    className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-emerald-600 transition-colors mx-4"
                    onClick={() => setIsOpen(false)}
                  >
                    Book Appointment
                  </Link>
                  <div className="flex flex-wrap gap-2 mx-4">
                    <Link
                      href="/patient/login"
                      className="text-emerald-500 border border-emerald-500 px-3 py-2 rounded-lg font-medium text-xs hover:bg-emerald-50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Patient
                    </Link>
                    <Link
                      href="/doctor/login"
                      className="text-blue-600 border border-blue-600 px-3 py-2 rounded-lg font-medium text-xs hover:bg-blue-50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Doctor
                    </Link>
                    <Link
                      href="/labtech/login"
                      className="text-purple-600 border border-purple-600 px-3 py-2 rounded-lg font-medium text-xs hover:bg-purple-50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Lab Tech
                    </Link>
                    <Link
                      href="/nurse/login"
                      className="text-pink-600 border border-pink-600 px-3 py-2 rounded-lg font-medium text-xs hover:bg-pink-50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Nurse
                    </Link>
                    <Link
                      href="/admin/login"
                      className="text-slate-700 border border-slate-300 px-3 py-2 rounded-lg font-medium text-xs hover:bg-slate-50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Donation Button for Mobile */}
        {!isAuthenticated && (
          <button
            onClick={() => setIsDonationOpen(true)}
            className="md:hidden w-full bg-red-500 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-red-600 transition-colors flex items-center justify-center gap-2 mt-4"
          >
            <Heart className="w-4 h-4" />
            Donate
          </button>
        )}
      </div>

      {/* Donation Modal */}
      <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />
    </nav>
  );
}
