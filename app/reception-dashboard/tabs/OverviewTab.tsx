'use client';

import { Appointment, Doctor, Patient, Nurse, Lab, Staff, DashboardStats } from '../types';
import { Calendar, Stethoscope, Users, Heart, FlaskRound, Building, Clock } from 'lucide-react';

interface OverviewTabProps {
  stats: DashboardStats;
  appointments: Appointment[];
  doctors: Doctor[];
  patients: Patient[];
  nurses: Nurse[];
  labs: Lab[];
  staff: Staff[];
  getStatusColor: (status: string) => string;
}

export default function OverviewTab({ 
  stats, 
  appointments, 
  doctors, 
  patients, 
  nurses, 
  labs, 
  staff,
  getStatusColor 
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

  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Today's Appointments" 
          value={stats.todayAppointments} 
          icon={Calendar}
          color="bg-blue-100 text-blue-600"
          subtext={`${stats.totalAppointments} total`}
        />
        <StatCard 
          title="Available Doctors" 
          value={stats.availableDoctors} 
          icon={Stethoscope}
          color="bg-green-100 text-green-600"
        />
        <StatCard 
          title="Total Patients" 
          value={stats.totalPatients} 
          icon={Users}
          color="bg-purple-100 text-purple-600"
        />
        <StatCard 
          title="Present Staff" 
          value={stats.presentStaff} 
          icon={Building}
          color="bg-orange-100 text-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Available Nurses" 
          value={stats.availableNurses} 
          icon={Heart}
          color="bg-red-100 text-red-600"
        />
        <StatCard 
          title="Active Labs" 
          value={stats.activeLabs} 
          icon={FlaskRound}
          color="bg-yellow-100 text-yellow-600"
        />
        <StatCard 
          title="Pending Tasks" 
          value={stats.pendingTasks} 
          icon={Clock}
          color="bg-orange-100 text-orange-600"
        />
        <StatCard 
          title="Total Staff" 
          value={staff.length} 
          icon={Building}
          color="bg-indigo-100 text-indigo-600"
        />
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Appointments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.slice(0, 5).map((apt) => (
                <tr key={apt.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{apt.patientName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{apt.doctorName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{apt.time}</td>
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