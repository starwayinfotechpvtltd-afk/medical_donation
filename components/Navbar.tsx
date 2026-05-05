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

  // 🔥 Prevent scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  // 🔥 Hide/show top bar on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowTopBar(false);
      } else {
        setShowTopBar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/doctors", label: "Doctors" },
    { href: "/departments", label: "Departments" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ];

  const announcements = [
    "Free Health Check-up Camp on March 25th, 2026 - Register Now!",
    "20% Discount on All Lab Tests - Limited Period Offer",
    "New Cardiology Department Now Open - Book Your Appointment Today",
    "Annual Health Check-up Package at Just ₹999 - Call Now!",
    "Special OPD Hours Extended till 8 PM for Working Professionals",
  ];

  return (
    <>
      {/* 🔥 TOP MARQUEE */}
      <div
        className={`bg-gradient-to-r from-emerald-600 to-green-600 text-white transition-all duration-500 ${
          showTopBar ? "max-h-12 py-2" : "max-h-0 py-0"
        } overflow-hidden`}
      >
        <div className="relative w-full overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee">
            {[...announcements, ...announcements].map((text, i) => (
              <span key={i} className="mx-6 text-sm font-medium">
                {text}
              </span>
            ))}
          </div>

          <button
            onClick={() => setShowTopBar(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-1 rounded-full"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/*NAVBAR */}
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/mefigurelogo.png" alt="logo" width={50} height={50} />
            <div className="hidden sm:flex flex-row gap-1">
              <div className="flex gap-1">
                <span className="text-emerald-600 font-medium text-base 2xl:text-xl">
                  Mefigure
                </span>
                <span className="text-orange-500 font-medium text-base 2xl:text-xl">
                  siddhi
                </span>
              </div>
              <span className="text-blue-900 text-base 2xl:text-xl font-medium tracking-wide">
                Vadanta
              </span>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-700 hover:text-emerald-600"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex">
            <Link
              href="/appointment"
              className="bg-emerald-500 text-white px-6 py-2 rounded-xl"
            >
              Book Appointment
            </Link>
          </div>

          {/* MOBILE BUTTON */}
          <button onClick={() => setIsOpen(true)} className="md:hidden">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* 🔥 MOBILE DRAWER */}
      <div
        className={`fixed inset-0 z-[999] md:hidden transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        {/* Sidebar */}
        <div
          className={`absolute top-0 left-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-5 border-b">
            <span className="text-lg font-semibold text-emerald-600">Menu</span>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Links */}
          <div className="flex flex-col p-4 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="py-3 px-4 rounded-lg hover:bg-slate-100 font-medium"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/appointment"
              onClick={() => setIsOpen(false)}
              className="mt-4 bg-emerald-500 text-white py-3 rounded-xl text-center"
            >
              Book Appointment
            </Link>

            {!isAuthenticated && (
              <button
                onClick={() => {
                  setIsDonationOpen(true);
                  setIsOpen(false);
                }}
                className="mt-2 bg-red-500 text-white py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4" />
                Donate
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MODAL */}
      <DonationModal
        isOpen={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
      />
    </>
  );
}

// "use client";

// import Link from "next/link";
// import { useState, useEffect } from "react";
// import { Menu, X, Heart, ChevronUp } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";
// import { DonationModal } from "./DonationModal";
// import Image from "next/image";

// export function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isDonationOpen, setIsDonationOpen] = useState(false);
//   const [showTopBar, setShowTopBar] = useState(true);
//   const [lastScrollY, setLastScrollY] = useState(0);
//   const { isAuthenticated } = useAuth();

//   useEffect(() => {
//     const handleScroll = () => {
//       const currentScrollY = window.scrollY;

//       // Hide top bar when scrolling down, show when scrolling up
//       if (currentScrollY > lastScrollY && currentScrollY > 50) {
//         setShowTopBar(false);
//       } else if (currentScrollY < lastScrollY) {
//         setShowTopBar(true);
//       }

//       setLastScrollY(currentScrollY);
//     };

//     window.addEventListener("scroll", handleScroll, { passive: true });

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, [lastScrollY]);

//   const navLinks = [
//     { href: "/", label: "Home" },
//     { href: "/about", label: "About Us" },
//     { href: "/doctors", label: "Doctors" },
//     { href: "/departments", label: "Departments" },
//     { href: "/gallery", label: "Gallery" },
//     { href: "/contact", label: "Contact" },
//   ];

//   // Announcement messages for marquee
//   const announcements = [
//     "Free Health Check-up Camp on March 25th, 2026 - Register Now!",
//     "20% Discount on All Lab Tests - Limited Period Offer",
//     "New Cardiology Department Now Open - Book Your Appointment Today",
//     "Annual Health Check-up Package at Just ₹999 - Call Now!",
//     "Special OPD Hours Extended till 8 PM for Working Professionals",
//   ];

//   return (
//     <>
//       {/* Top Announcement Bar - Marquee */}
//       <div
//         className={`bg-gradient-to-r from-emerald-600 to-green-600 text-white overflow-hidden transition-all duration-300 ease-in-out ${
//           showTopBar ? "max-h-12 py-2" : "max-h-0 py-0"
//         }`}
//       >
//         <div className="relative flex items-center justify-center">
//           {/* Marquee Content */}
//           <div className="overflow-hidden whitespace-nowrap relative w-full">
//             <div className="animate-marquee inline-block">
//               {announcements.map((announcement, index) => (
//                 <span key={index} className="mx-8 text-sm font-medium">
//                   {announcement}
//                 </span>
//               ))}
//             </div>
//             <div className="animate-marquee2 inline-block absolute top-0">
//               {announcements.map((announcement, index) => (
//                 <span key={`dup-${index}`} className="mx-8 text-sm font-medium">
//                   {announcement}
//                 </span>
//               ))}
//             </div>
//           </div>

//           {/* Optional: Close button for top bar */}
//           <button
//             onClick={() => setShowTopBar(false)}
//             className="absolute right-4 hover:bg-emerald-500 rounded-full p-1 transition-colors"
//             aria-label="Close announcement"
//           >
//             <ChevronUp className="w-4 h-4" />
//           </button>
//         </div>
//       </div>

//       {/* Main Navigation Bar - Fixed */}
//       <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
//         <div className="max-w-7xl mx-auto py-2">
//           <div className="flex justify-between items-center h-16">
//             {/* Logo */}
//             <Link href="/" className="flex items-center gap-2">
//               <Image
//                 src="/mefigurelogo.png"
//                 alt="Mefigure Siddhi Vadanta"
//                 width={55}
//                 height={55}
//                 priority
//                 className="object-contain"
//               />

//               <div className="hidden sm:flex flex-row gap-1">
//                 <div className="flex gap-1">
//                   <span className="text-emerald-600 font-medium text-base 2xl:text-xl">
//                     Mefigure
//                   </span>
//                   <span className="text-orange-500 font-medium text-base 2xl:text-xl">
//                     siddhi
//                   </span>
//                 </div>
//                 <span className="text-blue-900 text-base 2xl:text-xl font-medium tracking-wide">
//                   Vadanta
//                 </span>
//               </div>
//             </Link>

//             {/* Desktop Navigation */}
//             <div className="hidden md:flex items-center gap-8">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.href}
//                   href={link.href}
//                   className="text-slate-700 font-medium text-sm hover:text-emerald-500 transition-colors"
//                 >
//                   {link.label}
//                 </Link>
//               ))}
//             </div>

//             {/* CTA Button - Only Book Appointment */}
//             <div className="hidden md:flex items-center gap-4">
//               <Link
//                 href="/appointment"
//                 className="bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium text-sm hover:bg-emerald-600 transition-colors"
//               >
//                 Book Appointment
//               </Link>
//             </div>

//             {/* Mobile menu button */}
//             <button
//               className="md:hidden"
//               onClick={() => setIsOpen(!isOpen)}
//               aria-label="Toggle menu"
//             >
//               {isOpen ? (
//                 <X className="w-6 h-6 text-slate-700" />
//               ) : (
//                 <Menu className="w-6 h-6 text-slate-700" />
//               )}
//             </button>
//           </div>

//           {/* Mobile Navigation */}
//           {isOpen && (
//             <div className="md:hidden pb-4 border-t border-slate-200">
//               <div className="flex flex-col gap-2 pt-4">
//                 {navLinks.map((link) => (
//                   <Link
//                     key={link.href}
//                     href={link.href}
//                     className="text-slate-700 font-medium px-4 py-2 hover:bg-slate-50 rounded-lg transition-colors"
//                     onClick={() => setIsOpen(false)}
//                   >
//                     {link.label}
//                   </Link>
//                 ))}

//                 {/* Book Appointment Button for Mobile */}
//                 <Link
//                   href="/appointment"
//                   className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-emerald-600 transition-colors mx-4 mt-2 text-center"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   Book Appointment
//                 </Link>
//               </div>
//             </div>
//           )}

//           {/* Donation Button for Mobile */}
//           {!isAuthenticated && (
//             <button
//               onClick={() => setIsDonationOpen(true)}
//               className="md:hidden w-full bg-red-500 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-red-600 transition-colors flex items-center justify-center gap-2 mt-4"
//             >
//               <Heart className="w-4 h-4" />
//               Donate
//             </button>
//           )}
//         </div>

//         {/* Donation Modal */}
//         <DonationModal
//           isOpen={isDonationOpen}
//           onClose={() => setIsDonationOpen(false)}
//         />
//       </nav>
//     </>
//   );
// }
