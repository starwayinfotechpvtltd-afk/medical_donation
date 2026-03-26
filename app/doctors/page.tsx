"use client";

import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { DoctorCard } from "@/components/DoctorCard";
import { doctors } from "@/data/doctors";
import { Search } from "lucide-react";

export default function Doctors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment =
        selectedDepartment === "All" || doctor.department === selectedDepartment;

      return matchesSearch && matchesDepartment;
    });
  }, [searchTerm, selectedDepartment]);

  const departments = ["All", ...new Set(doctors.map((d) => d.department))];

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-emerald-50 to-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 text-balance">
              Our Expert Doctors
            </h1>
            <p className="text-xl text-slate-700 max-w-2xl">
              Meet our team of highly qualified and experienced healthcare professionals
            </p>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
                      selectedDepartment === dept
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
            {filteredDoctors.length > 0 ? (
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
                <p className="text-xl text-slate-600 mb-4">No doctors found matching your criteria.</p>
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
