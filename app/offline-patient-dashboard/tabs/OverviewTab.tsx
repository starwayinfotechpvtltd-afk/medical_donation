'use client';

import { 
  DashboardStats, Token, Appointment, Doctor, Patient 
} from '../types';
import { 
  Users, Ticket, Calendar, Stethoscope, 
  Clock, CheckCircle, AlertCircle, UserPlus
} from 'lucide-react';

interface OverviewTabProps {
  stats: DashboardStats;
  tokens: Token[];
  appointments: Appointment[];
  doctors: Doctor[];
  patients: Patient[];
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
}

export default function OverviewTab({ 
  stats, 
  tokens, 
  appointments, 
  doctors, 
  patients,
  getStatusColor,
  getPriorityColor 
}: OverviewTabProps) {
  
  const StatCard = ({ title, value, icon: Icon, color, subtext }: any) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
        </div>
        <div className={`${color} p-3 rounded-full`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  const currentTokens = tokens.filter(t => t.status === 'waiting' || t.status === 'in-progress');

  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Patients" 
          value={stats.totalPatients} 
          icon={Users}
          color="bg-blue-100 text-blue-600"
          subtext={`${stats.todayPatients} new today`}
        />
        <StatCard 
          title="Active Tokens" 
          value={stats.activeTokens} 
          icon={Ticket}
          color="bg-purple-100 text-purple-600"
          subtext={`${stats.waitingTokens} waiting`}
        />
        <StatCard 
          title="Today's Appointments" 
          value={stats.appointmentsToday} 
          icon={Calendar}
          color="bg-green-100 text-green-600"
        />
        <StatCard 
          title="Available Doctors" 
          value={`${stats.availableDoctors}/${doctors.length}`} 
          icon={Stethoscope}
          color="bg-orange-100 text-orange-600"
          subtext={`${stats.busyDoctors} busy`}
        />
      </div>

      {/* Current Token Queue */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Current Token Queue</h2>
        </div>
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTokens.slice(0, 5).map((token) => (
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
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(token.status)}`}>
                      {token.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{token.estimatedWaitTime} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white cursor-pointer hover:shadow-lg transition-shadow">
          <UserPlus className="w-8 h-8 mb-3 opacity-90" />
          <h3 className="text-lg font-semibold mb-1">Register Patient</h3>
          <p className="text-sm opacity-90">Register a new walk-in patient</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white cursor-pointer hover:shadow-lg transition-shadow">
          <Ticket className="w-8 h-8 mb-3 opacity-90" />
          <h3 className="text-lg font-semibold mb-1">Generate Token</h3>
          <p className="text-sm opacity-90">Create token for patient</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white cursor-pointer hover:shadow-lg transition-shadow">
          <CheckCircle className="w-8 h-8 mb-3 opacity-90" />
          <h3 className="text-lg font-semibold mb-1">Complete Appointment</h3>
          <p className="text-sm opacity-90">Mark appointment as completed</p>
        </div>
      </div>
    </>
  );
}