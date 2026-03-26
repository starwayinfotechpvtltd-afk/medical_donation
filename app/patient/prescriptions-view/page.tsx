'use client';

import { Download, Pill, Calendar } from 'lucide-react';

const prescriptions = [
  { id: 1, doctor: 'Dr. Rajesh Kumar', date: '2024-03-20', medicines: ['Aspirin 500mg', 'Metformin 1000mg'], duration: '30 days', status: 'Active' },
  { id: 2, doctor: 'Dr. Anjali Singh', date: '2024-02-15', medicines: ['Thyroid Medicine 50mcg'], duration: 'Continuous', status: 'Active' },
  { id: 3, doctor: 'Dr. Rajesh Kumar', date: '2024-01-20', medicines: ['Vitamin D Supplement'], duration: 'Completed', status: 'Completed' },
];

export default function PrescriptionsViewPage() {
  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-sky-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Prescriptions</h1>
          <p className="text-slate-600">View and download your current prescriptions</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <p className="text-slate-600 text-sm mb-2">Active Prescriptions</p>
            <p className="text-3xl font-bold text-slate-900">2</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <p className="text-slate-600 text-sm mb-2">Total Medicines</p>
            <p className="text-3xl font-bold text-slate-900">4</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
            <p className="text-slate-600 text-sm mb-2">Refills Available</p>
            <p className="text-3xl font-bold text-slate-900">1</p>
          </div>
        </div>

        {/* Prescriptions */}
        <div className="space-y-6">
          {prescriptions.map((prescription) => (
            <div key={prescription.id} className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-blue-100">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Prescription #{prescription.id}</h3>
                  <p className="text-slate-600 mt-1">Prescribed by: {prescription.doctor}</p>
                  <p className="text-slate-600 text-sm">Date: {prescription.date}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-4 py-2 rounded-lg font-semibold text-sm ${prescription.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                    {prescription.status}
                  </span>
                  <button className="block mt-3 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors font-semibold text-sm flex items-center gap-2 ml-auto">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-blue-500" />
                  Medicines
                </h4>
                <div className="space-y-3">
                  {prescription.medicines.map((medicine, idx) => (
                    <div key={idx} className="bg-blue-50 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{medicine}</p>
                        <p className="text-slate-600 text-sm">Duration: {prescription.duration}</p>
                      </div>
                      <Calendar className="w-5 h-5 text-blue-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
