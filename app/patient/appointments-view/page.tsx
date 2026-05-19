'use client';

import { useEffect, useMemo, useState } from 'react';
import { Calendar, Clock, Stethoscope } from 'lucide-react';
import { api, ApiException } from '@/lib/api-client';

interface AppointmentItem {
  id: number;
  doctor_profile_id: number;
  doctor_first_name?: string;
  doctor_last_name?: string;
  doctor_specialization?: string | null;
  doctor_qualification?: string | null;
  doctor_experience?: number | null;
  doctor_consultation_fee?: number | null;
  doctor_phone?: string | null;
  department_name?: string | null;
  scheduled_date: string;
  scheduled_time: string;
  status: string;
  notes?: string | null;
  reason?: string | null;
  disease?: string | null;
}

interface DoctorOption {
  id: number;
  first_name: string;
  last_name: string;
  specialization?: string | null;
  qualification?: string | null;
  years_of_experience?: number | null;
  consultation_fee?: number | null;
  departments?: string | null;
}

interface DepartmentOption {
  id: number;
  name: string;
}

const statusTone = (status: string) => {
  const s = (status || '').toLowerCase();
  if (s === 'confirmed') return 'bg-green-100 text-green-700';
  if (s === 'pending') return 'bg-amber-100 text-amber-700';
  if (s === 'cancelled') return 'bg-red-100 text-red-700';
  return 'bg-slate-100 text-slate-700';
};

