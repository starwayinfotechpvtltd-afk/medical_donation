'use client';

import { Token, Doctor, Patient, Appointment } from '../types';
import { Search, CheckCircle, XCircle, Clock, Users, Ticket } from 'lucide-react';

interface TokenManagementTabProps {
  tokens: Token[];
  setTokens: React.Dispatch<React.SetStateAction<Token[]>>;
  doctors: Doctor[];
  setDoctors: React.Dispatch<React.SetStateAction<Doctor[]>>;  // Add this
  patients: Patient[];
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  onUpdateStatus: (tokenId: string, status: string) => Promise<void>;
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
}

export default function TokenManagementTab({ 
  tokens, 
  setTokens,
  doctors,
  setDoctors,  // Add this
  patients,
  appointments,
  setAppointments,
  onUpdateStatus,
  getStatusColor,
  getPriorityColor 
}: TokenManagementTabProps) {

  const handleUpdateStatus = async (tokenId: string, newStatus: string) => {
    await onUpdateStatus(tokenId, newStatus);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending': return { icon: Clock, label: 'Pending', color: 'bg-yellow-100 text-yellow-800' };
      case 'waiting': return { icon: Clock, label: 'Waiting', color: 'bg-blue-100 text-blue-800' };
      case 'in-progress': return { icon: Users, label: 'In Progress', color: 'bg-purple-100 text-purple-800' };
      case 'completed': return { icon: CheckCircle, label: 'Completed', color: 'bg-green-100 text-green-800' };
      case 'cancelled': return { icon: XCircle, label: 'Cancelled', color: 'bg-red-100 text-red-800' };
      default: return { icon: Clock, label: status, color: 'bg-gray-100 text-gray-800' };
    }
  };

  const getNextStatus = (currentStatus: string): string[] => {
    switch(currentStatus) {
      case 'pending': return ['cancelled'];
      case 'waiting': return ['in-progress', 'cancelled'];
      case 'in-progress': return ['completed', 'cancelled'];
      default: return [];
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Token Management</h2>
          <p className="text-gray-600">Manage and track patient tokens</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-lg">
            <Ticket className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">
              Active: {tokens.filter(t => t.status !== 'completed' && t.status !== 'cancelled').length}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
          <p className="text-xs text-gray-500">Waiting</p>
          <p className="text-2xl font-bold text-gray-900">{tokens.filter(t => t.status === 'waiting').length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-purple-500">
          <p className="text-xs text-gray-500">In Progress</p>
          <p className="text-2xl font-bold text-gray-900">{tokens.filter(t => t.status === 'in-progress').length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
          <p className="text-xs text-gray-500">Completed Today</p>
          <p className="text-2xl font-bold text-gray-900">{tokens.filter(t => t.status === 'completed' && t.createdDate === new Date().toISOString().split('T')[0]).length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Token</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Wait Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tokens.map((token) => {
                const StatusIcon = getStatusBadge(token.status).icon;
                return (
                  <tr key={token.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-blue-600">{token.tokenNumber}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{token.patientName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{token.doctorName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(token.priority)}`}>
                        {token.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1 ${getStatusColor(token.status)}`}>
                        <StatusIcon className="w-3 h-3" />
                        {token.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{token.estimatedWaitTime} min</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {getNextStatus(token.status).map((status) => (
                          <button
                            key={status}
                            onClick={() => handleUpdateStatus(token.id, status)}
                            className={`px-2 py-1 text-xs font-medium rounded ${
                              status === 'cancelled' 
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                          >
                            {status === 'cancelled' ? 'Cancel' : status}
                          </button>
                        ))}
                        {token.status === 'pending' ? <span className="text-xs font-medium text-slate-500">Awaiting reception approval</span> : null}
                      </div>
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
