'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, ClipboardList, RefreshCw, Users, Activity } from 'lucide-react';
import { nurseAdminApi, type NurseAdminDashboard } from '@/lib/nurse-admin-api';

const fmtDate = (value?: string | null) => (value ? String(value).slice(0, 10) : '-');
const fmtTime = (value?: string | null) => (value ? String(value).slice(0, 5) : '-');

export default function NurseAdminDashboardPage() {
  const [data, setData] = useState<NurseAdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setData(await nurseAdminApi.getDashboard());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load nurse admin dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const summary = data?.summary;
  const cards = [
    { label: 'Total Nurses', value: summary?.total_nurses ?? 0, icon: Users, href: '/nurse-admin-dashboard/nurses' },
    { label: 'Active Nurses', value: summary?.active_nurses ?? 0, icon: Activity, href: '/nurse-admin-dashboard/nurses' },
    { label: 'Active Assignments', value: summary?.active_assignments ?? 0, icon: ClipboardList, href: '/nurse-admin-dashboard/assignments' },
    { label: 'Today Schedules', value: summary?.today_schedules ?? 0, icon: Calendar, href: '/nurse-admin-dashboard/schedules' },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-rose-600">Nursing Management</p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">Nurse Admin Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Manage nurse staff, patient assignments, and shift schedules.</p>
        </div>
        <button onClick={load} className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href} className="rounded-lg border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{card.label}</p>
                <Icon className="h-5 w-5 text-rose-600" />
              </div>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{loading ? '-' : card.value}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-lg border bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent Assignments</h2>
            <Link href="/nurse-admin-dashboard/assignments" className="text-sm font-medium text-rose-600">View all</Link>
          </div>
          <div className="space-y-3">
            {(data?.assignments ?? []).slice(0, 6).map((item) => (
              <div key={item.id} className="rounded-lg border p-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-900">{item.patient_first_name} {item.patient_last_name}</p>
                  <span className="rounded-full bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700">{item.status}</span>
                </div>
                <p className="mt-1 text-slate-500">Nurse: {item.nurse_first_name} {item.nurse_last_name}</p>
                <p className="text-slate-500">Appointment: {fmtDate(item.scheduled_date)} {fmtTime(item.scheduled_time)}</p>
              </div>
            ))}
            {!loading && !data?.assignments.length ? <p className="text-sm text-slate-500">No assignments yet.</p> : null}
          </div>
        </section>

        <section className="rounded-lg border bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Upcoming Appointments</h2>
            <Link href="/nurse-admin-dashboard/assignments" className="text-sm font-medium text-rose-600">Assign nurses</Link>
          </div>
          <div className="space-y-3">
            {(data?.appointments ?? []).slice(0, 6).map((item) => (
              <div key={item.id} className="rounded-lg border p-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-900">{item.patient_first_name} {item.patient_last_name}</p>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">{item.status}</span>
                </div>
                <p className="mt-1 text-slate-500">{fmtDate(item.scheduled_date)} at {fmtTime(item.scheduled_time)}</p>
                <p className="text-slate-500">Assigned nurse: {item.nurse_first_name ? `${item.nurse_first_name} ${item.nurse_last_name}` : 'Not assigned'}</p>
              </div>
            ))}
            {!loading && !data?.appointments.length ? <p className="text-sm text-slate-500">No appointments found.</p> : null}
          </div>
        </section>
      </div>
    </div>
  );
}
