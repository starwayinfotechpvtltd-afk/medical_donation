"use client";

import { useState } from "react";
import Image from "next/image";
import { doctors, type Doctor } from "@/data/doctors";
import { Trash2, Plus } from "lucide-react";

export default function AdminDoctors() {
  const [doctorsList, setDoctorsList] = useState<Doctor[]>(doctors);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    qualification: "",
    experience: "",
    department: "",
    phone: "",
    bio: "",
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this doctor?")) {
      setDoctorsList(doctorsList.filter((d) => d.id !== id));
    }
  };

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.name &&
      formData.specialization &&
      formData.qualification &&
      formData.department
    ) {
      const newDoctor: Doctor = {
        id: `${Date.now()}`,
        name: formData.name,
        specialization: formData.specialization,
        qualification: formData.qualification,
        experience: parseInt(formData.experience) || 0,
        image: "https://images.unsplash.com/photo-1612349317150-e539c59dc62a?w=400&h=400&fit=crop",
        department: formData.department,
        phone: formData.phone,
        bio: formData.bio,
      };
      setDoctorsList([...doctorsList, newDoctor]);
      setFormData({
        name: "",
        specialization: "",
        qualification: "",
        experience: "",
        department: "",
        phone: "",
        bio: "",
      });
      setShowForm(false);
    }
  };

  return (
    <main className="bg-slate-900 min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">Manage Doctors</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-emerald-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Doctor
            </button>
          </div>

          {/* Add Doctor Form */}
          {showForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Add New Doctor</h2>
              <form onSubmit={handleAddDoctor} className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Doctor Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Specialization
                  </label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) =>
                      setFormData({ ...formData, specialization: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Qualification
                  </label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) =>
                      setFormData({ ...formData, qualification: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Experience (years)
                  </label>
                  <input
                    type="number"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  ></textarea>
                </div>
                <div className="md:col-span-2 flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-500 text-white py-2 rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
                  >
                    Add Doctor
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-slate-300 text-slate-700 py-2 rounded-lg font-semibold hover:bg-slate-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Doctors List */}
          <div className="grid md:grid-cols-2 gap-6">
            {doctorsList.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48 bg-slate-200">
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{doctor.name}</h3>
                  <p className="text-emerald-600 font-medium text-sm mb-3">
                    {doctor.specialization}
                  </p>

                  <div className="space-y-2 mb-6 pb-6 border-b border-slate-200 text-sm">
                    <p>
                      <span className="text-slate-600">Qualification:</span>{" "}
                      <span className="font-medium text-slate-900">{doctor.qualification}</span>
                    </p>
                    <p>
                      <span className="text-slate-600">Experience:</span>{" "}
                      <span className="font-medium text-slate-900">{doctor.experience} years</span>
                    </p>
                    <p>
                      <span className="text-slate-600">Department:</span>{" "}
                      <span className="font-medium text-slate-900">{doctor.department}</span>
                    </p>
                    <p>
                      <span className="text-slate-600">Phone:</span>{" "}
                      <span className="font-medium text-slate-900">{doctor.phone}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(doctor.id)}
                    className="w-full bg-red-100 text-red-700 py-2 rounded-lg font-semibold hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {doctorsList.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">No doctors found. Add one to get started!</p>
            </div>
          )}
        </div>
    </main>
  );
}