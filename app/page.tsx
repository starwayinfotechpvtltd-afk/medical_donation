import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { DoctorCard } from "@/components/DoctorCard";
import { DepartmentCard } from "@/components/DepartmentCard";
import { doctors } from "@/data/doctors";
import { departments } from "@/data/departments";
import { hospitalInfo } from "@/data/hospital";
import { Stethoscope, Heart, Users, Clock, Gift, Heart as HeartIcon } from "lucide-react";

export default function Home() {
  const featuredDoctors = doctors.slice(0, 3);
  const featuredDepartments = departments.slice(0, 6);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-emerald-50 to-blue-50 py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 text-balance leading-tight">
                  Your Health, Our Priority
                </h1>
                <p className="text-xl text-slate-700 mb-8 leading-relaxed text-balance">
                  Welcome to Advanced Medical Care Hospital. We provide comprehensive healthcare
                  services with expert physicians and state-of-the-art medical technology.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/appointment"
                    className="bg-emerald-500 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-emerald-600 transition-colors text-center"
                  >
                    Book Appointment
                  </Link>
                  <Link
                    href="/about"
                    className="border-2 border-emerald-500 text-emerald-500 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-emerald-50 transition-colors text-center"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="relative h-96 hidden md:block">
                <Image
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=500&fit=crop"
                  alt="Hospital"
                  fill
                  className="object-cover rounded-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Why Choose Us"
              description="Excellence in healthcare services with a commitment to patient care"
              centered
            />

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  icon: Stethoscope,
                  title: "Expert Doctors",
                  description: "Highly qualified and experienced medical professionals",
                },
                {
                  icon: Heart,
                  title: "Advanced Technology",
                  description: "State-of-the-art medical equipment and diagnostic tools",
                },
                {
                  icon: Clock,
                  title: "24/7 Emergency",
                  description: "Round-the-clock emergency and critical care services",
                },
                {
                  icon: Users,
                  title: "Patient Care",
                  description: "Compassionate and personalized patient care approach",
                },
              ].map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={idx} className="text-center">
                    <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-slate-600 text-sm">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Departments Section */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Our Departments"
              subtitle="Medical Specializations"
              description="Comprehensive healthcare services across multiple specializations"
              centered
            />

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {featuredDepartments.map((department) => (
                <DepartmentCard key={department.id} department={department} />
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/departments"
                className="inline-block bg-emerald-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
              >
                View All Departments
              </Link>
            </div>
          </div>
        </section>

        {/* Doctors Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Our Expert Doctors"
              subtitle="Medical Professionals"
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

        {/* Stats Section */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { number: "50+", label: "Expert Doctors" },
                { number: "10+", label: "Departments" },
                { number: "500+", label: "Beds" },
                { number: "24/7", label: "Emergency Care" },
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <p className="text-5xl font-bold text-emerald-400 mb-2">{stat.number}</p>
                  <p className="text-slate-300 text-lg">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
