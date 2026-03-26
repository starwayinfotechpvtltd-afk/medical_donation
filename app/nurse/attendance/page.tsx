'use client';

import { useState } from 'react';
import { Calendar, Clock, Camera, CheckCircle, AlertCircle } from 'lucide-react';

const attendanceData = [
  { id: 1, date: '2024-03-24', checkIn: '08:00 AM', checkOut: '04:00 PM', status: 'Present' },
  { id: 2, date: '2024-03-23', checkIn: '08:15 AM', checkOut: '04:30 PM', status: 'Present' },
  { id: 3, date: '2024-03-22', checkIn: '08:00 AM', checkOut: null, status: 'Present' },
];

export default function AttendancePage() {
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-sky-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Attendance Management</h1>
          <p className="text-slate-600">Track your daily attendance and check-in times</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <button className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border-l-4 border-blue-500">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="text-slate-600 text-sm">Check In Time</p>
                <p className="text-2xl font-bold text-slate-900">08:00 AM</p>
              </div>
            </div>
          </button>

          <button onClick={() => setShowPhotoModal(true)} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border-l-4 border-purple-500">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Camera className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="text-slate-600 text-sm">Take Attendance Photo</p>
                <p className="text-sm font-semibold text-purple-600">Capture Now</p>
              </div>
            </div>
          </button>
        </div>

        {/* Attendance History */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Attendance History</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-50 border-b border-blue-100">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Check In</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Check Out</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((record) => (
                  <tr key={record.id} className="border-b border-blue-50 hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-900">{record.date}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{record.checkIn}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{record.checkOut || 'On Duty'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                        <CheckCircle className="w-4 h-4" />
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Photo Modal */}
        {showPhotoModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Attendance Photo</h3>
              <div className="bg-blue-50 rounded-lg p-8 flex flex-col items-center justify-center mb-6 border-2 border-dashed border-blue-300">
                {photoPreview ? (
                  <img src={photoPreview} alt="Attendance" className="w-full rounded-lg" />
                ) : (
                  <div className="text-center">
                    <Camera className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                    <p className="text-slate-600">No photo selected</p>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 bg-slate-200 text-slate-900 rounded-lg font-semibold hover:bg-slate-300 transition-colors">
                  Cancel
                </button>
                <button onClick={() => setShowPhotoModal(false)} className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
