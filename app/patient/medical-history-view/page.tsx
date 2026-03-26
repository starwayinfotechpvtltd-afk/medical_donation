'use client';

import { Calendar, Stethoscope, AlertCircle, CheckCircle } from 'lucide-react';

const medicalHistory = [
  { id: 1, date: '2024-03-20', type: 'Consultation', doctor: 'Dr. Rajesh Kumar', notes: 'Regular check-up, blood pressure normal, continue current medication' },
  { id: 2, date: '2024-02-15', type: 'Treatment', doctor: 'Dr. Rajesh Kumar', notes: 'Started Aspirin for hypertension management, follow up in 2 weeks' },
  { id: 3, date: '2024-01-20', type: 'Diagnosis', doctor: 'Dr. Anjali Singh', notes: 'Diagnosed with mild thyroid dysfunction, prescribed medication' },
  { id: 4, date: '2023-12-10', type: 'Follow-up', doctor: 'Dr. Rajesh Kumar', notes: 'Patient improving well, continue current treatment plan' },
];

export default function MedicalHistoryViewPage() {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Consultation': return <Stethoscope className="w-5 h-5" />;
      case 'Treatment': return <AlertCircle className="w-5 h-5" />;
      case 'Diagnosis': return <AlertCircle className="w-5 h-5" />;
      case 'Follow-up': return <CheckCircle className="w-5 h-5" />;
      default: return <Calendar className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Consultation': return 'bg-blue-100 text-blue-700';
      case 'Treatment': return 'bg-purple-100 text-purple-700';
      case 'Diagnosis': return 'bg-red-100 text-red-700';
      case 'Follow-up': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-sky-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Medical History</h1>
          <p className="text-slate-600">Complete record of your medical visits and treatments</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <p className="text-slate-600 text-sm mb-2">Total Visits</p>
            <p className="text-3xl font-bold text-slate-900">{medicalHistory.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
            <p className="text-slate-600 text-sm mb-2">Consultations</p>
            <p className="text-3xl font-bold text-slate-900">2</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
            <p className="text-slate-600 text-sm mb-2">Diagnoses</p>
            <p className="text-3xl font-bold text-slate-900">1</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <p className="text-slate-600 text-sm mb-2">Follow-ups</p>
            <p className="text-3xl font-bold text-slate-900">1</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          {medicalHistory.map((record, idx) => (
            <div key={record.id} className="relative">
              {idx !== medicalHistory.length - 1 && (
                <div className="absolute left-6 top-12 w-1 h-8 bg-blue-200"></div>
              )}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex gap-4">
                  <div className={`p-3 rounded-lg ${getTypeColor(record.type)}`}>
                    {getTypeIcon(record.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{record.type}</h3>
                        <p className="text-slate-600 text-sm">Dr. {record.doctor.split(' ').pop()}</p>
                      </div>
                      <span className="text-slate-600 text-sm font-semibold">{record.date}</span>
                    </div>
                    <p className="text-slate-600">{record.notes}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
