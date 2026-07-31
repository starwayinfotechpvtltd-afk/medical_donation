'use client';

import { useEffect, useMemo, useState } from 'react';
import { Building, CalendarCheck, LogOut, Menu, Plus, RefreshCw, Search, Trash2, User, UserMinus, Users, X } from 'lucide-react';
import GroundStaffProtected from '@/components/GroundStaffProtected';
import { useAuth } from '@/context/AuthContext';
import { getLoginPathForRole } from '@/lib/auth-routes';
import { groundStaffApi, type GroundStaffAttendance, type GroundStaffDashboard, type GroundStaffUser } from '@/lib/ground-staff-api';
import { useRouter } from 'next/navigation';

type Tab = 'overview' | 'staff' | 'attendance';
type StaffForm = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended';
  department: string;
  position: string;
  shift: 'morning' | 'evening' | 'night' | 'general';
  work_area: string;
  notes: string;
};

const today = () => new Date().toISOString().slice(0, 10);
const emptyForm: StaffForm = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  phone: '',
  status: 'active',
  department: '',
  position: '',
  shift: 'general',
  work_area: '',
  notes: '',
};
const fmtDate = (value?: string | null) => (value ? String(value).slice(0, 10) : '-');
const fmtTime = (value?: string | null) => (value ? String(value).slice(0, 5) : '-');

export default function GroundStaffDashboardPage() {
  return (
    <GroundStaffProtected>
      <GroundStaffDashboardContent />
    </GroundStaffProtected>
  );
}

