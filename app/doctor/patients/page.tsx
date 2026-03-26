'use client';

import { useState } from 'react';
import { doctorPatients } from '@/data/doctorProfiles';
import { Search, Phone, Calendar } from 'lucide-react';

export default function DoctorPatientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<typeof doctorPatients[0] | null>(null);

  const filteredPatients = doctorPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">My Patients</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Patient List */}
          <div className="lg:col-span-2 bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-700">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="divide-y divide-slate-700">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`p-6 cursor-pointer transition-colors ${
                    selectedPatient?.id === patient.id
                      ? 'bg-blue-600'
                      : 'hover:bg-slate-700'
                  }`}
                >
                  <h3 className="font-semibold text-white mb-2">{patient.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-300">
                    <span>{patient.age} years old</span>
                    <span>•</span>
                    <span>{patient.gender}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Patient Details */}
          {selectedPatient ? (
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">{selectedPatient.name}</h2>

              <div className="space-y-4 mb-6">
                <div className="bg-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-1">Age</p>
                  <p className="text-lg font-semibold text-white">{selectedPatient.age} years</p>
                </div>

                <div className="bg-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-1">Gender</p>
                  <p className="text-lg font-semibold text-white">{selectedPatient.gender}</p>
                </div>

                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                    <Phone className="w-4 h-4" />
                    Phone
                  </div>
                  <p className="text-lg font-semibold text-white">{selectedPatient.phone}</p>
                </div>

                <div className="bg-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-1">Current Condition</p>
                  <p className="text-lg font-semibold text-white">{selectedPatient.condition}</p>
                </div>

                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                    <Calendar className="w-4 h-4" />
                    Last Visit
                  </div>
                  <p className="text-lg font-semibold text-white">{selectedPatient.lastVisit}</p>
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-2">
                View Full History
              </button>
              <button className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                Create Prescription
              </button>
            </div>
          ) : (
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 flex items-center justify-center h-96">
              <p className="text-slate-400 text-center">Select a patient to view details</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
