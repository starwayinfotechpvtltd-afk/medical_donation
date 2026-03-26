'use client';

import { Download, Eye, CheckCircle } from 'lucide-react';

const completedTests = [
  { id: 'CT001', patient: 'John Doe', test: 'Blood Test (CBC)', completedDate: '2024-03-23', techician: 'Priya Patel' },
  { id: 'CT002', patient: 'Jane Smith', test: 'Lipid Profile', completedDate: '2024-03-22', techician: 'Priya Patel' },
  { id: 'CT003', patient: 'Mike Johnson', test: 'Thyroid Panel', completedDate: '2024-03-22', techician: 'Ahmed Hassan' },
  { id: 'CT004', patient: 'Sarah Lee', test: 'Glucose Test', completedDate: '2024-03-21', techician: 'Rajesh Verma' },
];

export default function CompletedTestsPage() {
  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-sky-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Completed Tests</h1>
          <p className="text-slate-600">View and download submitted laboratory test results</p>
        </div>

        {/* Summary */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <p className="text-slate-600 text-sm mb-2">This Month</p>
            <p className="text-3xl font-bold text-slate-900">24</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <p className="text-slate-600 text-sm mb-2">This Week</p>
            <p className="text-3xl font-bold text-slate-900">8</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
            <p className="text-slate-600 text-sm mb-2">Today</p>
            <p className="text-3xl font-bold text-slate-900">2</p>
          </div>
        </div>

        {/* Tests Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-50 border-b border-blue-100">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Test ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Patient Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Test Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Completed Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Tech Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {completedTests.map((test) => (
                  <tr key={test.id} className="border-b border-blue-50 hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{test.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{test.patient}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{test.test}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{test.completedDate}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{test.techician}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-sm font-semibold">
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors text-sm font-semibold">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
