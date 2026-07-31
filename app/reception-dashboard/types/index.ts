export interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  doctorId: string;
  specialty: string;
  date: string;
  time: string;
  type: 'in-person' | 'video' | 'phone';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  purpose: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  experience: number;
  availability: 'available' | 'busy' | 'off';
  rating: number;
  patientsCount: number;
  avatar: string;
  room: string;
  nextAvailableSlot: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'M' | 'F';
  lastVisit: string;
  appointments: number;
  avatar: string;
}

export interface Nurse {
  id: string;
  name: string;
  specialization: string;
  status: 'available' | 'on-duty' | 'break' | 'off-duty';
  assignedPatients: number;
  avatar: string;
}

export interface Lab {
  id: string;
  name: string;
  type: string;
  status: 'operational' | 'busy' | 'maintenance';
  currentTests: number;
  capacity: number;
  technician: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'present' | 'absent' | 'on-leave';
  shift: 'morning' | 'evening' | 'night';
  phone: string;
  email: string;
  avatar: string;
}

export interface DashboardStats {
  totalAppointments: number;
  todayAppointments: number;
  availableDoctors: number;
  totalPatients: number;
  availableNurses: number;
  activeLabs: number;
  presentStaff: number;
  pendingTasks: number;
}

export type TabType = 'overview' | 'appointments' | 'doctors' | 'patients' | 'nurses' | 'labs' | 'staff';