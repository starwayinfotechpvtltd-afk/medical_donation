// types/index.ts
export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'M' | 'F' | 'O';
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory: string[];
  allergies: string[];
  registrationDate: string;
  lastVisit?: string;
}

export interface Token {
  id: string;
  tokenNumber: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  department: string;
  status: 'pending' | 'waiting' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'normal' | 'urgent' | 'emergency';
  createdDate: string;
  createdTime: string;
  estimatedWaitTime: number;
  actualStartTime?: string;
  completionTime?: string;
  roomNumber?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  type: 'in-person' | 'video' | 'phone';
  purpose: string;
  symptoms: string;
  tokenNumber?: string;
  roomNumber?: string;
  notes?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  departmentIds?: string[];
  availability: 'available' | 'busy' | 'off';
  room: string;
  currentPatient?: string;
  nextPatient?: string;
}

export interface Department {
  id: string;
  name: string;
  head: string;
  location: string;
  tokenCounter: number;
}

export interface Receptionist {
  id: string;
  name: string;
  station: string;
  status: 'active' | 'inactive';
}

export interface DashboardStats {
  totalPatients: number;
  todayPatients: number;
  activeTokens: number;
  completedTokens: number;
  waitingTokens: number;
  urgentTokens: number;
  availableDoctors: number;
  busyDoctors: number;
  appointmentsToday: number;
}

// Add TabType export
export type TabType = 'overview' | 'register' | 'tokens' | 'appointments' | 'patients';
