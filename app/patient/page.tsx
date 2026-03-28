'use client';

import PatientSidebar from '@/components/PatientSidebar';
import { Pill, FileText, History, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

// Define types for better type safety
type Prescription = {
  id: string;
  doctorName: string;
  doctorSpecialization: string;
  dateIssued: string;
  medicines: { name: string }[];
};

type LabReport = {
  id: string;
  testName: string;
  category: string;
  dateOfTest: string;
  status: 'Normal' | 'Abnormal' | 'Critical';
};

type MedicalRecord = {
  id: string;
  visitDate: string;
  doctorName: string;
  department: string;
  diagnosis: string;
};

export default function PatientDashboard() {
  const userName = 'John Sharma';
  const activePrescriptions = 2;
  const labReports = 5;
  const appointments = 1;
  const medicalVisits = 8;

  // Sample data - you can replace this with actual data from your API
  const recentPrescriptions: Prescription[] = [
    {
      id: '1',
      doctorName: 'Dr. Sarah Johnson',
      doctorSpecialization: 'Cardiologist',
      dateIssued: '2024-02-15',
      medicines: [
        { name: 'Aspirin' },
        { name: 'Lisinopril' },
      ],
    },
    {
      id: '2',
      doctorName: 'Dr. Michael Chen',
      doctorSpecialization: 'General Physician',
      dateIssued: '2024-01-28',
      medicines: [
        { name: 'Amoxicillin' },
        { name: 'Ibuprofen' },
        { name: 'Cetirizine' },
      ],
    },
  ];

  const recentReports: LabReport[] = [
    {
      id: '1',
      testName: 'Complete Blood Count (CBC)',
      category: 'Hematology',
      dateOfTest: '2024-02-10',
      status: 'Normal',
    },
    {
      id: '2',
      testName: 'Lipid Profile',
      category: 'Biochemistry',
      dateOfTest: '2024-02-05',
      status: 'Abnormal',
    },
    {
      id: '3',
      testName: 'Thyroid Function Test',
      category: 'Endocrinology',
      dateOfTest: '2024-01-20',
      status: 'Normal',
    },
  ];

  const recentHistory: MedicalRecord[] = [
    {
      id: '1',
      visitDate: '2024-02-15',
      doctorName: 'Dr. Sarah Johnson',
      department: 'Cardiology',
      diagnosis: 'Hypertension - Stable',
    },
    {
      id: '2',
      visitDate: '2024-01-28',
      doctorName: 'Dr. Michael Chen',
      department: 'General Medicine',
      diagnosis: 'Upper Respiratory Infection',
    },
    {
      id: '3',
      visitDate: '2024-01-10',
      doctorName: 'Dr. Emily Rodriguez',
      department: 'Endocrinology',
      diagnosis: 'Hypothyroidism - Under control',
    },
  ];

  return (
    <div className="flex min-h-screen">
      <PatientSidebar />
      <main className="flex-1 ml-64 p-8 bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900">Welcome, {userName}!</h1>
            <p className="text-slate-600 mt-2">Your health information at a glance</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
                  <p className="text-slate-600 text-sm">Lab Reports</p>
                  <p className="text-3xl font-bold text-slate-900">{labReports}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">Medical Visits</p>
                  <p className="text-3xl font-bold text-slate-900">{medicalVisits}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <History className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">Upcoming Appointments</p>
                  <p className="text-3xl font-bold text-slate-900">{appointments}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Prescriptions */}
            <div className="bg-white rounded-xl shadow-sm">
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
                        {prescription.medicines.slice(0, 2).map((med, idx) => (
                          <span key={idx} className="inline-block bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded">
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
            <div className="bg-white rounded-xl shadow-sm">
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
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{report.testName}</p>
                          <p className="text-sm text-gray-600">{report.category}</p>
                          <p className="text-xs text-gray-500 mt-1">Tested: {report.dateOfTest}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
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
            <div className="bg-white rounded-xl shadow-sm lg:col-span-2">
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
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Doctor</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Diagnosis</th>
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
      </main>
    </div>
  );
}