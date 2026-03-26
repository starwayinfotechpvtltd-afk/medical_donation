export interface AppointmentDetails {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  doctorImage?: string;
  specialization: string;
  appointmentDate: string;
  appointmentTime: string;
  clinicAddress: string;
  clinicImage?: string;
  roomNumber: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface PatientMedicines {
  id: string;
  patientId: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  prescribedBy: string;
  startDate: string;
  endDate?: string;
  sideEffects?: string[];
  instructions?: string;
}

export interface PatientLabReport {
  id: string;
  patientId: string;
  testName: string;
  testDate: string;
  completedDate: string;
  technicianName: string;
  technicianId: string;
  status: 'pending' | 'completed';
  results: {
    parameter: string;
    value: string;
    unit: string;
    normalRange: string;
    status: 'normal' | 'abnormal';
  }[];
  pdf?: string;
}

export interface PatientNextCheckup {
  appointmentId: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  nextDate: string;
  nextTime: string;
  clinicAddress: string;
  clinicPhone: string;
  roomNumber: string;
  doctorImage?: string;
  clinicImage?: string;
}

export const patientAppointments: AppointmentDetails[] = [
  {
    id: 'APT001',
    patientId: 'P001',
    doctorId: 'DOC001',
    doctorName: 'Dr. Rajesh Kumar',
    specialization: 'Cardiology',
    appointmentDate: '2024-03-28',
    appointmentTime: '10:00 AM',
    clinicAddress: '123 Medical Plaza, Main Street, City',
    roomNumber: '301',
    status: 'completed',
    notes: 'General checkup completed successfully'
  },
  {
    id: 'APT002',
    patientId: 'P001',
    doctorId: 'DOC002',
    doctorName: 'Dr. Priya Singh',
    specialization: 'Neurology',
    appointmentDate: '2024-04-15',
    appointmentTime: '02:30 PM',
    clinicAddress: '456 Health Center, New Road, City',
    roomNumber: '205',
    status: 'scheduled',
    notes: 'Follow-up consultation'
  }
];

export const patientMedicines: PatientMedicines[] = [
  {
    id: 'MED001',
    patientId: 'P001',
    medicineName: 'Aspirin',
    dosage: '100mg',
    frequency: 'Once daily',
    duration: '30 days',
    prescribedBy: 'Dr. Rajesh Kumar',
    startDate: '2024-01-10',
    sideEffects: ['Mild heartburn', 'Dizziness'],
    instructions: 'Take after breakfast with water'
  },
  {
    id: 'MED002',
    patientId: 'P001',
    medicineName: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Twice daily',
    duration: '60 days',
    prescribedBy: 'Dr. Rajesh Kumar',
    startDate: '2024-02-05',
    sideEffects: ['Dry cough'],
    instructions: 'Take morning and evening'
  }
];

export const patientLabReports: PatientLabReport[] = [
  {
    id: 'LAB001',
    patientId: 'P001',
    testName: 'Complete Blood Count (CBC)',
    testDate: '2024-03-10',
    completedDate: '2024-03-12',
    technicianName: 'Arun Patel',
    technicianId: 'LAB001',
    status: 'completed',
    results: [
      {
        parameter: 'Hemoglobin',
        value: '13.5',
        unit: 'g/dL',
        normalRange: '12-16',
        status: 'normal'
      },
      {
        parameter: 'White Blood Cells',
        value: '7200',
        unit: 'cells/μL',
        normalRange: '4500-11000',
        status: 'normal'
      },
      {
        parameter: 'Platelets',
        value: '250',
        unit: '10^3/μL',
        normalRange: '150-400',
        status: 'normal'
      }
    ]
  },
  {
    id: 'LAB002',
    patientId: 'P001',
    testName: 'Lipid Profile',
    testDate: '2024-03-15',
    completedDate: '2024-03-17',
    technicianName: 'Meera Desai',
    technicianId: 'LAB002',
    status: 'completed',
    results: [
      {
        parameter: 'Total Cholesterol',
        value: '210',
        unit: 'mg/dL',
        normalRange: '<200',
        status: 'abnormal'
      },
      {
        parameter: 'LDL',
        value: '140',
        unit: 'mg/dL',
        normalRange: '<100',
        status: 'abnormal'
      },
      {
        parameter: 'HDL',
        value: '45',
        unit: 'mg/dL',
        normalRange: '>40',
        status: 'normal'
      }
    ]
  }
];

export const patientNextCheckups: PatientNextCheckup[] = [
  {
    appointmentId: 'APT002',
    doctorId: 'DOC002',
    doctorName: 'Dr. Priya Singh',
    specialization: 'Neurology',
    nextDate: '2024-04-15',
    nextTime: '02:30 PM',
    clinicAddress: '456 Health Center, New Road, City',
    clinicPhone: '+91 11 2345 6789',
    roomNumber: '205'
  }
];
