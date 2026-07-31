import { api } from '@/lib/api-client';

export interface GroundStaffUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  status: 'active' | 'inactive' | 'suspended';
  avatar_url?: string | null;
  department?: string | null;
  position?: string | null;
  shift?: 'morning' | 'evening' | 'night' | 'general' | null;
  work_area?: string | null;
  notes?: string | null;
  last_attendance_date?: string | null;
  last_attendance_status?: string | null;
  last_check_in?: string | null;
  last_check_out?: string | null;
}

export interface GroundStaffAttendance {
  id: number;
  user_id: number;
  attendance_date: string;
  check_in?: string | null;
  check_out?: string | null;
  status: 'present' | 'late' | 'half_day' | 'absent' | 'leave';
  notes?: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  department?: string | null;
  position?: string | null;
  marked_by_first_name?: string | null;
  marked_by_last_name?: string | null;
}

export interface GroundStaffSummary {
  date: string;
  total_staff: number;
  active_staff: number;
  inactive_staff: number;
  marked_today: number;
  present_today: number;
  late_today: number;
  absent_today: number;
  leave_today: number;
}

export interface GroundStaffDashboard {
  summary: GroundStaffSummary;
  staff: GroundStaffUser[];
  attendance: GroundStaffAttendance[];
}

export const groundStaffApi = {
  async getDashboard(date?: string) {
    const response = await api.get<GroundStaffDashboard>('/ground-staff/dashboard', { date });
    return response.data as GroundStaffDashboard;
  },
  async getStaff(query: { status?: string; search?: string; department?: string } = {}) {
    const response = await api.get<GroundStaffUser[]>('/ground-staff/staff', query);
    return (response.data ?? []) as GroundStaffUser[];
  },
  async createStaff(payload: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone?: string;
    department?: string;
    position?: string;
    shift?: string;
    work_area?: string;
    notes?: string;
  }) {
    const response = await api.post<GroundStaffUser>('/ground-staff/staff', payload);
    return response.data as GroundStaffUser;
  },
  async updateStaff(id: number, payload: Partial<GroundStaffUser>) {
    const response = await api.patch<GroundStaffUser>(`/ground-staff/staff/${id}`, payload);
    return response.data as GroundStaffUser;
  },
  async deleteStaff(id: number) {
    await api.delete(`/ground-staff/staff/${id}`);
  },
  async getAttendance(query: { date_from?: string; date_to?: string; user_id?: number; status?: string } = {}) {
    const response = await api.get<GroundStaffAttendance[]>('/ground-staff/attendance', query);
    return (response.data ?? []) as GroundStaffAttendance[];
  },
  async markAttendance(payload: {
    user_id: number;
    attendance_date: string;
    check_in?: string;
    check_out?: string;
    status: string;
    notes?: string;
  }) {
    await api.post('/ground-staff/attendance', payload);
  },
};
