// app/doctor/page.tsx (Dashboard)
'use client';

import { useState } from 'react';
import {
  Users, Calendar, FileText, FlaskConical, Heart,
  TrendingUp, Clock, CheckCircle2, AlertCircle,
  Stethoscope, Pill, MessageSquare, Activity,
  ChevronRight, Eye, Edit2, MoreHorizontal,
  Star
} from 'lucide-react';

// Mock Data
const stats = [
  { label: 'Total Patients', value: '284', change: '+12', icon: Users, color: 'blue' },
  { label: 'Today\'s Appointments', value: '8', change: '+2', icon: Calendar, color: 'emerald' },
  { label: 'Pending Tests', value: '12', change: '-3', icon: FlaskConical, color: 'amber' },
  { label: 'Patient Satisfaction', value: '98%', change: '+2%', icon: Heart, color: 'violet' },
];

const todayAppointments = [
  { id: 1, patient: 'John Sharma', time: '09:00 AM', type: 'Follow-up', status: 'confirmed' },
  { id: 2, patient: 'Priya Patel', time: '10:30 AM', type: 'Consultation', status: 'waiting' },
  { id: 3, patient: 'Aisha Khan', time: '11:45 AM', type: 'Test Review', status: 'confirmed' },
  { id: 4, patient: 'Ravi Patel', time: '02:00 PM', type: 'New Patient', status: 'confirmed' },
  { id: 5, patient: 'Sara Ahmed', time: '03:30 PM', type: 'Follow-up', status: 'pending' },
];

const recentPatients = [
  { id: 1, name: 'John Sharma', lastVisit: '2024-03-25', condition: 'Hypertension', status: 'active' },
  { id: 2, name: 'Priya Patel', lastVisit: '2024-03-24', condition: 'Diabetes', status: 'active' },
  { id: 3, name: 'Aisha Khan', lastVisit: '2024-03-23', condition: 'Migraine', status: 'critical' },
  { id: 4, name: 'Ravi Patel', lastVisit: '2024-03-22', condition: 'Arthritis', status: 'stable' },
];

const pendingTasks = [
  { id: 1, task: 'Review lab results', patient: 'John Sharma', priority: 'high' },
  { id: 2, task: 'Prescription renewal', patient: 'Priya Patel', priority: 'medium' },
  { id: 3, task: 'Schedule follow-up', patient: 'Aisha Khan', priority: 'high' },
  { id: 4, task: 'Complete medical notes', patient: 'Ravi Patel', priority: 'low' },
];

function StatusBadge({ status }: { status: string }) {
  const config = {
    confirmed: 'bg-emerald-100 text-emerald-700',
    waiting: 'bg-amber-100 text-amber-700',
    pending: 'bg-blue-100 text-blue-700',
    active: 'bg-emerald-100 text-emerald-700',
    critical: 'bg-red-100 text-red-700',
    stable: 'bg-blue-100 text-blue-700',
    high: 'bg-red-100 text-red-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-green-100 text-green-700',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config[status as keyof typeof config] || 'bg-slate-100 text-slate-700'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function StatsCard({ stat }: { stat: typeof stats[0] }) {
  const Icon = stat.icon;
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    violet: 'bg-violet-50 text-violet-600',
  };
  
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${
          stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
        }`}>
          <TrendingUp className="w-3 h-3" />
          {stat.change}
        </span>
      </div>
      <p className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</p>
      <p className="text-sm text-slate-500">{stat.label}</p>
    </div>
  );
}

function AppointmentItem({ appointment }: { appointment: typeof todayAppointments[0] }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
          {appointment.patient.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <p className="font-semibold text-slate-900">{appointment.patient}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-slate-500">{appointment.time}</span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs text-slate-500">{appointment.type}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <StatusBadge status={appointment.status} />
        <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400">
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function PatientRow({ patient }: { patient: typeof recentPatients[0] }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
          {patient.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <p className="font-semibold text-slate-900">{patient.name}</p>
          <p className="text-xs text-slate-500">Last Visit: {new Date(patient.lastVisit).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm text-slate-600">{patient.condition}</p>
          <StatusBadge status={patient.status} />
        </div>
        <button className="p-1.5 hover:bg-slate-100 rounded-lg text-blue-600">
          <Edit2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function TaskItem({ task }: { task: typeof pendingTasks[0] }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
      <div>
        <p className="font-medium text-slate-900">{task.task}</p>
        <p className="text-xs text-slate-500 mt-0.5">Patient: {task.patient}</p>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge status={task.priority} />
        <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400">
          <CheckCircle2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function DoctorDashboard() {
  const [greeting, setGreeting] = useState('');
  
  useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{greeting}, Dr. Rajesh 👋</h1>
          <p className="text-sm text-slate-500 mt-1">Here's your practice overview for today</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-lg px-3 py-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatsCard key={stat.label} stat={stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Today's Appointments</h3>
              <p className="text-sm text-slate-500 mt-1">You have {todayAppointments.length} appointments today</p>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>
          <div className="p-5 space-y-3">
            {todayAppointments.map((apt) => (
              <AppointmentItem key={apt.id} appointment={apt} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions Cards */}
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-slate-700">Write Prescription</span>
                <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
                <FlaskConical className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-slate-700">Order Lab Test</span>
                <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <Calendar className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-slate-700">Schedule Follow-up</span>
                <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
                <MessageSquare className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-medium text-slate-700">Message Patient</span>
                <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
              </button>
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="bg-white rounded-xl border border-slate-100">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">Pending Tasks</h3>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>
            <div className="p-2">
              {pendingTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Patients */}
      <div className="bg-white rounded-xl border border-slate-100">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Recent Patients</h3>
            <p className="text-sm text-slate-500 mt-1">Patients you've recently consulted</p>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All Patients
          </button>
        </div>
        <div className="p-5">
          <div className="space-y-2">
            {recentPatients.map((patient) => (
              <PatientRow key={patient.id} patient={patient} />
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">This Week's Schedule</h3>
          <div className="space-y-3">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, i) => (
              <div key={day} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{day}</p>
                  <p className="text-xs text-slate-500">{8 + i} appointments</p>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  View Schedule
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Patient Satisfaction</h3>
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
          </div>
          <div className="text-3xl font-bold mb-2">98%</div>
          <p className="text-blue-100 mb-4">Based on 284 reviews this month</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-sm text-blue-100">"Excellent care and attention to detail"</p>
            <p className="text-xs text-blue-200 mt-1">- Recent patient feedback</p>
          </div>
        </div>
      </div>
    </div>
  );
}