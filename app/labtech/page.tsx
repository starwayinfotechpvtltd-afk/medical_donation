'use client';

import { LabTechSidebar } from '@/components/LabTechSidebar';
import { FlaskConical, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function LabTechDashboard() {
  const totalTests = 12;
  const pendingTests = 4;
  const inProgressTests = 3;
  const completedTests = 5;

  return (
    <div className="flex min-h-screen">
      <LabTechSidebar />
      <main className="flex-1 ml-64 p-8 bg-gradient-to-br from-cyan-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 mb-8">Lab Technician Dashboard</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-cyan-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm mb-1">Total Tests</p>
                  <p className="text-3xl font-bold text-slate-900">{totalTests}</p>
                </div>
                <div className="bg-cyan-100 p-3 rounded-lg">
                  <FlaskConical className="w-6 h-6 text-cyan-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm mb-1">Pending Tests</p>
                  <p className="text-3xl font-bold text-slate-900">{pendingTests}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm mb-1">In Progress</p>
                  <p className="text-3xl font-bold text-slate-900">{inProgressTests}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm mb-1">Completed</p>
                  <p className="text-3xl font-bold text-slate-900">{completedTests}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/labtech/tests" className="px-4 py-3 bg-cyan-50 text-cyan-700 rounded-lg font-medium hover:bg-cyan-100 transition-colors">
                View All Tests
              </Link>
              <Link href="/labtech/upload-results" className="px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors">
                Upload Results
              </Link>
              <Link href="/labtech/completed-tests" className="px-4 py-3 bg-green-50 text-green-700 rounded-lg font-medium hover:bg-green-100 transition-colors">
                Completed Tests
              </Link>
            </div>
          </div>

          {/* Recent Tests */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Recent Tests</h3>
            <div className="space-y-3">
              {[
                { name: 'CBC - John Sharma', status: 'Pending', date: '2024-03-24' },
                { name: 'Lipid Profile - Priya Patel', status: 'In Progress', date: '2024-03-24' },
                { name: 'Thyroid - Amit Kumar', status: 'Pending', date: '2024-03-23' },
                { name: 'Glucose - Sneha Desai', status: 'Completed', date: '2024-03-23' },
                { name: 'Ultrasound - Rahul Singh', status: 'Completed', date: '2024-03-22' },
              ].map((test, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors">
                  <div>
                    <p className="font-medium text-slate-900">{test.name}</p>
                    <p className="text-xs text-slate-600">{test.date}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      test.status === 'Completed' ? 'bg-green-200 text-green-700' :
                      test.status === 'In Progress' ? 'bg-yellow-200 text-yellow-700' :
                      'bg-red-200 text-red-700'
                    }`}>
                      {test.status}
                    </span>
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
