export interface LabTest {
  id: string;
  testName: string;
  patientId: string;
  patientName: string;
  orderedBy: string;
  requestDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  resultFile?: string;
  notes?: string;
}

export interface LabTestResult {
  id: string;
  testId: string;
  testName: string;
  patientName: string;
  parameters: {
    name: string;
    value: string;
    unit: string;
    normalRange: string;
    status: 'normal' | 'abnormal';
  }[];
  uploadedDate: string;
  uploadedBy: string;
}

export const labTests: LabTest[] = [
  {
    id: 'LAB001',
    testName: 'Complete Blood Count (CBC)',
    patientId: 'P001',
    patientName: 'John Sharma',
    orderedBy: 'Dr. Rajesh Kumar',
    requestDate: '2024-03-04',
    status: 'completed',
    resultFile: 'CBC_P001_20240305.pdf',
    notes: 'All parameters within normal range'
  },
  {
    id: 'LAB002',
    testName: 'Blood Sugar Fasting',
    patientId: 'P002',
    patientName: 'Aisha Khan',
    orderedBy: 'Dr. Priya Singh',
    requestDate: '2024-03-05',
    status: 'completed',
    resultFile: 'BSF_P002_20240305.pdf',
    notes: 'Slightly elevated'
  },
  {
    id: 'LAB003',
    testName: 'Thyroid Profile',
    patientId: 'P003',
    patientName: 'Ravi Patel',
    orderedBy: 'Dr. Amit Verma',
    requestDate: '2024-03-05',
    status: 'in-progress',
    notes: 'Being processed'
  },
  {
    id: 'LAB004',
    testName: 'Chest X-Ray',
    patientId: 'P004',
    patientName: 'Sara Ahmed',
    orderedBy: 'Dr. Neha Gupta',
    requestDate: '2024-03-06',
    status: 'pending',
    notes: 'Awaiting sample'
  },
  {
    id: 'LAB005',
    testName: 'ECG',
    patientId: 'P001',
    patientName: 'John Sharma',
    orderedBy: 'Dr. Rajesh Kumar',
    requestDate: '2024-03-06',
    status: 'pending',
    notes: 'Scheduled for tomorrow'
  }
];

export const labTestResults: LabTestResult[] = [
  {
    id: 'RESULT001',
    testId: 'LAB001',
    testName: 'Complete Blood Count (CBC)',
    patientName: 'John Sharma',
    parameters: [
      {
        name: 'Hemoglobin',
        value: '14.5',
        unit: 'g/dL',
        normalRange: '13.5-17.5',
        status: 'normal'
      },
      {
        name: 'White Blood Cells',
        value: '7200',
        unit: 'cells/μL',
        normalRange: '4500-11000',
        status: 'normal'
      },
      {
        name: 'Platelets',
        value: '250000',
        unit: 'cells/μL',
        normalRange: '150000-400000',
        status: 'normal'
      }
    ],
    uploadedDate: '2024-03-05',
    uploadedBy: 'Priya Patel'
  },
  {
    id: 'RESULT002',
    testId: 'LAB002',
    testName: 'Blood Sugar Fasting',
    patientName: 'Aisha Khan',
    parameters: [
      {
        name: 'Fasting Blood Sugar',
        value: '125',
        unit: 'mg/dL',
        normalRange: '70-100',
        status: 'abnormal'
      }
    ],
    uploadedDate: '2024-03-05',
    uploadedBy: 'Priya Patel'
  }
];
