'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  User,
  Stethoscope,
  Heart,
  ClipboardList,
  FileText,
  Calendar,
  Bell,
  Menu,
  X,
  LogOut,
  Settings,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

import { TabType, DashboardStats, Patient, Doctor, Nurse, Prescription, LabReport, Appointment } from './types';
import { adminApi, type AdminPatient, type AdminPatientDetail, type DoctorProfile, type StaffUser } from '@/lib/admin-api';
import OverviewTab from './tabs/OverviewTab';
import PatientsTab from './tabs/PatientsTab';
import PatientDetailsTab from './tabs/PatientDetailsTab';
import AssignmentsTab from './tabs/AssignmentsTab';
import PrescriptionsTab from './tabs/PrescriptionsTab';
import LabReportsTab from './tabs/LabReportsTab';
import AppointmentsTab from './tabs/AppointmentsTab';
import { useAuth } from '@/context/AuthContext';
import { getLoginPathForRole } from '@/lib/auth-routes';

const calculateAge = (dateOfBirth?: string | null) => {
  if (!dateOfBirth) return 0;
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDelta = today.getMonth() - dob.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < dob.getDate())) age -= 1;
  return Math.max(age, 0);
};

const normalizeGender = (gender?: string | null): Patient['gender'] => {
  const value = String(gender || '').toLowerCase();
  if (value.startsWith('m')) return 'M';
  if (value.startsWith('f')) return 'F';
  return 'O';
};

const normalizeAppointmentStatus = (status?: string): Appointment['status'] => {
  if (status === 'pending') return 'scheduled';
  if (status === 'in_progress') return 'in-progress';
  if (status === 'no_show') return 'no-show';
  if (status === 'confirmed' || status === 'completed' || status === 'cancelled') return status;
  return 'scheduled';
};

const normalizeLabStatus = (status?: string): LabReport['status'] => {
  if (status === 'in_progress') return 'in-progress';
  if (status === 'completed' || status === 'cancelled' || status === 'pending' || status === 'in-progress') return status;
  return 'pending';
};

const mapPatient = (patient: AdminPatient, detail: AdminPatientDetail | null): Patient => {
  const latestAppointment = detail?.appointments?.[0];
  const doctorProfileId = latestAppointment?.doctor_profile_id ? String(latestAppointment.doctor_profile_id) : undefined;
  return {
    id: String(patient.id),
    name: `${patient.first_name} ${patient.last_name}`.trim(),
    email: patient.email,
    phone: patient.phone || '',
    age: calculateAge(detail?.date_of_birth),
    gender: normalizeGender(detail?.gender),
    bloodGroup: detail?.blood_type || 'unknown',
    address: [detail?.address, detail?.city, detail?.state, detail?.country].filter(Boolean).join(', '),
    emergencyContact: {
      name: detail?.emergency_contact || '',
      phone: detail?.emergency_phone || '',
      relationship: 'Emergency',
    },
    medicalHistory: [
      ...(detail?.chronic_conditions ? [{
        id: `${patient.id}-condition`,
        condition: detail.chronic_conditions,
        diagnosedDate: patient.created_at?.slice(0, 10) || '',
        status: 'chronic' as const,
      }] : []),
    ],
    allergies: detail?.allergies ? detail.allergies.split(',').map((item) => item.trim()).filter(Boolean) : [],
    registrationDate: patient.created_at?.slice(0, 10) || '',
    lastVisit: latestAppointment?.scheduled_date ? String(latestAppointment.scheduled_date).slice(0, 10) : undefined,
    status: patient.registration_status,
    assignedDoctorId: doctorProfileId,
  };
};

const mapDoctor = (doctor: DoctorProfile): Doctor => ({
  id: String(doctor.id),
  name: `${doctor.first_name} ${doctor.last_name}`.trim(),
  specialty: doctor.specialization || 'General Medicine',
  qualification: doctor.qualification || '',
  experience: doctor.years_of_experience || 0,
  availability: 'available',
  rating: 0,
  patientsCount: 0,
  avatar: doctor.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(`${doctor.first_name} ${doctor.last_name}`)}&background=2563eb&color=fff`,
  room: '',
  phone: '',
  email: '',
});

const mapNurse = (user: StaffUser): Nurse => ({
  id: String(user.id),
  name: `${user.first_name} ${user.last_name}`.trim(),
  specialization: 'Nursing',
  status: user.status === 'active' ? 'available' : 'off-duty',
  assignedPatients: 0,
  avatar: user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(`${user.first_name} ${user.last_name}`)}&background=dc2626&color=fff`,
  phone: user.phone || '',
  email: user.email,
});

