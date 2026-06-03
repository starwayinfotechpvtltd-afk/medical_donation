'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api, ApiException } from '@/lib/api-client';

interface LabTechProfile { id: number; first_name: string; last_name: string; email: string; }
interface LabTestRow {
  id: number;
  patient_reg_no: string;
  patient_first_name: string;
  patient_last_name: string;
  patient_phone?: string | null;
  test_name: string;
  category: string;
  priority: string;
  status: string;
  request_date: string;
  notes?: string | null;
  result_file_url?: string | null;
  technician_first_name?: string | null;
  technician_last_name?: string | null;
}

const categoryToApi = (category: string) => {
  const normalized = (category || '').trim().toLowerCase();
  const allowed = ['hematology', 'biochemistry', 'microbiology', 'immunology', 'radiology', 'cardiology', 'pathology', 'other'];
  return allowed.includes(normalized) ? normalized : 'other';
};

export default function DoctorLabTestsPage() {
  const searchParams = useSearchParams();
  const [rows, setRows] = useState<LabTestRow[]>([]);
  const [techs, setTechs] = useState<LabTechProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [patientRegNo, setPatientRegNo] = useState((searchParams.get('patientRegNo') || '').trim());
  const [statusFilter, setStatusFilter] = useState('');
  const [form, setForm] = useState({ testName: '', category: 'other', priority: 'routine', appointmentId: (searchParams.get('appointmentId') || '').trim(), notes: '', technicianId: '' });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [testsRes, techRes] = await Promise.all([
        api.get<LabTestRow[]>('/lab/lab-tests', { patient_reg_no: patientRegNo || undefined, status: statusFilter || undefined }),
        api.get<LabTechProfile[]>('/lab/lab-technicians'),
      ]);
      setRows((testsRes.data ?? []) as LabTestRow[]);
      setTechs((techRes.data ?? []) as LabTechProfile[]);
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to load lab tests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, [patientRegNo, statusFilter]);

  const createAndAssign = async () => {
    if (!patientRegNo.trim() || !form.testName.trim()) return;
    setSaving(true);
    setError('');
    try {
      const created = await api.post<{ id: number }>('/lab/lab-tests', {
        patient_reg_no: patientRegNo.trim(),
        appointment_id: form.appointmentId ? Number(form.appointmentId) : null,
        test_name: form.testName.trim(),
        test_type: form.testName.trim(),
        category: categoryToApi(form.category),
        priority: form.priority,
        notes: form.notes || null,
      });
      const newId = (created.data as { id: number } | undefined)?.id;
      if (newId && form.technicianId) {
        await api.patch(`/lab/lab-tests/${newId}/assign`, { lab_tech_profile_id: Number(form.technicianId) });
      }
      setForm((s) => ({ ...s, testName: '', notes: '', technicianId: '' }));
      await load();
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to create test.');
    } finally { setSaving(false); }
  };

  const assignTech = async (id: number, technicianId: string) => {
    if (!technicianId) return;
    setSaving(true);
    setError('');
    try {
      await api.patch(`/lab/lab-tests/${id}/assign`, { lab_tech_profile_id: Number(technicianId) });
      await load();
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to assign technician.');
    } finally { setSaving(false); }
  };

  const stats = useMemo(() => ({ total: rows.length, pending: rows.filter(r => r.status === 'pending').length, inProgress: rows.filter(r => r.status === 'in_progress').length, completed: rows.filter(r => r.status === 'completed').length }), [rows]);

  return <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
    <div><h1 className="text-2xl font-bold text-slate-900">Lab Tests</h1><p className="text-sm text-slate-500">Assign by patient registration number and technician.</p></div>
    {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">Total</p><p className="text-2xl font-bold">{stats.total}</p></div>
      <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">Pending</p><p className="text-2xl font-bold">{stats.pending}</p></div>
      <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">In Progress</p><p className="text-2xl font-bold">{stats.inProgress}</p></div>
      <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">Completed</p><p className="text-2xl font-bold">{stats.completed}</p></div>
    </div>
    <section className="rounded-xl border border-slate-100 bg-white p-4 space-y-3">
      <h2 className="font-semibold text-slate-900">Create Test</h2>
      <div className="grid gap-3 md:grid-cols-3">
        <input className="rounded border border-slate-200 px-3 py-2 text-sm" placeholder="Patient Reg No" value={patientRegNo} onChange={(e) => setPatientRegNo(e.target.value)} />
        <input className="rounded border border-slate-200 px-3 py-2 text-sm" placeholder="Test Name" value={form.testName} onChange={(e) => setForm((s) => ({ ...s, testName: e.target.value }))} />
        <select className="rounded border border-slate-200 px-3 py-2 text-sm" value={form.technicianId} onChange={(e) => setForm((s) => ({ ...s, technicianId: e.target.value }))}><option value="">Assign Technician (optional)</option>{techs.map(t => <option key={t.id} value={String(t.id)}>{t.first_name} {t.last_name}</option>)}</select>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        <select className="rounded border border-slate-200 px-3 py-2 text-sm" value={form.category} onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}><option value="other">Other</option><option value="hematology">Hematology</option><option value="biochemistry">Biochemistry</option><option value="microbiology">Microbiology</option><option value="immunology">Immunology</option><option value="radiology">Radiology</option><option value="cardiology">Cardiology</option><option value="pathology">Pathology</option></select>
        <select className="rounded border border-slate-200 px-3 py-2 text-sm" value={form.priority} onChange={(e) => setForm((s) => ({ ...s, priority: e.target.value }))}><option value="routine">Routine</option><option value="urgent">Urgent</option><option value="stat">STAT</option></select>
        <input className="rounded border border-slate-200 px-3 py-2 text-sm" placeholder="Appointment ID (optional)" value={form.appointmentId} onChange={(e) => setForm((s) => ({ ...s, appointmentId: e.target.value }))} />
        <button onClick={() => void createAndAssign()} disabled={saving} className="rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving...' : 'Create Test'}</button>
      </div>
    </section>
    <section className="space-y-3">
      <div className="flex gap-3"><input className="rounded border border-slate-200 px-3 py-2 text-sm" placeholder="Filter by Reg No" value={patientRegNo} onChange={(e) => setPatientRegNo(e.target.value)} /><select className="rounded border border-slate-200 px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="">All Statuses</option><option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="completed">Completed</option><option value="rejected">Rejected</option></select></div>
      {rows.map((r) => <article key={r.id} className="rounded-xl border border-slate-100 bg-white p-4"><div className="flex items-center justify-between gap-3"><div><p className="font-semibold text-slate-900">{r.test_name}</p><p className="text-xs text-slate-500">{r.patient_first_name} {r.patient_last_name} | Reg: {r.patient_reg_no} | Mob: {r.patient_phone || '-'}</p></div><span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold">{r.status}</span></div><p className="mt-1 text-xs text-slate-500">{new Date(r.request_date).toLocaleDateString()} | Priority: {r.priority}</p><div className="mt-2 flex flex-wrap items-center gap-3"><p className="text-xs text-slate-600">Technician: {(r.technician_first_name || '') + ' ' + (r.technician_last_name || '') || '-'}</p><select className="rounded border border-slate-200 px-2 py-1 text-xs" onChange={(e) => void assignTech(r.id, e.target.value)} defaultValue=""><option value="" disabled>Assign Technician</option>{techs.map(t => <option key={t.id} value={String(t.id)}>{t.first_name} {t.last_name}</option>)}</select>{r.result_file_url && <a className="text-xs font-semibold text-blue-600" href={r.result_file_url} target="_blank" rel="noreferrer">Download Report</a>}</div></article>)}
      {!loading && rows.length === 0 && <div className="rounded-xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-500">No lab tests found.</div>}
      {loading && <div className="rounded-xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-500">Loading...</div>}
    </section>
  </div>;
}
