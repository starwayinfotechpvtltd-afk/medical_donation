export interface Prescription {
  id: string;
  patientId: string;
  doctorName: string;
  doctorSpecialization: string;
  medicines: Medicine[];
  dateIssued: string;
  validUntil: string;
  notes: string;
  followUpDate?: string;
}

export interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  sideEffects?: string[];
}

export const mockPrescriptions: Prescription[] = [
  {
    id: 'RX001',
    patientId: 'P001',
    doctorName: 'Dr. Amit Gupta',
    doctorSpecialization: 'Cardiology',
    medicines: [
      {
        name: 'Enalapril',
        dosage: '10 mg',
        frequency: 'Twice daily',
        duration: '30 days',
        sideEffects: ['Dizziness', 'Dry cough']
      },
      {
        name: 'Atorvastatin',
        dosage: '20 mg',
        frequency: 'Once daily at night',
        duration: '30 days',
        sideEffects: ['Muscle pain', 'Headache']
      },
      {
        name: 'Metformin',
        dosage: '500 mg',
        frequency: 'Twice daily',
        duration: '30 days',
        sideEffects: ['Nausea', 'Stomach upset']
      }
    ],
    dateIssued: '2024-02-15',
    validUntil: '2024-05-15',
    notes: 'Continue with regular exercise and diet control. Blood pressure monitoring advised.',
    followUpDate: '2024-03-15'
  },
  {
    id: 'RX002',
    patientId: 'P001',
    doctorName: 'Dr. Rahul Singh',
    doctorSpecialization: 'Cardiology',
    medicines: [
      {
        name: 'Aspirin',
        dosage: '75 mg',
        frequency: 'Once daily',
        duration: '60 days',
        sideEffects: ['Stomach upset', 'Bleeding risk']
      }
    ],
    dateIssued: '2024-01-20',
    validUntil: '2024-03-20',
    notes: 'For blood clot prevention. Take with food.',
    followUpDate: '2024-02-20'
  },
  {
    id: 'RX003',
    patientId: 'P002',
    doctorName: 'Dr. Neha Reddy',
    doctorSpecialization: 'Pulmonology',
    medicines: [
      {
        name: 'Albuterol Inhaler',
        dosage: '100 mcg',
        frequency: 'As needed',
        duration: '30 days',
        sideEffects: ['Tremors', 'Nervousness']
      },
      {
        name: 'Fluticasone Propionate',
        dosage: '110 mcg',
        frequency: 'Twice daily',
        duration: '30 days',
        sideEffects: ['Throat irritation', 'Hoarseness']
      }
    ],
    dateIssued: '2024-02-10',
    validUntil: '2024-05-10',
    notes: 'Asthma control medication. Use steroid inhaler daily.',
    followUpDate: '2024-03-10'
  },
  {
    id: 'RX004',
    patientId: 'P003',
    doctorName: 'Dr. Vikram Patel',
    doctorSpecialization: 'Cardiology',
    medicines: [
      {
        name: 'Lisinopril',
        dosage: '20 mg',
        frequency: 'Once daily',
        duration: '30 days',
        sideEffects: ['Persistent dry cough', 'Dizziness']
      },
      {
        name: 'Metoprolol',
        dosage: '50 mg',
        frequency: 'Twice daily',
        duration: '30 days',
        sideEffects: ['Fatigue', 'Low blood pressure']
      }
    ],
    dateIssued: '2024-02-12',
    validUntil: '2024-05-12',
    notes: 'Heart disease management. Regular cardiology checkup needed.',
    followUpDate: '2024-03-12'
  }
];
