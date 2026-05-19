'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Calendar, FileText, History, Pill } from 'lucide-react';
import { api, ApiException } from '@/lib/api-client';

interface PatientDashboardData {
  patient: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  appointments: Array<{
    id: number;
    scheduled_date: string;
    scheduled_time: string;
    status: string;
    notes?: string | null;
    department?: string | null;
    first_name?: string;
    last_name?: string;
    reason?: string | null;
  }>;
  prescriptions: Array<{
    id: number;
    date_issued: string;
    medicine_name: string;
    dosage: string;
  }>;
  lab_tests: Array<{
    id: number;
    test_name: string;
    status: string;
    request_date: string;
  }>;
  medical_records: Array<{
    id: number;
    visit_date: string;
    diagnosis?: string | null;
  }>;
}

export default function PatientDashboard() {
  const [data, setData] = useState<PatientDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<PatientDashboardData>('/patient/dashboard');
        setData((res.data ?? null) as PatientDashboardData | null);
      } catch (err) {
        setError(err instanceof ApiException ? err.message : 'Failed to load dashboard.');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const stats = useMemo(() => {
    if (!data) return { appointments: 0, activeRx: 0, labs: 0, visits: 0 };
    return {
      appointments: data.appointments.length,
      activeRx: new Set(data.prescriptions.map((p) => p.id)).size,
      labs: new Set(data.lab_tests.map((l) => l.id)).size,
      visits: data.medical_records.length,
    };
  }, [data]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {data?.patient ? `Welcome, ${data.patient.first_name}` : 'Patient Dashboard'}
        </h1>
        <p className="text-sm text-slate-500">Your appointments, prescriptions, reports, and history in one place.</p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">Appointments</p><p className="text-2xl font-bold">{stats.appointments}</p></div>
        <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">Prescriptions</p><p className="text-2xl font-bold">{stats.activeRx}</p></div>
        <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">Lab Tests</p><p className="text-2xl font-bold">{stats.labs}</p></div>
        <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">Recent Visits</p><p className="text-2xl font-bold">{stats.visits}</p></div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-100 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold text-slate-900"><Calendar className="h-4 w-4 text-blue-600" /> Upcoming Appointments</h2>
            <Link href="/patient/appointments-view" className="text-xs font-semibold text-blue-600">View all</Link>
          </div>
          <div className="space-y-2">
            {(data?.appointments || []).slice(0, 4).map((apt) => (
              <div key={apt.id} className="rounded-lg border border-slate-100 p-3">
                <p className="text-sm font-medium text-slate-900">
                  {apt.department || 'General'} | {apt.status === 'completed' ? 'discharged' : apt.status}
                </p>
                <p className="text-xs text-slate-500">{apt.scheduled_date} {apt.scheduled_time}</p>
                {apt.notes && <p className="mt-1 text-xs text-slate-500">{apt.notes}</p>}
              </div>
            ))}
            {!loading && (data?.appointments || []).length === 0 && <p className="text-sm text-slate-500">No appointments yet.</p>}
          </div>
        </section>

        <section className="rounded-xl border border-slate-100 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold text-slate-900"><Pill className="h-4 w-4 text-emerald-600" /> Latest Prescriptions</h2>
            <Link href="/patient/prescriptions-view" className="text-xs font-semibold text-blue-600">View all</Link>
          </div>
          <div className="space-y-2">
            {(data?.prescriptions || []).slice(0, 4).map((rx, idx) => (
              <div key={`${rx.id}-${idx}`} className="rounded-lg border border-slate-100 p-3">
                <p className="text-sm font-medium text-slate-900">{rx.medicine_name} ({rx.dosage})</p>
                <p className="text-xs text-slate-500">Issued: {new Date(rx.date_issued).toLocaleDateString()}</p>
              </div>
            ))}
            {!loading && (data?.prescriptions || []).length === 0 && <p className="text-sm text-slate-500">No prescriptions available.</p>}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-100 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold text-slate-900"><FileText className="h-4 w-4 text-indigo-600" /> Lab Tests</h2>
            <Link href="/patient/lab-reports-view" className="text-xs font-semibold text-blue-600">View all</Link>
          </div>
          <div className="space-y-2">
            {(data?.lab_tests || []).slice(0, 4).map((lab) => (
              <div key={lab.id} className="rounded-lg border border-slate-100 p-3">
                <p className="text-sm font-medium text-slate-900">{lab.test_name}</p>
                <p className="text-xs text-slate-500">{lab.status} | {new Date(lab.request_date).toLocaleDateString()}</p>
              </div>
            ))}
            {!loading && (data?.lab_tests || []).length === 0 && <p className="text-sm text-slate-500">No lab tests yet.</p>}
          </div>
        </section>

        <section className="rounded-xl border border-slate-100 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold text-slate-900"><History className="h-4 w-4 text-purple-600" /> Medical History</h2>
            <Link href="/patient/medical-history-view" className="text-xs font-semibold text-blue-600">View all</Link>
          </div>
          <div className="space-y-2">
            {(data?.medical_records || []).slice(0, 4).map((record) => (
              <div key={record.id} className="rounded-lg border border-slate-100 p-3">
                <p className="text-sm font-medium text-slate-900">{record.diagnosis || 'Medical visit'}</p>
                <p className="text-xs text-slate-500">{new Date(record.visit_date).toLocaleDateString()}</p>
              </div>
            ))}
            {!loading && (data?.medical_records || []).length === 0 && <p className="text-sm text-slate-500">No medical history records.</p>}
          </div>
        </section>
      </div>

      {loading && (
        <div className="rounded-xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-500">
          <span className="inline-flex items-center gap-2"><AlertCircle className="h-4 w-4 animate-pulse" /> Loading dashboard...</span>
        </div>
      )}
    </div>
  );
}
