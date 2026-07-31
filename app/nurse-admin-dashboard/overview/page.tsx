'use client';

import { useEffect, useState } from 'react';
import { Activity, Calendar, ClipboardList, RefreshCw, Users } from 'lucide-react';
import { nurseAdminApi, type NurseAdminDashboard } from '@/lib/nurse-admin-api';

export default function NurseAdminOverviewPage() {
  const [data, setData] = useState<NurseAdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setData(await nurseAdminApi.getDashboard());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load overview.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const summary = data?.summary;
  const stats = [
    ['Total nurses', summary?.total_nurses ?? 0, Users],
    ['Active nurses', summary?.active_nurses ?? 0, Activity],
    ['Total assignments', summary?.total_assignments ?? 0, ClipboardList],
    ['Upcoming appointments', summary?.upcoming_appointments ?? 0, Calendar],
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Nursing Overview</h1>
          <p className="mt-1 text-sm text-slate-500">Live counts from nurses, assignments, schedules, and appointments.</p>
        </div>
        <button onClick={load} className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value, Icon]) => (
          <div key={String(label)} className="rounded-lg border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{label}</p>
              <Icon className="h-5 w-5 text-rose-600" />
            </div>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{loading ? '-' : String(value)}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">Nurse Workload</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b text-xs uppercase text-slate-500">
              <tr>
                <th className="py-3 pr-4">Nurse</th>
                <th className="py-3 pr-4">Email</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Assigned Patients</th>
                <th className="py-3 pr-4">Upcoming Shifts</th>
              </tr>
            </thead>
            <tbody>
              {(data?.nurses ?? []).map((nurse) => (
                <tr key={nurse.id} className="border-b last:border-0">
                  <td className="py-3 pr-4 font-medium text-slate-900">{nurse.first_name} {nurse.last_name}</td>
                  <td className="py-3 pr-4 text-slate-500">{nurse.email}</td>
                  <td className="py-3 pr-4">{nurse.status}</td>
                  <td className="py-3 pr-4">{nurse.assigned_patients ?? 0}</td>
                  <td className="py-3 pr-4">{nurse.scheduled_shifts ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && !data?.nurses.length ? <p className="py-6 text-sm text-slate-500">No nurses found.</p> : null}
        </div>
      </div>
    </div>
  );
}
