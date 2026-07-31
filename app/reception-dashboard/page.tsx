'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  Heart,
  FlaskRound,
  Building,
  Calendar,
  Bell,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut
} from 'lucide-react';

import { TabType, DashboardStats, Appointment, Doctor, Patient } from './types';
import { 
  mockNurses, 
  mockLabs, 
  mockStaff 
} from './data/mockData';
import OverviewTab from './tabs/OverviewTab';
import AppointmentsTab from './tabs/AppointmentsTab';
import DoctorsTab from './tabs/DoctorsTab';
import PatientsTab from './tabs/PatientsTab';
import NursesTab from './tabs/NursesTab';
import LabsTab from './tabs/LabsTab';
import StaffTab from './tabs/StaffTab';
import { offlinePatientApi } from '@/lib/offline-patient-api';
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

const mapAppointment = (row: Record<string, unknown>): Appointment => ({
  id: asString(row.appointment_id),
  patientName: `${asString(row.patient_first_name)} ${asString(row.patient_last_name)}`.trim(),
  patientId: asString(row.token_number) || asString(row.patient_id),
  doctorName: `${asString(row.doctor_first_name)} ${asString(row.doctor_last_name)}`.trim() || 'Unassigned',
  doctorId: asString(row.doctor_profile_id),
  specialty: asString(row.specialization) || asString(row.department_name) || 'General Medicine',
  date: datePart(row.scheduled_date),
  time: timePart(row.scheduled_time),
  type: 'in-person',
  status: asString(row.appointment_status) === 'pending' ? 'scheduled' : (asString(row.appointment_status).replace('_', '-') as Appointment['status']),
  purpose: asString(row.reason || row.disease),
});

const mapDoctor = (row: Record<string, unknown>): Doctor => ({
  id: asString(row.id),
  name: `${asString(row.first_name)} ${asString(row.last_name)}`.trim(),
  specialty: asString(row.specialization) || asString(row.department) || 'General Medicine',
  qualification: '',
  experience: 0,
  availability: 'available',
  rating: 0,
  patientsCount: 0,
  avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(`${asString(row.first_name)} ${asString(row.last_name)}`)}&background=2563eb&color=fff`,
  room: '',
  nextAvailableSlot: '',
});

const mapPatient = (row: Record<string, unknown>): Patient => ({
  id: asString(row.id),
  name: `${asString(row.first_name)} ${asString(row.last_name)}`.trim(),
  email: asString(row.email),
  phone: asString(row.phone),
  age: calculateAge(row.date_of_birth),
  gender: asString(row.gender).toLowerCase().startsWith('f') ? 'F' : 'M',
  lastVisit: datePart(row.last_visit),
  appointments: Number(row.appointments_count || 0),
  avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(`${asString(row.first_name)} ${asString(row.last_name)}`)}&background=6b7280&color=fff`,
});

export default function ReceptionDashboard() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user, logout } = useAuth();
  const canAccess = isAuthenticated && (user?.role === 'reception' || user?.role === 'admin');
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [tokenNumber, setTokenNumber] = useState('');
  const [approvingToken, setApprovingToken] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [nurses, setNurses] = useState(mockNurses);
  const [labs, setLabs] = useState(mockLabs);
  const [staff, setStaff] = useState(mockStaff);
  const [stats, setStats] = useState<DashboardStats>({
    totalAppointments: 0,
    todayAppointments: 0,
    availableDoctors: 0,
    totalPatients: 0,
    availableNurses: 0,
    activeLabs: 0,
    presentStaff: 0,
    pendingTasks: 0
  });

  const loadDashboard = async () => {
    if (!canAccess) return;
    setLoading(true);
    setError('');
    try {
      const data = await offlinePatientApi.getDashboard();
      setAppointments((data.tokens || []).map(mapAppointment));
      setDoctors((data.doctors || []).map(mapDoctor));
      setPatients((data.patients || []).map(mapPatient));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reception dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !canAccess) {
      router.replace(getLoginPathForRole('reception'));
      return;
    }
    if (!authLoading && canAccess) void loadDashboard();
  }, [authLoading, canAccess, router]);

  useEffect(() => {
    setStats({
      totalAppointments: appointments.length,
      todayAppointments: appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length,
      availableDoctors: doctors.filter(d => d.availability === 'available').length,
      totalPatients: patients.length,
      availableNurses: nurses.filter(n => n.status === 'available').length,
      activeLabs: labs.filter(l => l.status === 'operational' || l.status === 'busy').length,
      presentStaff: staff.filter(s => s.status === 'present').length,
      pendingTasks: appointments.filter(a => a.status === 'scheduled').length
    });
  }, [appointments, doctors, patients, nurses, labs, staff]);

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'nurses', label: 'Nurses', icon: Heart },
    { id: 'labs', label: 'Labs', icon: FlaskRound },
    { id: 'staff', label: 'Staff', icon: Building }
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'scheduled': 'bg-blue-100 text-blue-800',
      'confirmed': 'bg-green-100 text-green-800',
      'completed': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800',
      'no-show': 'bg-orange-100 text-orange-800',
      'available': 'bg-green-100 text-green-800',
      'busy': 'bg-yellow-100 text-yellow-800',
      'off': 'bg-gray-100 text-gray-800',
      'on-duty': 'bg-blue-100 text-blue-800',
      'break': 'bg-yellow-100 text-yellow-800',
      'off-duty': 'bg-gray-100 text-gray-800',
      'operational': 'bg-green-100 text-green-800',
      'maintenance': 'bg-yellow-100 text-yellow-800',
      'present': 'bg-green-100 text-green-800',
      'absent': 'bg-red-100 text-red-800',
      'on-leave': 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const renderTab = () => {
    if (loading) {
      return <div className="rounded-xl border bg-white p-6 text-sm text-gray-500">Loading reception dashboard...</div>;
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
            appointments={appointments}
            doctors={doctors}
            patients={patients}
            nurses={nurses}
            labs={labs}
            staff={staff}
            getStatusColor={getStatusColor}
          />
        );
      case 'appointments':
        return (
          <AppointmentsTab 
            appointments={appointments}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            getStatusColor={getStatusColor}
            tokenNumber={tokenNumber}
            setTokenNumber={setTokenNumber}
            approvingToken={approvingToken}
            approveToken={async () => {
              if (!tokenNumber.trim()) return;
              setApprovingToken(true);
              try {
                await offlinePatientApi.approveToken(tokenNumber.trim());
                setTokenNumber('');
                await loadDashboard();
              } finally {
                setApprovingToken(false);
              }
            }}
          />
        );
      case 'doctors':
        return (
          <DoctorsTab 
            doctors={doctors}
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
      case 'nurses':
        return (
          <NursesTab 
            nurses={nurses}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            getStatusColor={getStatusColor}
          />
        );
      case 'labs':
        return (
          <LabsTab 
            labs={labs}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            getStatusColor={getStatusColor}
          />
        );
      case 'staff':
        return (
          <StaffTab 
            staff={staff}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            getStatusColor={getStatusColor}
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
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Reception Dashboard</h1>
                <p className="text-xs text-gray-500">Hospital Management</p>
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
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  logout();
                  router.replace(getLoginPathForRole('reception'));
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
