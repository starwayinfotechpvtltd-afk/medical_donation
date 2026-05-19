import { api } from '@/lib/api-client';

export interface AdminMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface StaffUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  status: string;
  phone?: string | null;
  avatar_url?: string | null;
  last_login?: string | null;
  created_at: string;
  updated_at?: string;
  profile?: Record<string, unknown> | null;
}

export interface AdminPatient {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  registration_status: 'pending' | 'approved' | 'rejected' | 'suspended';
  dashboard_enabled: number;
  approved_at?: string | null;
  created_at: string;
}

export interface AdminPatientDetail extends AdminPatient {
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
  insurance_provider?: string | null;
  insurance_number?: string | null;
  registration_no?: string | null;
  appointments_count: number;
  prescriptions_count: number;
  lab_tests_count: number;
  appointments: Array<Record<string, unknown>>;
  prescriptions: Array<Record<string, unknown>>;
  lab_tests: Array<Record<string, unknown>>;
}

export interface DepartmentService { id: number; service_name: string; }

export interface Department {
  id: number;
  name: string;
  description?: string | null;
  icon?: string | null;
  image_url?: string | null;
  beds?: number | null;
  is_active?: number;
  services?: DepartmentService[];
}

export interface DoctorDepartment { id: number; name: string; is_primary?: number; }

export interface DoctorProfile {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
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
  departments?: DoctorDepartment[];
}

export interface ActivityLog {
  id: number;
  actor_type: 'user' | 'patient' | 'system';
  actor_id: number | null;
  action: string;
  description?: string | null;
  entity_type?: string | null;
  entity_id?: number | null;
  ip_address?: string | null;
  user_agent?: string | null;
  details?: string | null;
  created_at: string;
}

export interface AdminAuditLog {
  id: number;
  actor_id: number | null;
  actor_role: string | null;
  actor_name?: string | null;
  action: string;
  entity_type: string | null;
  entity_id: number | null;
  ip_address: string | null;
  status: string;
  created_at: string;
  old_value?: Record<string, unknown> | null;
  new_value?: Record<string, unknown> | null;
  meta?: Record<string, unknown> | null;
  user_agent?: string | null;
}

export interface UsersQuery { page?: number; limit?: number; role?: string; status?: string; search?: string; }
export interface HeroBanner {
  id: number;
  title?: string | null;
  image_url: string;
  link_url?: string | null;
  sort_order: number;
  is_active?: number;
  created_at?: string;
  updated_at?: string;
}

const normalizeAudit = (item: ActivityLog): AdminAuditLog => ({
  id: item.id,
  actor_id: item.actor_id,
  actor_role: item.actor_type,
  actor_name: item.actor_type,
  action: item.action,
  entity_type: item.entity_type ?? null,
  entity_id: item.entity_id ?? null,
  ip_address: item.ip_address ?? null,
  status: 'success',
  created_at: item.created_at,
  user_agent: item.user_agent ?? null,
  old_value: null,
  new_value: null,
  meta: item.details ? { details: item.details } : null,
});

