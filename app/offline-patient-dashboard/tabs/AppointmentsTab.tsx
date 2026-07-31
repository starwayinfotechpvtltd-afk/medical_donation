'use client';

import { Appointment, Token, Doctor, Patient } from '../types';
import { Search, Calendar, Clock, User, Stethoscope } from 'lucide-react';

interface AppointmentsTabProps {
  appointments: Appointment[];
  tokens: Token[];
  doctors: Doctor[];
  patients: Patient[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  getStatusColor: (status: string) => string;
}

export default function AppointmentsTab({ 
  appointments, 
  tokens,
  doctors,
  patients,
  searchTerm,
  setSearchTerm,
  getStatusColor 
}: AppointmentsTabProps) {
  
  const filteredAppointments = appointments.filter(a =>
    a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Appointments</h2>
          <p className="text-gray-600">Manage and approve patient appointments</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Token</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{appointment.patientName}</p>
                      <p className="text-xs text-gray-500">{appointment.patientId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{appointment.doctorName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{appointment.specialty}</td>
                  <td className="px-6 py-4">
                    {appointment.tokenNumber && (
                      <span className="text-sm font-bold text-blue-600">{appointment.tokenNumber}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{appointment.time}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
