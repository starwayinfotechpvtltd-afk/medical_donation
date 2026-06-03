'use client';

import { useEffect, useState } from 'react';
import { api, ApiException } from '@/lib/api-client';

interface DeptRow {
  id: number;
  department_key: string;
  department_name: string;
}

export default function ManageDepartmentsPage() {
  const [rows, setRows] = useState<DeptRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [key, setKey] = useState('');
  const [name, setName] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const res = await api.get<DeptRow[]>('/lab/my-departments');
      setRows((res.data ?? []) as DeptRow[]);
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to load departments.');
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []);

  const add = async () => {
    const department_key = key.trim().toLowerCase();
    const department_name = name.trim();
    if (!department_key || !department_name) return;
    setError('');
    try {
      await api.post('/lab/my-departments', { department_key, department_name });
      setKey(''); setName('');
      await load();
      localStorage.setItem('labtechDeptRefresh', String(Date.now()));
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to add department.');
    }
  };

  const remove = async (id: number) => {
    if (!window.confirm('Remove this department?')) return;
    setError('');
    try {
      await api.delete(`/lab/my-departments/${id}`);
      await load();
      localStorage.setItem('labtechDeptRefresh', String(Date.now()));
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to remove department.');
    }
  };

  return <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
    <div><h1 className="text-2xl font-bold text-slate-900">Manage Department</h1><p className="text-sm text-slate-500">Create and organize departments for your labtech views.</p></div>
    {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
    <section className="rounded-xl border border-slate-100 bg-white p-4 space-y-3">
      <h2 className="font-semibold text-slate-900">Add Department</h2>
      <div className="grid gap-3 md:grid-cols-3">
        <input value={name} onChange={(e) => setName(e.target.value)} className="rounded border border-slate-200 px-3 py-2 text-sm" placeholder="Department name" />
        <input value={key} onChange={(e) => setKey(e.target.value)} className="rounded border border-slate-200 px-3 py-2 text-sm" placeholder="Department key (slug)" />
        <button onClick={() => void add()} className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Add Department</button>
      </div>
    </section>

    <section className="space-y-3">
      {rows.map((d) => <article key={d.id} className="rounded-xl border border-slate-100 bg-white p-4"><div className="flex items-center justify-between"><div><p className="font-semibold text-slate-900">{d.department_name}</p><p className="text-xs text-slate-500">Key: {d.department_key}</p></div><button onClick={() => void remove(d.id)} className="rounded bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">Remove</button></div></article>)}
      {!loading && rows.length === 0 && <div className="rounded-xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-500">No custom departments found.</div>}
      {loading && <div className="rounded-xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-500">Loading...</div>}
    </section>
  </div>;
}
