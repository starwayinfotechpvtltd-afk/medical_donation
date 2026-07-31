import { api } from './api-client';

export interface LabAdminSummary {
  total_tests?: number;
  pending_tests?: number;
  in_progress_tests?: number;
  completed_tests?: number;
  cancelled_tests?: number;
  urgent_tests?: number;
  total_patients?: number;
  completed_today?: number;
  total_technicians?: number;
  active_technicians?: number;
  total_equipment?: number;
  operational_equipment?: number;
  maintenance_equipment?: number;
}

export interface LabEquipment {
  id: number;
  name: string;
  type?: string | null;
  model?: string | null;
  manufacturer?: string | null;
  serial_number?: string | null;
  location?: string | null;
  status: 'operational' | 'maintenance' | 'repair' | 'retired';
  condition_status: 'excellent' | 'good' | 'fair' | 'poor';
  last_calibration?: string | null;
  next_calibration?: string | null;
  last_maintenance?: string | null;
  next_maintenance?: string | null;
  notes?: string | null;
}

export interface LabAdminDashboardData {
  summary: LabAdminSummary;
  recent_tests: Array<Record<string, unknown>>;
  equipment: LabEquipment[];
}

export interface LabTechnicianProfile {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  user_email?: string | null;
  user_phone?: string | null;
  lab_name?: string | null;
  licence_number?: string | null;
  address?: string | null;
  email?: string | null;
  mobile_number?: string | null;
  lab_time?: string | null;
  created_at?: string | null;
}

export const labAdminApi = {
  async getDashboard() {
    const response = await api.get<LabAdminDashboardData>('/lab-admin/dashboard');
    return response.data as LabAdminDashboardData;
  },

  async getEquipment() {
    const response = await api.get<LabEquipment[]>('/lab-admin/equipment');
    return (response.data ?? []) as LabEquipment[];
  },

  async createEquipment(payload: Partial<LabEquipment>) {
    await api.post('/lab-admin/equipment', payload);
  },

  async updateEquipment(id: number, payload: Partial<LabEquipment>) {
    await api.patch(`/lab-admin/equipment/${id}`, payload);
  },

  async deleteEquipment(id: number) {
    await api.delete(`/lab-admin/equipment/${id}`);
  },

  async getTechnicians() {
    const response = await api.get<LabTechnicianProfile[]>('/lab/lab-technician-profiles');
    return (response.data ?? []) as LabTechnicianProfile[];
  },

  async getLabTests() {
    const response = await api.get<Array<Record<string, unknown>>>('/lab/lab-tests');
    return (response.data ?? []) as Array<Record<string, unknown>>;
  },
};
