'use client';

import { useState } from 'react';
import { patientAppointments, patientMedicines, patientLabReports } from '@/data/patientAppointmentDetails';
import { Calendar, Pill, TestTube, Plus, Search } from 'lucide-react';

export default function DoctorDashboard() {
  const [searchPatient, setSearchPatient] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Doctor Dashboard</h1>
        <p className="text-slate-600 mb-8">Dr. Rajesh Kumar - Cardiology</p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center gap-4">
              <Calendar className="w-10 h-10 text-blue-500" />
              <div>
                <p className="text-sm text-slate-600">Today's Appointments</p>
                <p className="text-3xl font-bold text-slate-900">5</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center gap-4">
              <Pill className="w-10 h-10 text-cyan-500" />
              <div>
                <p className="text-sm text-slate-600">Active Prescriptions</p>
                <p className="text-3xl font-bold text-slate-900">12</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center gap-4">
              <TestTube className="w-10 h-10 text-purple-500" />
              <div>
                <p className="text-sm text-slate-600">Pending Tests</p>
                <p className="text-3xl font-bold text-slate-900">8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 mb-8">
          <div className="p-8 border-b border-blue-100">
            <h2 className="text-2xl font-bold text-slate-900">Patient Appointments</h2>
          </div>
          <div className="p-8">
            <div className="space-y-4">
              {patientAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
                  <div>
                    <p className="font-semibold text-slate-900">{apt.doctorName}</p>
                    <p className="text-sm text-slate-600">{apt.appointmentDate} at {apt.appointmentTime}</p>
                    <p className="text-sm text-slate-500 mt-1">{apt.clinicAddress}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    apt.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Prescriptions */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100">
          <div className="p-8 border-b border-blue-100 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-900">Prescribed Medicines</h2>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Prescription
            </button>
          </div>
          <div className="p-8">
            <div className="space-y-4">
              {patientMedicines.map((med) => (
                <div key={med.id} className="p-4 bg-cyan-50 rounded-lg border border-cyan-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-slate-900">{med.medicineName}</p>
                      <p className="text-sm text-slate-600">{med.dosage} - {med.frequency}</p>
                    </div>
                    <span className="text-xs font-semibold bg-white px-2 py-1 rounded">{med.duration}</span>
                  </div>
                  <p className="text-sm text-slate-700">{med.instructions}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
