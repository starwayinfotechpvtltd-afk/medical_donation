'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Clock, FlaskRound, Microscope, TestTube, Users } from 'lucide-react';
import { labAdminApi, type LabAdminDashboardData } from '@/lib/lab-admin-api';

const n = (value: unknown) => Number(value || 0);

export default function LabAdminDashboard() {
  const [data, setData] = useState<LabAdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setData(await labAdminApi.getDashboard());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load lab dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const stats = data?.summary;
  const modules = useMemo(
    () => [
      {
        title: 'Lab Tests',
        description: 'Review lab tests, assignments, and result status',
        icon: TestTube,
        href: '/lab-admin-dashboard/overview',
        color: 'bg-blue-500',
        stats: `${n(stats?.pending_tests)} pending`,
      },
      {
        title: 'Technicians',
        description: 'View technician profiles and workload',
        icon: Users,
        href: '/lab-admin-dashboard/technicians',
        color: 'bg-green-500',
        stats: `${n(stats?.active_technicians)} active`,
      },
      {
        title: 'Equipment',
        description: 'Track equipment status and maintenance',
        icon: Microscope,
        href: '/lab-admin-dashboard/equipment',
        color: 'bg-purple-500',
        stats: `${n(stats?.operational_equipment)}/${n(stats?.total_equipment)} operational`,
      },
    ],
    [stats]
  );

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
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <FlaskRound className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lab Admin Dashboard</h1>
            <p className="mt-1 text-gray-600">Live laboratory operations</p>
          </div>
        </div>
      </div>

      <div className="space-y-8 p-6">
        {loading ? <div className="rounded-xl border bg-white p-6 text-sm text-gray-500">Loading lab dashboard...</div> : null}
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            <p>{error}</p>
            <button onClick={load} className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white">Retry</button>
          </div>
        ) : null}

        {!loading && !error ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Total Tests" value={n(stats?.total_tests)} icon={TestTube} color="bg-blue-100 text-blue-600" />
              <StatCard title="Pending Tests" value={n(stats?.pending_tests)} icon={Clock} color="bg-yellow-100 text-yellow-600" />
              <StatCard title="Completed Today" value={n(stats?.completed_today)} icon={CheckCircle} color="bg-green-100 text-green-600" />
              <StatCard title="Active Technicians" value={n(stats?.active_technicians)} icon={Users} color="bg-purple-100 text-purple-600" />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {modules.map((module) => {
                const Icon = module.icon;
                return (
                  <Link key={module.title} href={module.href} className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg">
                    <div className="p-6">
                      <div className={`${module.color} mb-4 flex h-12 w-12 items-center justify-center rounded-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-gray-900">{module.title}</h3>
                      <p className="mb-4 text-sm text-gray-600">{module.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">{module.stats}</span>
                        <ArrowRight className="h-4 w-4 text-gray-400 transition group-hover:translate-x-1 group-hover:text-blue-600" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
