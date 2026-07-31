import { api } from '@/lib/api-client';

export interface NurseUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  status: 'active' | 'inactive' | 'suspended';
  avatar_url?: string | null;
  assigned_patients?: number;
  scheduled_shifts?: number;
  created_at?: string;
}

export interface NurseAppointment {
  id: number;
  patient_id: number;
  scheduled_date: string;
  scheduled_time: string;
  status: string;
  type?: string | null;
  reason?: string | null;
  disease?: string | null;
  patient_registration_no?: string | null;
  patient_first_name: string;
  patient_last_name: string;
  patient_phone?: string | null;
  doctor_first_name?: string | null;
  doctor_last_name?: string | null;
  department_name?: string | null;
  nurse_user_id?: number | null;
  nurse_first_name?: string | null;
  nurse_last_name?: string | null;
}

export interface NurseAssignment {
  id: number;
  nurse_user_id: number;
  patient_id: number;
  appointment_id?: number | null;
  notes?: string | null;
  status: 'active' | 'completed' | 'cancelled';
  assigned_at: string;
  patient_registration_no?: string | null;
  patient_first_name: string;
  patient_last_name: string;
  patient_phone?: string | null;
  scheduled_date?: string | null;
  scheduled_time?: string | null;
  appointment_status?: string | null;
  nurse_first_name: string;
  nurse_last_name: string;
  nurse_email: string;
}

export interface NurseSchedule {
  id: number;
  nurse_user_id: number;
  shift_date: string;
  shift_type: 'morning' | 'evening' | 'night' | 'custom';
  start_time: string;
  end_time: string;
  ward?: string | null;
  notes?: string | null;
  status: 'scheduled' | 'completed' | 'cancelled' | 'absent';
  nurse_first_name: string;
  nurse_last_name: string;
  nurse_email: string;
}

export interface NurseAdminSummary {
  total_nurses: number;
  active_nurses: number;
  inactive_nurses: number;
  total_assignments: number;
  active_assignments: number;
  today_schedules: number;
  scheduled_today: number;
  upcoming_appointments: number;
  pending_appointments: number;
}

export interface NurseAdminDashboard {
  summary: NurseAdminSummary;
  nurses: NurseUser[];
  assignments: NurseAssignment[];
  schedules: NurseSchedule[];
  appointments: NurseAppointment[];
}

export const nurseAdminApi = {
  async getDashboard() {
    const response = await api.get<NurseAdminDashboard>('/nurse-admin/dashboard');
    return response.data as NurseAdminDashboard;
  },
  async getNurses(query: { status?: string; search?: string } = {}) {
    const response = await api.get<NurseUser[]>('/nurse-admin/nurses', query);
    return (response.data ?? []) as NurseUser[];
  },
  async createNurse(payload: { first_name: string; last_name: string; email: string; password: string; phone?: string }) {
    const response = await api.post<NurseUser>('/nurse-admin/nurses', payload);
    return response.data as NurseUser;
  },
  async updateNurse(id: number, payload: Partial<Pick<NurseUser, 'first_name' | 'last_name' | 'email' | 'phone' | 'status'>>) {
    const response = await api.patch<NurseUser>(`/nurse-admin/nurses/${id}`, payload);
    return response.data as NurseUser;
  },
  async deleteNurse(id: number) {
    await api.delete(`/nurse-admin/nurses/${id}`);
  },
  async getAppointments(query: { date_from?: string; date_to?: string; status?: string } = {}) {
    const response = await api.get<NurseAppointment[]>('/nurse-admin/appointments', query);
    return (response.data ?? []) as NurseAppointment[];
  },
  async getAssignments() {
    const response = await api.get<NurseAssignment[]>('/nurse-admin/assignments');
    return (response.data ?? []) as NurseAssignment[];
  },
  async createAssignment(payload: { nurse_user_id: number; patient_id: number; appointment_id?: number | null; notes?: string }) {
    await api.post('/nurse-admin/assignments', payload);
  },
  async updateAssignment(id: number, payload: Partial<Pick<NurseAssignment, 'nurse_user_id' | 'notes' | 'status'>>) {
    await api.patch(`/nurse-admin/assignments/${id}`, payload);
  },
  async getSchedules(query: { date_from?: string; date_to?: string } = {}) {
    const response = await api.get<NurseSchedule[]>('/nurse-admin/schedules', query);
    return (response.data ?? []) as NurseSchedule[];
  },
  async createSchedule(payload: { nurse_user_id: number; shift_date: string; shift_type: string; start_time: string; end_time: string; ward?: string; notes?: string }) {
    await api.post('/nurse-admin/schedules', payload);
  },
  async updateSchedule(id: number, payload: Partial<NurseSchedule>) {
    await api.patch(`/nurse-admin/schedules/${id}`, payload);
  },
};