const mapAppointments = (detail: AdminPatientDetail): Appointment[] =>
  detail.appointments.map((appointment) => ({
    id: String(appointment.id),
    patientId: String(detail.id),
    patientName: `${detail.first_name} ${detail.last_name}`.trim(),
    doctorId: appointment.doctor_profile_id ? String(appointment.doctor_profile_id) : '',
    doctorName: `${String(appointment.doctor_first_name || '')} ${String(appointment.doctor_last_name || '')}`.trim() || 'Unassigned',
    specialty: String(appointment.doctor_specialization || 'General Medicine'),
    date: appointment.scheduled_date ? String(appointment.scheduled_date).slice(0, 10) : '',
    time: appointment.scheduled_time ? String(appointment.scheduled_time).slice(0, 5) : '',
    type: String(appointment.type) === 'teleconsultation' ? 'video' : 'in-person',
    status: normalizeAppointmentStatus(String(appointment.status || 'pending')),
    purpose: String(appointment.reason || appointment.disease || '-'),
    symptoms: String(appointment.disease || appointment.reason || '-'),
    notes: appointment.notes ? String(appointment.notes) : undefined,
  }));

const mapPrescriptions = (detail: AdminPatientDetail): Prescription[] =>
  detail.prescriptions.map((prescription) => ({
    id: String(prescription.id),
    patientId: String(detail.id),
    patientName: `${detail.first_name} ${detail.last_name}`.trim(),
    doctorId: prescription.doctor_profile_id ? String(prescription.doctor_profile_id) : '',
    doctorName: `${String(prescription.doctor_first_name || '')} ${String(prescription.doctor_last_name || '')}`.trim() || 'Unknown doctor',
    date: prescription.date_issued ? String(prescription.date_issued).slice(0, 10) : '',
    medications: [],
    diagnosis: String(prescription.diagnosis || prescription.notes || 'Prescription'),
    notes: String(prescription.notes || ''),
    status: 'active',
  }));

const mapLabReports = (detail: AdminPatientDetail): LabReport[] =>
  detail.lab_tests.map((lab) => ({
    id: `${String(lab.id)}-${String(lab.result_id || 'pending')}`,
    patientId: String(detail.id),
    patientName: `${detail.first_name} ${detail.last_name}`.trim(),
    testName: String(lab.test_name || lab.test_type || 'Lab test'),
    testType: String(lab.test_type || 'General'),
    orderedBy: `${String(lab.doctor_first_name || '')} ${String(lab.doctor_last_name || '')}`.trim() || 'Unknown doctor',
    orderedDate: lab.request_date ? String(lab.request_date).slice(0, 10) : '',
    resultDate: lab.completed_at ? String(lab.completed_at).slice(0, 10) : undefined,
    result: [lab.parameter, lab.value, lab.unit].filter(Boolean).map(String).join(' ') || '',
    normalRange: String(lab.normal_range || ''),
    status: normalizeLabStatus(String(lab.status || lab.result_status || 'pending')),
    technician: `${String(lab.technician_first_name || '')} ${String(lab.technician_last_name || '')}`.trim() || 'Unassigned',
    notes: lab.notes ? String(lab.notes) : undefined,
  }));

