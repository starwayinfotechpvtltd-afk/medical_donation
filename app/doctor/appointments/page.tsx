'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Calendar, CheckCircle2, Clock, Search, XCircle } from 'lucide-react';
import { api, ApiException } from '@/lib/api-client';

type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

interface Appointment {
  id: number;
  patient_id: number;
  patient_first_name: string;
  patient_last_name: string;
  doctor_first_name: string;
  doctor_last_name: string;
  department_name?: string | null;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  reason?: string | null;
  type?: string | null;
  status: AppointmentStatus;
  notes?: string | null;
  cancellation_reason?: string | null;
}

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const classes: Record<AppointmentStatus, string> = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-emerald-100 text-emerald-700',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-indigo-100 text-indigo-700',
    cancelled: 'bg-red-100 text-red-700',
    no_show: 'bg-slate-200 text-slate-700',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${classes[status]}`}>
      {status}
    </span>
  );
}

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AppointmentStatus>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Appointment[]>('/appointments');
      setAppointments((res.data ?? []) as Appointment[]);
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAppointments();
  }, []);

  const filtered = useMemo(() => {
    return appointments.filter((item) => {
      const name = `${item.patient_first_name} ${item.patient_last_name}`.toLowerCase();
      const matchesQuery =
        name.includes(query.toLowerCase()) ||
        String(item.patient_id).includes(query.trim()) ||
        String(item.id).includes(query.trim());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesDate = !dateFilter || item.scheduled_date === dateFilter;
      return matchesQuery && matchesStatus && matchesDate;
    });
  }, [appointments, query, statusFilter, dateFilter]);

  const stats = useMemo(
    () => ({
      total: appointments.length,
      pending: appointments.filter((a) => a.status === 'pending').length,
      confirmed: appointments.filter((a) => a.status === 'confirmed').length,
      cancelled: appointments.filter((a) => a.status === 'cancelled').length,
      completed: appointments.filter((a) => a.status === 'completed').length,
    }),
    [appointments]
  );

  const approve = async (id: number) => {
    setUpdatingId(id);
    setError(null);
    setMessage(null);
    try {
      await api.patch(`/appointments/${id}/approve`, {});
      setMessage(`Appointment #${id} approved.`);
      await loadAppointments();
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Could not approve appointment.');
    } finally {
      setUpdatingId(null);
    }
  };

  const reject = async (id: number) => {
    const reason = window.prompt('Rejection reason (optional):') ?? '';
    setUpdatingId(id);
    setError(null);
    setMessage(null);
    try {
      await api.patch(`/appointments/${id}/reject`, { cancellation_reason: reason.trim() || null });
      setMessage(`Appointment #${id} rejected.`);
      await loadAppointments();
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Could not reject appointment.');
    } finally {
      setUpdatingId(null);
    }
  };

  const moveNextDate = async (id: number) => {
    const scheduled_date = window.prompt('Next appointment date (YYYY-MM-DD):') || '';
    if (!scheduled_date.trim()) return;
    const scheduled_time = window.prompt('Next appointment time (HH:MM:SS):', '10:00:00') || '';
    if (!scheduled_time.trim()) return;
    const note = window.prompt('Optional note:') || '';
    setUpdatingId(id);
    setError(null);
    setMessage(null);
    try {
      await api.patch(`/appointments/${id}/next-date`, { scheduled_date, scheduled_time, note: note.trim() || null });
      setMessage(`Appointment #${id} moved to next date.`);
      await loadAppointments();
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Could not update next date.');
    } finally {
      setUpdatingId(null);
    }
  };

  const discharge = async (id: number) => {
    const note = window.prompt('Discharge note (optional):') || '';
    setUpdatingId(id);
    setError(null);
    setMessage(null);
    try {
      await api.patch(`/appointments/${id}/discharge`, { note: note.trim() || null });
      setMessage(`Patient for appointment #${id} discharged.`);
      await loadAppointments();
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Could not discharge patient.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
        <p className="text-sm text-slate-500">Review and approve patient appointment requests.</p>
      </div>

      {message && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</div>}
      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">Total</p><p className="text-2xl font-bold">{stats.total}</p></div>
        <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">Pending Approval</p><p className="text-2xl font-bold text-amber-600">{stats.pending}</p></div>
        <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">Confirmed</p><p className="text-2xl font-bold text-emerald-600">{stats.confirmed}</p></div>
        <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">Cancelled</p><p className="text-2xl font-bold text-red-600">{stats.cancelled}</p></div>
        <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">Discharged</p><p className="text-2xl font-bold text-indigo-600">{stats.completed}</p></div>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by patient name, patient id, or appointment id"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | AppointmentStatus)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Discharged</option>
          </select>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
        <table className="w-full min-w-[900px]">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">Appointment</th>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Schedule</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-500">No appointments found.</td>
              </tr>
            )}
            {filtered.map((item) => {
              const patientName = `${item.patient_first_name} ${item.patient_last_name}`;
              const pending = item.status === 'pending';
              return (
                <tr key={item.id} className="border-t border-slate-100 text-sm">
                  <td className="px-4 py-3 font-medium text-slate-900">#{item.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{patientName}</p>
                    <p className="text-xs text-slate-500">Patient #{item.patient_id}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-400" />{item.scheduled_date}</div>
                    <div className="mt-1 flex items-center gap-2"><Clock className="h-4 w-4 text-slate-400" />{item.scheduled_time}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{item.department_name || '-'}</td>
                  <td className="max-w-[250px] truncate px-4 py-3 text-slate-700">{item.reason || '-'}</td>
                  <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                  <td className="px-4 py-3">
                    {pending ? (
                      <div className="flex gap-2">
                        <button
                          disabled={updatingId === item.id}
                          onClick={() => void approve(item.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Approve
                        </button>
                        <button
                          disabled={updatingId === item.id}
                          onClick={() => void reject(item.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Reject
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        {item.status === 'confirmed' && (
                          <>
                            <button disabled={updatingId === item.id} onClick={() => void moveNextDate(item.id)} className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60">Next Date</button>
                            <button disabled={updatingId === item.id} onClick={() => void discharge(item.id)} className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60">Discharge</button>
                          </>
                        )}
                        {item.status !== 'confirmed' && <span className="text-xs text-slate-500">Already reviewed</span>}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-500">
                  <span className="inline-flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 animate-pulse" />
                    Loading appointments...
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
