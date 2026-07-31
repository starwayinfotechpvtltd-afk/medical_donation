import { Doctor, Patient, Nurse, Lab, Staff, Appointment } from '../types';

export const mockDoctors: Doctor[] = [
  { 
    id: '1', 
    name: 'Dr. Sarah Johnson', 
    specialty: 'Cardiology', 
    qualification: 'MD, FACC', 
    experience: 12, 
    availability: 'available', 
    rating: 4.8, 
    patientsCount: 1240, 
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=3b82f6&color=fff', 
    room: '101', 
    nextAvailableSlot: '2024-01-20T10:00:00' 
  },
  { 
    id: '2', 
    name: 'Dr. Michael Chen', 
    specialty: 'Neurology', 
    qualification: 'MD, PhD', 
    experience: 8, 
    availability: 'available', 
    rating: 4.9, 
    patientsCount: 980, 
    avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=10b981&color=fff', 
    room: '202', 
    nextAvailableSlot: '2024-01-20T14:00:00' 
  },
  { 
    id: '3', 
    name: 'Dr. Emily Rodriguez', 
    specialty: 'Pediatrics', 
    qualification: 'MD, FAAP', 
    experience: 15, 
    availability: 'busy', 
    rating: 4.7, 
    patientsCount: 2100, 
    avatar: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=ef4444&color=fff', 
    room: '105', 
    nextAvailableSlot: '2024-01-21T09:00:00' 
  },
  { 
    id: '4', 
    name: 'Dr. James Wilson', 
    specialty: 'Orthopedics', 
    qualification: 'MD, FACS', 
    experience: 10, 
    availability: 'available', 
    rating: 4.6, 
    patientsCount: 1560, 
    avatar: 'https://ui-avatars.com/api/?name=James+Wilson&background=f59e0b&color=fff', 
    room: '304', 
    nextAvailableSlot: '2024-01-20T15:00:00' 
  },
  { 
    id: '5', 
    name: 'Dr. Lisa Anderson', 
    specialty: 'Dermatology', 
    qualification: 'MD, FAAD', 
    experience: 7, 
    availability: 'off', 
    rating: 4.9, 
    patientsCount: 875, 
    avatar: 'https://ui-avatars.com/api/?name=Lisa+Anderson&background=8b5cf6&color=fff', 
    room: '203', 
    nextAvailableSlot: '2024-01-22T09:00:00' 
  }
];

export const mockPatients: Patient[] = [
  { id: '1', name: 'John Smith', email: 'john.smith@email.com', phone: '+1 (555) 123-4567', age: 45, gender: 'M', lastVisit: '2024-01-15', appointments: 12, avatar: 'https://ui-avatars.com/api/?name=John+Smith&background=6b7280&color=fff' },
  { id: '2', name: 'Emma Davis', email: 'emma.davis@email.com', phone: '+1 (555) 234-5678', age: 52, gender: 'F', lastVisit: '2024-01-18', appointments: 8, avatar: 'https://ui-avatars.com/api/?name=Emma+Davis&background=6b7280&color=fff' },
  { id: '3', name: 'Michael Brown', email: 'michael.brown@email.com', phone: '+1 (555) 345-6789', age: 38, gender: 'M', lastVisit: '2024-01-19', appointments: 5, avatar: 'https://ui-avatars.com/api/?name=Michael+Brown&background=6b7280&color=fff' },
  { id: '4', name: 'Lisa Garcia', email: 'lisa.garcia@email.com', phone: '+1 (555) 456-7890', age: 62, gender: 'F', lastVisit: '2024-01-17', appointments: 15, avatar: 'https://ui-avatars.com/api/?name=Lisa+Garcia&background=6b7280&color=fff' },
  { id: '5', name: 'David Lee', email: 'david.lee@email.com', phone: '+1 (555) 567-8901', age: 29, gender: 'M', lastVisit: '2024-01-20', appointments: 3, avatar: 'https://ui-avatars.com/api/?name=David+Lee&background=6b7280&color=fff' }
];

