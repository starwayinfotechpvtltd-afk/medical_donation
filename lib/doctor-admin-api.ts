import { api } from '@/lib/api-client';

export interface DoctorAdminSummary {
  total_doctors: number;
  active_doctors: number;
  inactive_doctors: number;
  avg_experience: number;
  upcoming_appointments: number;
  assigned_patients: number;
}

export interface DoctorAdminDoctor {
  doctor_profile_id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  status: 'active' | 'inactive' | 'suspended';
  joined_at: string;
  specialization?: string | null;
  qualification?: string | null;
  license_number?: string | null;
  years_of_experience?: number | null;
  consultation_fee?: number | null;
  available_days?: string | null;
  available_time_start?: string | null;
  available_time_end?: string | null;
  image_url?: string | null;
  bio?: string | null;
  departments?: string | null;
  assigned_patients_count: number;
  upcoming_appointments_count: number;
}

export interface DoctorAdminPatient {
  id: number;
  registration_no: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  blood_type?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  registration_status: string;
  appointments_count: number;
  last_appointment_date?: string | null;
  next_appointment_date?: string | null;
}

export interface DoctorAdminAppointment {
  id: number;
  patient_id: number;
  doctor_profile_id?: number | null;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  type: string;
  disease?: string | null;
  reason?: string | null;
  notes?: string | null;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  patient_registration_no?: string | null;
  patient_first_name: string;
  patient_last_name: string;
  patient_email: string;
  patient_phone?: string | null;
  patient_gender?: string | null;
  patient_blood_type?: string | null;
  doctor_first_name?: string | null;
  doctor_last_name?: string | null;
  doctor_specialization?: string | null;
  department_name?: string | null;
}

export interface DoctorPayload {
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  phone?: string;
  status?: string;
  specialization?: string;
  qualification?: string;
  license_number?: string;
  years_of_experience?: number | null;
  consultation_fee?: number | null;
  available_days?: string;
  available_time_start?: string;
  available_time_end?: string;
  image_url?: string;
  bio?: string;
  department_ids?: number[];
}

export const doctorAdminApi = {
  async getSummary() {
    const response = await api.get<DoctorAdminSummary>('/doctor-admin/summary');
    return response.data as DoctorAdminSummary;
  },
  async getDoctors(query: { search?: string; status?: string; departmentId?: number } = {}) {
    const response = await api.get<DoctorAdminDoctor[]>('/doctor-admin/doctors', query);
    return (response.data ?? []) as DoctorAdminDoctor[];
  },
  async createDoctor(payload: DoctorPayload) {
    const response = await api.post<DoctorAdminDoctor>('/doctor-admin/doctors', payload);
    return response.data as DoctorAdminDoctor;
  },
  async updateDoctor(userId: number, payload: DoctorPayload) {
    const response = await api.patch<DoctorAdminDoctor>(`/doctor-admin/doctors/${userId}`, payload);
    return response.data as DoctorAdminDoctor;
  },
  async updateDoctorStatus(userId: number, status: 'active' | 'inactive' | 'suspended') {
    const response = await api.patch<DoctorAdminDoctor>(`/doctor-admin/doctors/${userId}/status`, { status });
    return response.data as DoctorAdminDoctor;
  },
  async getDoctorPatients(doctorProfileId: number) {
    const response = await api.get<DoctorAdminPatient[]>(`/doctor-admin/doctors/${doctorProfileId}/patients`);
    return (response.data ?? []) as DoctorAdminPatient[];
  },
  async getAppointments(query: { from?: string; to?: string; doctorProfileId?: number; status?: string } = {}) {
    const response = await api.get<DoctorAdminAppointment[]>('/doctor-admin/appointments', query);
    return (response.data ?? []) as DoctorAdminAppointment[];
  },
};

