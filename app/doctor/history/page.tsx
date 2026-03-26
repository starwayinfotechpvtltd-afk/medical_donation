'use client';

import { doctorPatients } from '@/data/doctorProfiles';
import { Calendar, User, FileText } from 'lucide-react';

export default function DoctorHistoryPage() {
  const visits = [
    { id: 1, patient: doctorPatients[0].name, date: '2024-03-06', time: '10:30 AM', diagnosis: 'Heart palpitations', notes: 'Prescribed cardiac medication' },
    { id: 2, patient: doctorPatients[1].name, date: '2024-03-05', time: '2:15 PM', diagnosis: 'Knee pain', notes: 'Physical therapy recommended' },
    { id: 3, patient: doctorPatients[2].name, date: '2024-03-04', time: '11:00 AM', diagnosis: 'Headaches', notes: 'MRI requested' },
    { id: 4, patient: doctorPatients[3].name, date: '2024-03-03', time: '3:45 PM', diagnosis: 'Fever and cough', notes: 'Antibiotics prescribed' },
    { id: 5, patient: doctorPatients[0].name, date: '2024-02-28', time: '9:30 AM', diagnosis: 'Follow-up', notes: 'Condition improving' }
  ];

  return (
    <main className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Visit History</h1>

        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="grid grid-cols-1 gap-4 p-6">
            {visits.map((visit) => (
              <div
                key={visit.id}
                className="bg-slate-700 rounded-lg p-6 border border-slate-600 hover:border-blue-500 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-5 h-5 text-blue-400" />
                      <h3 className="text-lg font-semibold text-white">{visit.patient}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {visit.date} at {visit.time}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-slate-400 text-sm mb-1 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Diagnosis
                    </p>
                    <p className="text-white font-medium">{visit.diagnosis}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Notes</p>
                    <p className="text-slate-300">{visit.notes}</p>
                  </div>
                </div>

                <button className="mt-4 text-blue-400 hover:text-blue-300 font-medium text-sm">
                  View Full Details →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
