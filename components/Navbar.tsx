"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Heart, ChevronUp } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { DonationModal } from "./DonationModal";
import Image from "next/image";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [showTopBar, setShowTopBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide top bar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowTopBar(false);
      } else if (currentScrollY < lastScrollY) {
        setShowTopBar(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/doctors", label: "Doctors" },
    { href: "/departments", label: "Departments" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ];

  // Announcement messages for marquee
  const announcements = [
    "🏥 Free Health Check-up Camp on March 25th, 2026 - Register Now!",
    "💊 20% Discount on All Lab Tests - Limited Period Offer",
    "👨‍⚕️ New Cardiology Department Now Open - Book Your Appointment Today",
    "🩺 Annual Health Check-up Package at Just ₹999 - Call Now!",
    "🌟 Special OPD Hours Extended till 8 PM for Working Professionals",
  ];

  return (
    <>
      {/* Top Announcement Bar - Marquee */}
      <div
        className={`bg-gradient-to-r from-emerald-600 to-green-600 text-white overflow-hidden transition-all duration-300 ease-in-out ${
          showTopBar ? "max-h-12 py-2" : "max-h-0 py-0"
        }`}
      >
        <div className="relative flex items-center justify-center">
          {/* Marquee Content */}
          <div className="overflow-hidden whitespace-nowrap relative w-full">
            <div className="animate-marquee inline-block">
              {announcements.map((announcement, index) => (
                <span key={index} className="mx-8 text-sm font-medium">
                  {announcement}
                </span>
              ))}
            </div>
            <div className="animate-marquee2 inline-block absolute top-0">
              {announcements.map((announcement, index) => (
                <span key={`dup-${index}`} className="mx-8 text-sm font-medium">
                  {announcement}
                </span>
              ))}
            </div>
          </div>
          
          {/* Optional: Close button for top bar */}
          <button
            onClick={() => setShowTopBar(false)}
            className="absolute right-4 hover:bg-emerald-500 rounded-full p-1 transition-colors"
            aria-label="Close announcement"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Navigation Bar - Fixed */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto py-2">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-4">
              <Image
                src="/mefigurelogo.png"
                alt="Mefigure Siddhi Vadanta"
                width={55}
                height={55}
                priority
                className="object-contain"
              />

              <div className="hidden sm:flex flex-col">
                <span className="text-gray-900 font-semibold text-base">
                  Medical Care
                </span>
                <span className="text-emerald-600 text-xs font-medium tracking-wide">
                  Hospital Services
                </span>
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

            {/* CTA Button - Only Book Appointment */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/appointment"
                className="bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium text-sm hover:bg-emerald-600 transition-colors"
              >
                Book Appointment
              </Link>
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
                
                {/* Book Appointment Button for Mobile */}
                <Link
                  href="/appointment"
                  className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-emerald-600 transition-colors mx-4 mt-2 text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Book Appointment
                </Link>
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
        <DonationModal  
          isOpen={isDonationOpen}
          onClose={() => setIsDonationOpen(false)}
        />
      </nav>
    </>
  );
}