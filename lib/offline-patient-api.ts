import { api } from './api-client';

export interface OfflineDashboardResponse {
  patients: Array<Record<string, unknown>>;
  tokens: Array<Record<string, unknown>>;
  doctors: Array<Record<string, unknown>>;
  departments: Array<Record<string, unknown>>;
}

export interface OfflineIntakePayload {
  first_name: string;
  last_name: string;
  email?: string;
  phone: string;
  date_of_birth?: string;
  gender: 'M' | 'F' | 'O';
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  chronic_conditions?: string;
  allergies?: string;
  department_id: number;
  doctor_profile_id: number;
  scheduled_date: string;
  scheduled_time: string;
  purpose: string;
  symptoms?: string;
  priority: 'normal' | 'urgent' | 'emergency';
}

export interface OfflineIntakeResult {
  patient_id: number;
  appointment_id: number;
  token_id: number;
  token_number: string;
}

export const offlinePatientApi = {
  async getDashboard() {
    const response = await api.get<OfflineDashboardResponse>('/offline-patient/dashboard');
    return response.data as OfflineDashboardResponse;
  },

  async createIntake(payload: OfflineIntakePayload) {
    const response = await api.post<OfflineIntakeResult>('/offline-patient/intake', payload);
    return response.data as OfflineIntakeResult;
  },

  async updateTokenStatus(id: string, status: string) {
    await api.patch(`/offline-patient/tokens/${id}/status`, { status });
  },

  async approveToken(tokenNumber: string) {
    await api.patch(`/offline-patient/tokens/${encodeURIComponent(tokenNumber)}/approve`, {});
  },
};