export default function PatientAdminDashboard() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user, logout } = useAuth();
  const canAccess = isAuthenticated && (user?.role === 'patient_admin' || user?.role === 'admin');

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [labReports, setLabReports] = useState<LabReport[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    activePatients: 0,
    admittedPatients: 0,
    dischargedPatients: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    pendingLabReports: 0,
    completedLabReports: 0,
    activePrescriptions: 0,
    availableDoctors: 0,
    availableNurses: 0,
    criticalPatients: 0
  });

  const loadDashboard = async () => {
    if (!canAccess) return;
    setLoading(true);
    setError('');
    try {
      const [patientRows, doctorRows, nurseRows] = await Promise.all([
        adminApi.getPatients(),
        adminApi.getDoctors(),
        adminApi.getUsers({ role: 'nurse', limit: 200, page: 1 }),
      ]);

      const detailRows = await Promise.all(
        patientRows.map((patient) =>
          adminApi.getPatientDetail(patient.id).catch(() => null)
        )
      );

      const validDetails = detailRows.filter(Boolean) as AdminPatientDetail[];
      setPatients(patientRows.map((patient) => mapPatient(patient, validDetails.find((detail) => detail.id === patient.id) || null)));
      setDoctors(doctorRows.map(mapDoctor));
      setNurses(nurseRows.data.map(mapNurse));
      setAppointments(validDetails.flatMap(mapAppointments));
      setPrescriptions(validDetails.flatMap(mapPrescriptions));
      setLabReports(validDetails.flatMap(mapLabReports));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load patient admin dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !canAccess) {
      router.replace(getLoginPathForRole('patient_admin'));
      return;
    }

    if (!authLoading && canAccess) {
      void loadDashboard();
    }
  }, [authLoading, canAccess, router]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    
    setStats({
      totalPatients: patients.length,
      activePatients: patients.filter(p => p.status === 'approved' || p.status === 'active').length,
      admittedPatients: patients.filter(p => p.status === 'admitted').length,
      dischargedPatients: patients.filter(p => p.status === 'discharged' || p.status === 'suspended').length,
      totalAppointments: appointments.length,
      todayAppointments: appointments.filter(a => a.date === today && (a.status === 'scheduled' || a.status === 'confirmed')).length,
      pendingLabReports: labReports.filter(l => l.status === 'pending' || l.status === 'in-progress').length,
      completedLabReports: labReports.filter(l => l.status === 'completed').length,
      activePrescriptions: prescriptions.filter(p => p.status === 'active').length,
      availableDoctors: doctors.filter(d => d.availability === 'available').length,
      availableNurses: nurses.filter(n => n.status === 'available' || n.status === 'on-duty').length,
      criticalPatients: patients.filter(p => p.status === 'admitted' && p.medicalHistory.length > 2).length
    });
  }, [patients, appointments, labReports, prescriptions, doctors, nurses]);

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'prescriptions', label: 'Prescriptions', icon: ClipboardList },
    { id: 'labReports', label: 'Lab Reports', icon: FileText },
    { id: 'assignments', label: 'Assignments', icon: Activity }
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'active': 'bg-green-100 text-green-800',
      'approved': 'bg-green-100 text-green-800',
      'inactive': 'bg-gray-100 text-gray-800',
      'suspended': 'bg-gray-100 text-gray-800',
      'rejected': 'bg-red-100 text-red-800',
      'admitted': 'bg-blue-100 text-blue-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'discharged': 'bg-purple-100 text-purple-800',
      'scheduled': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-green-100 text-green-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-purple-100 text-purple-800',
      'cancelled': 'bg-red-100 text-red-800',
      'no-show': 'bg-gray-100 text-gray-800',
      'available': 'bg-green-100 text-green-800',
      'busy': 'bg-yellow-100 text-yellow-800',
      'off': 'bg-gray-100 text-gray-800',
      'on-duty': 'bg-blue-100 text-blue-800',
      'break': 'bg-orange-100 text-orange-800',
      'off-duty': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSelectedPatient = () => {
    return patients.find(p => p.id === selectedPatientId) || null;
  };

  const approvePatient = async (id: string) => {
    if (!window.confirm('Approve this patient and enable dashboard access?')) return;
    await adminApi.approvePatient(Number(id));
    await loadDashboard();
  };

  const rejectPatient = async (id: string) => {
    const reason = window.prompt('Enter rejection reason');
    if (!reason?.trim()) return;
    await adminApi.rejectPatient(Number(id), reason.trim());
    await loadDashboard();
  };

  const deactivatePatient = async (id: string) => {
    if (!window.confirm('Suspend this patient and lock dashboard access?')) return;
    await adminApi.deactivatePatient(Number(id));
    await loadDashboard();
  };

  const deletePatient = async (id: string) => {
    if (!window.confirm('Delete this patient? This cannot be undone.')) return;
    await adminApi.deletePatient(Number(id));
    if (selectedPatientId === id) setSelectedPatientId(null);
    await loadDashboard();
  };

  const renderTab = () => {
    if (loading) {
      return (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-sm text-gray-500">
          Loading patient dashboard...
        </div>
      );
    }

    if (error) {
      return (
        <div className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          <p>{error}</p>
          <button onClick={loadDashboard} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white">Retry</button>
        </div>
      );
    }

    switch(activeTab) {
      case 'overview':
        return (
          <OverviewTab 
            stats={stats}
            patients={patients}
            appointments={appointments}
            doctors={doctors}
            nurses={nurses}
            prescriptions={prescriptions}
            labReports={labReports}
            getStatusColor={getStatusColor}
            onPatientSelect={(id) => {
              setSelectedPatientId(id);
              setActiveTab('patientDetails');
            }}
          />
        );
      case 'patients':
        return (
          <PatientsTab 
            patients={patients}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            getStatusColor={getStatusColor}
            onPatientSelect={(id) => {
              setSelectedPatientId(id);
              setActiveTab('patientDetails');
            }}
            onApprove={approvePatient}
            onReject={rejectPatient}
            onDeactivate={deactivatePatient}
            onDelete={deletePatient}
          />
        );
      case 'patientDetails':
        return (
          <PatientDetailsTab 
            patient={getSelectedPatient()}
            doctors={doctors}
            nurses={nurses}
            prescriptions={prescriptions}
            labReports={labReports}
            appointments={appointments}
            onBack={() => setActiveTab('patients')}
            getStatusColor={getStatusColor}
          />
        );
      case 'assignments':
        return (
          <AssignmentsTab 
            patients={patients}
            doctors={doctors}
            nurses={nurses}
            appointments={appointments}
            getStatusColor={getStatusColor}
            onPatientSelect={(id) => {
              setSelectedPatientId(id);
              setActiveTab('patientDetails');
            }}
          />
        );
      case 'prescriptions':
        return (
          <PrescriptionsTab 
            prescriptions={prescriptions}
            patients={patients}
            doctors={doctors}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            getStatusColor={getStatusColor}
          />
        );
      case 'labReports':
        return (
          <LabReportsTab 
            labReports={labReports}
            patients={patients}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            getStatusColor={getStatusColor}
          />
        );
      case 'appointments':
        return (
          <AppointmentsTab 
            appointments={appointments}
            patients={patients}
            doctors={doctors}
            nurses={nurses}
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
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Patient Admin</h1>
                <p className="text-xs text-gray-500">Patient Management</p>
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
              <span className="hidden md:inline text-sm font-medium text-gray-700">Admin</span>
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
                  router.replace(getLoginPathForRole('patient_admin'));
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
