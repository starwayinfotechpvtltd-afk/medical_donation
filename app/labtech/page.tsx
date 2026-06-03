'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Upload, CheckCircle2, Clock, Download,
  Activity, Calendar, FileText, TrendingUp, AlertCircle,
  Eye, X, DownloadCloud, LayoutDashboard, Beaker, Heart
} from 'lucide-react';
import { api, ApiException } from '@/lib/api-client';

interface LabTestRow {
  id: number;
  patient_id: number;
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
  updated_at?: string;
  result_file_url?: string | null;
}

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { cls: string; label: string }> = {
    pending: { cls: 'bg-amber-100 text-amber-700', label: 'Pending' },
    in_progress: { cls: 'bg-blue-100 text-blue-700', label: 'In Progress' },
    completed: { cls: 'bg-emerald-100 text-emerald-700', label: 'Completed' },
    rejected: { cls: 'bg-red-100 text-red-700', label: 'Rejected' },
  };
  const c = cfg[status] || cfg.pending;
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${c.cls}`}>{c.label}</span>;
}

function PriorityBadge({ priority }: { priority: string }) {
  const cfg: Record<string, string> = {
    routine: 'bg-slate-100 text-slate-700',
    urgent: 'bg-amber-100 text-amber-700',
    stat: 'bg-red-100 text-red-700',
  };
  return <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${cfg[priority] || 'bg-slate-100 text-slate-700'}`}>{priority.toUpperCase()}</span>;
}

