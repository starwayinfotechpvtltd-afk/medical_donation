'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, RefreshCw, Search, Trash2, UserMinus } from 'lucide-react';
import { nurseAdminApi, type NurseUser } from '@/lib/nurse-admin-api';

type FormState = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  status: 'active' | 'inactive' | 'suspended';
};

const emptyForm: FormState = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: '',
  status: 'active',
};

export default function NurseAdminNursesPage() {
  const [nurses, setNurses] = useState<NurseUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<NurseUser | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setNurses(await nurseAdminApi.getNurses({ search: search || undefined, status: status || undefined }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load nurses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [search, status]);

  const counters = useMemo(() => ({
    total: nurses.length,
    active: nurses.filter((n) => n.status === 'active').length,
    inactive: nurses.filter((n) => n.status !== 'active').length,
    assignments: nurses.reduce((sum, n) => sum + Number(n.assigned_patients || 0), 0),
  }), [nurses]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (nurse: NurseUser) => {
    setEditing(nurse);
    setForm({
      first_name: nurse.first_name,
      last_name: nurse.last_name,
      email: nurse.email,
      phone: nurse.phone || '',
      password: '',
      status: nurse.status,
    });
    setShowForm(true);
  };

  const save = async () => {
    setError('');
    try {
      if (editing) {
        await nurseAdminApi.updateNurse(editing.id, {
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone || undefined,
          status: form.status,
        });
      } else {
        if (!form.password.trim()) {
          setError('Password is required when creating a nurse.');
          return;
        }
        await nurseAdminApi.createNurse({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone || undefined,
          password: form.password,
        });
      }
      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save nurse.');
    }
  };

  const deactivate = async (nurse: NurseUser) => {
    if (!window.confirm(`Deactivate ${nurse.first_name} ${nurse.last_name}?`)) return;
    await nurseAdminApi.updateNurse(nurse.id, { status: 'inactive' });
    await load();
  };

  const remove = async (nurse: NurseUser) => {
    if (!window.confirm(`Delete ${nurse.first_name} ${nurse.last_name}? This cannot be undone.`)) return;
    await nurseAdminApi.deleteNurse(nurse.id);
    await load();
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Nurses</h1>
          <p className="mt-1 text-sm text-slate-500">Add, update, activate, deactivate, and delete nurse accounts.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white">
            <Plus className="h-4 w-4" />
            Add Nurse
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Total', counters.total],
          ['Active', counters.active],
          ['Inactive/Suspended', counters.inactive],
          ['Assigned Patients', counters.assignments],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-lg border bg-white p-4">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-3">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border px-10 py-2 text-sm" placeholder="Search nurses" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border px-3 py-2 text-sm">
          <option value="">All status</option>
          <option value="active">active</option>
          <option value="inactive">inactive</option>
          <option value="suspended">suspended</option>
        </select>
      </div>

      {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {nurses.map((nurse) => (
          <div key={nurse.id} className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">{nurse.first_name} {nurse.last_name}</p>
                <p className="text-sm text-slate-500">{nurse.email}</p>
                <p className="text-sm text-slate-500">{nurse.phone || 'No phone'}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">{nurse.status}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-slate-500">Patients</p>
                <p className="font-semibold">{nurse.assigned_patients ?? 0}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-slate-500">Shifts</p>
                <p className="font-semibold">{nurse.scheduled_shifts ?? 0}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => openEdit(nurse)} className="rounded-lg border px-3 py-1.5 text-xs">Edit</button>
              <button onClick={() => deactivate(nurse)} className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800">
                <UserMinus className="h-3.5 w-3.5" />
                Deactivate
              </button>
              <button onClick={() => remove(nurse)} className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white">
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {!loading && !nurses.length ? <div className="rounded-lg border bg-white p-8 text-sm text-slate-500">No nurses found.</div> : null}

      {showForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-2xl rounded-lg bg-white p-5" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-semibold text-slate-900">{editing ? 'Edit Nurse' : 'Add Nurse'}</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input value={form.first_name} onChange={(e) => setForm((s) => ({ ...s, first_name: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm" placeholder="First name" />
              <input value={form.last_name} onChange={(e) => setForm((s) => ({ ...s, last_name: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm" placeholder="Last name" />
              <input value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm" placeholder="Email" />
              <input value={form.phone} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm" placeholder="Phone" />
              {!editing ? <input value={form.password} onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))} type="password" className="rounded-lg border px-3 py-2 text-sm" placeholder="Password" /> : null}
              <select value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as FormState['status'] }))} className="rounded-lg border px-3 py-2 text-sm">
                <option value="active">active</option>
                <option value="inactive">inactive</option>
                <option value="suspended">suspended</option>
              </select>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="rounded-lg border px-4 py-2 text-sm">Cancel</button>
              <button onClick={save} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white">Save</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
