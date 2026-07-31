'use client';

import { Patient } from '../types';
import { Search, Phone, Mail, MapPin, Calendar } from 'lucide-react';

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
          <h2 className="text-xl font-bold text-gray-900">Patient List</h2>
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
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                {patient.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                <p className="text-sm text-gray-500">ID: {patient.id}</p>
                <p className="text-xs text-gray-400">Registered: {patient.registrationDate}</p>
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
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 text-xs truncate">{patient.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Age / Gender</span>
                <span className="text-gray-900">{patient.age} / {patient.gender}</span>
              </div>
              {patient.lastVisit && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Visit</span>
                  <span className="text-gray-900">{patient.lastVisit}</span>
                </div>
              )}
              {patient.emergencyContact.name && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500">Emergency Contact</p>
                  <p className="text-sm text-gray-900">{patient.emergencyContact.name}</p>
                  <p className="text-xs text-gray-500">{patient.emergencyContact.relationship} • {patient.emergencyContact.phone}</p>
                </div>
              )}
              {patient.medicalHistory.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500">Medical History</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {patient.medicalHistory.map((history, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                        {history}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {patient.allergies.length > 0 && (
                <div className="mt-1">
                  <p className="text-xs text-gray-500">Allergies</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {patient.allergies.map((allergy, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}