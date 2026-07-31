// types/index.ts
export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'M' | 'F' | 'O';
  bloodGroup: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory: MedicalHistory[];
  allergies: string[];
  registrationDate: string;
  lastVisit?: string;
  status: 'active' | 'inactive' | 'admitted' | 'discharged' | 'pending' | 'approved' | 'rejected' | 'suspended';
  assignedDoctorId?: string;
  assignedNurseId?: string;
  roomNumber?: string;
  bedNumber?: string;
}

export interface MedicalHistory {
  id: string;
  condition: string;
  diagnosedDate: string;
  status: 'active' | 'resolved' | 'chronic';
  notes?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  medications: Medication[];
  diagnosis: string;
  notes: string;
  status: 'active' | 'completed' | 'cancelled';
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  route: string;
  instructions: string;
}

export interface LabReport {
  id: string;
  patientId: string;
  patientName: string;
  testName: string;
  testType: string;
  orderedBy: string;
  orderedDate: string;
  resultDate?: string;
  result: string;
  normalRange: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  technician: string;
  notes?: string;
  fileUrl?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  nurseId?: string;
  nurseName?: string;
  specialty: string;
  date: string;
  time: string;
  type: 'in-person' | 'video' | 'phone';
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  purpose: string;
  symptoms: string;
  diagnosis?: string;
  notes?: string;
  followUpDate?: string;
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
  phone: string;
  email: string;
}

export interface Nurse {
  id: string;
  name: string;
  specialization: string;
  status: 'available' | 'on-duty' | 'break' | 'off-duty';
  assignedPatients: number;
  avatar: string;
  phone: string;
  email: string;
}

export interface DashboardStats {
  totalPatients: number;
  activePatients: number;
  admittedPatients: number;
  dischargedPatients: number;
  totalAppointments: number;
  todayAppointments: number;
  pendingLabReports: number;
  completedLabReports: number;
  activePrescriptions: number;
  availableDoctors: number;
  availableNurses: number;
  criticalPatients: number;
}

// Add this export for TabType
export type TabType = 'overview' | 'patients' | 'patientDetails' | 'assignments' | 'prescriptions' | 'labReports' | 'appointments';
