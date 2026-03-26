'use client';

import { Calendar, FileText, Pill, AlertCircle } from 'lucide-react';

const patientHistory = [
  { id: 1, date: '2024-03-20', type: 'Consultation', details: 'Regular check-up, blood pressure normal', doctor: 'Dr. Rajesh Kumar' },
  { id: 2, date: '2024-03-10', type: 'Prescription', details: 'Prescribed Aspirin for hypertension', doctor: 'Dr. Rajesh Kumar' },
  { id: 3, date: '2024-02-28', type: 'Lab Test', details: 'Blood test ordered, results normal', doctor: 'Dr. Rajesh Kumar' },
  { id: 4, date: '2024-02-15', type: 'Follow-up', details: 'Patient improving, continue medication', doctor: 'Dr. Rajesh Kumar' },
];

export default function PatientHistoryPage() {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Consultation': return 'bg-blue-100 text-blue-700';
      case 'Prescription': return 'bg-purple-100 text-purple-700';
      case 'Lab Test': return 'bg-green-100 text-green-700';
      case 'Follow-up': return 'bg-orange-100 text-orange-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Consultation': return <AlertCircle className="w-4 h-4" />;
      case 'Prescription': return <Pill className="w-4 h-4" />;
      case 'Lab Test': return <FileText className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-sky-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Patient Medical History</h1>
          <p className="text-slate-600">View complete patient consultation and treatment history</p>
        </div>

        <div className="space-y-4">
          {patientHistory.map((record) => (
            <div key={record.id} className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${getTypeColor(record.type)}`}>
                  {getTypeIcon(record.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{record.type}</h3>
                      <p className="text-slate-600 text-sm">{record.doctor}</p>
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(record.type)}`}>
                      {record.date}
                    </span>
                  </div>
                  <p className="text-slate-600">{record.details}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
