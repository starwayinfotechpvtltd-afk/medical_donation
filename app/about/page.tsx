import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { hospitalInfo } from "@/data/hospital";
import { Check } from "lucide-react";

export const metadata = {
  title: "About Us - Mefigure Siddhi Vadanta",
  description: "Learn about our hospital's history, mission, vision, and leadership team.",
};

export default function About() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-emerald-50 to-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 text-balance">
              About Our Hospital
            </h1>
            <p className="text-xl text-slate-700 max-w-2xl">
              Dedicated to providing compassionate, high-quality healthcare services
            </p>
          </div>
        </section>

        {/* Hospital Overview */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative h-96">
                <Image
                  src="https://images.unsplash.com/photo-1576091160575-2173d7676e96?w=600&h=500&fit=crop"
                  alt="Hospital Building"
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-slate-900 mb-6">Our Story</h2>
                <p className="text-slate-600 text-lg mb-4 leading-relaxed">
                  {hospitalInfo.history}
                </p>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Today, we continue to be a beacon of hope and healing, serving thousands of
                  patients annually with dedication, expertise, and compassion.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Our Mission & Vision"
              description="Guiding our commitment to healthcare excellence"
              centered
            />

            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div className="bg-white p-8 rounded-2xl shadow-md border-l-4 border-emerald-500">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h3>
                <p className="text-slate-700 text-lg leading-relaxed">{hospitalInfo.mission}</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-md border-l-4 border-blue-500">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h3>
                <p className="text-slate-700 text-lg leading-relaxed">{hospitalInfo.vision}</p>
              </div>
            </div>

            {/* Core Values */}
            <div className="bg-white p-8 rounded-2xl shadow-md">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Core Values</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Patient-Centered Care",
                    description:
                      "We prioritize the well-being and comfort of our patients in every decision.",
                  },
                  {
                    title: "Excellence",
                    description:
                      "We strive for the highest standards in medical practice and service delivery.",
                  },
                  {
                    title: "Integrity",
                    description:
                      "We operate with transparency, honesty, and ethical principles.",
                  },
                  {
                    title: "Compassion",
                    description: "We treat every patient with empathy and respect.",
                  },
                  {
                    title: "Innovation",
                    description:
                      "We embrace new technologies and methods to improve healthcare outcomes.",
                  },
                  {
                    title: "Teamwork",
                    description:
                      "We collaborate as a unified team to provide comprehensive care.",
                  },
                ].map((value, idx) => (
                  <div key={idx}>
                    <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <Check className="w-5 h-5 text-emerald-500" />
                      {value.title}
                    </h4>
                    <p className="text-slate-600 text-sm">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Director's Message */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-12 rounded-2xl">
              <div className="mb-6">
                <div className="relative w-24 h-24 mb-4">
                  <Image
                    src="https://images.unsplash.com/photo-1612349317150-e539c59dc62a?w=150&h=150&fit=crop"
                    alt="Director"
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Message from our Director
              </h3>
              <p className="text-slate-600 text-lg mb-4">{hospitalInfo.directorName}</p>
              <p className="text-slate-700 text-lg leading-relaxed">{hospitalInfo.directorMessage}</p>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="By The Numbers"
              centered
              subtitle="Our Impact"
            />
            
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { number: "18+", label: "Years of Service" },
                { number: "50,000+", label: "Patients Treated Annually" },
                { number: "10+", label: "Departments" },
                { number: "100+", label: "Hospital Staff" },
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <p className="text-5xl font-bold text-emerald-400 mb-2">{stat.number}</p>
                  <p className="text-slate-300">{stat.label}</p>
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
