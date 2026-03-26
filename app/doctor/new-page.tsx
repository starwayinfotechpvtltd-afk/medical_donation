'use client';

import { LightSidebar } from '@/components/LightSidebar';
import { LightStatsCard } from '@/components/LightStatsCard';
import { LightInfoCard } from '@/components/LightInfoCard';
import { Calendar, Users, FileText, Clock, Plus, Search } from 'lucide-react';
import { doctors } from '@/data/doctors';
import { mockAppointments } from '@/data/appointments';
import { useState } from 'react';

export default function DoctorDashboard() {
  const [searchPatient, setSearchPatient] = useState('');
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  const sidebarItems = [
    { label: 'Dashboard', href: '/doctor', icon: <Calendar className="w-5 h-5" /> },
    { label: 'My Patients', href: '/doctor/patients', icon: <Users className="w-5 h-5" /> },
    { label: 'Prescriptions', href: '/doctor/prescriptions', icon: <FileText className="w-5 h-5" />, badge: '5' },
    { label: 'Visit History', href: '/doctor/history', icon: <Clock className="w-5 h-5" /> }
  ];

  const doctorStats = {
    totalPatients: 24,
    todayAppointments: mockAppointments.filter(a => a.date.includes(new Date().toISOString().split('T')[0])).length,
    prescriptions: 5,
    completedVisits: 120
  };

  const todayAppointments = mockAppointments.filter(a => 
    a.date.includes(new Date().toISOString().split('T')[0])
  ).slice(0, 5);

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50">
      {/* Sidebar */}
      <LightSidebar 
        title="Doctor Portal" 
        items={sidebarItems} 
        userRole="Dr. Rajesh Kumar - Cardiology"
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Welcome, Dr. Rajesh Kumar</h1>
            <p className="text-slate-600">Manage your patients and prescriptions</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-6 mb-12">
            <LightStatsCard
              title="Total Patients"
              value={doctorStats.totalPatients}
              icon={<Users className="w-6 h-6" />}
              color="blue"
              trend={{ direction: 'up', percentage: 12 }}
            />
            <LightStatsCard
              title="Today's Appointments"
              value={doctorStats.todayAppointments}
              icon={<Calendar className="w-6 h-6" />}
              color="sky"
            />
            <LightStatsCard
              title="Active Prescriptions"
              value={doctorStats.prescriptions}
              icon={<FileText className="w-6 h-6" />}
              color="cyan"
            />
            <LightStatsCard
              title="Completed Visits"
              value={doctorStats.completedVisits}
              icon={<Clock className="w-6 h-6" />}
              color="purple"
              trend={{ direction: 'up', percentage: 8 }}
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-3 gap-8">
            {/* Today's Appointments */}
            <div className="col-span-2">
              <LightInfoCard
                title="Today's Appointments"
                color="blue"
                icon={<Calendar className="w-5 h-5" />}
                fullHeight
              >
                <div className="space-y-3">
                  {todayAppointments.length > 0 ? (
                    todayAppointments.map((apt) => (
                      <div key={apt.id} className="bg-white rounded-lg p-4 border-2 border-blue-100 hover:border-blue-300 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-bold text-slate-900">{apt.patientName}</p>
                            <p className="text-sm text-slate-600">{apt.department}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                            apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {apt.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mb-3">{apt.date} - {apt.time}</p>
                        <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm">
                          View Patient Details →
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-slate-500 py-8">No appointments today</p>
                  )}
                </div>
              </LightInfoCard>
            </div>

            {/* Quick Actions */}
            <div>
              <LightInfoCard
                title="Quick Actions"
                color="sky"
                icon={<Plus className="w-5 h-5" />}
                fullHeight
              >
                <div className="space-y-3">
                  <button
                    onClick={() => setShowPrescriptionModal(true)}
                    className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                  >
                    + Write Prescription
                  </button>
                  <button className="w-full bg-sky-100 text-sky-700 px-4 py-3 rounded-lg font-semibold hover:bg-sky-200 transition-colors">
                    + Add Medical Note
                  </button>
                  <button className="w-full bg-cyan-100 text-cyan-700 px-4 py-3 rounded-lg font-semibold hover:bg-cyan-200 transition-colors">
                    + Request Lab Test
                  </button>
                </div>
              </LightInfoCard>
            </div>
          </div>

          {/* Patient Search */}
          <div className="mt-8">
            <LightInfoCard
              title="Find Patient"
              color="cyan"
              icon={<Search className="w-5 h-5" />}
            >
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Search patient by name or ID..."
                  value={searchPatient}
                  onChange={(e) => setSearchPatient(e.target.value)}
                  className="flex-1 px-4 py-3 border-2 border-cyan-200 rounded-lg focus:border-cyan-500 outline-none"
                />
                <button className="bg-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-600 transition-colors">
                  Search
                </button>
              </div>
            </LightInfoCard>
          </div>
        </div>
      </main>

      {/* Prescription Modal */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl border-2 border-blue-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Write Prescription</h3>
            <div className="space-y-4 mb-6">
              <input type="text" placeholder="Patient Name" className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 outline-none" />
              <input type="text" placeholder="Medicine Name" className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 outline-none" />
              <input type="text" placeholder="Dosage" className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 outline-none" />
              <textarea placeholder="Instructions" rows={4} className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 outline-none resize-none" />
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowPrescriptionModal(false)}
                className="flex-1 px-4 py-3 border-2 border-blue-200 rounded-lg font-semibold text-blue-700 hover:bg-blue-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowPrescriptionModal(false)}
                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600"
              >
                Save Prescription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
