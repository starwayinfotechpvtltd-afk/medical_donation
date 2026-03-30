import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { DoctorCard } from "@/components/DoctorCard";
import { doctors } from "@/data/doctors";
import { departments } from "@/data/departments";
import { hospitalInfo } from "@/data/hospital";
import { Stethoscope, Heart, Users, Clock, HeartIcon } from "lucide-react";
import HeroSection from "@/components/Home/HeroSection";
import HomeAboutSection from "@/components/Home/HomeAboutSection";
import HomeServicesSection from "@/components/Home/HomeServicesSection";
import TestimonialsSection from "@/components/Home/TestimonialsSection";
import DepartmentCard from "@/components/Home/DepartmentCard";

export default function Home() {
  const featuredDoctors = doctors.slice(0, 3);
  const featuredDepartments = departments.slice(0, 6);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <HeroSection />

        <HomeAboutSection />

        <HomeServicesSection />

        {/* Departments Section */}
        <section className="w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <SectionHeading
                title="Our Departments"
                subtitle="Medical Professionals"
                description="Explore our specialized departments and the services we offer."
                centered
              />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {departments.map((dept) => (
                <DepartmentCard key={dept.id} department={dept} />
              ))}
            </div>
          </div>
        </section>

        {/* Doctors Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Our Expert Doctors"
              subtitle="Dedicated Medical Experts"
              description="Meet our team of highly qualified and experienced healthcare professionals"
              centered
            />

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {featuredDoctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/doctors"
                className="inline-block bg-emerald-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
              >
                View All Doctors
              </Link>
            </div>
          </div>
        </section>


        <TestimonialsSection />
 {/* Donation Section */}
        <section className="py-20 bg-gradient-to-r from-emerald-50 to-emerald-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Make a Difference"
              subtitle="Support Our Mission"
              description="Your donation helps us provide quality healthcare services to those in need"
              centered
            />

            <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
              <div>
                <h3 className="text-3xl font-bold text-slate-900 mb-6">Your Impact Matters</h3>
                <ul className="space-y-4 mb-8">
                  {[
                    "Fund advanced medical equipment for diagnosis",
                    "Support free treatment for underprivileged patients",
                    "Enable medical research and innovations",
                    "Provide scholarships for nursing students",
                  ].map((impact, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="bg-emerald-500 rounded-full p-2 mt-1 flex-shrink-0">
                        <HeartIcon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-slate-700 text-lg">{impact}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-slate-600 text-lg mb-6">
                  Every contribution makes a direct impact on healthcare delivery and patient outcomes.
                </p>
                <button className="bg-emerald-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors">
                  Donate Now
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { amount: "$50", impact: "Provides basic health check-up for one patient" },
                  { amount: "$100", impact: "Funds emergency medical supplies" },
                  { amount: "$500", impact: "Supports one week of free clinic services" },
                  { amount: "$1000", impact: "Funds advanced diagnostic test for patient" },
                ].map((donation, idx) => (
                  <button
                    key={idx}
                    className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl hover:scale-105 transition-all border-2 border-transparent hover:border-emerald-500"
                  >
                    <p className="text-3xl font-bold text-emerald-600 mb-2">{donation.amount}</p>
                    <p className="text-sm text-slate-600 text-left">{donation.impact}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Donation Stats */}
            <div className="bg-white rounded-2xl p-12 shadow-lg">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <p className="text-4xl font-bold text-emerald-600 mb-2">5000+</p>
                  <p className="text-slate-600">Patients Helped</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-emerald-600 mb-2">₹50L+</p>
                  <p className="text-slate-600">Funds Raised</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-emerald-600 mb-2">100%</p>
                  <p className="text-slate-600">Goes to Healthcare</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* CTA Section */}
        <section className="bg-emerald-500 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Book Your Appointment?</h2>
            <p className="text-xl mb-8 text-emerald-50 max-w-2xl mx-auto">
              Our healthcare professionals are ready to help you. Schedule your appointment today.
            </p>
            <Link
              href="/appointment"
              className="inline-block bg-white text-emerald-500 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
            >
              Book Now
            </Link>
          </div>
        </section>


      </main>
      <Footer />
    </>
  );
}