export const mockNurses: Nurse[] = [
  { id: '1', name: 'Jessica Parker', specialization: 'ICU', status: 'available', assignedPatients: 3, avatar: 'https://ui-avatars.com/api/?name=Jessica+Parker&background=3b82f6&color=fff' },
  { id: '2', name: 'Michael Thompson', specialization: 'Emergency', status: 'on-duty', assignedPatients: 4, avatar: 'https://ui-avatars.com/api/?name=Michael+Thompson&background=10b981&color=fff' },
  { id: '3', name: 'Emily Rodriguez', specialization: 'Pediatrics', status: 'break', assignedPatients: 2, avatar: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=ef4444&color=fff' },
  { id: '4', name: 'David Kim', specialization: 'Surgical', status: 'available', assignedPatients: 1, avatar: 'https://ui-avatars.com/api/?name=David+Kim&background=f59e0b&color=fff' },
  { id: '5', name: 'Sarah Wilson', specialization: 'Cardiology', status: 'available', assignedPatients: 2, avatar: 'https://ui-avatars.com/api/?name=Sarah+Wilson&background=8b5cf6&color=fff' }
];

export const mockLabs: Lab[] = [
  { id: '1', name: 'Hematology Lab', type: 'Hematology', status: 'operational', currentTests: 23, capacity: 50, technician: 'Sarah Wilson' },
  { id: '2', name: 'Biochemistry Lab', type: 'Biochemistry', status: 'busy', currentTests: 42, capacity: 50, technician: 'John Brown' },
  { id: '3', name: 'Microbiology Lab', type: 'Microbiology', status: 'operational', currentTests: 15, capacity: 40, technician: 'Emily Chen' },
  { id: '4', name: 'Pathology Lab', type: 'Pathology', status: 'maintenance', currentTests: 0, capacity: 30, technician: 'Michael Rodriguez' }
];

export const mockStaff: Staff[] = [
  { id: '1', name: 'Robert Wilson', role: 'Receptionist', department: 'Administration', status: 'present', shift: 'morning', phone: '+1 (555) 111-1111', email: 'robert@hospital.com', avatar: 'https://ui-avatars.com/api/?name=Robert+Wilson&background=3b82f6&color=fff' },
  { id: '2', name: 'Amanda Taylor', role: 'Billing Specialist', department: 'Finance', status: 'present', shift: 'morning', phone: '+1 (555) 222-2222', email: 'amanda@hospital.com', avatar: 'https://ui-avatars.com/api/?name=Amanda+Taylor&background=10b981&color=fff' },
  { id: '3', name: 'Thomas Johnson', role: 'Medical Records', department: 'Administration', status: 'absent', shift: 'evening', phone: '+1 (555) 333-3333', email: 'thomas@hospital.com', avatar: 'https://ui-avatars.com/api/?name=Thomas+Johnson&background=ef4444&color=fff' },
  { id: '4', name: 'Jennifer Martinez', role: 'Lab Assistant', department: 'Laboratory', status: 'present', shift: 'morning', phone: '+1 (555) 444-4444', email: 'jennifer@hospital.com', avatar: 'https://ui-avatars.com/api/?name=Jennifer+Martinez&background=f59e0b&color=fff' },
  { id: '5', name: 'Christopher Lee', role: 'Pharmacy Tech', department: 'Pharmacy', status: 'present', shift: 'night', phone: '+1 (555) 555-5555', email: 'christopher@hospital.com', avatar: 'https://ui-avatars.com/api/?name=Christopher+Lee&background=8b5cf6&color=fff' },
  { id: '6', name: 'Patricia Garcia', role: 'Administrative Assistant', department: 'Administration', status: 'present', shift: 'evening', phone: '+1 (555) 666-6666', email: 'patricia@hospital.com', avatar: 'https://ui-avatars.com/api/?name=Patricia+Garcia&background=ec4899&color=fff' }
];

export const mockAppointments: Appointment[] = [
  { id: '1', patientName: 'John Smith', patientId: 'P001', doctorName: 'Dr. Sarah Johnson', doctorId: '1', specialty: 'Cardiology', date: '2024-01-20', time: '09:00', type: 'in-person', status: 'confirmed', purpose: 'Follow-up checkup' },
  { id: '2', patientName: 'Emma Davis', patientId: 'P002', doctorName: 'Dr. Michael Chen', doctorId: '2', specialty: 'Neurology', date: '2024-01-20', time: '10:30', type: 'video', status: 'scheduled', purpose: 'Headache consultation' },
  { id: '3', patientName: 'Michael Brown', patientId: 'P003', doctorName: 'Dr. Emily Rodriguez', doctorId: '3', specialty: 'Pediatrics', date: '2024-01-20', time: '14:00', type: 'in-person', status: 'completed', purpose: 'Childhood vaccination' },
  { id: '4', patientName: 'Lisa Garcia', patientId: 'P004', doctorName: 'Dr. James Wilson', doctorId: '4', specialty: 'Orthopedics', date: '2024-01-21', time: '11:00', type: 'in-person', status: 'confirmed', purpose: 'Knee pain consultation' },
  { id: '5', patientName: 'David Lee', patientId: 'P005', doctorName: 'Dr. Lisa Anderson', doctorId: '5', specialty: 'Dermatology', date: '2024-01-21', time: '15:30', type: 'phone', status: 'scheduled', purpose: 'Skin rash consultation' },
  { id: '6', patientName: 'Sarah Johnson', patientId: 'P006', doctorName: 'Dr. Sarah Johnson', doctorId: '1', specialty: 'Cardiology', date: '2024-01-20', time: '11:30', type: 'in-person', status: 'cancelled', purpose: 'Blood pressure check' }
];