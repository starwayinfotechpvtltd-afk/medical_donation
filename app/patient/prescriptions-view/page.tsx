'use client';

import { useEffect, useMemo, useState } from 'react';
import { Download, Pill } from 'lucide-react';
import { api, ApiException } from '@/lib/api-client';

interface DashboardPatient {
  id: number;
}

interface PatientPrescription {
  id: number;
  date_issued: string;
  valid_until?: string | null;
  follow_up_date?: string | null;
  notes?: string | null;
  is_active: number;
  doctor_first_name?: string | null;
  doctor_last_name?: string | null;
  doctor_specialization?: string | null;
  medicines: Array<{
    id: number;
    medicine_name: string;
    dosage?: string | null;
    frequency?: string | null;
    duration?: string | null;
    route?: string | null;
    instructions?: string | null;
  }>;
}

export default function PrescriptionsViewPage() {
  const [rows, setRows] = useState<PatientPrescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const dash = await api.get<{ patient: DashboardPatient | null }>('/patient/dashboard');
      const patientId = (dash.data as { patient: DashboardPatient | null } | undefined)?.patient?.id;
      if (!patientId) {
        setRows([]);
        return;
      }
      const res = await api.get<PatientPrescription[]>(`/medical/patients/${patientId}/prescriptions`);
      setRows((res.data ?? []) as PatientPrescription[]);
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to load prescriptions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const stats = useMemo(() => {
    const active = rows.filter((r) => Number(r.is_active) === 1).length;
    const totalMeds = rows.reduce((acc, r) => acc + (r.medicines || []).length, 0);
    return { active, total: rows.length, totalMeds };
  }, [rows]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Prescriptions</h1>
        <p className="text-sm text-slate-500">All your active and past prescriptions with medicines and doctor details.</p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">Total Prescriptions</p><p className="text-2xl font-bold">{stats.total}</p></div>
        <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">Active</p><p className="text-2xl font-bold">{stats.active}</p></div>
        <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">Medicines Listed</p><p className="text-2xl font-bold">{stats.totalMeds}</p></div>
      </div>

      <section className="space-y-3">
        {!loading && rows.length === 0 && <div className="rounded-xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-500">No prescriptions found.</div>}
        {rows.map((rx) => (
          <article key={rx.id} className="rounded-xl border border-slate-100 bg-white p-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Prescription #{rx.id}</h2>
              <span className={`rounded px-2 py-1 text-xs font-semibold ${Number(rx.is_active) === 1 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                {Number(rx.is_active) === 1 ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-sm text-slate-700">Dr. {rx.doctor_first_name || '-'} {rx.doctor_last_name || ''} • {rx.doctor_specialization || 'General'}</p>
            <p className="mt-1 text-xs text-slate-500">Issued: {new Date(rx.date_issued).toLocaleDateString()} • Valid until: {rx.valid_until ? new Date(rx.valid_until).toLocaleDateString() : '-'}</p>
            <p className="mt-1 text-xs text-slate-500">Follow-up: {rx.follow_up_date ? new Date(rx.follow_up_date).toLocaleDateString() : '-'}</p>

            <div className="mt-3 rounded-lg border border-slate-100 p-3">
              <p className="mb-2 inline-flex items-center gap-2 text-xs font-medium text-slate-500"><Pill className="h-4 w-4" /> Medicines</p>
              <div className="space-y-1">
                {(rx.medicines || []).map((m) => (
                  <p key={m.id} className="text-sm text-slate-700">
                    {m.medicine_name} {m.dosage ? `| ${m.dosage}` : ''} {m.frequency ? `| ${m.frequency}` : ''} {m.duration ? `| ${m.duration}` : ''}
                  </p>
                ))}
                {(rx.medicines || []).length === 0 && <p className="text-sm text-slate-500">No medicines listed.</p>}
              </div>
            </div>

            {rx.notes && <p className="mt-2 text-sm text-slate-600">Notes: {rx.notes}</p>}
            <div className="mt-3">
              <button type="button" className="rounded bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700" onClick={() => window.print()}>
                <span className="inline-flex items-center gap-1"><Download className="h-3.5 w-3.5" /> Print / Download</span>
              </button>
            </div>
          </article>
        ))}
        {loading && <div className="rounded-xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-500">Loading prescriptions...</div>}
      </section>
    </div>
  );
}

