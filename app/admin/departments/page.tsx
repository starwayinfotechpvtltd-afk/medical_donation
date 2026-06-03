'use client';

import { useEffect, useState } from 'react';
import { Building2, Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { adminApi, type Department } from '@/lib/admin-api';

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', description: '', icon: '', beds: '', services: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', icon: '', beds: '', services: '' });
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
  const getImageUrl = (url?: string | null) => (url?.startsWith('http') ? url : url ? `${apiOrigin}${url}` : '');

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
      if (form.services.trim()) fd.append('services', form.services);
      if (imageFile) fd.append('image', imageFile);
      await adminApi.createDepartment(fd);
      setForm({ name: '', description: '', icon: '', beds: '', services: '' });
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

  const startEdit = (dept: Department) => {
    setEditingId(dept.id);
    setEditImageFile(null);
    setEditForm({
      name: dept.name || '',
      description: dept.description || '',
      icon: dept.icon || '',
      beds: dept.beds == null ? '' : String(dept.beds),
      services: (dept.services ?? []).map((service) => service.service_name).join(', '),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditImageFile(null);
    setEditForm({ name: '', description: '', icon: '', beds: '', services: '' });
  };

  const saveEdit = async (id: number) => {
    if (!editForm.name.trim()) return;
    try {
      setIsSavingEdit(true);
      const fd = new FormData();
      fd.append('name', editForm.name.trim());
      fd.append('description', editForm.description || '');
      fd.append('icon', editForm.icon || '');
      if (editForm.beds) fd.append('beds', String(Number(editForm.beds)));
      fd.append('services', editForm.services || '');
      if (editImageFile) fd.append('image', editImageFile);
      await adminApi.updateDepartment(id, fd);
      cancelEdit();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update department.');
    } finally {
      setIsSavingEdit(false);
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
          <input value={form.services} onChange={(e) => setForm((s) => ({ ...s, services: e.target.value }))} placeholder="Services (comma separated)" className="rounded-xl border border-slate-200 px-3 py-2 text-sm md:col-span-2" />
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
            <div key={dept.id} className="rounded-xl border border-slate-100 overflow-hidden">
              {/* Department image */}
              {dept.image_url && (
                <div className="h-36 w-full overflow-hidden bg-slate-100">
                  <img
                    src={getImageUrl(dept.image_url)}
                    alt={dept.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              {/* Fallback placeholder when no image */}
              {!dept.image_url && (
                <div className="h-36 w-full bg-slate-100 flex items-center justify-center">
                  <Building2 className="h-10 w-10 text-slate-300" />
                </div>
              )}

              <div className="p-4">
                {editingId === dept.id ? (
                  <div className="space-y-3">
                    <input value={editForm.name} onChange={(e) => setEditForm((s) => ({ ...s, name: e.target.value }))} placeholder="Name" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                    <input value={editForm.beds} onChange={(e) => setEditForm((s) => ({ ...s, beds: e.target.value }))} placeholder="Beds" type="number" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                    <input value={editForm.icon} onChange={(e) => setEditForm((s) => ({ ...s, icon: e.target.value }))} placeholder="Icon" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                    <input value={editForm.services} onChange={(e) => setEditForm((s) => ({ ...s, services: e.target.value }))} placeholder="Services (comma separated)" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                    <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => setEditImageFile(e.target.files?.[0] || null)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                    <textarea value={editForm.description} onChange={(e) => setEditForm((s) => ({ ...s, description: e.target.value }))} placeholder="Description" rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(dept.id)} disabled={isSavingEdit} className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60">
                        {isSavingEdit ? 'Saving...' : 'Save'}
                      </button>
                      <button onClick={cancelEdit} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-900">{dept.name}</p>
                      {dept.icon && <span className="text-slate-400 text-sm">{dept.icon}</span>}
                    </div>
                    <p className="mt-2 text-sm text-slate-500">{dept.description || 'No description'}</p>
                    <p className="mt-2 text-sm text-slate-600">Beds: {dept.beds ?? '-'}</p>
                    {dept.services?.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {dept.services.map((service) => (
                          <span key={service.id} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700">
                            {service.service_name}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => startEdit(dept)}
                        className="inline-flex items-center gap-1 rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-600"
                      >
                        <Pencil className="h-3.5 w-3.5" />Edit
                      </button>
                      <button
                        onClick={() => removeDepartment(dept.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
