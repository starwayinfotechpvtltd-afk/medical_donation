'use client';

import { useState } from 'react';
import { NurseSidebar } from '@/components/NurseSidebar';
import { Users, Clock, CheckCircle2, Plus } from 'lucide-react';
import Link from 'next/link';

export default function NurseDashboard() {
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showPatientLookup, setShowPatientLookup] = useState(false);
  const [searchPatientId, setSearchPatientId] = useState('');

  const nurseStats = {
    totalNurses: 24,
    presentToday: 22,
    shiftDuration: '8 hrs',
    patientsAttended: 156
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <NurseSidebar />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 bg-gradient-to-br from-pink-50 to-rose-50">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Nurse Dashboard</h1>
            <p className="text-slate-600">Manage attendance and patient care</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
              <p className="text-slate-600 text-sm mb-2">Total Nurses</p>
              <p className="text-3xl font-bold text-slate-900">{nurseStats.totalNurses}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
              <p className="text-slate-600 text-sm mb-2">Present Today</p>
              <p className="text-3xl font-bold text-slate-900">{nurseStats.presentToday}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-cyan-500">
              <p className="text-slate-600 text-sm mb-2">Shift Duration</p>
              <p className="text-3xl font-bold text-slate-900">{nurseStats.shiftDuration}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-pink-500">
              <p className="text-slate-600 text-sm mb-2">Patients Attended</p>
              <p className="text-3xl font-bold text-slate-900">{nurseStats.patientsAttended}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/nurse/attendance" className="px-4 py-3 bg-pink-50 text-pink-700 rounded-lg font-medium hover:bg-pink-100 transition-colors">
                Mark Attendance
              </Link>
              <Link href="/nurse/patient-lookup" className="px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors">
                Patient Lookup
              </Link>
              <Link href="/nurse/staff-records" className="px-4 py-3 bg-cyan-50 text-cyan-700 rounded-lg font-medium hover:bg-cyan-100 transition-colors">
                Staff Records
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Today's Attendance</h3>
              <div className="space-y-3">
                {[
                  { name: 'Aisha Khan', position: 'Staff Nurse', time: '09:00 AM', status: 'Present' },
                  { name: 'Priya Sharma', position: 'Senior Nurse', time: '08:45 AM', status: 'Present' },
                  { name: 'Neha Patel', position: 'Staff Nurse', time: '10:15 AM', status: 'Late' },
                  { name: 'Kavya Desai', position: 'Staff Nurse', time: '09:30 AM', status: 'Present' },
                ].map((nurse, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors">
                    <div>
                      <p className="font-medium text-slate-900">{nurse.name}</p>
                      <p className="text-xs text-slate-600">{nurse.position} • {nurse.time}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      nurse.status === 'Present' ? 'bg-green-200 text-green-700' : 'bg-yellow-200 text-yellow-700'
                    }`}>
                      {nurse.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Department Status</h3>
              <div className="space-y-3">
                {[
                  { dept: 'General Ward', count: 8 },
                  { dept: 'ICU', count: 4 },
                  { dept: 'Emergency', count: 6 },
                  { dept: 'Pediatrics', count: 3 },
                  { dept: 'Maternity', count: 3 },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                    <p className="font-medium text-slate-900">{item.dept}</p>
                    <span className="px-3 py-1 bg-pink-200 text-pink-700 rounded-full text-sm font-semibold">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
