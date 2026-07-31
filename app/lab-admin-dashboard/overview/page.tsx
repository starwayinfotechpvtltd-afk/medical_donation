'use client';

import { useEffect, useState } from 'react';
import { Activity, AlertCircle, CheckCircle, ClipboardList, Clock, Microscope, TestTube, Users } from 'lucide-react';
import { labAdminApi, type LabAdminDashboardData } from '@/lib/lab-admin-api';

const n = (value: unknown) => Number(value || 0);
const text = (value: unknown) => (value === null || value === undefined ? '' : String(value));
const statusClass = (status: string) => ({
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}[status] || 'bg-gray-100 text-gray-800');

export default function LabOverviewPage() {
  const [data, setData] = useState<LabAdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setData(await labAdminApi.getDashboard());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load lab overview.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const stats = data?.summary;
  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${color} rounded-full p-3`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Laboratory Overview</h1>
        <p className="mt-1 text-gray-600">Live lab tests, technician, and equipment metrics</p>
      </div>

      {loading ? <div className="rounded-xl border bg-white p-6 text-sm text-gray-500">Loading overview...</div> : null}
      {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</div> : null}

      {!loading && !error ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Tests" value={n(stats?.total_tests)} icon={TestTube} color="bg-blue-100 text-blue-600" />
            <StatCard title="Pending" value={n(stats?.pending_tests)} icon={Clock} color="bg-yellow-100 text-yellow-600" />
            <StatCard title="In Progress" value={n(stats?.in_progress_tests)} icon={Activity} color="bg-indigo-100 text-indigo-600" />
            <StatCard title="Completed" value={n(stats?.completed_tests)} icon={CheckCircle} color="bg-green-100 text-green-600" />
            <StatCard title="Urgent" value={n(stats?.urgent_tests)} icon={AlertCircle} color="bg-red-100 text-red-600" />
            <StatCard title="Patients" value={n(stats?.total_patients)} icon={ClipboardList} color="bg-cyan-100 text-cyan-600" />
            <StatCard title="Technicians" value={n(stats?.active_technicians)} icon={Users} color="bg-purple-100 text-purple-600" />
            <StatCard title="Equipment" value={`${n(stats?.operational_equipment)}/${n(stats?.total_equipment)}`} icon={Microscope} color="bg-emerald-100 text-emerald-600" />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Tests</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {(data?.recent_tests || []).map((test) => (
                <div key={text(test.id)} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-gray-900">{text(test.test_name)}</p>
                      <p className="text-sm text-gray-500">{`${text(test.patient_first_name)} ${text(test.patient_last_name)}`.trim()}</p>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusClass(text(test.status))}`}>
                      {text(test.status).replace('_', ' ')}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Technician: {`${text(test.technician_first_name)} ${text(test.technician_last_name)}`.trim() || 'Unassigned'} | Priority: {text(test.priority) || 'routine'}
                  </div>
                </div>
              ))}
              {(data?.recent_tests || []).length === 0 ? <div className="p-6 text-sm text-gray-500">No lab tests found.</div> : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
