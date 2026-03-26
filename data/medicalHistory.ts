export interface MedicalHistoryRecord {
  id: string;
  patientId: string;
  visitDate: string;
  doctorName: string;
  department: string;
  visitType: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
}

export const mockMedicalHistory: MedicalHistoryRecord[] = [
  {
    id: 'MH001',
    patientId: 'P001',
    visitDate: '2024-02-20',
    doctorName: 'Dr. Amit Gupta',
    department: 'Cardiology',
    visitType: 'Follow-up Consultation',
    symptoms: 'Chest discomfort, Shortness of breath',
    diagnosis: 'Hypertension, Coronary Artery Disease',
    treatment: 'Medication adjustment, Diet consultation',
    notes: 'Blood pressure improved. Continue current medications.'
  },
  {
    id: 'MH002',
    patientId: 'P001',
    visitDate: '2024-01-28',
    doctorName: 'Dr. Rahul Singh',
    department: 'Cardiology',
    visitType: 'Initial Consultation',
    symptoms: 'Elevated blood pressure, Fatigue',
    diagnosis: 'Stage 2 Hypertension',
    treatment: 'Started on Antihypertensive therapy, Lifestyle modification',
    notes: 'Regular monitoring required. Follow-up in 4 weeks.'
  },
  {
    id: 'MH003',
    patientId: 'P001',
    visitDate: '2024-01-10',
    doctorName: 'Dr. Suresh Mehta',
    department: 'General Medicine',
    visitType: 'Annual Checkup',
    symptoms: 'None',
    diagnosis: 'General Health Assessment',
    treatment: 'Preventive health counseling',
    notes: 'Overall health satisfactory. Advised on exercise and diet.'
  },
  {
    id: 'MH004',
    patientId: 'P002',
    visitDate: '2024-02-17',
    doctorName: 'Dr. Neha Reddy',
    department: 'Pulmonology',
    visitType: 'Follow-up Consultation',
    symptoms: 'Wheezing, Night-time cough',
    diagnosis: 'Asthma Control Assessment',
    treatment: 'Adjusted inhaler dosage, Peak flow monitoring',
    notes: 'Asthma control improved. Continue current regimen.'
  },
  {
    id: 'MH005',
    patientId: 'P002',
    visitDate: '2024-01-25',
    doctorName: 'Dr. Neha Reddy',
    department: 'Pulmonology',
    visitType: 'Initial Consultation',
    symptoms: 'Recurrent coughing, Difficulty breathing',
    diagnosis: 'Persistent Asthma',
    treatment: 'Started on inhaler therapy, Allergy testing',
    notes: 'Referred for allergy evaluation.'
  },
  {
    id: 'MH006',
    patientId: 'P003',
    visitDate: '2024-02-19',
    doctorName: 'Dr. Vikram Patel',
    department: 'Cardiology',
    visitType: 'Emergency Visit',
    symptoms: 'Chest pain, Palpitations',
    diagnosis: 'Acute Cardiac Syndrome Rule Out',
    treatment: 'ECG, Cardiac Enzyme tests, Hospitalization',
    notes: 'Admitted for observation. Troponin levels normal.'
  },
  {
    id: 'MH007',
    patientId: 'P003',
    visitDate: '2024-02-10',
    doctorName: 'Dr. Vikram Patel',
    department: 'Cardiology',
    visitType: 'Routine Follow-up',
    symptoms: 'None',
    diagnosis: 'Stable Heart Disease',
    treatment: 'Medication review, ECG performed',
    notes: 'ECG unchanged. Continue current medications.'
  }
];
