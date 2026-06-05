import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Stethoscope, Bed, Clock, Phone, MapPin, Calendar } from "lucide-react";
import { departments as fallbackDepartments } from "@/data/departments";

const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

// Generate static params for static export (optional)
export async function generateStaticParams() {
  try {
    const res = await fetch(`${apiBase}/api/departments`, { next: { revalidate: 60 } });
    if (!res.ok) return fallbackDepartments.map((dept) => ({ id: String(dept.id) }));
    
    const body = await res.json();
    const departments = Array.isArray(body?.data) ? body.data : fallbackDepartments;
    
    return departments.map((dept: any) => ({
      id: String(dept.id),
    }));
  } catch {
    return fallbackDepartments.map((dept) => ({ id: String(dept.id) }));
  }
}

async function getDepartment(id: string) {
  try {
    const res = await fetch(`${apiBase}/api/departments/${id}`, {
      next: { revalidate: 60 }
    });
    
    if (!res.ok) {
      const fallbackDept = fallbackDepartments.find((d) => String(d.id) === id);
      if (fallbackDept) return fallbackDept;
      return null;
    }

    const body = await res.json();
    const dept = body?.data || body;
    
    if (!dept || Object.keys(dept).length === 0) {
      const fallbackDept = fallbackDepartments.find((d) => String(d.id) === id);
      return fallbackDept || null;
    }

    return {
      ...dept,
      id: String(dept.id),
      image_url: dept.image_url?.startsWith("http")
        ? dept.image_url
        : dept.image_url
          ? `${apiBase}${dept.image_url}`
          : "/images/home/hero_image_2.webp",
    };
  } catch (error) {
    const fallbackDept = fallbackDepartments.find((d) => String(d.id) === id);
    return fallbackDept || null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const department = await getDepartment(id);
  
  if (!department) {
    return {
      title: "Department Not Found",
      description: "The requested department could not be found.",
    };
  }

  return {
    title: `${department.name} - Mefigure Siddhi Vadanta Foundation`,
    description: department.description || `Learn about our ${department.name} department and specialized medical services.`,
  };
}

export default async function DepartmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const department = await getDepartment(id);

  if (!department) {
    notFound();
  }

  const services = (department.services ?? [])
    .map((service: any) =>
      typeof service === "string" ? service : service.service_name
    )
    .filter(Boolean);

  const doctorCount = typeof department.doctors === "number" ? department.doctors : 0;

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-emerald-600 to-emerald-800 py-20">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
              <div className="text-white flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {department.name}
                </h1>
                <p className="text-lg text-emerald-100 max-w-2xl">
                  {department.description || "Providing excellence in healthcare with advanced medical facilities and expert specialists."}
                </p>
              </div>
              <div className="flex gap-4">
                <a
                  href="#appointment"
                  className="inline-flex items-center gap-2 bg-white text-emerald-700 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
                >
                  <Calendar size={20} />
                  Book Appointment
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  <Phone size={20} />
                  Contact
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Department Stats Bar */}
        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-wrap justify-around gap-6">
              <div className="flex items-center gap-3">
                <Stethoscope className="text-emerald-600" size={24} />
                <div>
                  <div className="font-bold text-2xl text-slate-900">{doctorCount}+</div>
                  <div className="text-sm text-slate-600">Expert Doctors</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Bed className="text-emerald-600" size={24} />
                <div>
                  <div className="font-bold text-2xl text-slate-900">{department.beds}+</div>
                  <div className="text-sm text-slate-600">Specialized Beds</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="text-emerald-600" size={24} />
                <div>
                  <div className="font-bold text-2xl text-slate-900">24/7</div>
                  <div className="text-sm text-slate-600">Emergency Service</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">About the Department</h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 leading-relaxed">
                    {department.description ||
                      `The ${department.name} department at Mefigure Siddhi Vadanta Foundation is dedicated to providing comprehensive healthcare services. Our team of experienced specialists uses state-of-the-art technology to ensure the best possible outcomes for our patients.`}
                  </p>
                </div>
              </section>

              {/* Services Section */}
              {services.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Services</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {services.map((service: string, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <span className="text-slate-700">{service}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Facilities */}
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Department Facilities</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    "Modern Operation Theaters",
                    "Advanced Diagnostic Equipment",
                    "ICU with Latest Monitors",
                    "Private Recovery Rooms",
                    "24/7 Emergency Care",
                    "Pharmacy Services",
                  ].map((facility, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 text-emerald-600">✓</div>
                      <span className="text-slate-700">{facility}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div id="contact" className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Department Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-emerald-600" />
                    <span className="text-slate-600">+91 123 456 7890</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-emerald-600" />
                    <span className="text-slate-600">Mefigure Siddhi Vadanta Foundation, [Your Address]</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-emerald-600" />
                    <span className="text-slate-600">Open 24/7</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-emerald-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-2 bg-white rounded-lg hover:bg-emerald-100 transition-colors">
                    View Doctor List
                  </button>
                  <button className="w-full text-left px-4 py-2 bg-white rounded-lg hover:bg-emerald-100 transition-colors">
                    Check Available Beds
                  </button>
                  <button className="w-full text-left px-4 py-2 bg-white rounded-lg hover:bg-emerald-100 transition-colors">
                    Download Brochure
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Section */}
        <section id="appointment" className="bg-slate-50 py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Schedule an Appointment
            </h2>
            <p className="text-slate-600 mb-8">
              Book your consultation with our specialists at the {department.name} department
            </p>
            <a
              href="/appointment"
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              <Calendar size={20} />
              Book Appointment
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}