function UploadModal({ isOpen, onClose, test, onSubmit }: { isOpen: boolean; onClose: () => void; test: LabTestRow | null; onSubmit: (payload: { result_file_url?: string; notes?: string }) => Promise<void>; }) {
  const [resultFileUrl, setResultFileUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setResultFileUrl(test?.result_file_url || '');
    setNotes('');
  }, [test, isOpen]);

  if (!isOpen || !test) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({ result_file_url: resultFileUrl || undefined, notes: notes || undefined });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <h2 className="text-xl font-bold text-slate-900">Upload Result</h2>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-slate-100"><X className="h-5 w-5 text-slate-400" /></button>
        </div>
        <form onSubmit={submit} className="space-y-4 p-6">
          <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">{test.test_name}</p>
            <p>{test.patient_first_name} {test.patient_last_name} | Reg: {test.patient_reg_no}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Report URL (optional)</label>
            <input value={resultFileUrl} onChange={(e) => setResultFileUrl(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="https://... or /uploads/lab/..." />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Technician Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div className="rounded-lg border-2 border-dashed border-slate-200 p-6 text-center">
            <DownloadCloud className="mx-auto mb-2 h-8 w-8 text-slate-400" />
            <p className="text-sm text-slate-600">Use report URL above (file upload endpoint can be integrated next)</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button disabled={saving} type="submit" className="flex-1 rounded-lg bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50">{saving ? 'Saving...' : 'Mark Completed'}</button>
            <button type="button" onClick={onClose} className="flex-1 rounded-lg bg-slate-100 py-2 font-medium text-slate-700 hover:bg-slate-200">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
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

export default function TechnicianDashboard({ activeDept = 'laboratory' }: { activeDept?: string }) {
  const [rows, setRows] = useState<LabTestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState<LabTestRow | null>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get<LabTestRow[]>('/lab/lab-tests');
      setRows((res.data ?? []) as LabTestRow[]);
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => rows.filter((r) => matchDept(r, activeDept)), [rows, activeDept]);

  const stats = useMemo(() => {
    const pending = filtered.filter((r) => r.status === 'pending' || r.status === 'in_progress').length;
    const completedToday = filtered.filter((r) => r.status === 'completed' && new Date(r.updated_at || r.request_date).toDateString() === new Date().toDateString()).length;
    const completed = filtered.filter((r) => r.status === 'completed');
    let avgHours = 0;
    if (completed.length) {
      const totalMs = completed.reduce((sum, r) => sum + Math.max(0, new Date(r.updated_at || r.request_date).getTime() - new Date(r.request_date).getTime()), 0);
      avgHours = totalMs / completed.length / (1000 * 60 * 60);
    }
    return {
      pending,
      completedToday,
      totalResults: completed.length,
      avgTurnaround: completed.length ? `${avgHours.toFixed(1)} hrs` : '0 hrs',
    };
  }, [filtered]);

  const openUpload = (test: LabTestRow) => {
    setSelectedTest(test);
    setShowUploadModal(true);
  };

  const submitResult = async ({ result_file_url }: { result_file_url?: string; notes?: string }) => {
    if (!selectedTest) return;
    await api.patch(`/lab/lab-tests/${selectedTest.id}/results`, { result_file_url: result_file_url || null, results: [] });
    await load();
  };

  const deptIcon = activeDept === 'all' ? <LayoutDashboard className="h-6 w-6 text-blue-600" /> : activeDept === 'cardiology' ? <Heart className="h-6 w-6 text-red-600" /> : <Beaker className="h-6 w-6 text-blue-600" />;
  const deptTitle = activeDept === 'all' ? 'All Departments' : activeDept.charAt(0).toUpperCase() + activeDept.slice(1);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-1 flex items-center gap-2">{deptIcon}<h1 className="text-2xl font-bold text-slate-900">{deptTitle}</h1></div>
          <p className="text-sm text-slate-500">Live technician dashboard from current lab data flow.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => void load()} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-white">Refresh</button>
          <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-white"><Download className="mr-1 inline h-4 w-4" />Export</button>
        </div>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-100 bg-white p-5"><p className="text-2xl font-bold text-slate-900">{stats.pending}</p><p className="text-sm text-slate-500">Pending Tests</p></div>
        <div className="rounded-xl border border-slate-100 bg-white p-5"><p className="text-2xl font-bold text-slate-900">{stats.completedToday}</p><p className="text-sm text-slate-500">Completed Today</p></div>
        <div className="rounded-xl border border-slate-100 bg-white p-5"><p className="text-2xl font-bold text-slate-900">{stats.totalResults}</p><p className="text-sm text-slate-500">Total Results</p></div>
        <div className="rounded-xl border border-slate-100 bg-white p-5"><p className="text-2xl font-bold text-slate-900">{stats.avgTurnaround}</p><p className="text-sm text-slate-500">Avg Turnaround</p></div>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Assigned Tests</h3>
            <p className="mt-1 text-sm text-slate-500">Department-filtered live records</p>
          </div>
        </div>
        <div className="space-y-3 p-5">
          {filtered.map((test) => (
            <div key={test.id} className="rounded-xl border border-slate-100 bg-white p-4 hover:shadow-sm">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <div className="mb-1 flex items-center gap-2"><h3 className="font-semibold text-slate-900">{test.test_name}</h3><PriorityBadge priority={test.priority} /></div>
                  <div className="text-sm text-slate-600">Patient: {test.patient_first_name} {test.patient_last_name} ({test.patient_reg_no})</div>
                  <div className="text-xs text-slate-500">Doctor: Dr. {test.doctor_first_name || ''} {test.doctor_last_name || ''}</div>
                </div>
                <StatusBadge status={test.status} />
              </div>
              <div className="mb-3 flex items-center gap-2 text-xs text-slate-500"><Calendar className="h-3.5 w-3.5" /><span>Requested: {new Date(test.request_date).toLocaleDateString()}</span></div>
              <div className="flex gap-2">
                <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600"><Eye className="h-3.5 w-3.5" />View</button>
                <button onClick={() => openUpload(test)} disabled={test.status === 'completed'} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-600 disabled:opacity-50"><Upload className="h-3.5 w-3.5" />Upload Results</button>
              </div>
            </div>
          ))}
          {!loading && filtered.length === 0 && <div className="rounded-lg border border-slate-100 p-8 text-center text-sm text-slate-500">No tests found for this department.</div>}
          {loading && <div className="rounded-lg border border-slate-100 p-8 text-center text-sm text-slate-500">Loading tests...</div>}
        </div>
      </div>

      <UploadModal isOpen={showUploadModal} onClose={() => { setShowUploadModal(false); setSelectedTest(null); }} test={selectedTest} onSubmit={submitResult} />
    </div>
  );
}
