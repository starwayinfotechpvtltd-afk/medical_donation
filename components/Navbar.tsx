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

//   // 🔥 Prevent scroll when drawer open
//   useEffect(() => {
//     document.body.style.overflow = isOpen ? "hidden" : "auto";
//   }, [isOpen]);

//   // 🔥 Hide/show top bar on scroll
//   useEffect(() => {
//     const handleScroll = () => {
//       const currentScrollY = window.scrollY;

//       if (currentScrollY > lastScrollY && currentScrollY > 50) {
//         setShowTopBar(false);
//       } else {
//         setShowTopBar(true);
//       }

//       setLastScrollY(currentScrollY);
//     };

//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [lastScrollY]);

//   const navLinks = [
//     { href: "/", label: "Home" },
//     { href: "/about", label: "About Us" },
//     { href: "/doctors", label: "Doctors" },
//     { href: "/departments", label: "Departments" },
//     { href: "/gallery", label: "Gallery" },
//     { href: "/contact", label: "Contact" },
//   ];

//   const announcements = [
//     "Free Health Check-up Camp on March 25th, 2026 - Register Now!",
//     "20% Discount on All Lab Tests - Limited Period Offer",
//     "New Cardiology Department Now Open - Book Your Appointment Today",
//     "Annual Health Check-up Package at Just ₹999 - Call Now!",
//     "Special OPD Hours Extended till 8 PM for Working Professionals",
//   ];

//   return (
//     <>
//       {/* 🔥 TOP MARQUEE */}
//       <div
//         className={`bg-gradient-to-r from-emerald-600 to-green-600 text-white transition-all duration-500 ${
//           showTopBar ? "max-h-12 py-2" : "max-h-0 py-0"
//         } overflow-hidden`}
//       >
//         <div className="relative w-full overflow-hidden">
//           <div className="flex whitespace-nowrap animate-marquee">
//             {[...announcements, ...announcements].map((text, i) => (
//               <span key={i} className="mx-6 text-sm font-medium">
//                 {text}
//               </span>
//             ))}
//           </div>

//           <button
//             onClick={() => setShowTopBar(false)}
//             className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-1 rounded-full"
//           >
//             <ChevronUp className="w-4 h-4" />
//           </button>
//         </div>
//       </div>

//       {/*NAVBAR */}
//       <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
//           {/* LOGO */}
//           <Link href="/" className="flex items-center gap-2">
//             <Image src="/mefigurelogo.png" alt="logo" width={50} height={50} />
//             <div className="hidden sm:flex flex-row gap-1">
//               <div className="flex gap-1">
//                 <span className="text-emerald-600 font-medium text-base 2xl:text-xl">
//                   Mefigure
//                 </span>
//                 <span className="text-orange-500 font-medium text-base 2xl:text-xl">
//                   siddhi
//                 </span>
//               </div>
//               <span className="text-blue-900 text-base 2xl:text-xl font-medium tracking-wide">
//                 Vadanta
//               </span>
//             </div>
//           </Link>

//           {/* DESKTOP MENU */}
//           <div className="hidden md:flex gap-8">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 className="text-slate-700 hover:text-emerald-600"
//               >
//                 {link.label}
//               </Link>
//             ))}
//           </div>

//           {/* CTA */}
//           <div className="hidden md:flex">
//             <Link
//               href="/appointment"
//               className="bg-emerald-500 text-white px-6 py-2 rounded-xl"
//             >
//               Book Appointment
//             </Link>
//           </div>

//           {/* MOBILE BUTTON */}
//           <button onClick={() => setIsOpen(true)} className="md:hidden">
//             <Menu className="w-6 h-6" />
//           </button>
//         </div>
//       </nav>

//       {/* 🔥 MOBILE DRAWER */}
//       <div
//         className={`fixed inset-0 z-[999] md:hidden transition-all duration-300 ${
//           isOpen ? "opacity-100 visible" : "opacity-0 invisible"
//         }`}
//       >
//         {/* Overlay */}
//         <div
//           className="absolute inset-0 bg-black/60 backdrop-blur-sm"
//           onClick={() => setIsOpen(false)}
//         />

//         {/* Sidebar */}
//         <div
//           className={`absolute top-0 left-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ${
//             isOpen ? "translate-x-0" : "-translate-x-full"
//           }`}
//         >
//           {/* Header */}
//           <div className="flex justify-between items-center p-5 border-b">
//             <span className="text-lg font-semibold text-emerald-600">Menu</span>
//             <button onClick={() => setIsOpen(false)}>
//               <X className="w-6 h-6" />
//             </button>
//           </div>

//           {/* Links */}
//           <div className="flex flex-col p-4 gap-2">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 onClick={() => setIsOpen(false)}
//                 className="py-3 px-4 rounded-lg hover:bg-slate-100 font-medium"
//               >
//                 {link.label}
//               </Link>
//             ))}

//             <Link
//               href="/appointment"
//               onClick={() => setIsOpen(false)}
//               className="mt-4 bg-emerald-500 text-white py-3 rounded-xl text-center"
//             >
//               Book Appointment
//             </Link>

