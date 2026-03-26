'use client';

import PatientSidebar from '@/components/PatientSidebar';
import { Pill, FileText, History, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function PatientDashboard() {
  const userName = 'John Sharma';
  const activePrescriptions = 2;
  const labReports = 5;
  const appointments = 1;
  const medicalVisits = 8;

  return (
    <div className="flex min-h-screen">
      <PatientSidebar />
      <main className="flex-1 ml-64 p-8 bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900">Welcome, {userName}!</h1>
            <p className="text-slate-600 mt-2">Your health information at a glance</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-emerald-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">Active Prescriptions</p>
                  <p className="text-3xl font-bold text-slate-900">{activePrescriptions}</p>
                </div>
                <div className="bg-emerald-100 p-3 rounded-lg">
                  <Pill className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
              <p className="text-gray-600 text-sm">Lab Reports</p>
              <p className="text-2xl font-bold text-gray-900">{recentReports.length}</p>
            </div>
            <FileText className="w-10 h-10 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Visits</p>
              <p className="text-2xl font-bold text-gray-900">{recentHistory.length}</p>
            </div>
            <History className="w-10 h-10 text-purple-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Upcoming Checkup</p>
              <p className="text-2xl font-bold text-gray-900">Mar 15</p>
            </div>
            <Calendar className="w-10 h-10 text-orange-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Prescriptions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Pill className="w-5 h-5 text-emerald-600" />
              Recent Prescriptions
            </h2>
            <Link href="/patient/prescriptions" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {recentPrescriptions.length > 0 ? (
              recentPrescriptions.map((prescription) => (
                <div key={prescription.id} className="p-6 hover:bg-gray-50 transition">
                  <p className="font-semibold text-gray-900">{prescription.doctorName}</p>
                  <p className="text-sm text-gray-600">{prescription.doctorSpecialization}</p>
                  <p className="text-xs text-gray-500 mt-1">Issued: {prescription.dateIssued}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {prescription.medicines.slice(0, 2).map((med) => (
                      <span key={med.name} className="inline-block bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded">
                        {med.name}
                      </span>
                    ))}
                    {prescription.medicines.length > 2 && (
                      <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        +{prescription.medicines.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-gray-500 text-center">No prescriptions available</div>
            )}
          </div>
        </div>

        {/* Recent Lab Reports */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Recent Lab Reports
            </h2>
            <Link href="/patient/lab-reports" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {recentReports.length > 0 ? (
              recentReports.map((report) => (
                <div key={report.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{report.testName}</p>
                      <p className="text-sm text-gray-600">{report.category}</p>
                      <p className="text-xs text-gray-500 mt-1">Tested: {report.dateOfTest}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {report.status === 'Normal' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-orange-600" />
                      )}
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        report.status === 'Normal' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-gray-500 text-center">No lab reports available</div>
            )}
          </div>
        </div>

        {/* Recent Medical History */}
        <div className="bg-white rounded-lg shadow lg:col-span-2">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <History className="w-5 h-5 text-purple-600" />
              Recent Medical History
            </h2>
            <Link href="/patient/medical-history" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Diagnosis</th>
                </tr>
              </thead>
              <tbody>
                {recentHistory.length > 0 ? (
                  recentHistory.map((record) => (
                    <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-900">{record.visitDate}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{record.doctorName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{record.department}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{record.diagnosis}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      No medical history available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
