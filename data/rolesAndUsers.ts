export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  color: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department?: string;
  joinDate: string;
  image?: string;
  qualifications?: string[];
  licenseNumber?: string;
}

export const roles: Role[] = [
  {
    id: 'R001',
    name: 'Doctor',
    description: 'Medical doctor who treats patients',
    permissions: ['view_patients', 'write_prescription', 'request_tests', 'write_notes'],
    color: 'bg-blue-100 border-blue-300'
  },
  {
    id: 'R002',
    name: 'Lab Technician',
    description: 'Laboratory technician for testing',
    permissions: ['manage_tests', 'upload_results', 'view_reports', 'allocate_tests'],
    color: 'bg-cyan-100 border-cyan-300'
  },
  {
    id: 'R003',
    name: 'Nurse',
    description: 'Nursing staff for patient care',
    permissions: ['mark_attendance', 'view_patients', 'record_vitals', 'patient_lookup'],
    color: 'bg-pink-100 border-pink-300'
  },
  {
    id: 'R004',
    name: 'Admin',
    description: 'System administrator',
    permissions: ['all'],
    color: 'bg-purple-100 border-purple-300'
  }
];

export const createdUsers: UserProfile[] = [
  {
    id: 'DOC001',
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@hospital.com',
    phone: '+91 9876543210',
    role: 'Doctor',
    department: 'Cardiology',
    joinDate: '2022-01-15',
    qualifications: ['MBBS', 'MD Cardiology'],
    licenseNumber: 'MCI/2010/12345'
  },
  {
    id: 'DOC002',
    name: 'Dr. Priya Singh',
    email: 'priya.singh@hospital.com',
    phone: '+91 9876543211',
    role: 'Doctor',
    department: 'Neurology',
    joinDate: '2021-06-20',
    qualifications: ['MBBS', 'MD Neurology'],
    licenseNumber: 'MCI/2011/12346'
  },
  {
    id: 'LAB001',
    name: 'Arun Patel',
    email: 'arun.patel@hospital.com',
    phone: '+91 9876543212',
    role: 'Lab Technician',
    department: 'Laboratory',
    joinDate: '2020-03-10',
    qualifications: ['B.Sc Biology', 'Diploma in Lab Technology']
  },
  {
    id: 'LAB002',
    name: 'Meera Desai',
    email: 'meera.desai@hospital.com',
    phone: '+91 9876543213',
    role: 'Lab Technician',
    department: 'Pathology',
    joinDate: '2021-05-15',
    qualifications: ['B.Sc Biology', 'Diploma in Pathology']
  },
  {
    id: 'NURSE001',
    name: 'Aisha Khan',
    email: 'aisha.khan@hospital.com',
    phone: '+91 9876543214',
    role: 'Nurse',
    department: 'General Ward',
    joinDate: '2019-08-05',
    qualifications: ['BSc Nursing', 'GNM']
  },
  {
    id: 'NURSE002',
    name: 'Neha Sharma',
    email: 'neha.sharma@hospital.com',
    phone: '+91 9876543215',
    role: 'Nurse',
    department: 'ICU',
    joinDate: '2020-11-20',
    qualifications: ['BSc Nursing', 'ICU Certification']
  }
];
