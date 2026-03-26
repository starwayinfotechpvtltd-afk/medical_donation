'use client';

import { useState } from 'react';
import { createdUsers } from '@/data/rolesAndUsers';
import { Clock, Camera, Users, Search, CheckCircle } from 'lucide-react';

export default function NurseDashboard() {
  const [searchPatientId, setSearchPatientId] = useState('');
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceData, setAttendanceData] = useState({
    date: new Date().toISOString().split('T')[0],
    checkIn: '',
    checkOut: '',
  });

  const nurses = createdUsers.filter(u => u.role === 'Nurse');

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Nurse Dashboard</h1>
        <p className="text-slate-600 mb-8">Aisha Khan - General Ward</p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-pink-100">
            <div className="flex items-center gap-4">
              <Clock className="w-10 h-10 text-pink-500" />
              <div>
                <p className="text-sm text-slate-600">Today's Patients</p>
                <p className="text-3xl font-bold text-slate-900">24</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-pink-100">
            <div className="flex items-center gap-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
              <div>
                <p className="text-sm text-slate-600">Check-ins</p>
                <p className="text-3xl font-bold text-slate-900">22</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-pink-100">
            <div className="flex items-center gap-4">
              <Users className="w-10 h-10 text-purple-500" />
              <div>
                <p className="text-sm text-slate-600">Staff</p>
                <p className="text-3xl font-bold text-slate-900">{nurses.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Attendance */}
          <div className="bg-white rounded-xl shadow-sm border border-pink-100">
            <div className="p-8 border-b border-pink-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">Mark Attendance</h2>
              <button
                onClick={() => setShowAttendanceModal(true)}
                className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                With Photo
              </button>
            </div>
            <div className="p-8">
              <div className="space-y-4">
                {[
                  { name: 'Aisha Khan', time: '08:00 AM', status: 'checked-in' },
                  { name: 'Neha Sharma', time: '08:15 AM', status: 'checked-in' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-pink-50 rounded-lg border border-pink-100">
                    <div>
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-600">Check-in: {item.time}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Patient Lookup */}
          <div className="bg-white rounded-xl shadow-sm border border-pink-100">
            <div className="p-8 border-b border-pink-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Patient Lookup</h2>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter patient ID..."
                  value={searchPatientId}
                  onChange={(e) => setSearchPatientId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>
            {searchPatientId && (
              <div className="p-8">
                <div className="bg-pink-50 p-6 rounded-lg border border-pink-200">
                  <h3 className="font-bold text-slate-900 mb-4">Patient Details</h3>
                  <div className="space-y-3 text-slate-700">
                    <p><span className="font-semibold">Patient ID:</span> {searchPatientId}</p>
                    <p><span className="font-semibold">Name:</span> John Sharma</p>
                    <p><span className="font-semibold">Ward:</span> A-201</p>
                    <p><span className="font-semibold">Doctor:</span> Dr. Rajesh Kumar</p>
                    <p><span className="font-semibold">Blood Type:</span> O+</p>
                    <p><span className="font-semibold">Vitals:</span> BP: 120/80, HR: 75</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Attendance Modal */}
      {showAttendanceModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Attendance with Photo</h2>
            <div className="border-2 border-dashed border-pink-300 rounded-lg p-8 text-center mb-6">
              <Camera className="w-12 h-12 text-pink-500 mx-auto mb-3" />
              <p className="text-slate-900 font-semibold mb-1">Click to take photo</p>
              <p className="text-sm text-slate-600">Or upload from device</p>
            </div>
            <input
              type="time"
              value={attendanceData.checkIn}
              onChange={(e) => setAttendanceData({ ...attendanceData, checkIn: e.target.value })}
              className="w-full px-4 py-2 border border-pink-200 rounded-lg mb-4 focus:ring-2 focus:ring-pink-500"
              placeholder="Check-in Time"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowAttendanceModal(false)}
                className="flex-1 px-4 py-2 border border-pink-200 rounded-lg hover:bg-pink-50 transition-colors font-medium text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAttendanceModal(false)}
                className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
