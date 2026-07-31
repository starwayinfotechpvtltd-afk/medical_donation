'use client';

import { Appointment, Patient, Doctor, Nurse } from '../types';
import { Search, Stethoscope, Heart } from 'lucide-react';

interface AppointmentsTabProps {
  appointments: Appointment[];
  patients: Patient[];
  doctors: Doctor[];
  nurses: Nurse[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  getStatusColor: (status: string) => string;
}

export default function AppointmentsTab({ 
  appointments, 
  patients, 
  doctors, 
  nurses,
  searchTerm, 
  setSearchTerm,
  getStatusColor 
}: AppointmentsTabProps) {
  
  const filteredAppointments = appointments.filter(a =>
    a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const today = new Date().toISOString().split('T')[0];
  const upcomingAppointments = filteredAppointments.filter(a => a.date >= today && a.status !== 'completed' && a.status !== 'cancelled');

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Appointments</h2>
          <p className="text-gray-600">Manage patient appointments</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nurse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date/Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {upcomingAppointments.slice(0, 10).map((appointment) => {
                const nurse = nurses.find(n => n.id === appointment.nurseId);
                return (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                          {appointment.patientName.charAt(0)}
                        </div>
                        <span className="text-sm text-gray-900">{appointment.patientName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-900">{appointment.doctorName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {nurse ? (
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-red-600" />
                          <span className="text-sm text-gray-900">{nurse.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900">{appointment.date}</span>
                        <span className="text-xs text-gray-500">{appointment.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{appointment.specialty}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="truncate block max-w-[150px]">{appointment.purpose}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
