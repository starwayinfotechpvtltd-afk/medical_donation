'use client';

import { useState } from 'react';
import { mockPrescriptions } from '@/data/prescriptions';
import { Pill, Download, ChevronDown, ChevronUp } from 'lucide-react';

export default function PrescriptionsPage() {
  const patientId = 'P001';
  const prescriptions = mockPrescriptions.filter(p => p.patientId === patientId);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDownload = (id: string) => {
    // Simulate PDF download
    alert(`Downloading prescription ${id}...`);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Pill className="w-8 h-8 text-emerald-600" />
          My Prescriptions
        </h1>
        <p className="text-gray-600 mt-2">View and download your medication prescriptions</p>
      </div>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {prescriptions.length > 0 ? (
          prescriptions.map((prescription) => (
            <div key={prescription.id} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Header */}
              <button
                onClick={() => toggleExpand(prescription.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{prescription.doctorName}</h3>
                    <span className="text-sm bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                      {prescription.doctorSpecialization}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Issued: {prescription.dateIssued} • Valid until: {prescription.validUntil}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {expandedId === prescription.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Details */}
              {expandedId === prescription.id && (
                <div className="border-t border-gray-200 bg-gray-50">
                  <div className="p-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Medications:</h4>
                    <div className="space-y-4 mb-6">
                      {prescription.medicines.map((medicine) => (
                        <div key={medicine.name} className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-semibold text-gray-900">{medicine.name}</h5>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{medicine.dosage}</span>
                          </div>
                          <p className="text-sm text-gray-600">Frequency: {medicine.frequency}</p>
                          <p className="text-sm text-gray-600">Duration: {medicine.duration}</p>
                          {medicine.sideEffects && medicine.sideEffects.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <p className="text-xs font-semibold text-gray-700 mb-1">Possible side effects:</p>
                              <p className="text-xs text-gray-600">{medicine.sideEffects.join(', ')}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {prescription.notes && (
                      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm font-semibold text-amber-900 mb-1">Doctor's Notes:</p>
                        <p className="text-sm text-amber-800">{prescription.notes}</p>
                      </div>
                    )}

                    {prescription.followUpDate && (
                      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-semibold text-blue-900">Follow-up Appointment:</p>
                        <p className="text-sm text-blue-800">{prescription.followUpDate}</p>
                      </div>
                    )}

                    <button
                      onClick={() => handleDownload(prescription.id)}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition"
                    >
                      <Download className="w-4 h-4" />
                      Download Prescription PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Pill className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No prescriptions available</p>
          </div>
        )}
      </div>
    </div>
  );
}
