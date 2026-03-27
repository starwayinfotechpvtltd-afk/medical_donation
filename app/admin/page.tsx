// app/admin/page.tsx (Dashboard Page)
'use client';

import { useState } from 'react';
import {
  Users, Stethoscope, Calendar, FlaskConical, Heart,
  TrendingUp, TrendingDown, Eye, Edit2, Trash2, Plus,
  MoreHorizontal, UserPlus, Activity, BarChart3,
  CheckCircle2, Clock, AlertCircle, ChevronRight,
  Search,
  TestTube,
  FileText
} from 'lucide-react';

// Mock Data
const stats = [
  { label: 'Total Patients', value: '3,847', change: '+12.5%', up: true, icon: Users, color: 'blue' },
  { label: 'Active Doctors', value: '48', change: '+2', up: true, icon: Stethoscope, color: 'emerald' },
  { label: 'Appointments Today', value: '124', change: '-3.2%', up: false, icon: Calendar, color: 'violet' },
  { label: 'Lab Tests Pending', value: '31', change: '+8', up: false, icon: FlaskConical, color: 'amber' },
];

const recentActivity = [
  { user: 'Dr. Rajesh Kumar', action: 'Prescribed medication', patient: 'John Sharma', time: '2m ago', role: 'Doctor', avatar: 'RK' },
  { user: 'Priya Patel', action: 'Uploaded CBC results', patient: 'Aisha Khan', time: '14m ago', role: 'Lab Tech', avatar: 'PP' },
  { user: 'Aisha Khan', action: 'Checked in for shift', patient: null, time: '28m ago', role: 'Nurse', avatar: 'AK' },
  { user: 'Admin', action: 'Created new role', patient: null, time: '1h ago', role: 'Admin', avatar: 'AD' },
  { user: 'Dr. Priya Singh', action: 'Added medical notes', patient: 'Ravi Patel', time: '2h ago', role: 'Doctor', avatar: 'PS' },
];

const staff = [
  { id: 1, name: 'Dr. Rajesh Kumar', role: 'Doctor', dept: 'Cardiology', status: 'Active', patients: 24 },
  { id: 2, name: 'Priya Patel', role: 'Lab Tech', dept: 'Laboratory', status: 'Active', patients: 12 },
  { id: 3, name: 'Aisha Khan', role: 'Nurse', dept: 'General Ward', status: 'On Leave', patients: 0 },
  { id: 4, name: 'Dr. Priya Singh', role: 'Doctor', dept: 'Neurology', status: 'Active', patients: 18 },
  { id: 5, name: 'Arun Mehta', role: 'Lab Tech', dept: 'Pathology', status: 'Active', patients: 8 },
];

const appointments = [
  { id: 1, patient: 'John Sharma', doctor: 'Dr. Rajesh Kumar', dept: 'Cardiology', time: '10:00 AM', status: 'Approved' },
  { id: 2, patient: 'Jane Smith', doctor: 'Dr. Amit Patel', dept: 'Orthopedics', time: '11:30 AM', status: 'Pending' },
  { id: 3, patient: 'Ravi Patel', doctor: 'Dr. Priya Singh', dept: 'Neurology', time: '2:00 PM', status: 'Pending' },
  { id: 4, patient: 'Sara Ahmed', doctor: 'Dr. Anjali Desai', dept: 'General', time: '3:30 PM', status: 'Approved' },
];

// Components
function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    Doctor: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    'Lab Tech': 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
    Nurse: 'bg-pink-50 text-pink-700 ring-1 ring-pink-200',
    Admin: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${styles[role] || styles.Admin}`}>
      {role}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Active: 'bg-emerald-50 text-emerald-700',
    'On Leave': 'bg-amber-50 text-amber-700',
    Approved: 'bg-emerald-50 text-emerald-700',
    Pending: 'bg-amber-50 text-amber-700',
    Cancelled: 'bg-red-50 text-red-700',
  };
  const dots: Record<string, string> = {
    Active: 'bg-emerald-500',
    'On Leave': 'bg-amber-500',
    Approved: 'bg-emerald-500',
    Pending: 'bg-amber-500',
    Cancelled: 'bg-red-500',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status]}`} />
      {status}
    </span>
  );
}

