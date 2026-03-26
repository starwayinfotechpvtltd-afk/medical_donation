export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: 'patient' | 'doctor' | 'lab_technician' | 'admin';
  action: string;
  description: string;
  timestamp: string;
  details?: string;
}

export const activityLogs: ActivityLog[] = [
  {
    id: 'ACT001',
    userId: 'P001',
    userName: 'John Sharma',
    userRole: 'patient',
    action: 'appointment_booked',
    description: 'Booked appointment with Dr. Rajesh Kumar',
    timestamp: '2024-03-06T09:30:00',
    details: 'Cardiology consultation'
  },
  {
    id: 'ACT002',
    userId: 'DOC001',
    userName: 'Dr. Rajesh Kumar',
    userRole: 'doctor',
    action: 'prescription_created',
    description: 'Created prescription for John Sharma',
    timestamp: '2024-03-06T10:15:00',
    details: 'Cardiac medication for palpitations'
  },
  {
    id: 'ACT003',
    userId: 'LAB001',
    userName: 'Priya Patel',
    userRole: 'lab_technician',
    action: 'test_result_uploaded',
    description: 'Uploaded CBC result for John Sharma',
    timestamp: '2024-03-05T14:45:00',
    details: 'All parameters normal'
  },
  {
    id: 'ACT004',
    userId: 'P002',
    userName: 'Aisha Khan',
    userRole: 'patient',
    action: 'lab_request_created',
    description: 'Requested blood test',
    timestamp: '2024-03-06T08:00:00',
    details: 'Complete blood count'
  },
  {
    id: 'ACT005',
    userId: 'DOC002',
    userName: 'Dr. Priya Singh',
    userRole: 'doctor',
    action: 'patient_visited',
    description: 'Completed patient visit',
    timestamp: '2024-03-06T11:00:00',
    details: 'Orthopedic consultation - Knee pain'
  },
  {
    id: 'ACT006',
    userId: 'LAB001',
    userName: 'Priya Patel',
    userRole: 'lab_technician',
    action: 'test_initiated',
    description: 'Started Thyroid Profile test',
    timestamp: '2024-03-06T09:00:00',
    details: 'For patient Ravi Patel'
  },
  {
    id: 'ACT007',
    userId: 'ADMIN001',
    userName: 'Hospital Admin',
    userRole: 'admin',
    action: 'user_added',
    description: 'Added new doctor to system',
    timestamp: '2024-03-06T16:30:00',
    details: 'Dr. Neha Gupta - General Medicine'
  },
  {
    id: 'ACT008',
    userId: 'P003',
    userName: 'Ravi Patel',
    userRole: 'patient',
    action: 'appointment_cancelled',
    description: 'Cancelled appointment',
    timestamp: '2024-03-05T17:00:00',
    details: 'Neurology consultation'
  },
  {
    id: 'ACT009',
    userId: 'DOC003',
    userName: 'Dr. Amit Verma',
    userRole: 'doctor',
    action: 'medical_history_updated',
    description: 'Updated patient medical history',
    timestamp: '2024-03-06T13:20:00',
    details: 'Added headache notes for Ravi Patel'
  },
  {
    id: 'ACT010',
    userId: 'LAB001',
    userName: 'Priya Patel',
    userRole: 'lab_technician',
    action: 'result_verified',
    description: 'Verified blood test results',
    timestamp: '2024-03-06T15:00:00',
    details: 'Blood Sugar results for Aisha Khan'
  }
];

// Function to get activity stats
export function getActivityStats() {
  const patientActivity = activityLogs.filter(log => log.userRole === 'patient').length;
  const doctorActivity = activityLogs.filter(log => log.userRole === 'doctor').length;
  const labActivity = activityLogs.filter(log => log.userRole === 'lab_technician').length;

  return {
    totalActivity: activityLogs.length,
    patientActivity,
    doctorActivity,
    labActivity,
    recentActivities: activityLogs.slice(0, 5)
  };
}