export const adminApi = {
  async getUsers(query: UsersQuery = {}) {
    const response = await api.get<StaffUser[]>('/users', query as Record<string, string | number | boolean | undefined>);
    return { data: (response.data ?? []) as StaffUser[], meta: response.meta as AdminMeta | undefined };
  },
  async getUser(id: number) { const response = await api.get<StaffUser>(`/users/${id}`); return response.data as StaffUser; },
  async createUser(payload: { first_name: string; last_name: string; email: string; password: string; role: string; phone?: string; }) { const response = await api.post<StaffUser>('/users', payload); return response.data as StaffUser; },
  async updateUser(id: number, payload: Partial<{ first_name: string; last_name: string; email: string; phone: string; role: string; status: string; avatar_url: string; }>) { const response = await api.patch<StaffUser>(`/users/${id}`, payload); return response.data as StaffUser; },
  async assignRole(id: number, role: string) { const response = await api.patch<StaffUser>(`/users/${id}/assign-role`, { role }); return response.data as StaffUser; },
  async updateDoctorProfile(id: number, payload: Partial<{ specialization: string; qualification: string; license_number: string; years_of_experience: number; consultation_fee: number; available_days: string; available_time_start: string; available_time_end: string; image_url: string; bio: string; }>) { const response = await api.patch<Record<string, unknown>>(`/users/${id}/doctor-profile`, payload); return response.data as Record<string, unknown>; },
  async deactivateUser(id: number) { await api.patch(`/users/${id}/deactivate`, {}); },
  async deleteUser(id: number) { await api.delete(`/users/${id}`); },

  async getPatients(status?: string) { const response = await api.get<AdminPatient[]>('/admin/patients', { status }); return (response.data ?? []) as AdminPatient[]; },
  async getPatientDetail(id: number) { const response = await api.get<AdminPatientDetail>(`/admin/patients/${id}`); return response.data as AdminPatientDetail; },
  async approvePatient(id: number) { await api.patch(`/admin/patients/${id}/approve`, {}); },
  async rejectPatient(id: number, rejection_reason: string) { await api.patch(`/admin/patients/${id}/reject`, { rejection_reason }); },
  async deactivatePatient(id: number) { await api.patch(`/admin/patients/${id}/deactivate`, {}); },
  async deletePatient(id: number) { await api.delete(`/admin/patients/${id}`); },

  async getActivityLogs(query: { actorType?: string; action?: string; entityType?: string; limit?: number; offset?: number } = {}) {
    const response = await api.get<ActivityLog[]>('/admin/activity-logs', query as Record<string, string | number | boolean | undefined>);
    return (response.data ?? []) as ActivityLog[];
  },

  async getAuditLogs(query: { page?: number; limit?: number; action?: string; entity_type?: string } = {}) {
    const limit = query.limit ?? 10;
    const page = query.page ?? 1;
    const offset = (page - 1) * limit;
    const logs = await this.getActivityLogs({ action: query.action, entityType: query.entity_type, limit, offset });
    return {
      data: logs.map(normalizeAudit),
      meta: { page, limit, total: logs.length, totalPages: Math.max(1, Math.ceil(logs.length / limit)) },
    };
  },

  async getAuditLog(id: number) {
    const logs = await this.getActivityLogs({ limit: 200, offset: 0 });
    const found = logs.find((l) => l.id === id);
    if (!found) throw new Error('Log not found.');
    return normalizeAudit(found);
  },

  async getDepartments() { const response = await api.get<Department[]>('/departments'); return (response.data ?? []) as Department[]; },
  async getDepartment(id: number) { const response = await api.get<{ department: Department; services: DepartmentService[]; doctors: DoctorProfile[] }>(`/departments/${id}`); return response.data as { department: Department; services: DepartmentService[]; doctors: DoctorProfile[] }; },
  async createDepartment(payload: FormData | { name: string; description?: string; icon?: string; image_url?: string; beds?: number }) { const response = await api.post<{ id: number }>('/departments', payload); return response.data as { id: number }; },
  async updateDepartment(id: number, payload: Partial<{ name: string; description: string; icon: string; image_url: string; beds: number }>) { await api.patch(`/departments/${id}`, payload); },
  async deleteDepartment(id: number) { await api.delete(`/departments/${id}`); },

  async getDoctors() { const response = await api.get<DoctorProfile[]>('/doctors'); return (response.data ?? []) as DoctorProfile[]; },
  async getDoctor(id: number) { const response = await api.get<DoctorProfile>(`/doctors/${id}`); return response.data as DoctorProfile; },
  async assignDoctorDepartment(doctorProfileId: number, department_id: number, is_primary = 0) { await api.post(`/doctors/${doctorProfileId}/departments`, { department_id, is_primary }); },
  async removeDoctorDepartment(doctorProfileId: number, departmentId: number) { await api.delete(`/doctors/${doctorProfileId}/departments/${departmentId}`); },

  async getHeroBannersAdmin() {
    const response = await api.get<HeroBanner[]>('/hero-banners/admin');
    return (response.data ?? []) as HeroBanner[];
  },
  async createHeroBanner(payload: FormData) {
    const response = await api.post<{ id: number; image_url: string }>('/hero-banners/admin', payload);
    return response.data as { id: number; image_url: string };
  },
  async updateHeroBanner(id: number, payload: Partial<Pick<HeroBanner, 'title' | 'link_url' | 'sort_order' | 'is_active'>>) {
    await api.patch(`/hero-banners/admin/${id}`, payload);
  },
  async deleteHeroBanner(id: number) {
    await api.delete(`/hero-banners/admin/${id}`);
  },
};
