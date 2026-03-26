export interface DoctorProfile {
  id: string;
  name: string;
  email: string;
  department: string;
  qualification: string;
  experience: number;
  phone: string;
}

export const doctorProfiles: DoctorProfile[] = [
  {
    id: 'DOC001',
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@hospital.com',
    department: 'Cardiology',
    qualification: 'MD, DM Cardiology',
    experience: 12,
    phone: '9876543210'
  },
  {
    id: 'DOC002',
    name: 'Dr. Priya Singh',
    email: 'priya.singh@hospital.com',
    department: 'Orthopedics',
    qualification: 'MD, MCh Orthopedics',
    experience: 10,
    phone: '9876543211'
  },
  {
    id: 'DOC003',
    name: 'Dr. Amit Verma',
    email: 'amit.verma@hospital.com',
    department: 'Neurology',
    qualification: 'MD, DM Neurology',
    experience: 15,
    phone: '9876543212'
  },
  {
    id: 'DOC004',
    name: 'Dr. Neha Gupta',
    email: 'neha.gupta@hospital.com',
    department: 'General Medicine',
    qualification: 'MD, Chest',
    experience: 8,
    phone: '9876543213'
  }
];

export interface DoctorPatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  lastVisit: string;
  condition: string;
}

export const doctorPatients: DoctorPatient[] = [
  {
    id: 'P001',
    name: 'John Sharma',
    age: 45,
    gender: 'Male',
    phone: '9876543220',
    lastVisit: '2024-03-01',
    condition: 'Heart palpitations'
  },
  {
    id: 'P002',
    name: 'Aisha Khan',
    age: 38,
    gender: 'Female',
    phone: '9876543221',
    lastVisit: '2024-02-28',
    condition: 'Knee pain'
  },
  {
    id: 'P003',
    name: 'Ravi Patel',
    age: 52,
    gender: 'Male',
    phone: '9876543222',
    lastVisit: '2024-03-05',
    condition: 'Headaches and dizziness'
  },
  {
    id: 'P004',
    name: 'Sara Ahmed',
    age: 35,
    gender: 'Female',
    phone: '9876543223',
    lastVisit: '2024-02-27',
    condition: 'Fever and cough'
  }
];
