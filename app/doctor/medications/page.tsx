'use client';

import { useEffect, useMemo, useState } from 'react';
import { api, ApiException } from '@/lib/api-client';

interface Medication {
  id: number;
  name: string;
  generic_name?: string | null;
  category?: string | null;
  default_dosage?: string | null;
  default_frequency?: string | null;
  default_duration?: string | null;
  default_route?: string | null;
  notes?: string | null;
  is_active: number;
}

const emptyForm = {
  name: '',
  generic_name: '',
  category: '',
  default_dosage: '',
  default_frequency: '',
  default_duration: '',
  default_route: 'oral',
  notes: '',
  is_active: true,
};

export default function DoctorMedicationsPage() {
  const [rows, setRows] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Medication | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get<Medication[]>('/medical/doctor/medications');
      setRows((res.data ?? []) as Medication[]);
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to load medications.');
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
    return rows.filter((m) => m.name.toLowerCase().includes(q) || (m.generic_name || '').toLowerCase().includes(q));
  }, [rows, query]);

  const resetForm = () => {
    setEditing(null);
    setForm({ ...emptyForm });
  };

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      if (editing) {
        await api.patch(`/medical/doctor/medications/${editing.id}`, form);
      } else {
        await api.post('/medical/doctor/medications', form);
      }
      await load();
      resetForm();
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to save medication.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!window.confirm('Delete this medication?')) return;
    try {
      await api.delete(`/medical/doctor/medications/${id}`);
      await load();
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to delete medication.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Medications</h1>
        <p className="text-sm text-slate-500">Doctor-owned medication library (CRUD).</p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="rounded-xl border border-slate-100 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm md:col-span-2" placeholder="Medication name *" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
          <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Generic name" value={form.generic_name} onChange={(e) => setForm((s) => ({ ...s, generic_name: e.target.value }))} />
          <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Category" value={form.category} onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))} />
          <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Default dosage" value={form.default_dosage} onChange={(e) => setForm((s) => ({ ...s, default_dosage: e.target.value }))} />
          <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Default frequency" value={form.default_frequency} onChange={(e) => setForm((s) => ({ ...s, default_frequency: e.target.value }))} />
          <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Default duration" value={form.default_duration} onChange={(e) => setForm((s) => ({ ...s, default_duration: e.target.value }))} />
          <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Route (oral)" value={form.default_route} onChange={(e) => setForm((s) => ({ ...s, default_route: e.target.value }))} />
          <textarea className="rounded-lg border border-slate-200 px-3 py-2 text-sm md:col-span-3" placeholder="Notes" value={form.notes} onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))} />
          <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm((s) => ({ ...s, is_active: e.target.checked }))} />Active</label>
        </div>
        <div className="mt-3 flex gap-2">
          <button onClick={() => void save()} disabled={saving || !form.name.trim()} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving...' : editing ? 'Update Medication' : 'Add Medication'}</button>
          {editing && <button onClick={resetForm} className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Cancel Edit</button>}
        </div>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white p-4">
        <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Search by name or generic name" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
        <table className="w-full min-w-[900px]">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th><th className="px-4 py-3">Generic</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Defaults</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">No medications found.</td></tr>}
            {filtered.map((m) => (
              <tr key={m.id} className="border-t border-slate-100 text-sm">
                <td className="px-4 py-3 font-medium">{m.name}</td>
                <td className="px-4 py-3">{m.generic_name || '-'}</td>
                <td className="px-4 py-3">{m.category || '-'}</td>
                <td className="px-4 py-3">{[m.default_dosage, m.default_frequency, m.default_duration].filter(Boolean).join(' | ') || '-'}</td>
                <td className="px-4 py-3">{m.is_active ? 'Active' : 'Inactive'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditing(m); setForm({ name: m.name, generic_name: m.generic_name || '', category: m.category || '', default_dosage: m.default_dosage || '', default_frequency: m.default_frequency || '', default_duration: m.default_duration || '', default_route: m.default_route || 'oral', notes: m.notes || '', is_active: !!m.is_active }); }} className="rounded bg-slate-100 px-2 py-1 text-xs">Edit</button>
                    <button onClick={() => void remove(m.id)} className="rounded bg-red-100 px-2 py-1 text-xs text-red-700">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {loading && <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">Loading medications...</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
