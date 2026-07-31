'use client';

import { Patient } from '../types';
import { CheckCircle2, Search, Trash2, UserMinus, UserX } from 'lucide-react';

interface PatientsTabProps {
  patients: Patient[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  getStatusColor: (status: string) => string;
  onPatientSelect: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onDeactivate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function PatientsTab({ 
  patients, 
  searchTerm, 
  setSearchTerm,
  getStatusColor,
  onPatientSelect,
  onApprove,
  onReject,
  onDeactivate,
  onDelete,
}: PatientsTabProps) {
  
  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Patients</h2>
          <p className="text-gray-600">Manage all patients</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search patients..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age/Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Blood Group</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
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
                    <div className="text-sm text-gray-600">{patient.phone}</div>
                    <div className="text-xs text-gray-500">{patient.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{patient.age} / {patient.gender}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{patient.bloodGroup}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(patient.status)}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {patient.assignedDoctorId ? `Dr. ${patient.assignedDoctorId}` : 'Unassigned'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => onPatientSelect(patient.id)}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        View
                      </button>
                      {(patient.status === 'pending' || patient.status === 'rejected') && onApprove ? (
                        <button onClick={() => onApprove(patient.id)} className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                        </button>
                      ) : null}
                      {patient.status === 'pending' && onReject ? (
                        <button onClick={() => onReject(patient.id)} className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">
                          <UserX className="h-3.5 w-3.5" /> Reject
                        </button>
                      ) : null}
                      {patient.status !== 'suspended' && onDeactivate ? (
                        <button onClick={() => onDeactivate(patient.id)} className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-amber-100 text-amber-700 rounded hover:bg-amber-200">
                          <UserMinus className="h-3.5 w-3.5" /> Suspend
                        </button>
                      ) : null}
                      {onDelete ? (
                        <button onClick={() => onDelete(patient.id)} className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-slate-100 text-red-700 rounded hover:bg-red-50">
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      ) : null}
                    </div>
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
