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
  test_name: string;
  category: string;
  priority: string;
  status: string;
  request_date: string;
  result_file_url?: string | null;
}

const matchDept = (row: LabTestRow, dept: string) => {
  if (dept === 'all') return true;
  const name = row.test_name.toLowerCase();
  const category = (row.category || '').toLowerCase();
  if (dept === 'laboratory') return ['hematology', 'biochemistry', 'microbiology', 'immunology', 'pathology', 'other'].includes(category);
  if (dept === 'radiology') return category === 'radiology' || name.includes('x-ray') || name.includes('mri') || name.includes('ct');
  if (dept === 'cardiology') return category === 'cardiology' || name.includes('ecg') || name.includes('echo') || name.includes('cardio');
  if (dept === 'dialysis') return name.includes('dialysis');
  return category === dept || name.includes(dept);
};

export default function LabTechTestsPage({ activeDept = 'all' }: { activeDept?: string }) {
  const [rows, setRows] = useState<LabTestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const res = await api.get<LabTestRow[]>('/lab/lab-tests');
      setRows((res.data ?? []) as LabTestRow[]);
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to load tests.');
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => rows.filter((r) => matchDept(r, activeDept) && (r.status === 'pending' || r.status === 'in_progress')), [rows, activeDept]);

  return <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
    <div><h1 className="text-2xl font-bold text-slate-900">Pending Tests</h1><p className="text-sm text-slate-500">Live tests assigned to your technician account.</p></div>
    {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
    <section className="space-y-3">
      {filtered.map((r) => <article key={r.id} className="rounded-xl border border-slate-100 bg-white p-4"><div className="flex items-center justify-between gap-3"><div><p className="font-semibold text-slate-900">{r.test_name}</p><p className="text-xs text-slate-500">{r.patient_first_name} {r.patient_last_name} | Reg: {r.patient_reg_no} | Mob: {r.patient_phone || '-'}</p><p className="text-xs text-slate-500">Doctor: Dr. {(r.doctor_first_name || '')} {(r.doctor_last_name || '')} | {new Date(r.request_date).toLocaleDateString()}</p></div><span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold">{r.status}</span></div></article>)}
      {!loading && filtered.length === 0 && <div className="rounded-xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-500">No pending tests found.</div>}
      {loading && <div className="rounded-xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-500">Loading...</div>}
    </section>
  </div>;
}
