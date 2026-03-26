'use client';

import { useState } from 'react';
import { Search, User, FileText, TrendingUp } from 'lucide-react';

const patients = [
  { id: 'P001', name: 'John Sharma', age: 45, condition: 'Hypertension', lastVisit: '2024-03-20', status: 'Active' },
  { id: 'P002', name: 'Priya Patel', age: 32, condition: 'Thyroid Disorder', lastVisit: '2024-03-18', status: 'Active' },
  { id: 'P003', name: 'Amit Kumar', age: 58, condition: 'Diabetes Type 2', lastVisit: '2024-03-15', status: 'Follow-up' },
  { id: 'P004', name: 'Sneha Desai', age: 41, condition: 'High Cholesterol', lastVisit: '2024-03-10', status: 'Active' },
];

export default function PatientsListPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-sky-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Patients</h1>
          <p className="text-slate-600">Manage and review your patient list</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3 text-blue-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by patient name or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <p className="text-slate-600 text-sm mb-2">Total Patients</p>
            <p className="text-3xl font-bold text-slate-900">4</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <p className="text-slate-600 text-sm mb-2">Active Cases</p>
            <p className="text-3xl font-bold text-slate-900">3</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
            <p className="text-slate-600 text-sm mb-2">Follow-ups Due</p>
            <p className="text-3xl font-bold text-slate-900">1</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
            <p className="text-slate-600 text-sm mb-2">Consultations</p>
            <p className="text-3xl font-bold text-slate-900">12</p>
          </div>
        </div>

        {/* Patients Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-50 border-b border-blue-100">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Patient ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Age</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Condition</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Last Visit</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-b border-blue-50 hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{patient.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-900 flex items-center gap-2">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      {patient.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{patient.age}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{patient.condition}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{patient.lastVisit}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${patient.status === 'Follow-up' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button className="text-blue-500 hover:text-blue-700 font-semibold text-sm">View</button>
                      <button className="text-emerald-500 hover:text-emerald-700 font-semibold text-sm">Prescribe</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
