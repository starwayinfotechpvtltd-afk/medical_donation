export interface Patient {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  age: number;
  gender: string;
  bloodType: string;
  address: string;
  allergies: string[];
  chronicConditions: string[];
}

export const mockPatients: Patient[] = [
  {
    id: 'P001',
    name: 'John Sharma',
    email: 'patient@hospital.com',
    password: 'patient123',
    phone: '+91-9876543210',
    age: 45,
    gender: 'Male',
    bloodType: 'O+',
    address: '123 Health Street, Mumbai, India',
    allergies: ['Penicillin', 'Shellfish'],
    chronicConditions: ['Hypertension', 'Type 2 Diabetes']
  },
  {
    id: 'P002',
    name: 'Priya Patel',
    email: 'priya.patient@hospital.com',
    password: 'patient123',
    phone: '+91-8765432109',
    age: 32,
    gender: 'Female',
    bloodType: 'B+',
    address: '456 Wellness Avenue, Delhi, India',
    allergies: ['Aspirin'],
    chronicConditions: ['Asthma']
  },
  {
    id: 'P003',
    name: 'Rajesh Kumar',
    email: 'rajesh.patient@hospital.com',
    password: 'patient123',
    phone: '+91-7654321098',
    age: 58,
    gender: 'Male',
    bloodType: 'A+',
    address: '789 Care Lane, Bangalore, India',
    allergies: [],
    chronicConditions: ['Heart Disease', 'High Cholesterol']
  }
];
