"use client";

import { useState } from "react";
import Image from "next/image";
import { departments, type Department } from "@/data/departments";
import { Trash2, Plus, Edit2 } from "lucide-react";

export default function AdminDepartments() {
  const [departmentsList, setDepartmentsList] = useState<Department[]>(departments);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    beds: "",
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this department?")) {
      setDepartmentsList(departmentsList.filter((d) => d.id !== id));
    }
  };

  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.description && formData.beds) {
      const newDepartment: Department = {
        id: `${Date.now()}`,
        name: formData.name,
        description: formData.description,
        icon: "🏥",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop",
        doctors: 5,
        beds: parseInt(formData.beds),
        services: [],
      };
      setDepartmentsList([...departmentsList, newDepartment]);
      setFormData({
        name: "",
        description: "",
        beds: "",
      });
      setShowForm(false);
    }
  };

  return (
    <main className="bg-slate-900 min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">Manage Departments</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-emerald-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Department
            </button>
          </div>

          {/* Add Department Form */}
          {showForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Add New Department</h2>
              <form onSubmit={handleAddDepartment} className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Department Name
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
                    Number of Beds
                  </label>
                  <input
                    type="number"
                    value={formData.beds}
                    onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div></div>
                <div className="md:col-span-3">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  ></textarea>
                </div>
                <div className="md:col-span-3 flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-500 text-white py-2 rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
                  >
                    Add Department
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

          {/* Departments Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {departmentsList.map((dept) => (
              <div key={dept.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-40 bg-slate-200">
                  <Image
                    src={dept.image}
                    alt={dept.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{dept.icon}</span>
                    <h3 className="text-xl font-semibold text-slate-900">{dept.name}</h3>
                  </div>

                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{dept.description}</p>

                  <div className="bg-slate-50 p-4 rounded-lg mb-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600 text-sm">Doctors:</span>
                      <span className="font-semibold text-slate-900">{dept.doctors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 text-sm">Beds:</span>
                      <span className="font-semibold text-slate-900">{dept.beds}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-emerald-100 text-emerald-700 py-2 rounded-lg font-semibold hover:bg-emerald-200 transition-colors flex items-center justify-center gap-2">
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(dept.id)}
                      className="flex-1 bg-red-100 text-red-700 py-2 rounded-lg font-semibold hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {departmentsList.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">
                No departments found. Add one to get started!
              </p>
            </div>
          )}
        </div>
    </main>
  );
}
