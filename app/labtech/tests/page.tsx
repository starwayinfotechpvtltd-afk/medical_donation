'use client';

import { useState } from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

const labTests = [
  { id: 'LT001', patient: 'John Sharma', test: 'Blood Test (CBC)', status: 'Pending', requestDate: '2024-03-24', priority: 'High' },
  { id: 'LT002', patient: 'Priya Patel', test: 'Lipid Profile', status: 'In Progress', requestDate: '2024-03-24', priority: 'Normal' },
  { id: 'LT003', patient: 'Amit Kumar', test: 'Thyroid Function', status: 'Pending', requestDate: '2024-03-23', priority: 'High' },
  { id: 'LT004', patient: 'Sneha Desai', test: 'Glucose Test', status: 'Completed', requestDate: '2024-03-23', priority: 'Normal' },
];

export default function LabTestsPage() {
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredTests = filterStatus === 'All' ? labTests : labTests.filter(t => t.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Completed': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-sky-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Lab Tests</h1>
            <p className="text-slate-600">Manage and track laboratory test requests</p>
          </div>
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors">
            New Test
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
            <p className="text-slate-600 text-sm mb-2">Pending</p>
            <p className="text-3xl font-bold text-slate-900">2</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <p className="text-slate-600 text-sm mb-2">In Progress</p>
            <p className="text-3xl font-bold text-slate-900">1</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <p className="text-slate-600 text-sm mb-2">Completed</p>
            <p className="text-3xl font-bold text-slate-900">1</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
            <p className="text-slate-600 text-sm mb-2">Total Tests</p>
            <p className="text-3xl font-bold text-slate-900">4</p>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex gap-2">
          {['All', 'Pending', 'In Progress', 'Completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filterStatus === status ? 'bg-blue-500 text-white' : 'bg-blue-50 text-slate-900 hover:bg-blue-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Tests List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-50 border-b border-blue-100">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Test ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Patient</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Test Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Priority</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTests.map((test) => (
                  <tr key={test.id} className="border-b border-blue-50 hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{test.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{test.patient}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{test.test}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-semibold text-xs ${getStatusColor(test.status)}`}>
                        {test.status === 'Completed' && <CheckCircle className="w-3 h-3" />}
                        {test.status === 'Pending' && <Clock className="w-3 h-3" />}
                        {test.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${test.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        {test.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-blue-500 hover:text-blue-700 font-semibold text-sm">View</button>
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
