'use client';

import { Prescription, Patient, Doctor } from '../types';
import { Search, Pill, Calendar, Stethoscope } from 'lucide-react';

interface PrescriptionsTabProps {
  prescriptions: Prescription[];
  patients: Patient[];
  doctors: Doctor[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  getStatusColor: (status: string) => string;
}

export default function PrescriptionsTab({ 
  prescriptions, 
  patients, 
  doctors,
  searchTerm, 
  setSearchTerm,
  getStatusColor 
}: PrescriptionsTabProps) {
  
  const filteredPrescriptions = prescriptions.filter(p =>
    p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Prescriptions</h2>
          <p className="text-gray-600">Manage patient prescriptions</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search prescriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredPrescriptions.map((prescription) => (
          <div key={prescription.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{prescription.patientName}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(prescription.status)}`}>
                    {prescription.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Stethoscope className="w-4 h-4" />
                    {prescription.doctorName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {prescription.date}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-2 font-medium">Diagnosis: {prescription.diagnosis}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Medications</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {prescription.medications.map((med, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                    <Pill className="w-4 h-4 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">{med.name}</p>
                      <p className="text-sm text-gray-600">{med.dosage} - {med.frequency}</p>
                      <p className="text-xs text-gray-500">{med.duration} • {med.route}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {prescription.notes && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">Notes: {prescription.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
