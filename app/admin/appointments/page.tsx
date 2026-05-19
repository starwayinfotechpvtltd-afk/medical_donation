'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api-client';
import { Calendar, CheckCircle2, Clock3, RefreshCw, Search, XCircle } from 'lucide-react';

type AdminAppointment = {
  id: number;
  patient_id: number;
  doctor_profile_id: number;
  department_id: number | null;
  scheduled_date: string;
  scheduled_time: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  reason?: string | null;
  disease?: string | null;
  cancellation_reason?: string | null;
  patient_first_name?: string;
  patient_last_name?: string;
  doctor_first_name?: string;
  doctor_last_name?: string;
  department_name?: string;
};

const statusTabs = ['all', 'pending', 'confirmed', 'cancelled'] as const;

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<(typeof statusTabs)[number]>('all');
  const [rejectReason, setRejectReason] = useState('');
  const [selected, setSelected] = useState<AdminAppointment | null>(null);
  const [saving, setSaving] = useState(false);

  const loadAppointments = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get<AdminAppointment[]>('/appointments');
      setAppointments((res.data ?? []) as AdminAppointment[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return appointments.filter((item) => {
      if (status !== 'all' && item.status !== status) return false;
      if (!q) return true;
      const patientName = `${item.patient_first_name ?? ''} ${item.patient_last_name ?? ''}`.toLowerCase();
      const doctorName = `${item.doctor_first_name ?? ''} ${item.doctor_last_name ?? ''}`.toLowerCase();
      return patientName.includes(q) || doctorName.includes(q) || (item.department_name || '').toLowerCase().includes(q);
    });
  }, [appointments, search, status]);

  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
  };

  const approve = async (id: number) => {
    setSaving(true);
    setError('');
    try {
      await api.patch(`/appointments/${id}/approve`, {});
      setSelected(null);
      await loadAppointments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve appointment.');
    } finally {
      setSaving(false);
    }
  };

  const reject = async (id: number) => {
    if (!rejectReason.trim()) {
      setError('Rejection reason is required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await api.patch(`/appointments/${id}/reject`, { cancellation_reason: rejectReason.trim() });
      setRejectReason('');
      setSelected(null);
      await loadAppointments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject appointment.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-blue-600">Admin</p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">Appointments</h1>
          <p className="mt-2 text-sm text-slate-500">Live data from `/api/appointments` with approve/reject actions.</p>
        </div>
        <button onClick={loadAppointments} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total" value={stats.total} />
        <Stat label="Pending" value={stats.pending} />
        <Stat label="Confirmed" value={stats.confirmed} />
        <Stat label="Cancelled" value={stats.cancelled} />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1.2fr,0.8fr]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient, doctor, department"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-3 text-sm outline-none focus:border-blue-400"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {statusTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setStatus(tab)}
                className={`rounded-xl px-4 py-2 text-sm font-medium ${status === tab ? 'bg-blue-600 text-white' : 'border border-slate-200 bg-slate-50 text-slate-700'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        {loading ? <p className="text-sm text-slate-500">Loading appointments...</p> : null}
        {error ? <p className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</p> : null}

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="px-3 py-3">Patient</th>
                <th className="px-3 py-3">Doctor</th>
                <th className="px-3 py-3">Department</th>
                <th className="px-3 py-3">Schedule</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="px-3 py-3 font-medium text-slate-900">{item.patient_first_name} {item.patient_last_name}</td>
                  <td className="px-3 py-3">Dr. {item.doctor_first_name} {item.doctor_last_name}</td>
                  <td className="px-3 py-3">{item.department_name || '-'}</td>
                  <td className="px-3 py-3">
                    <div className="flex flex-col gap-1 text-xs text-slate-600">
                      <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{item.scheduled_date}</span>
                      <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{item.scheduled_time}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3"><StatusBadge status={item.status} /></td>
                  <td className="px-3 py-3">
                    <button onClick={() => setSelected(item)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && filtered.length === 0 ? <p className="pt-4 text-sm text-slate-500">No appointments found.</p> : null}
      </section>

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-slate-900">Manage Appointment #{selected.id}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {selected.patient_first_name} {selected.patient_last_name} - Dr. {selected.doctor_first_name} {selected.doctor_last_name}
            </p>
            <p className="mt-2 text-sm text-slate-600">Reason: {selected.reason || selected.disease || '-'}</p>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Rejection reason (required for reject)"
              className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-400"
            />

            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button onClick={() => setSelected(null)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm">Close</button>
              <button disabled={saving} onClick={() => void approve(selected.id)} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">Approve</button>
              <button disabled={saving} onClick={() => void reject(selected.id)} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">Reject</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StatusBadge({ status }: { status: AdminAppointment['status'] }) {
  if (status === 'confirmed') {
    return <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" />confirmed</span>;
  }
  if (status === 'cancelled') {
    return <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700"><XCircle className="h-3.5 w-3.5" />cancelled</span>;
  }
  return <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-xs text-amber-700"><Clock3 className="h-3.5 w-3.5" />{status}</span>;
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
