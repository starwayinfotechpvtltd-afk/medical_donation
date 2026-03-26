'use client';

import { Users, Calendar, TrendingUp, Award } from 'lucide-react';

const staffRecords = [
  { id: 1, name: 'Aisha Khan', shift: 'Day Shift', attendance: 24, performance: 95, department: 'General Ward' },
  { id: 2, name: 'Rajesh Verma', shift: 'Night Shift', attendance: 23, performance: 92, department: 'ICU' },
  { id: 3, name: 'Priya Nair', shift: 'Day Shift', attendance: 25, performance: 98, department: 'Pediatrics' },
  { id: 4, name: 'Ahmed Hassan', shift: 'Morning Shift', attendance: 22, performance: 88, department: 'Emergency' },
];

export default function StaffRecordsPage() {
  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-sky-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Staff Records</h1>
          <p className="text-slate-600">View nursing staff performance and attendance records</p>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-blue-500" />
              <p className="text-slate-600 text-sm">Total Staff</p>
            </div>
            <p className="text-3xl font-bold text-slate-900">24</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-green-500" />
              <p className="text-slate-600 text-sm">Present Today</p>
            </div>
            <p className="text-3xl font-bold text-slate-900">22</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <p className="text-slate-600 text-sm">Avg Attendance</p>
            </div>
            <p className="text-3xl font-bold text-slate-900">96%</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-5 h-5 text-orange-500" />
              <p className="text-slate-600 text-sm">Avg Performance</p>
            </div>
            <p className="text-3xl font-bold text-slate-900">93%</p>
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-50 border-b border-blue-100">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Shift</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Department</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Days Present</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Performance</th>
                </tr>
              </thead>
              <tbody>
                {staffRecords.map((staff) => (
                  <tr key={staff.id} className="border-b border-blue-50 hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{staff.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{staff.shift}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{staff.department}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-blue-100 rounded-full h-2 max-w-xs">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(staff.attendance / 25) * 100}%` }}></div>
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{staff.attendance}/25</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-green-100 rounded-full h-2 max-w-xs">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${staff.performance}%` }}></div>
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{staff.performance}%</span>
                      </div>
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
