'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  UserPlus,
  Ticket,
  Calendar,
  Users,
  Bell,
  User,
  Menu,
  X,
  LogOut,
  Settings,
} from 'lucide-react';

import { TabType, DashboardStats, Patient, Token, Appointment, Doctor, Department } from './types';
import OverviewTab from './tabs/OverviewTab';
import RegisterPatientTab from './tabs/RegisterPatientTab';
import TokenManagementTab from './tabs/TokenManagementTab';
import AppointmentsTab from './tabs/AppointmentsTab';
import PatientsTab from './tabs/PatientsTab';
import { offlinePatientApi, type OfflineIntakePayload } from '@/lib/offline-patient-api';
import { useAuth } from '@/context/AuthContext';
import { getLoginPathForRole } from '@/lib/auth-routes';

const asString = (value: unknown) => (value === null || value === undefined ? '' : String(value));
const datePart = (value: unknown) => asString(value).slice(0, 10);
const timePart = (value: unknown) => asString(value).slice(0, 5);

const calculateAge = (dateOfBirth: unknown) => {
  const dob = new Date(asString(dateOfBirth));
  if (Number.isNaN(dob.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDelta = today.getMonth() - dob.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < dob.getDate())) age -= 1;
  return Math.max(age, 0);
};

const normalizeGender = (gender: unknown): Patient['gender'] => {
  const value = asString(gender).toLowerCase();
  if (value.startsWith('m')) return 'M';
  if (value.startsWith('f')) return 'F';
  return 'O';
};

const normalizeTokenStatus = (status: unknown): Token['status'] => {
  const value = asString(status).replace('_', '-');
  if (value === 'pending' || value === 'waiting' || value === 'in-progress' || value === 'completed' || value === 'cancelled') return value;
  return 'pending';
};

const normalizeAppointmentStatus = (status: unknown): Appointment['status'] => {
  const value = asString(status).replace('_', '-');
  if (value === 'pending') return 'scheduled';
  if (value === 'confirmed' || value === 'in-progress' || value === 'completed' || value === 'cancelled' || value === 'no-show') return value;
  return 'scheduled';
};

const mapPatient = (row: Record<string, unknown>): Patient => ({
  id: asString(row.id),
  name: `${asString(row.first_name)} ${asString(row.last_name)}`.trim(),
  email: asString(row.email),
  phone: asString(row.phone),
  age: calculateAge(row.date_of_birth),
  gender: normalizeGender(row.gender),
  address: asString(row.address),
  emergencyContact: {
    name: asString(row.emergency_contact),
    phone: asString(row.emergency_phone),
    relationship: 'Emergency',
  },
  medicalHistory: asString(row.chronic_conditions).split(',').map((item) => item.trim()).filter(Boolean),
  allergies: asString(row.allergies).split(',').map((item) => item.trim()).filter(Boolean),
  registrationDate: datePart(row.created_at),
  lastVisit: datePart(row.last_visit) || undefined,
});

const mapDoctor = (row: Record<string, unknown>): Doctor => ({
  id: asString(row.id),
  name: `${asString(row.first_name)} ${asString(row.last_name)}`.trim(),
  specialty: asString(row.specialization) || asString(row.department) || 'General Medicine',
  departmentIds: asString(row.department_ids).split(',').filter(Boolean),
  availability: 'available',
  room: '',
});

const mapDepartment = (row: Record<string, unknown>): Department => ({
  id: asString(row.id),
  name: asString(row.name),
  head: '',
  location: '',
  tokenCounter: 0,
});

const mapToken = (row: Record<string, unknown>): Token => ({
  id: asString(row.id),
  tokenNumber: asString(row.token_number),
  patientId: asString(row.patient_id),
  patientName: `${asString(row.patient_first_name)} ${asString(row.patient_last_name)}`.trim(),
  doctorId: asString(row.doctor_profile_id),
  doctorName: `${asString(row.doctor_first_name)} ${asString(row.doctor_last_name)}`.trim() || 'Unassigned',
  specialty: asString(row.specialization) || asString(row.department_name) || 'General Medicine',
  department: asString(row.department_name),
  status: normalizeTokenStatus(row.status),
  priority: (asString(row.priority) as Token['priority']) || 'normal',
  createdDate: datePart(row.created_at),
  createdTime: timePart(row.created_at),
  estimatedWaitTime: Number(row.estimated_wait_time || 15),
  roomNumber: asString(row.room_number) || undefined,
});

const mapAppointment = (row: Record<string, unknown>): Appointment => ({
  id: asString(row.appointment_id),
  patientId: asString(row.patient_id),
  patientName: `${asString(row.patient_first_name)} ${asString(row.patient_last_name)}`.trim(),
  doctorId: asString(row.doctor_profile_id),
  doctorName: `${asString(row.doctor_first_name)} ${asString(row.doctor_last_name)}`.trim() || 'Unassigned',
  specialty: asString(row.specialization) || asString(row.department_name) || 'General Medicine',
  date: datePart(row.scheduled_date),
  time: timePart(row.scheduled_time),
  status: normalizeAppointmentStatus(row.appointment_status),
  type: 'in-person',
  purpose: asString(row.reason),
  symptoms: asString(row.disease),
  tokenNumber: asString(row.token_number),
  roomNumber: asString(row.room_number) || undefined,
});