function Avatar({ initials, color = 'blue', size = 'md' }: { initials: string; color?: string; size?: 'sm' | 'md' | 'lg' }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    violet: 'bg-violet-100 text-violet-700',
    amber: 'bg-amber-100 text-amber-700',
    pink: 'bg-pink-100 text-pink-700',
    slate: 'bg-slate-100 text-slate-700',
  };
  
  const sizes = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm'
  };
  
  return (
    <div className={`rounded-full flex items-center justify-center font-bold ${sizes[size]} ${colors[color] || colors.slate} flex-shrink-0`}>
      {initials}
    </div>
  );
}

function StatsCard({ stat }: { stat: typeof stats[0] }) {
  const Icon = stat.icon;
  const colorMap: Record<string, { bg: string; icon: string; badge: string }> = {
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', badge: stat.up ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600' },
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', badge: stat.up ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600' },
    violet: { bg: 'bg-violet-50', icon: 'text-violet-600', badge: stat.up ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600' },
    amber: { bg: 'bg-amber-50', icon: 'text-amber-600', badge: stat.up ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700' },
  };
  const c = colorMap[stat.color];

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-lg ${c.bg}`}>
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${c.badge}`}>
          {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {stat.change}
        </span>
      </div>
      <p className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</p>
      <p className="text-sm text-slate-500">{stat.label}</p>
    </div>
  );
}

