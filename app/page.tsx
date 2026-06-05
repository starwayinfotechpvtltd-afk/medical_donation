import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { departments } from "@/data/departments";
import HeroSection from "@/components/Home/HeroSection";
import HomeAboutSection from "@/components/Home/HomeAboutSection";
import HomeServicesSection from "@/components/Home/HomeServicesSection";
import TestimonialsSection from "@/components/Home/TestimonialsSection";
import DepartmentCard from "@/components/Home/DepartmentCard";
import DoctorsSection from "@/components/Home/DoctorHome";
import DonationSection from "@/components/Home/DonationSection";
import FAQSection from "@/components/Home/FaqSection";

const apiBase = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

async function getHomeDepartments() {
  try {
    const res = await fetch(`${apiBase}/api/departments`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return departments.slice(0, 6);
    const body = await res.json();
    const rows = Array.isArray(body?.data) ? body.data : [];
    return rows.slice(0, 6).map((dept: any) => ({
      ...dept,
      id: String(dept.id),
      image_url: dept.image_url?.startsWith("http")
        ? dept.image_url
        : dept.image_url
          ? `${apiBase}${dept.image_url}`
          : "",
    }));
  } catch {
    return departments.slice(0, 6);
  }
}

export default async function Home() {
  const featuredDepartments = await getHomeDepartments();

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
              {featuredDepartments.map((dept) => (
                <DepartmentCard key={dept.id} department={dept} />
              ))}
            </div>
            {/* CTA */}
            <div className="text-center mt-12">
              <Link
                href="/departments"
                className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
              >
                View All Departments
              </Link>
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
                  Our healthcare professionals are ready to help you. Schedule
                  your appointment today.
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
