'use client';

import { patientAppointments, patientMedicines, patientLabReports, patientNextCheckups } from '@/data/patientAppointmentDetails';
import { Calendar, Pill, TestTube, Download, MapPin, Clock, Phone } from 'lucide-react';

export default function PatientDashboard() {
  const nextCheckup = patientNextCheckups[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Your Health Dashboard</h1>
        <p className="text-slate-600 mb-8">Welcome back, John Sharma</p>

        {/* Next Appointment Card */}
        {nextCheckup && (
          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-8 mb-8 border border-blue-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Next Appointment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="bg-white rounded-lg p-6 mb-4">
                  <p className="text-sm text-slate-600 mb-2">Doctor</p>
                  <p className="text-2xl font-bold text-slate-900">{nextCheckup.doctorName}</p>
                  <p className="text-slate-600 mt-1">{nextCheckup.specialization}</p>
                </div>
                <div className="bg-white rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-slate-600">Date & Time</p>
                      <p className="font-semibold text-slate-900">{nextCheckup.nextDate} at {nextCheckup.nextTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-slate-600">Location</p>
                      <p className="font-semibold text-slate-900">{nextCheckup.clinicAddress}</p>
                      <p className="text-sm text-slate-600">Room {nextCheckup.roomNumber}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-bold text-slate-900 mb-4">Doctor Info</h3>
                <div className="space-y-3 text-slate-700">
                  <p><span className="font-semibold">Specialization:</span> {nextCheckup.specialization}</p>
                  <p><span className="font-semibold">Contact:</span> {nextCheckup.clinicPhone}</p>
                  <p><span className="font-semibold">Room Number:</span> {nextCheckup.roomNumber}</p>
                  <button className="w-full mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium">
                    Reschedule Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Medicines */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100">
            <div className="p-6 border-b border-blue-100 flex items-center gap-2">
              <Pill className="w-6 h-6 text-cyan-500" />
              <h2 className="text-xl font-bold text-slate-900">Active Medicines</h2>
            </div>
            <div className="p-6 space-y-4">
              {patientMedicines.map((med) => (
                <div key={med.id} className="p-4 bg-cyan-50 rounded-lg border border-cyan-100">
                  <p className="font-semibold text-slate-900 text-sm">{med.medicineName}</p>
                  <p className="text-xs text-slate-600 mt-1">{med.dosage} • {med.frequency}</p>
                  <p className="text-xs text-slate-500 mt-2">{med.instructions}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Lab Tests */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100">
            <div className="p-6 border-b border-blue-100 flex items-center gap-2">
              <TestTube className="w-6 h-6 text-purple-500" />
              <h2 className="text-xl font-bold text-slate-900">Lab Reports</h2>
            </div>
            <div className="p-6 space-y-4">
              {patientLabReports.map((report) => (
                <div key={report.id} className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-slate-900 text-sm">{report.testName}</p>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      report.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{report.completedDate}</p>
                  <p className="text-xs text-slate-500 mt-2">By: {report.technicianName}</p>
                  <button className="w-full mt-3 flex items-center justify-center gap-2 bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-semibold hover:bg-blue-200 transition-colors">
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Health Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100">
            <div className="p-6 border-b border-blue-100">
              <h2 className="text-xl font-bold text-slate-900">Health Summary</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-sm text-slate-600 mb-2">Blood Type</p>
                <p className="text-2xl font-bold text-slate-900">O+</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-sm text-slate-600 mb-2">Height / Weight</p>
                <p className="text-lg font-semibold text-slate-900">175 cm / 75 kg</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-sm text-slate-600 mb-2">Allergies</p>
                <p className="text-slate-900">Penicillin, Sulfa drugs</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-sm text-slate-600 mb-2">Last Check-up</p>
                <p className="text-slate-900">2024-03-20</p>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment History */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-blue-100">
          <div className="p-8 border-b border-blue-100 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-slate-900">Appointment History</h2>
          </div>
          <div className="p-8">
            <div className="space-y-4">
              {patientAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div>
                    <p className="font-semibold text-slate-900">{apt.doctorName}</p>
                    <p className="text-sm text-slate-600">{apt.appointmentDate} at {apt.appointmentTime}</p>
                    <p className="text-sm text-slate-500">{apt.clinicAddress}</p>
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
      </div>
    </div>
  );
}
