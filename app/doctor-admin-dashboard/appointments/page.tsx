'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Eye, Filter, RefreshCw, Search, X } from 'lucide-react';
import { doctorAdminApi, type DoctorAdminAppointment, type DoctorAdminDoctor } from '@/lib/doctor-admin-api';

const today = new Date().toISOString().slice(0, 10);
const nextMonth = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);

const statusClass = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  in_progress: 'bg-purple-50 text-purple-700 border-purple-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  no_show: 'bg-slate-50 text-slate-700 border-slate-200',
};

export default function DoctorAdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<DoctorAdminAppointment[]>([]);
  const [doctors, setDoctors] = useState<DoctorAdminDoctor[]>([]);
  const [search, setSearch] = useState('');
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(nextMonth);
  const [doctorProfileId, setDoctorProfileId] = useState('');
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState<DoctorAdminAppointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [appointmentRows, doctorRows] = await Promise.all([
        doctorAdminApi.getAppointments({
          from,
          to,
          status,
          doctorProfileId: doctorProfileId ? Number(doctorProfileId) : undefined,
        }),
        doctorAdminApi.getDoctors(),
      ]);
      setAppointments(appointmentRows);
      setDoctors(doctorRows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return appointments;
    return appointments.filter((appointment) => {
      const patient = `${appointment.patient_first_name} ${appointment.patient_last_name}`.toLowerCase();
      const doctor = `${appointment.doctor_first_name || ''} ${appointment.doctor_last_name || ''}`.toLowerCase();
      return patient.includes(q) || doctor.includes(q) || (appointment.reason || '').toLowerCase().includes(q) || (appointment.patient_registration_no || '').toLowerCase().includes(q);
    });
  }, [appointments, search]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">Upcoming Appointments</h1>
          <p className="mt-1 text-sm text-slate-600">Read-only appointment view. Doctor admins can see status, but cannot accept, reject, or change it.</p>
        </div>
        <button onClick={load} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-3 border-b border-slate-200 p-4 xl:grid-cols-[1fr_repeat(5,auto)]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patient, doctor, registration no, reason" className="w-full rounded-lg border border-slate-200 px-9 py-2 text-sm text-slate-900 outline-none focus:border-blue-500" />
          </div>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500" />
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500" />
          <select value={doctorProfileId} onChange={(e) => setDoctorProfileId(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500">
            <option value="">All doctors</option>
            {doctors.map((doctor) => <option key={doctor.doctor_profile_id} value={doctor.doctor_profile_id}>Dr. {doctor.first_name} {doctor.last_name}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500">
            <option value="">All status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No show</option>
          </select>
          <button onClick={load} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Filter className="h-4 w-4" /> Apply
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Patient</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Doctor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Reason</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-4 py-4">
                    <p className="font-medium text-slate-950">{appointment.patient_first_name} {appointment.patient_last_name}</p>
                    <p className="text-sm text-slate-500">{appointment.patient_registration_no || `Patient #${appointment.patient_id}`}</p>
                    <p className="text-xs text-slate-500">{appointment.patient_email}</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    <p>Dr. {appointment.doctor_first_name || '-'} {appointment.doctor_last_name || ''}</p>
                    <p className="text-xs text-slate-500">{appointment.doctor_specialization || 'No specialization'}</p>
                    <p className="text-xs text-slate-500">{appointment.department_name || 'No department'}</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    <p className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4 text-slate-400" /> {appointment.scheduled_date}</p>
                    <p className="text-xs text-slate-500">{String(appointment.scheduled_time).slice(0, 5)} · {appointment.duration_minutes} min</p>
                  </td>
                  <td className="max-w-sm px-4 py-4 text-sm text-slate-700">
                    <p className="line-clamp-2">{appointment.reason || appointment.disease || '-'}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusClass[appointment.status]}`}>{appointment.status.replace('_', ' ')}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button onClick={() => setSelected(appointment)} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"><Eye className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filtered.length === 0 ? <p className="p-6 text-sm text-slate-500">No appointments found for this filter.</p> : null}
          {loading ? <p className="p-6 text-sm text-slate-500">Loading appointments...</p> : null}
        </div>
      </section>

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40">
          <aside className="h-full w-full max-w-xl overflow-y-auto bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="font-semibold text-slate-950">Appointment Details</h2>
                <p className="text-sm text-slate-500">Read-only status: {selected.status.replace('_', ' ')}</p>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-5 p-5">
              <DetailGroup title="Patient" rows={[
                ['Name', `${selected.patient_first_name} ${selected.patient_last_name}`],
                ['Registration', selected.patient_registration_no || '-'],
                ['Email', selected.patient_email],
                ['Phone', selected.patient_phone || '-'],
                ['Gender', selected.patient_gender || '-'],
                ['Blood type', selected.patient_blood_type || '-'],
              ]} />
              <DetailGroup title="Doctor" rows={[
                ['Name', `Dr. ${selected.doctor_first_name || '-'} ${selected.doctor_last_name || ''}`],
                ['Specialization', selected.doctor_specialization || '-'],
                ['Department', selected.department_name || '-'],
              ]} />
              <DetailGroup title="Appointment" rows={[
                ['Date', selected.scheduled_date],
                ['Time', String(selected.scheduled_time).slice(0, 5)],
                ['Duration', `${selected.duration_minutes} minutes`],
                ['Type', selected.type.replace('_', ' ')],
                ['Status', selected.status.replace('_', ' ')],
                ['Reason', selected.reason || '-'],
                ['Disease', selected.disease || '-'],
                ['Notes', selected.notes || '-'],
              ]} />
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}

function DetailGroup({ title, rows }: { title: string; rows: Array<[string, string]> }) {
  return (
    <section>
      <h3 className="mb-2 text-sm font-semibold text-slate-950">{title}</h3>
      <div className="grid gap-2">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
            <p className="mt-1 text-sm text-slate-900">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

