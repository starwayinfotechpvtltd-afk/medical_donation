'use client';

import { useEffect, useState } from 'react';
import { Building2, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { adminApi, type Department } from '@/lib/admin-api';

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', description: '', icon: '', beds: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setDepartments(await adminApi.getDepartments());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load departments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const createDepartment = async () => {
    if (!form.name.trim()) return;
    try {
      const fd = new FormData();
      fd.append('name', form.name.trim());
      if (form.description) fd.append('description', form.description);
      if (form.icon) fd.append('icon', form.icon);
      if (form.beds) fd.append('beds', String(Number(form.beds)));
      if (imageFile) fd.append('image', imageFile);
      await adminApi.createDepartment(fd);
      setForm({ name: '', description: '', icon: '', beds: '' });
      setImageFile(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create department.');
    }
  };

  const removeDepartment = async (id: number) => {
    if (!window.confirm('Delete this department?')) return;
    try {
      await adminApi.deleteDepartment(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete department.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-blue-600">Departments</p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">Department Management</h1>
        </div>
        <button onClick={load} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm"><RefreshCw className="h-4 w-4" />Refresh</button>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Add Department</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} placeholder="Name" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          <input value={form.beds} onChange={(e) => setForm((s) => ({ ...s, beds: e.target.value }))} placeholder="Beds" type="number" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          <input value={form.icon} onChange={(e) => setForm((s) => ({ ...s, icon: e.target.value }))} placeholder="Icon" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          <textarea value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} placeholder="Description" className="rounded-xl border border-slate-200 px-3 py-2 text-sm md:col-span-2" rows={3} />
        </div>
        <button onClick={createDepartment} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white"><Plus className="h-4 w-4" />Create</button>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">All Departments</h2>
        {loading ? <p className="mt-3 text-sm text-slate-500">Loading...</p> : null}
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {departments.map((dept) => (
            <div key={dept.id} className="rounded-xl border border-slate-100 p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-900">{dept.name}</p>
                <Building2 className="h-4 w-4 text-slate-400" />
              </div>
              <p className="mt-2 text-sm text-slate-500">{dept.description || 'No description'}</p>
              <p className="mt-2 text-sm text-slate-600">Beds: {dept.beds ?? '-'}</p>
              <button onClick={() => removeDepartment(dept.id)} className="mt-3 inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600"><Trash2 className="h-3.5 w-3.5" />Delete</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
