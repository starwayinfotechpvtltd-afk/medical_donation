"use client";

import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DoctorCard, type PublicDoctor } from "@/components/DoctorCard";
import { api } from "@/lib/api-client";
import { HeartHandshake, RefreshCw, Search } from "lucide-react";
import PageHero from "@/components/PageHero";

type DoctorApiRow = {
  id: number;
  first_name?: string | null;
  last_name?: string | null;
  specialization?: string | null;
  qualification?: string | null;
  years_of_experience?: number | null;
  image_url?: string | null;
  bio?: string | null;
  phone?: string | null;
  departments?: string | Array<{ id: number; name: string; is_primary?: number }> | null;
};

const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

const getImageUrl = (url?: string | null) => {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("/images/") || url.startsWith("/placeholder")) return url;
  return `${apiOrigin}${url}`;
};

const getDepartmentNames = (departments: DoctorApiRow["departments"]) => {
  if (!departments) return [];
  if (Array.isArray(departments)) return departments.map((dept) => dept.name).filter(Boolean);
  return departments.split(",").map((dept) => dept.trim()).filter(Boolean);
};

const normalizeDoctor = (doctor: DoctorApiRow): PublicDoctor => {
  const departmentNames = getDepartmentNames(doctor.departments);

  return {
    id: doctor.id,
    name: `Dr. ${[doctor.first_name, doctor.last_name].filter(Boolean).join(" ") || "Doctor"}`,
    specialization: doctor.specialization || "General Medicine",
    qualification: doctor.qualification || "Qualification not specified",
    experience: doctor.years_of_experience ?? null,
    image: getImageUrl(doctor.image_url),
    department: departmentNames.join(", ") || "General",
    phone: doctor.phone ?? null,
    bio: doctor.bio ?? null,
  };
};

export default function Doctors() {
  const [doctors, setDoctors] = useState<PublicDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  const loadDoctors = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get<DoctorApiRow[]>("/doctors");
      setDoctors((response.data ?? []).map(normalizeDoctor));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load doctors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const filteredDoctors = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const matchesSearch =
        !search ||
        doctor.name.toLowerCase().includes(search) ||
        doctor.specialization.toLowerCase().includes(search) ||
        doctor.qualification.toLowerCase().includes(search) ||
        doctor.department.toLowerCase().includes(search);

      const matchesDepartment =
        selectedDepartment === "All" ||
        doctor.department
          .split(",")
          .map((dept) => dept.trim())
          .includes(selectedDepartment);

      return matchesSearch && matchesDepartment;
    });
  }, [doctors, searchTerm, selectedDepartment]);

  const departments = useMemo(
    () => [
      "All",
      ...new Set(
        doctors.flatMap((doctor) =>
          doctor.department.split(",").map((department) => department.trim()).filter(Boolean)
        )
      ),
    ],
    [doctors]
  );

  return (
    <>
      <Navbar />
      <main>
        <PageHero
          badge="Medical Experts"
          icon={HeartHandshake}
          title="Trusted doctors for every healthcare need."
          description="Connect with highly qualified specialists across multiple medical disciplines, committed to delivering personalized and patient-centered care."
          breadcrumb={[
            {
              label: "Home",
              href: "/",
            },
            {
              label: "Doctors",
            },
          ]}
        />

        {/* Filters Section */}
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {error ? (
              <div className="mb-6 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
                <span>{error}</span>
                <button
                  type="button"
                  onClick={loadDoctors}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 font-semibold text-red-700 ring-1 ring-red-200 transition hover:bg-red-100"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry
                </button>
              </div>
            ) : null}

            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search doctors by name or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Department Filter */}
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-3">Filter by Department:</p>
              <div className="flex flex-wrap gap-2">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDepartment(dept)}
                    className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${selectedDepartment === dept
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Doctors Grid */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <>
                <p className="text-center text-slate-600 mb-8">Loading doctors...</p>
                <div className="grid md:grid-cols-3 gap-8">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="overflow-hidden rounded-2xl bg-white shadow-md">
                      <div className="h-56 animate-pulse bg-slate-200" />
                      <div className="space-y-3 p-6">
                        <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200" />
                        <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
                        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                        <div className="h-10 w-full animate-pulse rounded bg-slate-100" />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : filteredDoctors.length > 0 ? (
              <>
                <p className="text-slate-600 mb-8 text-center">
                  Showing {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? "s" : ""}
                </p>
                <div className="grid md:grid-cols-3 gap-8">
                  {filteredDoctors.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} showContact />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-slate-600 mb-4">
                  {doctors.length ? "No doctors found matching your criteria." : "No doctors are available right now."}
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedDepartment("All");
                  }}
                  className="text-emerald-500 font-semibold hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