//             {!isAuthenticated && (
//               <button
//                 onClick={() => {
//                   setIsDonationOpen(true);
//                   setIsOpen(false);
//                 }}
//                 className="mt-2 bg-red-500 text-white py-3 rounded-xl flex items-center justify-center gap-2"
//               >
//                 <Heart className="w-4 h-4" />
//                 Donate
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* MODAL */}
//       <DonationModal
//         isOpen={isDonationOpen}
//         onClose={() => setIsDonationOpen(false)}
//       />
//     </>
//   );
// }

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, Heart, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { DonationModal } from "./DonationModal";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [showTopBar, setShowTopBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { isAuthenticated } = useAuth();

  // Prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateNavbar = () => {
      const currentScrollY = window.scrollY;

      // prevent shaking near top
      if (currentScrollY <= 20) {
        setShowTopBar(true);
      } else if (currentScrollY > lastScrollY + 10) {
        // scrolling down
        setShowTopBar(false);
      } else if (currentScrollY < lastScrollY - 10) {
        // scrolling up
        setShowTopBar(true);
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/doctors", label: "Doctors" },
    { href: "/departments", label: "Departments" },
    { href: "/donate", label: "Donate" },
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

  const loginLinks = [
    { href: "/adminLogin", label: "Admin Login" },
    { href: "/doctorLogin", label: "Doctor Login" },
    { href: "/nurseLogin", label: "Nurse Login" },
    { href: "/labtechLogin", label: "Lab Technician Login" },
    { href: "/patient/login", label: "Patient Login" },
  ];

  return (
    <>
      {/* TOP MARQUEE */}
      {/* TOP MARQUEE */}
      <div
        className={`fixed top-0 left-0 z-[60] w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white transition-transform duration-300 ease-in-out ${
          showTopBar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex h-10 items-center overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee">
            {[...announcements, ...announcements].map((text, i) => (
              <span
                key={i}
                className="mx-6 text-xs sm:text-sm font-medium tracking-wide"
              >
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <nav
        className={`sticky z-50 w-full border-b border-slate-200/70 bg-white/80 backdrop-blur-xl transition-all duration-300 ${
          showTopBar ? "top-10" : "top-0"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* LOGO */}
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <Image
              src="/mefigurelogo.png"
              alt="logo"
              width={50}
              height={50}
              className="h-11 w-11 object-contain sm:h-12 sm:w-12"
            />

            <div className="flex flex-col leading-none gap-0">
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-emerald-600 sm:text-base lg:text-lg">
                  Mefigure
                </span>
                <span className="text-sm font-bold text-orange-500 sm:text-base lg:text-lg">
                  Siddhi
                </span>
              </div>
              <span className="text-xs font-semibold tracking-wide text-slate-700 sm:text-base lg:text-lg">
                Vadanta
              </span>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden items-center gap-7 lg:flex xl:gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative text-[15px] font-medium text-slate-700 transition-all duration-300 hover:text-emerald-600"
              >
                {link.label}

                <span className="absolute -bottom-1 left-0 h-[2px] w-0 rounded-full bg-emerald-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* DESKTOP CTA */}
          <div className="hidden items-center gap-4 lg:flex">
            <div className="relative">
              <button
                onClick={() => setShowLoginDropdown((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-300 hover:bg-slate-50"
              >
                Login
                <ChevronDown className="h-4 w-4" />
              </button>

              {showLoginDropdown && (
                <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                  {loginLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setShowLoginDropdown(false)}
                      className="block px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-600"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/appointment"
              className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-600"
            >
              Book Appointment
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:bg-slate-50 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <div
        className={`fixed inset-0 z-[999] lg:hidden transition-all duration-300 ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {/* OVERLAY */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        {/* SIDEBAR */}
        <div
          className={`absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5">
            <div className="flex items-center gap-3">
              <Image
                src="/mefigurelogo.png"
                alt="logo"
                width={42}
                height={42}
                className="rounded-full"
              />

              <div className="flex flex-col">
                <span className="font-bold text-emerald-600">
                  Mefigure Siddhi
                </span>

                <span className="text-sm text-slate-500">Vadanta</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 transition hover:bg-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* LINKS */}
          <div className="flex flex-1 flex-col overflow-y-auto px-5 py-6">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="group flex items-center justify-between rounded-2xl px-4 py-4 text-[15px] font-medium text-slate-700 transition-all duration-300 hover:bg-emerald-50 hover:text-emerald-600"
                >
                  {link.label}

                  <span className="translate-x-0 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                    →
                  </span>
                </Link>
              ))}
            </div>

            {/* MOBILE ACTIONS */}
            <div className="mt-8 flex flex-col gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Login Portals
                </p>
                <div className="flex flex-col gap-1">
                  {loginLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white hover:text-emerald-600"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="/appointment"
                onClick={() => setIsOpen(false)}
                className="rounded-2xl bg-emerald-500 px-5 py-4 text-center text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:bg-emerald-600"
              >
                Book Appointment
              </Link>

              {!isAuthenticated && (
                <button
                  onClick={() => {
                    setIsDonationOpen(true);
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-500 transition-all duration-300 hover:bg-red-500 hover:text-white"
                >
                  <Heart className="h-4 w-4" />
                  Donate Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* DONATION MODAL */}
      <DonationModal
        isOpen={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
      />
    </>
  );
}