function MiniChart() {
  const bars = [40, 65, 55, 80, 70, 90, 75, 95, 85, 100, 88, 92];
  return (
    <div className="flex items-end gap-1 h-12">
      {bars.map((h, i) => (
        <div
          key={i}
          className={`flex-1 rounded-sm transition-all ${i === bars.length - 1 ? 'bg-blue-500' : 'bg-slate-100 hover:bg-blue-200'}`}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

function DonutChart() {
  const segments = [
    { label: 'Doctors', value: 48, color: '#3b82f6' },
    { label: 'Nurses', value: 86, color: '#8b5cf6' },
    { label: 'Lab Techs', value: 34, color: '#10b981' },
    { label: 'Admin', value: 12, color: '#f59e0b' },
  ];
  const total = segments.reduce((a, b) => a + b.value, 0);
  let offset = 0;
  const r = 40;
  const circ = 2 * Math.PI * r;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative flex-shrink-0">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#f1f5f9" strokeWidth="14" />
          {segments.map((seg, i) => {
            const portion = (seg.value / total) * circ;
            const dash = `${portion} ${circ - portion}`;
            const rotation = (offset / total) * 360 - 90;
            offset += seg.value;
            return (
              <circle
                key={i}
                cx="50"
                cy="50"
                r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth="14"
                strokeDasharray={dash}
                transform={`rotate(${rotation} 50 50)`}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-lg font-bold text-slate-900">{total}</p>
          <p className="text-[9px] text-slate-400 font-medium">Staff</p>
        </div>
      </div>
      <div className="space-y-2 w-full sm:w-auto">
        {segments.map(seg => (
          <div key={seg.label} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: seg.color }} />
            <span className="text-xs text-slate-600 flex-1">{seg.label}</span>
            <span className="text-xs font-semibold text-slate-900">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'staff' | 'appointments'>('overview');
  const [staffSearch, setStaffSearch] = useState('');
  const [appointmentFilter, setAppointmentFilter] = useState('All');

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(staffSearch.toLowerCase()) ||
    s.role.toLowerCase().includes(staffSearch.toLowerCase()) ||
    s.dept.toLowerCase().includes(staffSearch.toLowerCase())
  );

  const filteredAppointments = appointments.filter(apt => 
    appointmentFilter === 'All' ? true : apt.status === appointmentFilter
  );

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">Good morning, Admin 👋</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Here's what's happening at your hospital today.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-lg px-3 py-2 self-start sm:self-auto">
          <Calendar className="w-3.5 h-3.5" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={stat.label} style={{ animationDelay: `${i * 60}ms` }} className="animate-slide-in">
            <StatsCard stat={stat} />
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Appointment Trends</h3>
              <p className="text-xs text-slate-400 mt-0.5">Last 12 months</p>
            </div>
            <div className="flex items-center gap-2">
              {['6M', '1Y', 'All'].map(t => (
                <button key={t} className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${t === '1Y' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-3">
            <span className="text-2xl font-bold text-slate-900">1,284</span>
            <span className="text-sm text-emerald-600 font-medium ml-2">↑ 18.2% vs last year</span>
          </div>
          <MiniChart />
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Staff Distribution</h3>
              <p className="text-xs text-slate-400 mt-0.5">By role</p>
            </div>
            <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <DonutChart />
        </div>
      </div>

      {/* Tabs + Content */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="flex items-center gap-1 px-5 border-b border-slate-100 min-w-max">
            {(['overview', 'staff', 'appointments'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium capitalize transition-all border-b-2 -mb-px whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab === 'overview' ? 'Recent Activity' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5">
          {activeTab === 'overview' && (
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-2">
                  <Avatar
                    initials={item.avatar}
                    color={item.role === 'Doctor' ? 'blue' : item.role === 'Lab Tech' ? 'violet' : item.role === 'Nurse' ? 'pink' : 'slate'}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-slate-900">{item.user}</span>
                      <RoleBadge role={item.role} />
                    </div>
                    <p className="text-xs text-slate-500">
                      {item.action}
                      {item.patient && <> · <span className="font-medium text-slate-700">{item.patient}</span></>}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0 pt-0.5">{item.time}</span>
                </div>
              ))}
              <button className="w-full text-center text-xs text-blue-600 hover:text-blue-700 font-medium py-2 hover:bg-blue-50 rounded-lg transition-colors mt-2">
                View all activity →
              </button>
            </div>
          )}

          {activeTab === 'staff' && (
            <div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Search staff..."
                    value={staffSearch}
                    onChange={(e) => setStaffSearch(e.target.value)}
                    className="w-full sm:w-64 pl-8 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <button className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  <UserPlus className="w-3.5 h-3.5" />
                  Add Staff
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {['Name', 'Role', 'Department', 'Patients', 'Status', 'Actions'].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-slate-500 pb-3 pr-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStaff.map((s) => (
                      <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2.5">
                            <Avatar initials={s.name.split(' ').map(n => n[0]).slice(0,2).join('')} color="blue" size="md" />
                            <span className="text-sm font-medium text-slate-900">{s.name}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4"><RoleBadge role={s.role} /></td>
                        <td className="py-3 pr-4 text-sm text-slate-500">{s.dept}</td>
                        <td className="py-3 pr-4 text-sm text-slate-700 font-medium">{s.patients}</td>
                        <td className="py-3 pr-4"><StatusBadge status={s.status} /></td>
                        <td className="py-3">
                          <div className="flex items-center gap-1">
                            <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
                <p className="text-sm text-slate-500">Today's appointments</p>
                <div className="flex gap-2">
                  {['All', 'Approved', 'Pending'].map(f => (
                    <button 
                      key={f} 
                      onClick={() => setAppointmentFilter(f)}
                      className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                        appointmentFilter === f 
                          ? 'bg-slate-100 text-slate-700' 
                          : 'text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                {filteredAppointments.map((apt) => (
                  <div key={apt.id} className="flex flex-wrap sm:flex-nowrap items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100 group">
                    <div className="w-1.5 h-8 rounded-full flex-shrink-0" style={{ background: apt.status === 'Approved' ? '#10b981' : '#f59e0b' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{apt.patient}</p>
                      <p className="text-xs text-slate-500">{apt.doctor} · {apt.dept}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-auto sm:ml-0">
                      <p className="text-sm font-medium text-slate-700">{apt.time}</p>
                      <StatusBadge status={apt.status} />
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-all">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Add Doctor', icon: Stethoscope, color: 'text-blue-600 bg-blue-50 hover:bg-blue-100' },
          { label: 'Add Lab Tech', icon: TestTube, color: 'text-violet-600 bg-violet-50 hover:bg-violet-100' },
          { label: 'Add Nurse', icon: Heart, color: 'text-pink-600 bg-pink-50 hover:bg-pink-100' },
          { label: 'View Reports', icon: FileText, color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' },
        ].map(action => {
          const Icon = action.icon;
          return (
            <button key={action.label} className={`flex items-center justify-center sm:justify-start gap-2 p-4 rounded-xl font-medium text-sm transition-all border border-transparent hover:border-slate-100 hover:shadow-sm ${action.color}`}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">{action.label}</span>
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease forwards;
        }
      `}</style>
    </div>
  );
}