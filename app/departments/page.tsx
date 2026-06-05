// app\departments\page.tsx
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { DepartmentCard } from "@/components/DepartmentCard";
import { departments } from "@/data/departments";
import PageHero from "@/components/PageHero";
import { HeartHandshake } from "lucide-react";

const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

export const metadata = {
  title: "Our Departments - Explore Medical Specializations at Mefigure Siddhi Vadanta Foundation",
  description: "Explore our various medical departments and specializations.",
};

async function getDepartments() {
  try {
    const res = await fetch(`${apiBase}/api/departments`, { next: { revalidate: 60 } });
    if (!res.ok) return departments;

    const body = await res.json();
    const rows = Array.isArray(body?.data) ? body.data : [];

    if (rows.length === 0) return departments;

    return rows.map((dept: any) => ({
      ...dept,
      id: String(dept.id),
      image_url: dept.image_url?.startsWith("http")
        ? dept.image_url
        : dept.image_url
          ? `${apiBase}${dept.image_url}`
          : "",
    }));
  } catch {
    return departments;
  }
}

export default async function Departments() {
  const departmentRows = await getDepartments();

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <PageHero
          badge="Our Departments"
          icon={HeartHandshake}
          title="Expert care for every stage of life."
          description="From preventive care and diagnostics to advanced treatments and specialized services, our departments are dedicated to providing compassionate, patient-centered healthcare."
          breadcrumb={[
            {
              label: "Home",
              href: "/",
            },
            {
              label: "Departments",
            },
          ]}
        />
        {/* Departments Grid */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="All Departments"
              description="Choose from our specialized medical departments"
              centered
            />

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {departmentRows.map((department) => (
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
