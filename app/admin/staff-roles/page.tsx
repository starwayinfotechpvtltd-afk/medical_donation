'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, RefreshCw, Search, Trash2, UserMinus } from 'lucide-react';
import { adminApi, type StaffUser, type AdminMeta } from '@/lib/admin-api';

type StaffFormState = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  status: string;
};

const emptyForm: StaffFormState = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  phone: '',
  role: 'doctor_admin',
  status: 'active',
};

const roles = ['doctor_admin', 'patient_admin', 'doctor', 'nurse_admin', 'nurse', 'lab_admin', 'lab_technician', 'ground_staff_admin', 'ground_staff', 'offline_patient', 'reception', 'admin'];
const addStaffRoles = ['doctor_admin', 'patient_admin', 'nurse_admin', 'lab_admin', 'ground_staff_admin', 'offline_patient', 'reception', 'admin'];

export default function StaffRolesPage() {
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [meta, setMeta] = useState<AdminMeta | null>(null);
  const [page, setPage] = useState(1);
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<StaffUser | null>(null);
  const [form, setForm] = useState<StaffFormState>(emptyForm);

  const loadUsers = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await adminApi.getUsers({
        page,
        limit: 12,
        role: role || undefined,
        status: status || undefined,
        search: search || undefined,
      });
      setUsers(res.data);
      setMeta(res.meta ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load staff data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page, role, status, search]);

  const counters = useMemo(
    () => ({
      doctors: users.filter((u) => u.role === 'doctor').length,
      doctorAdmins: users.filter((u) => u.role === 'doctor_admin').length,
      patientAdmins: users.filter((u) => u.role === 'patient_admin').length,
      nurseAdmins: users.filter((u) => u.role === 'nurse_admin').length,
      groundStaffAdmins: users.filter((u) => u.role === 'ground_staff_admin').length,
      nurses: users.filter((u) => u.role === 'nurse').length,
      lab: users.filter((u) => u.role === 'lab_technician').length,
      admins: users.filter((u) => u.role === 'admin').length,
    }),
    [users]
  );

  const save = async () => {
    try {
      if (!editing && !form.password.trim()) {
        setError('Password is required when creating a staff account.');
        return;
      }

      if (editing) {
        await adminApi.updateUser(editing.id, {
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone || undefined,
          status: form.status,
        });

        if (editing.role !== form.role) {
          await adminApi.assignRole(editing.id, form.role);
        }
      } else {
        await adminApi.createUser({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          password: form.password,
          phone: form.phone || undefined,
          role: form.role,
        });
      }

      setShow(false);
      setEditing(null);
      setForm(emptyForm);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save staff.');
    }
  };

  const deactivate = async (id: number) => {
    if (!window.confirm('Deactivate this user?')) return;
    await adminApi.deactivateUser(id);
    await loadUsers();
  };

  const removeUser = async (id: number, name: string) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    await adminApi.deleteUser(id);
    await loadUsers();
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-blue-600">Staff & Roles</p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">Staff Management</h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={loadUsers}
            className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>

          <button
            onClick={() => {
              setEditing(null);
              setForm(emptyForm);
              setShow(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm text-white"
          >
            <Plus className="h-4 w-4" />
            Add Staff
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[
          ['Doctor Admins', counters.doctorAdmins],
          ['Patient Admins', counters.patientAdmins],
          ['Nurse Admins', counters.nurseAdmins],
          ['Ground Admins', counters.groundStaffAdmins],
          ['Doctors', counters.doctors],
          ['Nurses', counters.nurses],
          ['Lab Techs', counters.lab],
          ['Admins', counters.admins],
        ].map(([key, value]) => (
          <div key={String(key)} className="rounded-xl border bg-white p-4">
            <p className="text-sm text-slate-500">{key}</p>
            <p className="text-2xl font-semibold">{value as number}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-3">
        <div className="relative md:col-span-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="w-full rounded-xl border px-10 py-2 text-sm"
            placeholder="Search"
          />
        </div>

        <select
          value={role}
          onChange={(e) => {
            setPage(1);
            setRole(e.target.value);
          }}
          className="rounded-xl border px-3 py-2 text-sm"
        >
          <option value="">All roles</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r.replaceAll('_', ' ')}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className="rounded-xl border px-3 py-2 text-sm"
        >
          <option value="">All status</option>
          <option value="active">active</option>
          <option value="inactive">inactive</option>
          <option value="suspended">suspended</option>
        </select>
      </div>

      <div className="rounded-xl border bg-white p-4">
        {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {users.map((u) => (
            <div key={u.id} className="rounded-xl border p-4">
              <p className="font-semibold">
                {u.first_name} {u.last_name}
              </p>
              <p className="text-sm text-slate-500">{u.email}</p>
              <p className="mt-2 text-xs">
                {u.role.replaceAll('_', ' ')} • {u.status}
              </p>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => {
                    setEditing(u);
                    setForm({
                      first_name: u.first_name,
                      last_name: u.last_name,
                      email: u.email,
                      password: '',
                      phone: u.phone ?? '',
                      role: u.role,
                      status: u.status,
                    });
                    setShow(true);
                  }}
                  className="rounded-lg border px-3 py-1.5 text-xs"
                >
                  Edit
                </button>

                <button
                  onClick={() => deactivate(u.id)}
                  className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800"
                >
                  <UserMinus className="h-3.5 w-3.5" />
                  Deactivate
                </button>
                <button
                  onClick={() => removeUser(u.id, `${u.first_name} ${u.last_name}`)}
                  className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {meta ? (
          <div className="mt-4 flex items-center justify-between text-sm">
            <span>
              Page {meta.page} of {meta.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={meta.page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded border px-2 py-1 disabled:opacity-50"
              >
                Prev
              </button>
              <button
                disabled={meta.page >= meta.totalPages}
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                className="rounded border px-2 py-1 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {show ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShow(false)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl bg-white p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold">{editing ? 'Edit Staff' : 'Add Staff'}</h2>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input
                value={form.first_name}
                onChange={(e) => setForm((s) => ({ ...s, first_name: e.target.value }))}
                placeholder="First name"
                className="rounded-xl border px-3 py-2 text-sm"
              />
              <input
                value={form.last_name}
                onChange={(e) => setForm((s) => ({ ...s, last_name: e.target.value }))}
                placeholder="Last name"
                className="rounded-xl border px-3 py-2 text-sm"
              />
              <input
                value={form.email}
                onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                placeholder="Email"
                className="rounded-xl border px-3 py-2 text-sm"
              />
              <input
                value={form.phone}
                onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                placeholder="Phone"
                className="rounded-xl border px-3 py-2 text-sm"
              />

              {!editing ? (
                <input
                  value={form.password}
                  onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
                  placeholder="Password"
                  type="password"
                  required
                  className="rounded-xl border px-3 py-2 text-sm md:col-span-2"
                />
              ) : null}

              <select
                value={form.role}
                onChange={(e) => setForm((s) => ({ ...s, role: e.target.value }))}
                className="rounded-xl border px-3 py-2 text-sm"
              >
                {(editing ? roles : addStaffRoles).map((r) => (
                  <option key={r} value={r}>
                    {r.replaceAll('_', ' ')}
                  </option>
                ))}
              </select>

              <select
                value={form.status}
                onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))}
                className="rounded-xl border px-3 py-2 text-sm"
              >
                <option value="active">active</option>
                <option value="inactive">inactive</option>
                <option value="suspended">suspended</option>
              </select>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShow(false)} className="rounded-lg border px-3 py-2 text-sm">
                Cancel
              </button>
              <button onClick={save} className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white">
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
