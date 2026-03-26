'use client';

import { useState } from 'react';
import { LightSidebar } from '@/components/LightSidebar';
import { LightStatsCard } from '@/components/LightStatsCard';
import { LightInfoCard } from '@/components/LightInfoCard';
import { Heart, Calendar, Pill, Beaker, Download, MapPin, Clock, Phone } from 'lucide-react';
import { mockAppointments } from '@/data/appointments';
import { labReports } from '@/data/labReports';
import { prescriptions } from '@/data/prescriptions';

export default function PatientDashboard() {
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string>('');

  const sidebarItems = [
    { label: 'Dashboard', href: '/patient', icon: <Heart className="w-5 h-5" /> },
    { label: 'Prescriptions', href: '/patient/prescriptions', icon: <Pill className="w-5 h-5" />, badge: prescriptions.length },
    { label: 'Lab Reports', href: '/patient/lab-reports', icon: <Beaker className="w-5 h-5" />, badge: labReports.length },
    { label: 'Medical History', href: '/patient/medical-history', icon: <Calendar className="w-5 h-5" /> },
    { label: 'Appointments', href: '/patient/appointments', icon: <Calendar className="w-5 h-5" /> }
  ];

  // Get next appointment
  const nextAppointment = mockAppointments.find(a => new Date(a.date) >= new Date());
  
  // Get recent lab reports
  const recentReports = labReports.slice(0, 3);

  // Get active prescriptions
  const activePrescriptions = prescriptions.slice(0, 3);

  const patientStats = {
    nextCheckup: nextAppointment ? 'Scheduled' : 'None',
    activeMedicines: activePrescriptions.length,
    completedTests: labReports.filter(r => r.status === 'completed').length,
    pendingTests: labReports.filter(r => r.status === 'pending').length
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50">
      {/* Sidebar */}
      <LightSidebar
        title="Patient Portal"
        items={sidebarItems}
        userRole="John Sharma"
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Welcome, John</h1>
            <p className="text-slate-600">Your complete health information dashboard</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-6 mb-12">
            <LightStatsCard
              title="Next Checkup"
              value={nextAppointment ? 'Booked' : 'None'}
              icon={<Calendar className="w-6 h-6" />}
              color="blue"
            />
            <LightStatsCard
              title="Active Medicines"
              value={patientStats.activeMedicines}
              icon={<Pill className="w-6 h-6" />}
              color="sky"
            />
            <LightStatsCard
              title="Completed Tests"
              value={patientStats.completedTests}
              icon={<Beaker className="w-6 h-6" />}
              color="cyan"
            />
            <LightStatsCard
              title="Pending Tests"
              value={patientStats.pendingTests}
              icon={<Beaker className="w-6 h-6" />}
              color="purple"
            />
          </div>

          {/* Next Appointment Section */}
          {nextAppointment && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Next Appointment</h2>
              <div className="bg-white rounded-2xl border-2 border-blue-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="grid grid-cols-2 gap-8">
                  {/* Doctor Info */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-600 mb-4">CONSULTING DOCTOR</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="font-bold text-slate-900 text-lg">Dr. Rajesh Kumar</p>
                        <p className="text-slate-600">Cardiology Specialist</p>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <Phone className="w-4 h-4" />
                        <span>+91-9876543210</span>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <p className="text-xs text-blue-700 mb-1">License</p>
                        <p className="font-semibold text-blue-900">REG-2015-0012</p>
                      </div>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-600 mb-4">APPOINTMENT DETAILS</h3>
                    <div className="space-y-4">
                      <div className="bg-blue-100 rounded-lg p-4 border-2 border-blue-300">
                        <p className="text-xs text-blue-700 mb-1">Date & Time</p>
                        <p className="text-xl font-bold text-blue-900">{nextAppointment.date} • {nextAppointment.time}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-slate-600 mt-1" />
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Location</p>
                          <p className="font-semibold text-slate-900">Heart Care Clinic, 3rd Floor</p>
                          <p className="text-sm text-slate-600">123 Medical Center Drive, City</p>
                        </div>
                      </div>
                      <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                        Reschedule Appointment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Three Column Layout */}
          <div className="grid grid-cols-3 gap-8 mb-8">
            {/* Active Medicines */}
            <div>
              <LightInfoCard
                title="Active Medicines"
                color="sky"
                icon={<Pill className="w-5 h-5" />}
                fullHeight
              >
                <div className="space-y-3">
                  {activePrescriptions.map((med) => (
                    <div key={med.id} className="bg-white rounded-lg p-3 border-2 border-sky-100">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{med.medicineName}</p>
                          <p className="text-xs text-slate-600">{med.dosage}</p>
                        </div>
                        <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">Active</span>
                      </div>
                      <p className="text-xs text-slate-500">{med.frequency}</p>
                    </div>
                  ))}
                  <button className="w-full text-sky-600 hover:text-sky-800 font-semibold text-sm mt-2">
                    View All →
                  </button>
                </div>
              </LightInfoCard>
            </div>

            {/* Recent Lab Reports */}
            <div>
              <LightInfoCard
                title="Recent Lab Reports"
                color="cyan"
                icon={<Beaker className="w-5 h-5" />}
                fullHeight
              >
                <div className="space-y-3">
                  {recentReports.map((report) => (
                    <div key={report.id} className="bg-white rounded-lg p-3 border-2 border-cyan-100 hover:border-cyan-300 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{report.testName}</p>
                          <p className="text-xs text-slate-600">{report.date}</p>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          report.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedReport(report.id);
                          setShowDownloadModal(true);
                        }}
                        className="text-cyan-600 hover:text-cyan-800 font-semibold text-xs flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </LightInfoCard>
            </div>

            {/* Health Summary */}
            <div>
              <LightInfoCard
                title="Health Summary"
                color="purple"
                icon={<Heart className="w-5 h-5" />}
                fullHeight
              >
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-3 border-2 border-purple-100">
                    <p className="text-xs text-slate-600 mb-1">Blood Type</p>
                    <p className="font-bold text-slate-900">O+</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border-2 border-purple-100">
                    <p className="text-xs text-slate-600 mb-1">Last Checkup</p>
                    <p className="font-bold text-slate-900">2 months ago</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border-2 border-purple-100">
                    <p className="text-xs text-slate-600 mb-1">Allergies</p>
                    <p className="font-bold text-slate-900">Penicillin</p>
                  </div>
                  <button className="w-full bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-semibold hover:bg-purple-200 transition-colors mt-2">
                    View Full Details
                  </button>
                </div>
              </LightInfoCard>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-6">
            <button className="bg-blue-500 text-white px-6 py-4 rounded-xl font-semibold hover:bg-blue-600 transition-colors shadow-md">
              Book New Appointment
            </button>
            <button className="bg-sky-500 text-white px-6 py-4 rounded-xl font-semibold hover:bg-sky-600 transition-colors shadow-md">
              Message Doctor
            </button>
            <button className="bg-cyan-500 text-white px-6 py-4 rounded-xl font-semibold hover:bg-cyan-600 transition-colors shadow-md">
              Download Health Records
            </button>
          </div>
        </div>
      </main>

      {/* Download Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border-2 border-cyan-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Download Report</h3>
            <div className="bg-cyan-50 border-2 border-cyan-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-700">
                {recentReports.find(r => r.id === selectedReport)?.testName}
              </p>
              <p className="text-xs text-slate-600 mt-2">
                {recentReports.find(r => r.id === selectedReport)?.date}
              </p>
            </div>
            <div className="space-y-3">
              <button className="w-full bg-cyan-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-cyan-600 transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Download as PDF
              </button>
              <button
                onClick={() => setShowDownloadModal(false)}
                className="w-full bg-slate-100 text-slate-700 px-4 py-3 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
