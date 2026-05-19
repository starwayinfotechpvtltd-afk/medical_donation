'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, RefreshCw, Search, Trash2, UserMinus } from 'lucide-react';
import { adminApi, type Department, type DoctorProfile, type StaffUser } from '@/lib/admin-api';

type DoctorForm = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  status: string;
  specialization: string;
  qualification: string;
  years_of_experience: string;
  department_id: string;
  is_primary: boolean;
};

const emptyForm: DoctorForm = {
  first_name: '', last_name: '', email: '', password: '', phone: '', status: 'active',
  specialization: '', qualification: '', years_of_experience: '', department_id: '', is_primary: true,
};

export default function AdminDoctorsPage() {
  const [tab, setTab] = useState<'add' | 'management'>('management');
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState<DoctorForm>(emptyForm);

  const loadAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [doctorRows, userRows, deptRows] = await Promise.all([
        adminApi.getDoctors(),
        adminApi.getUsers({ role: 'doctor', limit: 200, page: 1 }),
        adminApi.getDepartments(),
      ]);
      setDoctors(doctorRows);
      setUsers(userRows.data);
      setDepartments(deptRows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load doctors.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return doctors.filter((d) => `${d.first_name} ${d.last_name}`.toLowerCase().includes(q) || (d.specialization || '').toLowerCase().includes(q));
  }, [doctors, search]);

  const createDoctor = async () => {
    try {
      const created = await adminApi.createUser({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
        role: 'doctor',
        phone: form.phone || undefined,
      });

      await adminApi.updateUser(created.id, { status: form.status });

      await adminApi.updateDoctorProfile(created.id, {
        specialization: form.specialization || undefined,
        qualification: form.qualification || undefined,
        years_of_experience: form.years_of_experience ? Number(form.years_of_experience) : undefined,
      });

      if (form.department_id) {
        const doctorRows = await adminApi.getDoctors();
        const createdProfile = doctorRows.find((d) => d.user_id === created.id);
        if (createdProfile) {
          await adminApi.assignDoctorDepartment(createdProfile.id, Number(form.department_id), form.is_primary ? 1 : 0);
        }
      }

      setForm(emptyForm);
      setTab('management');
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create doctor.');
    }
  };

  const deactivate = async (doctor: DoctorProfile) => {
    if (!window.confirm(`Deactivate ${doctor.first_name} ${doctor.last_name}?`)) return;
    const user = users.find((u) => u.id === doctor.user_id);
    if (!user) return;
    await adminApi.deactivateUser(user.id);
    await loadAll();
  };

  const removeDoctor = async (doctor: DoctorProfile) => {
    if (!window.confirm(`Delete ${doctor.first_name} ${doctor.last_name}? This cannot be undone.`)) return;
    const user = users.find((u) => u.id === doctor.user_id);
    if (!user) return;
    await adminApi.deleteUser(user.id);
    await loadAll();
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-blue-600">Doctors</p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">Doctor Add & Management</h1>
        </div>
        <button onClick={loadAll} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm"><RefreshCw className="h-4 w-4" />Refresh</button>
      </div>

      <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
        <button onClick={() => setTab('management')} className={`rounded-lg px-4 py-2 text-sm ${tab === 'management' ? 'bg-blue-600 text-white' : 'text-slate-700'}`}>Management</button>
        <button onClick={() => setTab('add')} className={`rounded-lg px-4 py-2 text-sm ${tab === 'add' ? 'bg-blue-600 text-white' : 'text-slate-700'}`}>Add Doctor</button>
      </div>

      {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div> : null}

      {tab === 'add' ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Create Doctor</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input value={form.first_name} onChange={(e) => setForm((s) => ({ ...s, first_name: e.target.value }))} placeholder="First name" className="rounded-xl border px-3 py-2 text-sm" />
            <input value={form.last_name} onChange={(e) => setForm((s) => ({ ...s, last_name: e.target.value }))} placeholder="Last name" className="rounded-xl border px-3 py-2 text-sm" />
            <input value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} placeholder="Email" className="rounded-xl border px-3 py-2 text-sm" />
            <input value={form.phone} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} placeholder="Phone" className="rounded-xl border px-3 py-2 text-sm" />
            <input value={form.password} onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))} placeholder="Temporary password" type="password" className="rounded-xl border px-3 py-2 text-sm" />
            <select value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))} className="rounded-xl border px-3 py-2 text-sm"><option value="active">active</option><option value="inactive">inactive</option><option value="suspended">suspended</option></select>
            <input value={form.specialization} onChange={(e) => setForm((s) => ({ ...s, specialization: e.target.value }))} placeholder="Specialization" className="rounded-xl border px-3 py-2 text-sm" />
            <input value={form.qualification} onChange={(e) => setForm((s) => ({ ...s, qualification: e.target.value }))} placeholder="Qualification" className="rounded-xl border px-3 py-2 text-sm" />
            <input value={form.years_of_experience} onChange={(e) => setForm((s) => ({ ...s, years_of_experience: e.target.value }))} placeholder="Years of experience" type="number" className="rounded-xl border px-3 py-2 text-sm" />
            <select value={form.department_id} onChange={(e) => setForm((s) => ({ ...s, department_id: e.target.value }))} className="rounded-xl border px-3 py-2 text-sm"><option value="">No department assignment</option>{departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
          </div>
          <button onClick={createDoctor} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white"><Plus className="h-4 w-4" />Create Doctor</button>
        </section>
      ) : (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">Manage Doctors</h2>
            <div className="relative w-full max-w-sm"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search doctor" className="w-full rounded-xl border px-10 py-2 text-sm" /></div>
          </div>
          {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((d) => (
              <div key={d.id} className="rounded-xl border border-slate-100 p-4">
                <p className="font-semibold text-slate-900">{d.first_name} {d.last_name}</p>
                <p className="text-sm text-slate-500">{d.specialization || 'No specialization'}</p>
                <p className="mt-2 text-xs text-slate-600">Experience: {d.years_of_experience ?? '-'} years</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => deactivate(d)} className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800"><UserMinus className="h-3.5 w-3.5" />Deactivate</button>
                  <button onClick={() => removeDoctor(d)} className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"><Trash2 className="h-3.5 w-3.5" />Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
