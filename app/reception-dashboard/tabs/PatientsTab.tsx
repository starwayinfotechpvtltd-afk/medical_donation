'use client';

import { Patient } from '../types';
import { Search, Phone, Mail } from 'lucide-react';

interface PatientsTabProps {
  patients: Patient[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function PatientsTab({ patients, searchTerm, setSearchTerm }: PatientsTabProps) {
  
  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm)
  );

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Patients</h2>
          <p className="text-gray-600">View all registered patients</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <div key={patient.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <img src={patient.avatar} alt={patient.name} className="w-14 h-14 rounded-full" />
              <div>
                <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                <p className="text-sm text-gray-500">ID: {patient.id}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{patient.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 truncate">{patient.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Age / Gender</span>
                <span className="text-gray-900">{patient.age} / {patient.gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last Visit</span>
                <span className="text-gray-900">{patient.lastVisit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Appointments</span>
                <span className="text-gray-900">{patient.appointments}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}