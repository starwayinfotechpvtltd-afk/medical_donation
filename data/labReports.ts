export interface LabReport {
  id: string;
  patientId: string;
  testName: string;
  category: string;
  dateOfTest: string;
  dateOfReport: string;
  results: LabResult[];
  status: 'Normal' | 'Abnormal' | 'Critical';
  pathologist: string;
  notes?: string;
  fileUrl: string;
}

export interface LabResult {
  parameter: string;
  value: string | number;
  unit: string;
  referenceRange: string;
  status: 'Normal' | 'High' | 'Low';
}

export const mockLabReports: LabReport[] = [
  {
    id: 'LAB001',
    patientId: 'P001',
    testName: 'Complete Blood Count (CBC)',
    category: 'Hematology',
    dateOfTest: '2024-02-18',
    dateOfReport: '2024-02-20',
    results: [
      { parameter: 'Hemoglobin', value: 14.2, unit: 'g/dL', referenceRange: '13.5-17.5', status: 'Normal' },
      { parameter: 'WBC Count', value: 7.5, unit: '10^3/µL', referenceRange: '4.5-11', status: 'Normal' },
      { parameter: 'Platelet Count', value: 250, unit: '10^3/µL', referenceRange: '150-400', status: 'Normal' }
    ],
    status: 'Normal',
    pathologist: 'Dr. Sunita Sharma',
    fileUrl: '/reports/LAB001.pdf'
  },
  {
    id: 'LAB002',
    patientId: 'P001',
    testName: 'Lipid Profile',
    category: 'Biochemistry',
    dateOfTest: '2024-02-18',
    dateOfReport: '2024-02-20',
    results: [
      { parameter: 'Total Cholesterol', value: 285, unit: 'mg/dL', referenceRange: '<200', status: 'High' },
      { parameter: 'LDL Cholesterol', value: 185, unit: 'mg/dL', referenceRange: '<100', status: 'High' },
      { parameter: 'HDL Cholesterol', value: 35, unit: 'mg/dL', referenceRange: '>40', status: 'Low' },
      { parameter: 'Triglycerides', value: 215, unit: 'mg/dL', referenceRange: '<150', status: 'High' }
    ],
    status: 'Abnormal',
    pathologist: 'Dr. Sunita Sharma',
    notes: 'Cholesterol levels elevated. Recommended dietary changes and medication adjustment.',
    fileUrl: '/reports/LAB002.pdf'
  },
  {
    id: 'LAB003',
    patientId: 'P001',
    testName: 'Blood Glucose (Fasting)',
    category: 'Biochemistry',
    dateOfTest: '2024-02-18',
    dateOfReport: '2024-02-20',
    results: [
      { parameter: 'Fasting Glucose', value: 156, unit: 'mg/dL', referenceRange: '70-100', status: 'High' },
      { parameter: 'HbA1c', value: 8.2, unit: '%', referenceRange: '<5.7', status: 'High' }
    ],
    status: 'Abnormal',
    pathologist: 'Dr. Sunita Sharma',
    notes: 'Diabetes control needs improvement. Follow up with endocrinologist.',
    fileUrl: '/reports/LAB003.pdf'
  },
  {
    id: 'LAB004',
    patientId: 'P002',
    testName: 'Chest X-Ray',
    category: 'Radiology',
    dateOfTest: '2024-02-15',
    dateOfReport: '2024-02-16',
    results: [
      { parameter: 'Lung Fields', value: 'Clear bilateral', unit: '', referenceRange: 'No abnormality', status: 'Normal' },
      { parameter: 'Heart Size', value: 'Normal', unit: '', referenceRange: 'Normal', status: 'Normal' },
      { parameter: 'Mediastinum', value: 'No widening', unit: '', referenceRange: 'Normal', status: 'Normal' }
    ],
    status: 'Normal',
    pathologist: 'Dr. Arjun Desai',
    fileUrl: '/reports/LAB004.pdf'
  },
  {
    id: 'LAB005',
    patientId: 'P002',
    testName: 'Pulmonary Function Tests',
    category: 'Pulmonology',
    dateOfTest: '2024-02-15',
    dateOfReport: '2024-02-17',
    results: [
      { parameter: 'FEV1', value: 68, unit: '% predicted', referenceRange: '>80', status: 'Low' },
      { parameter: 'FVC', value: 75, unit: '% predicted', referenceRange: '>80', status: 'Low' },
      { parameter: 'FEV1/FVC Ratio', value: 0.72, unit: '', referenceRange: '>0.70', status: 'Normal' }
    ],
    status: 'Abnormal',
    pathologist: 'Dr. Arjun Desai',
    notes: 'Mild obstruction pattern consistent with asthma. Continue current inhaler therapy.',
    fileUrl: '/reports/LAB005.pdf'
  },
  {
    id: 'LAB006',
    patientId: 'P003',
    testName: 'Cardiac Enzymes Panel',
    category: 'Biochemistry',
    dateOfTest: '2024-02-16',
    dateOfReport: '2024-02-17',
    results: [
      { parameter: 'Troponin I', value: 0.01, unit: 'ng/mL', referenceRange: '<0.04', status: 'Normal' },
      { parameter: 'CK-MB', value: 2.8, unit: 'ng/mL', referenceRange: '<5', status: 'Normal' },
      { parameter: 'Myoglobin', value: 45, unit: 'ng/mL', referenceRange: '<100', status: 'Normal' }
    ],
    status: 'Normal',
    pathologist: 'Dr. Sunita Sharma',
    fileUrl: '/reports/LAB006.pdf'
  }
];
