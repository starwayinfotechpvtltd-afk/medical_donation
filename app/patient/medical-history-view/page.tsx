'use client';

import { useEffect, useMemo, useState } from 'react';
import { History, Stethoscope } from 'lucide-react';
import { api, ApiException } from '@/lib/api-client';

interface MedicalRecordItem {
  id: number;
  visit_date: string;
  diagnosis?: string | null;
  symptoms?: string | null;
  treatment_plan?: string | null;
  notes?: string | null;
  doctor_first_name?: string | null;
  doctor_last_name?: string | null;
  doctor_specialization?: string | null;
  department_name?: string | null;
}

export default function MedicalHistoryViewPage() {
  const [rows, setRows] = useState<MedicalRecordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get<MedicalRecordItem[]>('/patient/medical-history');
      setRows((res.data ?? []) as MedicalRecordItem[]);
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to load medical history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const totalWithDiagnosis = useMemo(() => rows.filter((r) => !!r.diagnosis).length, [rows]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Medical History</h1>
        <p className="text-sm text-slate-500">Complete visit timeline with doctor and treatment details.</p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">Total Records</p><p className="text-2xl font-bold">{rows.length}</p></div>
        <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">Diagnoses</p><p className="text-2xl font-bold">{totalWithDiagnosis}</p></div>
        <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">Departments</p><p className="text-2xl font-bold">{new Set(rows.map((r) => r.department_name).filter(Boolean)).size}</p></div>
      </div>

      <section className="space-y-3">
        {!loading && rows.length === 0 && <div className="rounded-xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-500">No medical history found.</div>}
        {rows.map((record) => (
          <article key={record.id} className="rounded-xl border border-slate-100 bg-white p-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="inline-flex items-center gap-2 font-semibold text-slate-900"><History className="h-4 w-4" /> Visit #{record.id}</h2>
              <p className="text-xs text-slate-500">{new Date(record.visit_date).toLocaleDateString()}</p>
            </div>
            <p className="text-sm text-slate-700">{record.diagnosis || 'General checkup'}</p>
            <p className="mt-1 text-xs text-slate-500 inline-flex items-center gap-1"><Stethoscope className="h-3.5 w-3.5" /> Dr. {record.doctor_first_name || '-'} {record.doctor_last_name || ''} • {record.doctor_specialization || 'General'} • {record.department_name || '-'}</p>
            {record.symptoms && <p className="mt-2 text-sm text-slate-600">Symptoms: {record.symptoms}</p>}
            {record.treatment_plan && <p className="mt-1 text-sm text-slate-600">Treatment: {record.treatment_plan}</p>}
            {record.notes && <p className="mt-1 text-sm text-slate-600">Notes: {record.notes}</p>}
          </article>
        ))}
        {loading && <div className="rounded-xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-500">Loading medical history...</div>}
      </section>
    </div>
  );
}

