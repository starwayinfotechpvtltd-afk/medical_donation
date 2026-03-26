'use client';

import { Calendar, Clock, MapPin, Phone, CheckCircle, AlertCircle } from 'lucide-react';

const appointments = [
  { id: 1, doctor: 'Dr. Rajesh Kumar', specialty: 'Cardiology', date: '2024-03-28', time: '10:00 AM', address: '123 Medical Center, City', status: 'Upcoming' },
  { id: 2, doctor: 'Dr. Anjali Singh', specialty: 'Endocrinology', date: '2024-03-20', time: '2:30 PM', address: '456 Health Plaza, City', status: 'Completed' },
  { id: 3, doctor: 'Dr. Rajesh Kumar', specialty: 'Cardiology', date: '2024-03-10', time: '11:00 AM', address: '123 Medical Center, City', status: 'Completed' },
];

export default function AppointmentsViewPage() {
  const upcomingCount = appointments.filter(a => a.status === 'Upcoming').length;
  const completedCount = appointments.filter(a => a.status === 'Completed').length;

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-sky-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Appointments</h1>
          <p className="text-slate-600">View and manage your doctor appointments</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <p className="text-slate-600 text-sm mb-2">Total Appointments</p>
            <p className="text-3xl font-bold text-slate-900">{appointments.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <p className="text-slate-600 text-sm mb-2">Upcoming</p>
            <p className="text-3xl font-bold text-slate-900">{upcomingCount}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
            <p className="text-slate-600 text-sm mb-2">Completed</p>
            <p className="text-3xl font-bold text-slate-900">{completedCount}</p>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-6">
          {appointments.map((apt) => (
            <div key={apt.id} className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-blue-100">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{apt.doctor}</h3>
                  <p className="text-slate-600 mt-1">{apt.specialty}</p>
                </div>
                <span className={`inline-block px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 ${apt.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                  {apt.status === 'Completed' && <CheckCircle className="w-4 h-4" />}
                  {apt.status === 'Upcoming' && <AlertCircle className="w-4 h-4" />}
                  {apt.status}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-slate-600 text-sm">Date</p>
                    <p className="font-semibold text-slate-900">{apt.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-slate-600 text-sm">Time</p>
                    <p className="font-semibold text-slate-900">{apt.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:col-span-2">
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-slate-600 text-sm">Location</p>
                    <p className="font-semibold text-slate-900">{apt.address}</p>
                  </div>
                </div>
              </div>

              {apt.status === 'Upcoming' && (
                <div className="mt-6 pt-6 border-t border-blue-100 flex gap-3">
                  <button className="flex-1 px-4 py-2 bg-slate-200 text-slate-900 rounded-lg font-semibold hover:bg-slate-300 transition-colors">
                    Reschedule
                  </button>
                  <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                    Get Directions
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
