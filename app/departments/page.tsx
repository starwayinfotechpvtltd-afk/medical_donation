import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { DepartmentCard } from "@/components/DepartmentCard";
import { departments } from "@/data/departments";

export const metadata = {
  title: "Our Departments - Advanced Medical Care Hospital",
  description: "Explore our various medical departments and specializations.",
};

export default function Departments() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-emerald-50 to-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 text-balance">
              Our Departments
            </h1>
            <p className="text-xl text-slate-700 max-w-2xl">
              Comprehensive healthcare services across multiple medical specializations
            </p>
          </div>
        </section>

        {/* Departments Grid */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="All Departments"
              description="Choose from our specialized medical departments"
              centered
            />

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {departments.map((department) => (
                <DepartmentCard key={department.id} department={department} showDetails />
              ))}
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Why Our Departments Excel"
              description="We combine expertise, technology, and compassion"
              centered
            />

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Expert Physicians",
                  description:
                    "Our departments are led by board-certified specialists with years of experience in their fields.",
                },
                {
                  title: "Advanced Equipment",
                  description:
                    "We invest in the latest medical technology to provide accurate diagnostics and treatment.",
                },
                {
                  title: "Comprehensive Care",
                  description:
                    "From prevention to treatment, we provide holistic care for all patient needs.",
                },
                {
                  title: "24/7 Availability",
                  description:
                    "Our departments operate round-the-clock to handle emergencies and urgent cases.",
                },
                {
                  title: "Patient Comfort",
                  description:
                    "We maintain modern, clean facilities with comfortable recovery areas.",
                },
                {
                  title: "Insurance Support",
                  description:
                    "We partner with major insurance providers to make healthcare accessible.",
                },
              ].map((service, idx) => (
                <div key={idx} className="p-6 bg-slate-50 rounded-lg">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">{service.title}</h3>
                  <p className="text-slate-600">{service.description}</p>
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
