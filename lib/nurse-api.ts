import { api } from '@/lib/api-client';

export interface AssignedPatient {
  id?: number;
  assignment_id: number;
  assignment_notes?: string | null;
  assignment_status: string;
  assigned_at: string;
  patient_id: number;
  registration_no?: string | null;
  first_name: string;
  last_name: string;
  email?: string | null;
  phone?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  blood_type?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  allergies?: string | null;
  chronic_conditions?: string | null;
  emergency_contact?: string | null;
  emergency_phone?: string | null;
  appointment_id?: number | null;
  scheduled_date?: string | null;
  scheduled_time?: string | null;
  appointment_status?: string | null;
  reason?: string | null;
  disease?: string | null;
  doctor_first_name?: string | null;
  doctor_last_name?: string | null;
  doctor_specialization?: string | null;
  department_name?: string | null;
}

export interface Medicine {
  id: number;
  medicine_name: string;
  dosage?: string | null;
  frequency?: string | null;
  duration?: string | null;
  route?: string | null;
  instructions?: string | null;
}

export interface Prescription {
  id: number;
  patient_id: number;
  date_issued?: string | null;
  valid_until?: string | null;
  follow_up_date?: string | null;
  notes?: string | null;
  doctor_first_name?: string | null;
  doctor_last_name?: string | null;
  medicines: Medicine[];
}

export interface CareTask {
  id: number;
  patient_id: number;
  assignment_id?: number | null;
  prescription_id?: number | null;
  medicine_id?: number | null;
  task_type: 'medicine' | 'checkup' | 'vitals' | 'note';
  title: string;
  scheduled_date: string;
  scheduled_time: string;
  notes?: string | null;
  status: 'pending' | 'done' | 'missed' | 'cancelled';
  patient_first_name?: string;
  patient_last_name?: string;
  registration_no?: string | null;
  medicine_name?: string | null;
  dosage?: string | null;
  frequency?: string | null;
}

export interface NurseDashboardData {
  summary: {
    assigned_patients: number;
    today_tasks: number;
    pending_tasks: number;
    completed_tasks: number;
  };
  patients: AssignedPatient[];
  timetable: CareTask[];
}

export interface PatientDetail {
  assignment_id: number;
  patient: AssignedPatient;
  appointments: Record<string, unknown>[];
  prescriptions: Prescription[];
  timetable: CareTask[];
}

export const nurseApi = {
  async getDashboard(query: { date_from?: string; date_to?: string; status?: string } = {}) {
    const response = await api.get<NurseDashboardData>('/nurse/dashboard', query);
    return response.data as NurseDashboardData;
  },
  async getAssignedPatients() {
    const response = await api.get<AssignedPatient[]>('/nurse/patients');
    return (response.data ?? []) as AssignedPatient[];
  },
  async getPatientDetail(patientId: number) {
    const response = await api.get<PatientDetail>(`/nurse/patients/${patientId}`);
    return response.data as PatientDetail;
  },
  async getTimetable(query: { patient_id?: number; date_from?: string; date_to?: string; status?: string } = {}) {
    const response = await api.get<CareTask[]>('/nurse/timetable', query);
    return (response.data ?? []) as CareTask[];
  },
  async createTimetableEntry(payload: {
    patient_id: number;
    prescription_id?: number | null;
    medicine_id?: number | null;
    task_type: string;
    title: string;
    scheduled_date: string;
    scheduled_time: string;
    notes?: string;
  }) {
    await api.post('/nurse/timetable', payload);
  },
  async updateTimetableEntry(id: number, payload: Partial<Pick<CareTask, 'task_type' | 'title' | 'scheduled_date' | 'scheduled_time' | 'notes' | 'status'>>) {
    await api.patch(`/nurse/timetable/${id}`, payload);
  },
};
