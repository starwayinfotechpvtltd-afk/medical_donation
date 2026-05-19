'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Calendar, CheckCircle2, Clock, Users } from 'lucide-react';
import { api, ApiException } from '@/lib/api-client';

type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled';

interface Appointment {
  id: number;
  patient_id: number;
  patient_first_name: string;
  patient_last_name: string;
  scheduled_date: string;
  scheduled_time: string;
  status: AppointmentStatus;
  reason?: string | null;
}

export default function DoctorDashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setError(null);
      try {
        const res = await api.get<Appointment[]>('/appointments');
        setAppointments((res.data ?? []) as Appointment[]);
      } catch (err) {
        setError(err instanceof ApiException ? err.message : 'Failed to load dashboard data.');
      }
    };
    void load();
  }, []);

  const patientsCount = useMemo(() => new Set(appointments.map((a) => a.patient_id)).size, [appointments]);
  const pending = useMemo(() => appointments.filter((a) => a.status === 'pending'), [appointments]);
  const upcoming = useMemo(
    () => appointments.filter((a) => a.status !== 'cancelled').slice(0, 5),
    [appointments]
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Doctor Dashboard</h1>
        <p className="text-sm text-slate-500">Patient workload and appointment approval overview.</p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">Patients</p><p className="text-2xl font-bold">{patientsCount}</p></div>
        <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">Appointments</p><p className="text-2xl font-bold">{appointments.length}</p></div>
        <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">Pending Approval</p><p className="text-2xl font-bold text-amber-600">{pending.length}</p></div>
        <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">Approved</p><p className="text-2xl font-bold text-emerald-600">{appointments.filter((a) => a.status === 'confirmed').length}</p></div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-100 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Pending Approvals</h2>
            <Link href="/doctor/appointments" className="text-xs font-semibold text-blue-600">Open queue</Link>
          </div>
          {pending.length === 0 && <p className="text-sm text-slate-500">No pending requests.</p>}
          <div className="space-y-2">
            {pending.slice(0, 5).map((a) => (
              <div key={a.id} className="rounded-lg border border-slate-100 p-3">
                <p className="text-sm font-medium text-slate-900">{a.patient_first_name} {a.patient_last_name}</p>
                <p className="text-xs text-slate-500">#{a.id} | {a.scheduled_date} {a.scheduled_time}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-100 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Upcoming Appointments</h2>
            <Calendar className="h-4 w-4 text-slate-400" />
          </div>
          {upcoming.length === 0 && <p className="text-sm text-slate-500">No upcoming appointments.</p>}
          <div className="space-y-2">
            {upcoming.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">{a.patient_first_name} {a.patient_last_name}</p>
                  <p className="text-xs text-slate-500">{a.reason || '-'}</p>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <p>{a.scheduled_date}</p>
                  <p>{a.scheduled_time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-slate-100 bg-white p-4">
        <h2 className="mb-3 font-semibold text-slate-900">Patient Area</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Link href="/doctor/patients" className="rounded-lg border border-slate-200 p-3 text-sm font-medium text-slate-700 hover:bg-slate-50"><Users className="mb-2 h-4 w-4 text-blue-600" />Patient list</Link>
          <Link href="/doctor/patient-history" className="rounded-lg border border-slate-200 p-3 text-sm font-medium text-slate-700 hover:bg-slate-50"><Clock className="mb-2 h-4 w-4 text-blue-600" />Patient history</Link>
          <Link href="/doctor/appointments" className="rounded-lg border border-slate-200 p-3 text-sm font-medium text-slate-700 hover:bg-slate-50"><CheckCircle2 className="mb-2 h-4 w-4 text-blue-600" />Approval queue</Link>
        </div>
      </section>
    </div>
  );
}