function GroundStaffDashboardContent() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState<GroundStaffDashboard | null>(null);
  const [staff, setStaff] = useState<GroundStaffUser[]>([]);
  const [attendance, setAttendance] = useState<GroundStaffAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [date, setDate] = useState(today());
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<GroundStaffUser | null>(null);
  const [form, setForm] = useState<StaffForm>(emptyForm);
  const [attendanceForm, setAttendanceForm] = useState({
    user_id: '',
    attendance_date: today(),
    check_in: '09:00',
    check_out: '',
    status: 'present',
    notes: '',
  });

  const loadDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const dashboard = await groundStaffApi.getDashboard(date);
      setData(dashboard);
      setStaff(dashboard.staff);
      setAttendance(dashboard.attendance);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load ground staff dashboard.');
    } finally {
      setLoading(false);
    }
  };

  const loadStaff = async () => {
    setError('');
    try {
      setStaff(await groundStaffApi.getStaff({ search: search || undefined, status: status || undefined }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load staff.');
    }
  };

  const loadAttendance = async () => {
    setError('');
    try {
      setAttendance(await groundStaffApi.getAttendance({ date_from: date, date_to: date, status: status || undefined }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load attendance.');
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, [date]);

  useEffect(() => {
    if (tab === 'staff') void loadStaff();
    if (tab === 'attendance') void loadAttendance();
  }, [tab, search, status]);

  const summary = data?.summary;
  const counters = useMemo(() => ({
    total: staff.length,
    active: staff.filter((item) => item.status === 'active').length,
    present: attendance.filter((item) => item.status === 'present').length,
    absent: attendance.filter((item) => item.status === 'absent').length,
  }), [staff, attendance]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (item: GroundStaffUser) => {
    setEditing(item);
    setForm({
      first_name: item.first_name,
      last_name: item.last_name,
      email: item.email,
      password: '',
      phone: item.phone || '',
      status: item.status,
      department: item.department || '',
      position: item.position || '',
      shift: item.shift || 'general',
      work_area: item.work_area || '',
      notes: item.notes || '',
    });
    setShowForm(true);
  };

  const saveStaff = async () => {
    setError('');
    try {
      if (editing) {
        await groundStaffApi.updateStaff(editing.id, {
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone || undefined,
          status: form.status,
          department: form.department || undefined,
          position: form.position || undefined,
          shift: form.shift,
          work_area: form.work_area || undefined,
          notes: form.notes || undefined,
        });
      } else {
        if (!form.password.trim()) {
          setError('Password is required when creating ground staff.');
          return;
        }
        await groundStaffApi.createStaff({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          password: form.password,
          phone: form.phone || undefined,
          department: form.department || undefined,
          position: form.position || undefined,
          shift: form.shift,
          work_area: form.work_area || undefined,
          notes: form.notes || undefined,
        });
      }
      setShowForm(false);
      await loadDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save staff.');
    }
  };

  const deleteStaff = async (item: GroundStaffUser) => {
    if (!window.confirm(`Delete ${item.first_name} ${item.last_name}? This cannot be undone.`)) return;
    await groundStaffApi.deleteStaff(item.id);
    await loadDashboard();
  };

  const deactivateStaff = async (item: GroundStaffUser) => {
    if (!window.confirm(`Deactivate ${item.first_name} ${item.last_name}?`)) return;
    await groundStaffApi.updateStaff(item.id, { status: 'inactive' });
    await loadDashboard();
  };

  const markAttendance = async () => {
    setError('');
    if (!attendanceForm.user_id) {
      setError('Select a staff member before marking attendance.');
      return;
    }
    try {
      await groundStaffApi.markAttendance({
        user_id: Number(attendanceForm.user_id),
        attendance_date: attendanceForm.attendance_date,
        check_in: attendanceForm.check_in || undefined,
        check_out: attendanceForm.check_out || undefined,
        status: attendanceForm.status,
        notes: attendanceForm.notes || undefined,
      });
      setDate(attendanceForm.attendance_date);
      await loadDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save attendance.');
    }
  };

  const logoutUser = () => {
    logout();
    router.replace(getLoginPathForRole('ground_staff_admin'));
  };

  const tabs: Array<{ id: Tab; label: string; icon: typeof Users }> = [
    { id: 'overview', label: 'Overview', icon: Building },
    { id: 'staff', label: 'Ground Staff', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="fixed left-0 right-0 top-0 z-30 border-b bg-white">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen((v) => !v)} className="rounded-lg p-2 hover:bg-slate-100 lg:hidden">
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-emerald-600 p-1.5 text-white">
                <Building className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Ground Staff</h1>
                <p className="text-xs text-slate-500">Staff and Attendance</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right text-sm md:block">
              <p className="font-medium text-slate-900">{user?.name || 'Ground Staff'}</p>
              <p className="text-xs text-slate-500">{user?.email || ''}</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
              <User className="h-4 w-4" />
            </div>
          </div>
        </div>
      </header>

      <aside className={`fixed inset-y-0 left-0 z-20 w-64 border-r bg-white pt-[60px] transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <nav className="flex h-full flex-col p-4">
          <div className="space-y-1">
            {tabs.map((item) => {
              const Icon = item.icon;
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setTab(item.id);
                    setSidebarOpen(false);
                    setSearch('');
                    setStatus('');
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium ${active ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
          <button onClick={logoutUser} className="mt-auto flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </nav>
      </aside>

      <main className="pt-[60px] lg:ml-64">
        <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-emerald-600">Ground Staff Dashboard</p>
              <h2 className="mt-1 text-3xl font-semibold text-slate-900">
                {tab === 'overview' ? 'Overview' : tab === 'staff' ? 'Manage Ground Staff' : 'Attendance System'}
              </h2>
            </div>
            <div className="flex gap-2">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-lg border bg-white px-3 py-2 text-sm" />
              <button onClick={loadDashboard} className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>

          {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}

          {tab === 'overview' ? (
            <>
              <div className="grid gap-4 md:grid-cols-4">
                {[
                  ['Total Staff', summary?.total_staff ?? 0],
                  ['Active Staff', summary?.active_staff ?? 0],
                  ['Marked Today', summary?.marked_today ?? 0],
                  ['Present Today', summary?.present_today ?? 0],
                ].map(([label, value]) => (
                  <div key={String(label)} className="rounded-lg border bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="mt-3 text-3xl font-semibold text-slate-900">{loading ? '-' : value}</p>
                  </div>
                ))}
              </div>
              <AttendanceTable rows={attendance} />
            </>
          ) : null}

          {tab === 'staff' ? (
            <>
              <div className="grid gap-4 md:grid-cols-4">
                {[
                  ['Total', counters.total],
                  ['Active', counters.active],
                  ['Present', counters.present],
                  ['Absent', counters.absent],
                ].map(([label, value]) => (
                  <div key={String(label)} className="rounded-lg border bg-white p-4">
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="mt-2 text-2xl font-semibold">{value}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 rounded-lg border bg-white p-4">
                <div className="relative min-w-72 flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border px-10 py-2 text-sm" placeholder="Search staff" />
                </div>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border px-3 py-2 text-sm">
                  <option value="">All status</option>
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                  <option value="suspended">suspended</option>
                </select>
                <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white">
                  <Plus className="h-4 w-4" />
                  Add Staff
                </button>
              </div>
              <StaffGrid rows={staff} onEdit={openEdit} onDeactivate={deactivateStaff} onDelete={deleteStaff} />
            </>
          ) : null}

          {tab === 'attendance' ? (
            <>
              <div className="grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-6">
                <select value={attendanceForm.user_id} onChange={(e) => setAttendanceForm((s) => ({ ...s, user_id: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm md:col-span-2">
                  <option value="">Select staff</option>
                  {staff.filter((item) => item.status === 'active').map((item) => (
                    <option key={item.id} value={item.id}>{item.first_name} {item.last_name}</option>
                  ))}
                </select>
                <input type="date" value={attendanceForm.attendance_date} onChange={(e) => setAttendanceForm((s) => ({ ...s, attendance_date: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm" />
                <input type="time" value={attendanceForm.check_in} onChange={(e) => setAttendanceForm((s) => ({ ...s, check_in: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm" />
                <input type="time" value={attendanceForm.check_out} onChange={(e) => setAttendanceForm((s) => ({ ...s, check_out: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm" />
                <select value={attendanceForm.status} onChange={(e) => setAttendanceForm((s) => ({ ...s, status: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm">
                  <option value="present">present</option>
                  <option value="late">late</option>
                  <option value="half_day">half day</option>
                  <option value="absent">absent</option>
                  <option value="leave">leave</option>
                </select>
                <input value={attendanceForm.notes} onChange={(e) => setAttendanceForm((s) => ({ ...s, notes: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm md:col-span-5" placeholder="Notes" />
                <button onClick={markAttendance} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white">Save</button>
              </div>
              <div className="flex flex-wrap gap-3 rounded-lg border bg-white p-4">
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border px-3 py-2 text-sm">
                  <option value="">All attendance status</option>
                  <option value="present">present</option>
                  <option value="late">late</option>
                  <option value="half_day">half day</option>
                  <option value="absent">absent</option>
                  <option value="leave">leave</option>
                </select>
              </div>
              <AttendanceTable rows={attendance} />
            </>
          ) : null}
        </div>
      </main>

      {showForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-3xl rounded-lg bg-white p-5" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-semibold text-slate-900">{editing ? 'Edit Ground Staff' : 'Add Ground Staff'}</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input value={form.first_name} onChange={(e) => setForm((s) => ({ ...s, first_name: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm" placeholder="First name" />
              <input value={form.last_name} onChange={(e) => setForm((s) => ({ ...s, last_name: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm" placeholder="Last name" />
              <input value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm" placeholder="Email" />
              <input value={form.phone} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm" placeholder="Phone" />
              {!editing ? <input value={form.password} onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))} type="password" className="rounded-lg border px-3 py-2 text-sm" placeholder="Password" /> : null}
              <select value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as StaffForm['status'] }))} className="rounded-lg border px-3 py-2 text-sm">
                <option value="active">active</option>
                <option value="inactive">inactive</option>
                <option value="suspended">suspended</option>
              </select>
              <input value={form.department} onChange={(e) => setForm((s) => ({ ...s, department: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm" placeholder="Department" />
              <input value={form.position} onChange={(e) => setForm((s) => ({ ...s, position: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm" placeholder="Position" />
              <select value={form.shift} onChange={(e) => setForm((s) => ({ ...s, shift: e.target.value as StaffForm['shift'] }))} className="rounded-lg border px-3 py-2 text-sm">
                <option value="general">general</option>
                <option value="morning">morning</option>
                <option value="evening">evening</option>
                <option value="night">night</option>
              </select>
              <input value={form.work_area} onChange={(e) => setForm((s) => ({ ...s, work_area: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm" placeholder="Work area" />
              <textarea value={form.notes} onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm md:col-span-2" rows={3} placeholder="Notes" />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="rounded-lg border px-4 py-2 text-sm">Cancel</button>
              <button onClick={saveStaff} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white">Save</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StaffGrid({ rows, onEdit, onDeactivate, onDelete }: {
  rows: GroundStaffUser[];
  onEdit: (row: GroundStaffUser) => void;
  onDeactivate: (row: GroundStaffUser) => void;
  onDelete: (row: GroundStaffUser) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {rows.map((item) => (
        <div key={item.id} className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-900">{item.first_name} {item.last_name}</p>
              <p className="text-sm text-slate-500">{item.email}</p>
              <p className="text-sm text-slate-500">{item.phone || 'No phone'}</p>
            </div>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{item.status}</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <Info label="Department" value={item.department || '-'} />
            <Info label="Position" value={item.position || '-'} />
            <Info label="Shift" value={item.shift || '-'} />
            <Info label="Area" value={item.work_area || '-'} />
          </div>
          <p className="mt-3 text-xs text-slate-500">Last attendance: {fmtDate(item.last_attendance_date)} {item.last_attendance_status || ''}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={() => onEdit(item)} className="rounded-lg border px-3 py-1.5 text-xs">Edit</button>
            <button onClick={() => onDeactivate(item)} className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800">
              <UserMinus className="h-3.5 w-3.5" />
              Deactivate
            </button>
            <button onClick={() => onDelete(item)} className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white">
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </div>
      ))}
      {!rows.length ? <div className="rounded-lg border bg-white p-8 text-sm text-slate-500 md:col-span-2 xl:col-span-3">No ground staff found.</div> : null}
    </div>
  );
}

function AttendanceTable({ rows }: { rows: GroundStaffAttendance[] }) {
  return (
    <div className="rounded-lg border bg-white p-5">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">Attendance Records</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b text-xs uppercase text-slate-500">
            <tr>
              <th className="py-3 pr-4">Staff</th>
              <th className="py-3 pr-4">Department</th>
              <th className="py-3 pr-4">Date</th>
              <th className="py-3 pr-4">Check In</th>
              <th className="py-3 pr-4">Check Out</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4">Marked By</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.id} className="border-b last:border-0">
                <td className="py-3 pr-4 font-medium text-slate-900">{item.first_name} {item.last_name}</td>
                <td className="py-3 pr-4">{item.department || '-'}</td>
                <td className="py-3 pr-4">{fmtDate(item.attendance_date)}</td>
                <td className="py-3 pr-4">{fmtTime(item.check_in)}</td>
                <td className="py-3 pr-4">{fmtTime(item.check_out)}</td>
                <td className="py-3 pr-4">{item.status}</td>
                <td className="py-3 pr-4">{item.marked_by_first_name ? `${item.marked_by_first_name} ${item.marked_by_last_name}` : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length ? <p className="py-6 text-sm text-slate-500">No attendance records found.</p> : null}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-medium text-slate-900">{value}</p>
    </div>
  );
}
