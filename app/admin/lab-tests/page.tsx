'use client';

import { useEffect, useMemo, useState } from 'react';
import { api, ApiException } from '@/lib/api-client';

interface LabTestRow {
  id: number;
  patient_reg_no: string;
  patient_first_name: string;
  patient_last_name: string;
  patient_phone?: string | null;
  doctor_first_name?: string | null;
  doctor_last_name?: string | null;
  technician_first_name?: string | null;
  technician_last_name?: string | null;
  test_name: string;
  status: string;
  priority: string;
  request_date: string;
  result_file_url?: string | null;
  is_critical?: number;
}

export default function AdminLabTestsPage() {
  const [rows, setRows] = useState<LabTestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const res = await api.get<LabTestRow[]>('/lab/lab-tests', { status: status || undefined });
      setRows((res.data ?? []) as LabTestRow[]);
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to load lab tests.');
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, [status]);

  const toggleCritical = async (row: LabTestRow) => {
    setError('');
    try {
      await api.patch(`/lab/lab-tests/${row.id}/critical`, { is_critical: Number(row.is_critical) === 1 ? 0 : 1 });
      await load();
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to update toggle.');
    }
  };

  const stats = useMemo(() => ({ total: rows.length, pending: rows.filter(r => r.status === 'pending').length, inProgress: rows.filter(r => r.status === 'in_progress').length, completed: rows.filter(r => r.status === 'completed').length }), [rows]);

  return <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
    <div><h1 className="text-2xl font-bold text-slate-900">Lab Tests</h1><p className="text-sm text-slate-500">Admin monitoring with toggle control.</p></div>
    {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">Total</p><p className="text-2xl font-bold">{stats.total}</p></div>
      <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">Pending</p><p className="text-2xl font-bold">{stats.pending}</p></div>
      <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">In Progress</p><p className="text-2xl font-bold">{stats.inProgress}</p></div>
      <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">Completed</p><p className="text-2xl font-bold">{stats.completed}</p></div>
    </div>
    <div className="flex gap-3"><select className="rounded border border-slate-200 px-3 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All Statuses</option><option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="completed">Completed</option><option value="rejected">Rejected</option></select></div>
    <section className="space-y-3">
      {rows.map((r) => <article key={r.id} className="rounded-xl border border-slate-100 bg-white p-4"><div className="flex items-center justify-between"><div><p className="font-semibold text-slate-900">{r.test_name}</p><p className="text-xs text-slate-500">{r.patient_first_name} {r.patient_last_name} | Reg: {r.patient_reg_no} | Mob: {r.patient_phone || '-'}</p><p className="text-xs text-slate-500">Doctor: Dr. {(r.doctor_first_name || '')} {(r.doctor_last_name || '')} | Technician: {(r.technician_first_name || '')} {(r.technician_last_name || '')}</p></div><span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold">{r.status}</span></div><div className="mt-2 flex items-center gap-4"><button onClick={() => void toggleCritical(r)} className={`rounded px-3 py-1 text-xs font-semibold ${Number(r.is_critical) === 1 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>{Number(r.is_critical) === 1 ? 'Critical ON' : 'Critical OFF'}</button>{r.result_file_url && <a className="text-xs font-semibold text-blue-600" href={r.result_file_url} target="_blank" rel="noreferrer">Download Report</a>}</div></article>)}
      {!loading && rows.length === 0 && <div className="rounded-xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-500">No lab tests found.</div>}
      {loading && <div className="rounded-xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-500">Loading...</div>}
    </section>
  </div>;
}
