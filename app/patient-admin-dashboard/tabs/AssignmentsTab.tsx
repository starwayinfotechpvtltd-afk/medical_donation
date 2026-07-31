'use client';

import { Patient, Doctor, Nurse, Appointment } from '../types';
import { Search, Stethoscope, Heart, CheckCircle, XCircle, Clock } from 'lucide-react';

interface AssignmentsTabProps {
  patients: Patient[];
  doctors: Doctor[];
  nurses: Nurse[];
  appointments: Appointment[];
  getStatusColor: (status: string) => string;
  onPatientSelect: (id: string) => void;
}

export default function AssignmentsTab({ 
  patients, 
  doctors, 
  nurses, 
  appointments,
  getStatusColor,
  onPatientSelect 
}: AssignmentsTabProps) {
  
  const assignedPatients = patients.filter(p => p.assignedDoctorId || p.assignedNurseId);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Patient Assignments</h2>
          <p className="text-gray-600">View patient to doctor/nurse assignments</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Nurse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Appointment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assignedPatients.map((patient) => {
                const doctor = doctors.find(d => d.id === patient.assignedDoctorId);
                const nurse = nurses.find(n => n.id === patient.assignedNurseId);
                const lastAppointment = appointments
                  .filter(a => a.patientId === patient.id)
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

                return (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{patient.name}</p>
                          <p className="text-xs text-gray-500">ID: {patient.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(patient.status)}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {doctor ? (
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-900">{doctor.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {nurse ? (
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-red-600" />
                          <span className="text-sm text-gray-900">{nurse.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {patient.roomNumber ? `Room ${patient.roomNumber}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {lastAppointment ? lastAppointment.date : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onPatientSelect(patient.id)}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        View
                      </button>
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