// tabs/OverviewTab.tsx
'use client';

import { 
  DashboardStats, Patient, Appointment, Doctor, Nurse, Prescription, LabReport 
} from '../types';
import { 
  Users, User, Stethoscope, Heart, ClipboardList, 
  FileText, Calendar, Activity, TrendingUp, AlertCircle,
  CheckCircle, Clock, ArrowUp, ArrowDown
} from 'lucide-react';

interface OverviewTabProps {
  stats: DashboardStats;
  patients: Patient[];
  appointments: Appointment[];
  doctors: Doctor[];
  nurses: Nurse[];
  prescriptions: Prescription[];
  labReports: LabReport[];
  getStatusColor: (status: string) => string;
  onPatientSelect: (id: string) => void;
}

export default function OverviewTab({ 
  stats, 
  patients, 
  appointments, 
  doctors, 
  nurses,
  prescriptions,
  labReports,
  getStatusColor,
  onPatientSelect 
}: OverviewTabProps) {
  
  const StatCard = ({ title, value, icon: Icon, color, subtext, trend, trendUp }: any) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-xs ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
              {trendUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              {Math.abs(trend)}% from last month
            </div>
          )}
        </div>
        <div className={`${color} p-3 rounded-full`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  const recentPatients = patients.slice(0, 5);

  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Patients" 
          value={stats.totalPatients} 
          icon={Users}
          color="bg-blue-100 text-blue-600"
          subtext={`${stats.activePatients} active`}
          trend={8}
          trendUp={true}
        />
        <StatCard 
          title="Admitted Patients" 
          value={stats.admittedPatients} 
          icon={Heart}
          color="bg-red-100 text-red-600"
          subtext={`${stats.criticalPatients} critical`}
        />
        <StatCard 
          title="Today's Appointments" 
          value={stats.todayAppointments} 
          icon={Calendar}
          color="bg-green-100 text-green-600"
          subtext={`${stats.totalAppointments} total`}
          trend={12}
          trendUp={true}
        />
        <StatCard 
          title="Available Staff" 
          value={`${stats.availableDoctors}D / ${stats.availableNurses}N`} 
          icon={Activity}
          color="bg-purple-100 text-purple-600"
          subtext={`${doctors.length} doctors, ${nurses.length} nurses`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Active Prescriptions" 
          value={stats.activePrescriptions} 
          icon={ClipboardList}
          color="bg-indigo-100 text-indigo-600"
          subtext={`${prescriptions.length} total`}
        />
        <StatCard 
          title="Lab Reports" 
          value={`${stats.completedLabReports}/${stats.pendingLabReports + stats.completedLabReports}`} 
          icon={FileText}
          color="bg-yellow-100 text-yellow-600"
          subtext={`${stats.pendingLabReports} pending`}
        />
        <StatCard 
          title="Discharged Patients" 
          value={stats.dischargedPatients} 
          icon={CheckCircle}
          color="bg-emerald-100 text-emerald-600"
          trend={-5}
          trendUp={false}
        />
        <StatCard 
          title="Critical Care" 
          value={stats.criticalPatients} 
          icon={AlertCircle}
          color="bg-orange-100 text-orange-600"
          subtext="Needs immediate attention"
        />
      </div>

      {/* Recent Patients */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Recent Patients</h2>
          <button 
            onClick={() => onPatientSelect('')}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            View All
          </button>
        </div>
        <div className="divide-y divide-gray-200">
          {recentPatients.map((patient) => (
            <div 
              key={patient.id} 
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onPatientSelect(patient.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {patient.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{patient.name}</p>
                    <p className="text-sm text-gray-500">ID: {patient.id} • Age: {patient.age} • {patient.bloodGroup}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(patient.status)}`}>
                    {patient.status}
                  </span>
                  {patient.assignedDoctorId && (
                    <span className="text-xs text-gray-500">
                      Dr. {doctors.find(d => d.id === patient.assignedDoctorId)?.name || 'Unassigned'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}