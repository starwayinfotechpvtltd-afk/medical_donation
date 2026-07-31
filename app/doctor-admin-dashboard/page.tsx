'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Activity, CalendarDays, RefreshCw, Stethoscope, UserCheck, Users } from 'lucide-react';
import { doctorAdminApi, type DoctorAdminAppointment, type DoctorAdminDoctor, type DoctorAdminSummary } from '@/lib/doctor-admin-api';

const statusClass = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  in_progress: 'bg-purple-50 text-purple-700 border-purple-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  no_show: 'bg-slate-50 text-slate-700 border-slate-200',
};

export default function DoctorAdminDashboard() {
  const [summary, setSummary] = useState<DoctorAdminSummary | null>(null);
  const [doctors, setDoctors] = useState<DoctorAdminDoctor[]>([]);
  const [appointments, setAppointments] = useState<DoctorAdminAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [summaryData, doctorRows, appointmentRows] = await Promise.all([
        doctorAdminApi.getSummary(),
        doctorAdminApi.getDoctors(),
        doctorAdminApi.getAppointments({ to: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10) }),
      ]);
      setSummary(summaryData);
      setDoctors(doctorRows.slice(0, 6));
      setAppointments(appointmentRows.slice(0, 8));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const statCards = [
    { label: 'Total Doctors', value: summary?.total_doctors ?? 0, icon: Users, tone: 'bg-blue-50 text-blue-700' },
    { label: 'Active Doctors', value: summary?.active_doctors ?? 0, icon: UserCheck, tone: 'bg-emerald-50 text-emerald-700' },
    { label: 'Upcoming Appointments', value: summary?.upcoming_appointments ?? 0, icon: CalendarDays, tone: 'bg-violet-50 text-violet-700' },
    { label: 'Assigned Patients', value: summary?.assigned_patients ?? 0, icon: Activity, tone: 'bg-cyan-50 text-cyan-700' },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">Doctor Admin Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">Manage doctor profiles and monitor appointments without changing appointment status.</p>
        </div>
        <button onClick={load} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-600">{card.label}</p>
                <span className={`rounded-lg p-2 ${card.tone}`}><Icon className="h-5 w-5" /></span>
              </div>
              <p className="mt-3 text-3xl font-semibold text-slate-950">{loading ? '-' : card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-slate-950">Doctor Details</h2>
            <Link href="/doctor-admin-dashboard/doctors" className="text-sm font-medium text-blue-600 hover:text-blue-700">Manage</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {doctors.map((doctor) => (
              <div key={doctor.doctor_profile_id} className="flex items-center justify-between gap-3 px-5 py-4">
                <div>
                  <p className="font-medium text-slate-900">Dr. {doctor.first_name} {doctor.last_name}</p>
                  <p className="text-sm text-slate-500">{doctor.specialization || 'General Medicine'} · {doctor.departments || 'No department'}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${doctor.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                  {doctor.status}
                </span>
              </div>
            ))}
            {!loading && doctors.length === 0 ? <p className="px-5 py-6 text-sm text-slate-500">No doctors found.</p> : null}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-slate-950">Upcoming Appointments</h2>
            <Link href="/doctor-admin-dashboard/appointments" className="text-sm font-medium text-blue-600 hover:text-blue-700">View all</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="grid gap-3 px-5 py-4 md:grid-cols-[1fr_auto]">
                <div>
                  <p className="font-medium text-slate-900">{appointment.patient_first_name} {appointment.patient_last_name}</p>
                  <p className="text-sm text-slate-500">Dr. {appointment.doctor_first_name || '-'} {appointment.doctor_last_name || ''} · {appointment.doctor_specialization || 'No specialty'}</p>
                  <p className="mt-1 text-xs text-slate-500">{appointment.scheduled_date} at {String(appointment.scheduled_time).slice(0, 5)}</p>
                </div>
                <span className={`h-fit rounded-full border px-2.5 py-1 text-xs font-medium ${statusClass[appointment.status]}`}>
                  {appointment.status.replace('_', ' ')}
                </span>
              </div>
            ))}
            {!loading && appointments.length === 0 ? <p className="px-5 py-6 text-sm text-slate-500">No upcoming appointments found.</p> : null}
          </div>
        </section>
      </div>
    </div>
  );
}
