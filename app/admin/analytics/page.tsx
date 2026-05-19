'use client';

import { useEffect, useMemo, useState } from 'react';
import { Activity, Building2, Stethoscope, Users } from 'lucide-react';
import { adminApi, type ActivityLog, type AdminPatient, type Department, type DoctorProfile } from '@/lib/admin-api';

export default function AdminAnalyticsPage() {
  const [patients, setPatients] = useState<AdminPatient[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [p, d, dr, logs] = await Promise.all([
          adminApi.getPatients(),
          adminApi.getDepartments(),
          adminApi.getDoctors(),
          adminApi.getActivityLogs({ limit: 200, offset: 0 }),
        ]);
        if (!mounted) return;
        setPatients(p); setDepartments(d); setDoctors(dr); setActivity(logs);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load analytics.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const activityByAction = useMemo(() => {
    const map = new Map<string, number>();
    activity.forEach((a) => map.set(a.action, (map.get(a.action) || 0) + 1));
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [activity]);

  if (loading) return <div className="p-6 text-sm text-slate-500">Loading analytics...</div>;
  if (error) return <div className="m-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div>
        <p className="text-sm font-medium text-blue-600">Analytics</p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-900">Operational Analytics</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Mini label="Patients" value={patients.length} icon={Users} />
        <Mini label="Doctors" value={doctors.length} icon={Stethoscope} />
        <Mini label="Departments" value={departments.length} icon={Building2} />
        <Mini label="Activity Events" value={activity.length} icon={Activity} />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Top Activity Actions</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {activityByAction.map(([action, count]) => (
            <div key={action} className="rounded-xl border border-slate-100 px-4 py-3">
              <p className="font-medium text-slate-900">{action}</p>
              <p className="text-sm text-slate-500">{count} events</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Mini({ label, value, icon: Icon }: { label: string; value: number; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <Icon className="h-4 w-4 text-blue-600" />
      </div>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
