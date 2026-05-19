'use client';

import { useEffect, useMemo, useState } from 'react';
import { api, ApiException } from '@/lib/api-client';

interface TemplateMedicine {
  medicine_name: string;
  dosage?: string | null;
  frequency?: string | null;
  duration?: string | null;
  route?: string | null;
  instructions?: string | null;
}

interface DoctorTemplate {
  id: number;
  name: string;
  diagnosis?: string | null;
  notes?: string | null;
  follow_up_days?: number | null;
  is_active: number;
  usage_count?: number;
  medicines: TemplateMedicine[];
  assets?: Array<{
    file_url: string;
    file_name?: string | null;
    file_type: 'image' | 'document';
    mime_type?: string | null;
    sort_order?: number;
  }>;
}

const blankTemplate = {
  name: '',
  diagnosis: '',
  notes: '',
  follow_up_days: 14,
  is_active: true,
  medicines: [],
  assets: [],
};

export default function DoctorTemplatesPage() {
  const [rows, setRows] = useState<DoctorTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<DoctorTemplate | null>(null);
  const [form, setForm] = useState({ ...blankTemplate });
  const [saving, setSaving] = useState(false);
  const [uploadingAsset, setUploadingAsset] = useState(false);
  const [importJson, setImportJson] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get<DoctorTemplate[]>('/medical/doctor/templates');
      setRows((res.data ?? []) as DoctorTemplate[]);
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to load templates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((t) => t.name.toLowerCase().includes(q) || (t.diagnosis || '').toLowerCase().includes(q));
  }, [rows, query]);

  const reset = () => {
    setEditing(null);
    setForm({ ...blankTemplate });
  };

  const uploadAsset = async (file: File) => {
    setUploadingAsset(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('asset', file);
      const res = await api.post<{ file_url: string; file_name: string; file_type: 'image' | 'document'; mime_type: string }>('/medical/doctor/templates/assets/upload', fd);
      const asset = res.data;
      if (!asset) return;
      setForm((s) => ({
        ...s,
        assets: [...(s.assets || []), { ...asset, sort_order: (s.assets || []).length }],
      }));
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to upload asset.');
    } finally {
      setUploadingAsset(false);
    }
  };

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      if (editing) await api.patch(`/medical/doctor/templates/${editing.id}`, form);
      else await api.post('/medical/doctor/templates', form);
      await load();
      reset();
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to save template.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!window.confirm('Delete this template?')) return;
    try {
      await api.delete(`/medical/doctor/templates/${id}`);
      await load();
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to delete template.');
    }
  };

  const importTemplate = () => {
    try {
      const parsed = JSON.parse(importJson);
      if (!parsed?.name) {
        setError('Invalid template JSON. Must include name.');
        return;
      }
      setForm({
        name: parsed.name,
        diagnosis: parsed.diagnosis || '',
        notes: parsed.notes || '',
        follow_up_days: Number(parsed.follow_up_days || 14),
        is_active: parsed.is_active !== false,
        medicines: [],
        assets: Array.isArray(parsed.assets) ? parsed.assets : [],
      });
      setImportJson('');
      setError('');
    } catch {
      setError('Invalid JSON format for template import.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Prescription Templates</h1>
        <p className="text-sm text-slate-500">Create, edit, delete, and import your own templates.</p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="rounded-xl border border-slate-100 bg-white p-4 space-y-3">
        <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Template name *" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
        <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Diagnosis" value={form.diagnosis} onChange={(e) => setForm((s) => ({ ...s, diagnosis: e.target.value }))} />
        <textarea className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Notes" value={form.notes} onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))} />
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <input type="number" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Follow-up days" value={form.follow_up_days} onChange={(e) => setForm((s) => ({ ...s, follow_up_days: Number(e.target.value) }))} />
          <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm((s) => ({ ...s, is_active: e.target.checked }))} />Active</label>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-700">Template Format Files (Image / PDF / Word)</p>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void uploadAsset(file);
              e.currentTarget.value = '';
            }}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          {uploadingAsset && <p className="text-xs text-slate-500">Uploading file...</p>}
          {(form.assets || []).length > 0 && (
            <div className="space-y-2">
              {(form.assets || []).map((asset, idx) => (
                <div key={`${asset.file_url}-${idx}`} className="flex items-center justify-between rounded border border-slate-200 px-3 py-2 text-xs">
                  <p className="truncate text-slate-700">{asset.file_name || asset.file_url} ({asset.file_type})</p>
                  <button
                    type="button"
                    onClick={() => setForm((s) => ({ ...s, assets: (s.assets || []).filter((_, i) => i !== idx).map((a, i) => ({ ...a, sort_order: i })) }))}
                    className="rounded bg-red-100 px-2 py-1 text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button onClick={() => void save()} disabled={saving || !form.name.trim()} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving...' : editing ? 'Update Template' : 'Create Template'}</button>
          {editing && <button onClick={reset} className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Cancel Edit</button>}
        </div>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white p-4 space-y-2">
        <p className="text-sm font-semibold text-slate-800">Upload / Import Built Template (JSON)</p>
        <textarea value={importJson} onChange={(e) => setImportJson(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs" rows={5} placeholder={`{"name":"General Rx Sheet","diagnosis":"General","notes":"Header/footer layout","assets":[]}`} />
        <button onClick={importTemplate} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Load JSON Into Form</button>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white p-4">
        <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Search templates" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="space-y-3">
        {!loading && filtered.length === 0 && <div className="rounded-xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-500">No templates found.</div>}
        {filtered.map((t) => (
          <article key={t.id} className="rounded-xl border border-slate-100 bg-white p-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">{t.name}</h2>
              <span className="text-xs text-slate-500">Used {t.usage_count || 0} time(s)</span>
            </div>
            <p className="text-sm text-slate-600">{t.diagnosis || '-'}</p>
            {(t.assets || []).length > 0 && (
              <p className="mt-1 text-xs text-slate-500">
                Files: {(t.assets || []).map((a) => `${a.file_name || a.file_url} (${a.file_type})`).join(', ')}
              </p>
            )}
            <div className="mt-3 flex gap-2">
              <button onClick={() => { setEditing(t); setForm({ name: t.name, diagnosis: t.diagnosis || '', notes: t.notes || '', follow_up_days: Number(t.follow_up_days || 14), is_active: !!t.is_active, medicines: [], assets: (t.assets || []).map((a, idx) => ({ ...a, sort_order: Number(a.sort_order ?? idx) })) }); }} className="rounded bg-slate-100 px-2 py-1 text-xs">Edit</button>
              <button onClick={() => void remove(t.id)} className="rounded bg-red-100 px-2 py-1 text-xs text-red-700">Delete</button>
            </div>
          </article>
        ))}
        {loading && <div className="rounded-xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-500">Loading templates...</div>}
      </div>
    </div>
  );
}
