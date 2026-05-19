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
import DoctorsSection from "@/components/Home/DoctorHome";
import DonationSection from "@/components/Home/DonationSection";
import FAQSection from "@/components/Home/FaqSection";

export default function Home() {
  const featuredDoctors = doctors.slice(0, 3);
  const featuredDepartments = departments.slice(0, 6);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <HomeAboutSection />
        <HomeServicesSection />
        {/* Departments Section */}
        <section className="w-full">
          <div className="max-w-[90%] lg:max-w-[90%] xl:max-w-[80%] 2xl:max-w-[75%] mx-auto lg:px-8 py-20">
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
        <DoctorsSection />
        <TestimonialsSection />
        {/* Donation Section */}
        <DonationSection />
        {/* CTA Section */}
        <section className="bg-emerald-500 text-white py-16">
          <div className="max-w-[90%] lg:max-w-[90%] xl:max-w-[80%] 2xl:max-w-[75%] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

              {/* Left Content */}
              <div className="text-center lg:text-left">
                <h2 className="text-4xl font-bold mb-4">
                  Ready to Book Your Appointment?
                </h2>

                <p className="text-xl text-emerald-50 max-w-2xl">
                  Our healthcare professionals are ready to help you. Schedule your
                  appointment today.
                </p>
              </div>

              {/* Right Button */}
              <div className="flex-shrink-0">
                <Link
                  href="/appointment"
                  className="inline-flex items-center justify-center bg-white text-emerald-500 px-8 py-4 rounded-xl font-semibold hover:bg-emerald-50 transition-all duration-300 shadow-lg"
                >
                  Book Now
                </Link>
              </div>

            </div>
          </div>
        </section>

        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