export default function AppointmentsViewPage() {
  const [rows, setRows] = useState<AppointmentItem[]>([]);
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [cancelReason, setCancelReason] = useState<Record<number, string>>({});
  const [form, setForm] = useState({
    doctor_profile_id: '',
    department_id: '',
    scheduled_date: '',
    scheduled_time: '',
    reason: '',
    disease: '',
    type: 'in_person',
  });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [aptRes, docRes, depRes] = await Promise.all([
        api.get<AppointmentItem[]>('/appointments'),
        api.get<DoctorOption[]>('/doctors'),
        api.get<DepartmentOption[]>('/departments'),
      ]);
      setRows((aptRes.data ?? []) as AppointmentItem[]);
      setDoctors((docRes.data ?? []) as DoctorOption[]);
      setDepartments((depRes.data ?? []) as DepartmentOption[]);
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const stats = useMemo(() => {
    const pending = rows.filter((r) => r.status === 'pending').length;
    const confirmed = rows.filter((r) => r.status === 'confirmed').length;
    const completed = rows.filter((r) => r.status === 'completed').length;
    return { total: rows.length, pending, confirmed, completed };
  }, [rows]);

  const selectedDoctor = doctors.find((d) => String(d.id) === form.doctor_profile_id);

  const createAppointment = async () => {
    setSaving(true);
    setError('');
    try {
      await api.post('/appointments', {
        doctor_profile_id: Number(form.doctor_profile_id),
        department_id: Number(form.department_id),
        scheduled_date: form.scheduled_date,
        scheduled_time: form.scheduled_time,
        reason: form.reason,
        disease: form.disease || null,
        type: form.type,
      });
      setForm({ doctor_profile_id: '', department_id: '', scheduled_date: '', scheduled_time: '', reason: '', disease: '', type: 'in_person' });
      await load();
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to book appointment.');
    } finally {
      setSaving(false);
    }
  };

  const cancelAppointment = async (id: number) => {
    try {
      await api.patch(`/appointments/${id}/cancel`, { cancellation_reason: cancelReason[id] || null });
      await load();
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to cancel appointment.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
        <p className="text-sm text-slate-500">Manage bookings, assigned doctor details, and appointment status.</p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">Total</p><p className="text-2xl font-bold">{stats.total}</p></div>
        <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">Pending</p><p className="text-2xl font-bold">{stats.pending}</p></div>
        <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">Confirmed</p><p className="text-2xl font-bold">{stats.confirmed}</p></div>
        <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">Completed</p><p className="text-2xl font-bold">{stats.completed}</p></div>
      </div>

      <section className="rounded-xl border border-slate-100 bg-white p-4 space-y-3">
        <h2 className="text-sm font-semibold text-slate-800">Book New Appointment</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm" value={form.doctor_profile_id} onChange={(e) => setForm((s) => ({ ...s, doctor_profile_id: e.target.value }))}>
            <option value="">Select doctor</option>
            {doctors.map((d) => <option key={d.id} value={d.id}>Dr. {d.first_name} {d.last_name} ({d.specialization || 'General'})</option>)}
          </select>
          <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm" value={form.department_id} onChange={(e) => setForm((s) => ({ ...s, department_id: e.target.value }))}>
            <option value="">Select department</option>
            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm" value={form.type} onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))}>
            <option value="in_person">In Person</option>
            <option value="teleconsultation">Teleconsultation</option>
          </select>
          <input type="date" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" value={form.scheduled_date} onChange={(e) => setForm((s) => ({ ...s, scheduled_date: e.target.value }))} />
          <input type="time" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" value={form.scheduled_time} onChange={(e) => setForm((s) => ({ ...s, scheduled_time: e.target.value }))} />
          <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Condition / disease" value={form.disease} onChange={(e) => setForm((s) => ({ ...s, disease: e.target.value }))} />
        </div>
        <textarea className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" rows={2} placeholder="Reason for appointment" value={form.reason} onChange={(e) => setForm((s) => ({ ...s, reason: e.target.value }))} />

        {selectedDoctor && (
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">
            <p className="font-semibold">Assigned Doctor Details</p>
            <p>Dr. {selectedDoctor.first_name} {selectedDoctor.last_name} • {selectedDoctor.specialization || 'General'}</p>
            <p>{selectedDoctor.qualification || 'Qualification not listed'} • {selectedDoctor.years_of_experience ?? '-'} years exp • Fee: Rs. {selectedDoctor.consultation_fee ?? 0}</p>
            <p>Departments: {selectedDoctor.departments || '-'}</p>
          </div>
        )}

        <button
          type="button"
          disabled={saving || !form.doctor_profile_id || !form.department_id || !form.scheduled_date || !form.scheduled_time || !form.reason.trim()}
          onClick={() => void createAppointment()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? 'Booking...' : 'Book Appointment'}
        </button>
      </section>

      <section className="space-y-3">
        {!loading && rows.length === 0 && <div className="rounded-xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-500">No appointments found.</div>}
        {rows.map((apt) => (
          <article key={apt.id} className="rounded-xl border border-slate-100 bg-white p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Dr. {apt.doctor_first_name} {apt.doctor_last_name}</h3>
              <span className={`rounded px-2 py-1 text-xs font-semibold ${statusTone(apt.status)}`}>{apt.status}</span>
            </div>
            <p className="text-sm text-slate-700">{apt.doctor_specialization || 'General'} • {apt.department_name || 'Department not assigned'}</p>
            <p className="mt-1 text-xs text-slate-500">{apt.doctor_qualification || '-'} • {apt.doctor_experience ?? '-'} years • Phone: {apt.doctor_phone || '-'}</p>
            <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-700 md:grid-cols-3">
              <p className="inline-flex items-center gap-2"><Calendar className="h-4 w-4" /> {apt.scheduled_date}</p>
              <p className="inline-flex items-center gap-2"><Clock className="h-4 w-4" /> {apt.scheduled_time}</p>
              <p className="inline-flex items-center gap-2"><Stethoscope className="h-4 w-4" /> {apt.type}</p>
            </div>
            <p className="mt-2 text-sm text-slate-600">Reason: {apt.reason || '-'}</p>
            {!!apt.disease && <p className="text-sm text-slate-600">Condition: {apt.disease}</p>}
            {!!apt.notes && <p className="mt-1 text-xs text-slate-500">Doctor update: {apt.notes}</p>}

            {(apt.status === 'pending' || apt.status === 'confirmed') && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <input
                  className="rounded border border-slate-200 px-2 py-1 text-xs"
                  placeholder="Cancellation reason (optional)"
                  value={cancelReason[apt.id] || ''}
                  onChange={(e) => setCancelReason((s) => ({ ...s, [apt.id]: e.target.value }))}
                />
                <button type="button" onClick={() => void cancelAppointment(apt.id)} className="rounded bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">Cancel</button>
              </div>
            )}
          </article>
        ))}
        {loading && <div className="rounded-xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-500">Loading appointments...</div>}
      </section>
    </div>
  );
}


