'use client';

import { Appointment } from '../types';
import { Search, UserPlus, Calendar as CalendarIcon } from 'lucide-react';

interface AppointmentsTabProps {
  appointments: Appointment[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  getStatusColor: (status: string) => string;
  tokenNumber: string;
  setTokenNumber: (value: string) => void;
  approvingToken: boolean;
  approveToken: () => Promise<void>;
}

export default function AppointmentsTab({ 
  appointments, 
  searchTerm, 
  setSearchTerm,
  selectedDate,
  setSelectedDate,
  getStatusColor,
  tokenNumber,
  setTokenNumber,
  approvingToken,
  approveToken
}: AppointmentsTabProps) {
  
  const filteredAppointments = appointments.filter(a => {
    const matchesSearch = a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = a.date === selectedDate;
    return matchesSearch && matchesDate;
  });

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Appointments</h2>
          <p className="text-gray-600">Manage patient appointments</p>
        </div>
        <div className="flex gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            value={tokenNumber}
            onChange={(e) => setTokenNumber(e.target.value.toUpperCase())}
            placeholder="Token number"
            className="px-3 py-2 border border-gray-300 rounded-lg"
          />
          <button
            onClick={() => void approveToken()}
            disabled={approvingToken || !tokenNumber.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" />
            {approvingToken ? 'Approving...' : 'Approve Token'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{apt.patientName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{apt.doctorName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{apt.specialty}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{apt.time}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 capitalize">{apt.type}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(apt.status)}`}>
                      {apt.status}
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
