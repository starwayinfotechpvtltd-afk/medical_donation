'use client';

import { mockMedicalHistory } from '@/data/medicalHistory';
import { History, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function MedicalHistoryPage() {
  const patientId = 'P001';
  const medicalHistory = mockMedicalHistory.filter(h => h.patientId === patientId);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <History className="w-8 h-8 text-purple-600" />
          Medical History
        </h1>
        <p className="text-gray-600 mt-2">Complete record of your visits and consultations</p>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {medicalHistory.length > 0 ? (
          medicalHistory.map((record, index) => (
            <div key={record.id} className="relative">
              {/* Timeline Line */}
              {index !== medicalHistory.length - 1 && (
                <div className="absolute left-8 top-20 w-0.5 h-12 bg-gray-300" />
              )}

              {/* Record Card */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <button
                  onClick={() => toggleExpand(record.id)}
                  className="w-full p-6 flex items-start gap-4 hover:bg-gray-50 transition"
                >
                  {/* Timeline Circle */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center border-4 border-white shadow">
                      <History className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-left">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-500">{record.visitDate}</p>
                        <h3 className="text-lg font-semibold text-gray-900 mt-1">{record.visitType}</h3>
                      </div>
                      {expandedId === record.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400 mt-1" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 mt-1" />
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
                        {record.doctorName}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                        {record.department}
                      </span>
                    </div>
                  </div>
                </button>

                {/* Details */}
                {expandedId === record.id && (
                  <div className="border-t border-gray-200 bg-gray-50 p-6">
                    <div className="space-y-4">
                      {/* Symptoms */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Symptoms:</h4>
                        <p className="text-sm text-gray-700 bg-white p-3 rounded border border-gray-200">
                          {record.symptoms}
                        </p>
                      </div>

                      {/* Diagnosis */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Diagnosis:</h4>
                        <p className="text-sm text-gray-700 bg-white p-3 rounded border border-gray-200">
                          {record.diagnosis}
                        </p>
                      </div>

                      {/* Treatment */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Treatment/Recommendations:</h4>
                        <p className="text-sm text-gray-700 bg-white p-3 rounded border border-gray-200">
                          {record.treatment}
                        </p>
                      </div>

                      {/* Doctor Notes */}
                      {record.notes && (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                          <h4 className="text-sm font-semibold text-amber-900 mb-1">Doctor's Notes:</h4>
                          <p className="text-sm text-amber-800">{record.notes}</p>
                        </div>
                      )}

                      {/* Doctor Info */}
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-900">
                          <span className="font-semibold">Consulting Doctor:</span> {record.doctorName}
                        </p>
                        <p className="text-sm text-blue-900">
                          <span className="font-semibold">Department:</span> {record.department}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No medical history available</p>
          </div>
        )}
      </div>
    </div>
  );
}
