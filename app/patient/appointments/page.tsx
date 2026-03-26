'use client';

import { Calendar, Clock, MapPin, Phone, AlertCircle } from 'lucide-react';

export default function AppointmentsPage() {
  // Mock upcoming appointments
  const upcomingAppointments = [
    {
      id: '1',
      doctorName: 'Dr. Amit Gupta',
      specialty: 'Cardiology',
      date: '2024-03-15',
      time: '10:00 AM',
      location: 'Room 304, Cardiology Department',
      phone: '+91-9876543210',
      type: 'Follow-up Consultation'
    },
    {
      id: '2',
      doctorName: 'Dr. Suresh Mehta',
      specialty: 'General Medicine',
      date: '2024-04-05',
      time: '2:30 PM',
      location: 'Room 102, General Medicine',
      phone: '+91-9876543215',
      type: 'Routine Checkup'
    }
  ];

  // Mock past appointments
  const pastAppointments = [
    {
      id: '3',
      doctorName: 'Dr. Rahul Singh',
      specialty: 'Cardiology',
      date: '2024-02-20',
      time: '9:00 AM',
      location: 'Room 305, Cardiology Department',
      notes: 'Blood pressure controlled. Continue current medications.'
    },
    {
      id: '4',
      doctorName: 'Dr. Neha Reddy',
      specialty: 'Pulmonology',
      date: '2024-01-28',
      time: '11:00 AM',
      location: 'Room 201, Pulmonology',
      notes: 'Chest X-ray normal. Asthma control improving.'
    }
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Calendar className="w-8 h-8 text-orange-600" />
          My Appointments
        </h1>
        <p className="text-gray-600 mt-2">View your upcoming and past appointments</p>
      </div>

      {/* Upcoming Appointments */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Appointments</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-lg shadow border-l-4 border-emerald-500 overflow-hidden">
                <div className="p-6">
                  {/* Doctor Info */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{appointment.doctorName}</h3>
                    <p className="text-sm text-gray-600">{appointment.specialty}</p>
                    <p className="text-sm text-emerald-600 font-medium mt-1">{appointment.type}</p>
                  </div>

                  {/* Appointment Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Calendar className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm">{new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Clock className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm">{appointment.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm">{appointment.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Phone className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm">{appointment.phone}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition">
                      Reschedule
                    </button>
                    <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 bg-white rounded-lg shadow p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No upcoming appointments</p>
            </div>
          )}
        </div>
      </div>

      {/* Past Appointments */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Past Appointments</h2>
        <div className="space-y-4">
          {pastAppointments.length > 0 ? (
            pastAppointments.map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{appointment.doctorName}</h3>
                      <p className="text-sm text-gray-600">{appointment.specialty}</p>
                    </div>
                    <span className="text-xs bg-gray-200 text-gray-800 px-3 py-1 rounded-full font-medium">
                      Completed
                    </span>
                  </div>

                  <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {appointment.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {appointment.location}
                    </div>
                  </div>

                  {appointment.notes && (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-xs font-semibold text-gray-700 mb-1">Doctor's Notes:</p>
                      <p className="text-sm text-gray-600">{appointment.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No past appointments</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
