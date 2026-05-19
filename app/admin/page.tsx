'use client';

import { useEffect, useMemo, useState } from 'react';
import { Activity, Building2, Stethoscope, UserCheck, Users } from 'lucide-react';
import { adminApi, type AdminPatient, type Department, type DoctorProfile, type ActivityLog } from '@/lib/admin-api';
import { donationApi, type DonationStats, type RecentDonation } from '@/lib/donation-api';

export default function AdminDashboardPage() {
  const [patients, setPatients] = useState<AdminPatient[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [donationStats, setDonationStats] = useState<DonationStats | null>(null);
  const [recentDonations, setRecentDonations] = useState<RecentDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [patientRows, deptRows, doctorRows, logs, donationStatsRes, donationRecentRes] = await Promise.all([
          adminApi.getPatients(),
          adminApi.getDepartments(),
          adminApi.getDoctors(),
          adminApi.getActivityLogs({ limit: 30, offset: 0 }),
          donationApi.getStats(),
          donationApi.getRecent(20),
        ]);

        if (!mounted) return;
        setPatients(patientRows);
        setDepartments(deptRows);
        setDoctors(doctorRows);
        setActivity(logs);
        setDonationStats((donationStatsRes.data ?? null) as DonationStats | null);
        setRecentDonations((donationRecentRes.data ?? []) as RecentDonation[]);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load dashboard.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  const stats = useMemo(() => {
    const pending = patients.filter((p) => p.registration_status === 'pending').length;
    const approved = patients.filter((p) => p.registration_status === 'approved').length;
    return { pending, approved };
  }, [patients]);

  if (loading) return <div className="p-6 text-sm text-slate-500">Loading dashboard...</div>;
  if (error) return <div className="m-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div>
        <p className="text-sm font-medium text-blue-600">Admin Dashboard</p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-900">Hospital Final Overview</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Card label="Patients" value={patients.length} icon={Users} />
        <Card label="Approved Patients" value={stats.approved} icon={UserCheck} />
        <Card label="Pending Approval" value={stats.pending} icon={Activity} />
        <Card label="Departments" value={departments.length} icon={Building2} />
        <Card label="Doctors" value={doctors.length} icon={Stethoscope} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card label="Total Donations" value={Number(donationStats?.total_transactions || 0)} icon={Activity} />
        <Card label="Unique Donors" value={Number(donationStats?.unique_donors || 0)} icon={Users} />
        <Card label="Raised (INR)" value={Math.round(Number(donationStats?.total_raised || 0))} icon={Building2} />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
        <div className="mt-4 space-y-3">
          {activity.slice(0, 8).map((log) => (
            <div key={log.id} className="rounded-xl border border-slate-100 px-4 py-3 text-sm">
              <p className="font-medium text-slate-900">{log.action}</p>
              <p className="text-slate-500">
  {log.actor_type} #{log.actor_id ?? '-'} - {new Date(log.created_at).toLocaleString()}
</p>
              
               </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Recent Donors</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="py-2">Donor</th>
                <th className="py-2">Email</th>
                <th className="py-2">Campaign</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentDonations.slice(0, 10).map((row) => (
                <tr key={row.id} className="border-t border-slate-100">
                  <td className="py-2">{row.is_anonymous ? 'Anonymous' : (row.donor_name || 'Unnamed')}</td>
                  <td className="py-2">{row.is_anonymous ? '-' : (row.donor_email || '-')}</td>
                  <td className="py-2">{row.campaign_title}</td>
                  <td className="py-2">₹{Number(row.amount).toLocaleString()}</td>
                  <td className="py-2">{new Date(row.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {recentDonations.length === 0 && (
                <tr><td colSpan={5} className="py-6 text-center text-slate-500">No donations yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Card({ label, value, icon: Icon }: { label: string; value: number; icon: React.ComponentType<{ className?: string }> }) {
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
