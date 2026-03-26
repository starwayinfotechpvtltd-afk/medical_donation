export interface NurseAttendance {
  id: string;
  nurseId: string;
  date: string;
  checkInTime: string;
  checkOutTime: string;
  photoUrl: string;
  status: 'present' | 'absent' | 'late';
  department: string;
}

export interface Nurse {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  joinDate: string;
  photo: string;
  shift: 'morning' | 'evening' | 'night';
  licenseNumber: string;
}

export const nurses: Nurse[] = [
  {
    id: 'NURSE001',
    name: 'Aisha Khan',
    email: 'aisha.khan@hospital.com',
    phone: '+91-9876543210',
    department: 'General Ward',
    position: 'Staff Nurse',
    joinDate: '2021-03-15',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha',
    shift: 'morning',
    licenseNumber: 'NL-2021-001'
  },
  {
    id: 'NURSE002',
    name: 'Priya Verma',
    email: 'priya.verma@hospital.com',
    phone: '+91-9876543211',
    department: 'ICU',
    position: 'Senior Nurse',
    joinDate: '2020-06-10',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    shift: 'evening',
    licenseNumber: 'NL-2020-015'
  },
  {
    id: 'NURSE003',
    name: 'Sneha Dey',
    email: 'sneha.dey@hospital.com',
    phone: '+91-9876543212',
    department: 'Emergency',
    position: 'Staff Nurse',
    joinDate: '2022-01-20',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha',
    shift: 'night',
    licenseNumber: 'NL-2022-008'
  },
  {
    id: 'NURSE004',
    name: 'Meera Singh',
    email: 'meera.singh@hospital.com',
    phone: '+91-9876543213',
    department: 'Pediatrics',
    position: 'Pediatric Nurse',
    joinDate: '2021-09-05',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Meera',
    shift: 'morning',
    licenseNumber: 'NL-2021-012'
  },
  {
    id: 'NURSE005',
    name: 'Rani Chatterjee',
    email: 'rani.chatterjee@hospital.com',
    phone: '+91-9876543214',
    department: 'Maternity',
    position: 'Maternity Nurse',
    joinDate: '2020-11-12',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rani',
    shift: 'evening',
    licenseNumber: 'NL-2020-022'
  }
];

export const attendanceRecords: NurseAttendance[] = [
  {
    id: 'ATT001',
    nurseId: 'NURSE001',
    date: new Date().toISOString().split('T')[0],
    checkInTime: '08:00 AM',
    checkOutTime: '04:00 PM',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha',
    status: 'present',
    department: 'General Ward'
  },
  {
    id: 'ATT002',
    nurseId: 'NURSE002',
    date: new Date().toISOString().split('T')[0],
    checkInTime: '04:15 PM',
    checkOutTime: '12:15 AM',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    status: 'late',
    department: 'ICU'
  },
  {
    id: 'ATT003',
    nurseId: 'NURSE003',
    date: new Date().toISOString().split('T')[0],
    checkInTime: '12:00 AM',
    checkOutTime: '08:00 AM',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha',
    status: 'present',
    department: 'Emergency'
  }
];