export default function OfflinePatientDashboard() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user, logout } = useAuth();
  const canAccess = isAuthenticated && (user?.role === 'offline_patient' || user?.role === 'reception' || user?.role === 'admin');
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    todayPatients: 0,
    activeTokens: 0,
    completedTokens: 0,
    waitingTokens: 0,
    urgentTokens: 0,
    availableDoctors: 0,
    busyDoctors: 0,
    appointmentsToday: 0
  });

  const loadDashboard = async () => {
    if (!canAccess) return;
    setLoading(true);
    setError('');
    try {
      const data = await offlinePatientApi.getDashboard();
      const tokenRows = data.tokens || [];
      setPatients((data.patients || []).map(mapPatient));
      setDoctors((data.doctors || []).map(mapDoctor));
      setDepartments((data.departments || []).map(mapDepartment));
      setTokens(tokenRows.map(mapToken));
      setAppointments(tokenRows.map(mapAppointment));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load offline patient dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !canAccess) {
      router.replace(getLoginPathForRole('offline_patient'));
      return;
    }
    if (!authLoading && canAccess) void loadDashboard();
  }, [authLoading, canAccess, router]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    
    setStats({
      totalPatients: patients.length,
      todayPatients: patients.filter(p => p.registrationDate === today).length,
      activeTokens: tokens.filter(t => t.status === 'pending' || t.status === 'waiting' || t.status === 'in-progress').length,
      completedTokens: tokens.filter(t => t.status === 'completed').length,
      waitingTokens: tokens.filter(t => t.status === 'waiting').length,
      urgentTokens: tokens.filter(t => t.priority === 'urgent' || t.priority === 'emergency').length,
      availableDoctors: doctors.filter(d => d.availability === 'available').length,
      busyDoctors: doctors.filter(d => d.availability === 'busy').length,
      appointmentsToday: appointments.filter(a => a.date === today).length
    });
  }, [patients, tokens, appointments, doctors]);

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'register', label: 'Register Patient', icon: UserPlus },
    { id: 'tokens', label: 'Token Management', icon: Ticket },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'patients', label: 'Patient List', icon: Users }
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'waiting': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-purple-100 text-purple-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'confirmed': 'bg-green-100 text-green-800',
      'scheduled': 'bg-blue-100 text-blue-800',
      'no-show': 'bg-gray-100 text-gray-800',
      'available': 'bg-green-100 text-green-800',
      'busy': 'bg-yellow-100 text-yellow-800',
      'off': 'bg-gray-100 text-gray-800',
      'normal': 'bg-green-100 text-green-800',
      'urgent': 'bg-orange-100 text-orange-800',
      'emergency': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'urgent': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderTab = () => {
    if (loading) {
      return <div className="rounded-xl border bg-white p-6 text-sm text-gray-500">Loading offline patient dashboard...</div>;
    }

    if (error) {
      return (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          <p>{error}</p>
          <button onClick={loadDashboard} className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white">Retry</button>
        </div>
      );
    }

    switch(activeTab) {
      case 'overview':
        return (
          <OverviewTab 
            stats={stats}
            tokens={tokens}
            appointments={appointments}
            doctors={doctors}
            patients={patients}
            getStatusColor={getStatusColor}
            getPriorityColor={getPriorityColor}
          />
        );
      case 'register':
        return (
          <RegisterPatientTab 
            patients={patients}
            setPatients={setPatients}
            departments={departments}
            doctors={doctors}
            tokens={tokens}
            setTokens={setTokens}
            appointments={appointments}
            setAppointments={setAppointments}
            onRegister={async (payload: OfflineIntakePayload) => {
              const result = await offlinePatientApi.createIntake(payload);
              await loadDashboard();
              return result;
            }}
          />
        );
      case 'tokens':
        return (
          <TokenManagementTab 
            tokens={tokens}
            setTokens={setTokens}
            doctors={doctors}
            patients={patients}
            setDoctors={setDoctors}  
            appointments={appointments}
            setAppointments={setAppointments}
            onUpdateStatus={async (tokenId, status) => {
              await offlinePatientApi.updateTokenStatus(tokenId, status.replace('-', '_'));
              await loadDashboard();
            }}
            getStatusColor={getStatusColor}
            getPriorityColor={getPriorityColor}
          />
        );
      case 'appointments':
        return (
          <AppointmentsTab 
            appointments={appointments}
            tokens={tokens}
            doctors={doctors}
            patients={patients}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            getStatusColor={getStatusColor}
          />
        );
      case 'patients':
        return (
          <PatientsTab 
            patients={patients}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        );
      default:
        return null;
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!canAccess) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Patient Management</h1>
                <p className="text-xs text-gray-500">Offline Patient Registration</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-gray-100">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="hidden md:inline text-sm font-medium text-gray-700">{user?.name || 'Receptionist'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `} style={{ top: '60px' }}>
        <nav className="h-full overflow-y-auto p-4">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as TabType);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="pt-4 border-t border-gray-200 space-y-1">
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50">
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button
                onClick={() => {
                  logout();
                  router.replace(getLoginPathForRole('offline_patient'));
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 pt-[60px]">
        <div className="p-6">
          {renderTab()}
        </div>
      </main>
    </div>
  );
}
