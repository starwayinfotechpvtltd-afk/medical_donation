'use client';

import { DoctorSidebar } from '@/components/DoctorSidebar';
import { Users, Calendar, FileText, Pill } from 'lucide-react';
import Link from 'next/link';

export default function DoctorDashboard() {
  const totalPatients = 24;
  const appointmentsToday = 5;
  const pendingPrescriptions = 8;
  const completedToday = 3;

  return (
    <div className="flex min-h-screen">
      <DoctorSidebar />
      <main className="flex-1 ml-64 p-8 bg-gradient-to-br from-blue-50 to-sky-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 mb-8">Doctor Dashboard</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm mb-1">Total Patients</p>
                  <p className="text-3xl font-bold text-slate-900">{totalPatients}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm mb-1">Today's Appointments</p>
                  <p className="text-3xl font-bold text-slate-900">{appointmentsToday}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm mb-1">Pending Prescriptions</p>
                  <p className="text-3xl font-bold text-slate-900">{pendingPrescriptions}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Pill className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-indigo-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm mb-1">Completed Today</p>
                  <p className="text-3xl font-bold text-slate-900">{completedToday}</p>
                </div>
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/doctor/write-prescription" className="px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors">
                Write Prescription
              </Link>
              <Link href="/doctor/patients-list" className="px-4 py-3 bg-green-50 text-green-700 rounded-lg font-medium hover:bg-green-100 transition-colors">
                View Patients
              </Link>
              <Link href="/doctor/patient-history" className="px-4 py-3 bg-purple-50 text-purple-700 rounded-lg font-medium hover:bg-purple-100 transition-colors">
                Patient History
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Recent Patients</h3>
            <div className="space-y-3">
              {[
                { name: 'Priya Patel', condition: 'Hypertension', lastVisit: '2024-03-24' },
                { name: 'Amit Kumar', condition: 'Diabetes Management', lastVisit: '2024-03-23' },
                { name: 'Sneha Desai', condition: 'Respiratory Issues', lastVisit: '2024-03-22' },
                { name: 'Rahul Singh', condition: 'Follow-up Check', lastVisit: '2024-03-21' },
                { name: 'Neha Sharma', condition: 'General Checkup', lastVisit: '2024-03-20' },
              ].map((patient, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <div>
                    <p className="font-medium text-slate-900">{patient.name}</p>
                    <p className="text-xs text-slate-600">{patient.condition}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-600">{patient.lastVisit}</p>
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">View</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
