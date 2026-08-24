'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, Copy, Mail, Plus, RefreshCw, Search, Send, Trash2, UserMinus, X } from 'lucide-react';
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

/** Maps each role to its dedicated login URL path */
const LOGIN_URLS: Record<string, string> = {
  admin:              '/adminLogin',
  doctor:             '/doctorLogin',
  doctor_admin:       '/doctor-admin-dashboardLogin',
  patient_admin:      '/patient-admin-dashboardLogin',
  nurse:              '/nurseLogin',
  nurse_admin:        '/nurse-admin-dashboardLogin',
  lab_technician:     '/labtechLogin',
  lab_admin:          '/lab-admin-dashboardLogin',
  offline_patient:    '/offline-patient-dashboardLogin',
  reception:          '/reception-dashboardLogin',
  ground_staff:       '/ground-staff-dashboardLogin',
  ground_staff_admin: '/ground-staff-dashboardLogin',
};

/** Roles that are considered "super admin" — cannot be shared via email invite */
const SUPER_ADMIN_ROLES = new Set(['admin']);

function getLoginUrl(role: string): string {
  const path = LOGIN_URLS[role] ?? '/adminLogin';
  if (typeof window !== 'undefined') return `${window.location.origin}${path}`;
  return path;
}

// ── Minimal Toast ─────────────────────────────────────────────────────────────

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: number) => void;
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium shadow-lg transition-all duration-300 ${
            t.type === 'success' ? 'bg-emerald-600 text-white' :
            t.type === 'error'   ? 'bg-red-600 text-white' :
                                   'bg-slate-800 text-white'
          }`}
        >
          {t.type === 'success' && <Check className="h-4 w-4 shrink-0" />}
          {t.type === 'error'   && <X className="h-4 w-4 shrink-0" />}
          {t.type === 'info'    && <Copy className="h-4 w-4 shrink-0" />}
          <span>{t.message}</span>
          <button onClick={() => onRemove(t.id)} className="ml-1 opacity-70 hover:opacity-100">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const addToast = useCallback((message: string, type: ToastType = 'success', duration = 3000) => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}

// ── Invite Modal ─────────────────────────────────────────────────────────────

interface InviteModalProps {
  user: StaffUser;
  onClose: () => void;
  onToast: (message: string, type: ToastType) => void;
}

function InviteModal({ user, onClose, onToast }: InviteModalProps) {
  const loginUrl = getLoginUrl(user.role);
  const roleName = user.role.replaceAll('_', ' ');
  const [sending, setSending] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(loginUrl);
      onToast('Login link copied to clipboard!', 'info');
    } catch {
      onToast('Failed to copy. Please copy the link manually.', 'error');
    }
  };

  const handleSendEmail = async () => {
    setSending(true);
    try {
      await adminApi.sendInvite(user.id);
      onToast(`Invite email sent to ${user.email}`, 'success');
      onClose();
    } catch (err) {
      onToast(err instanceof Error ? err.message : 'Failed to send email. Check server mail config.', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Send Login Invite</h2>
              <p className="text-xs text-slate-500">{user.first_name} {user.last_name} · {roleName}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-6 py-5">
          {/* Email preview card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 space-y-2 font-mono">
            <div>
              <span className="not-italic font-sans text-slate-400 text-xs uppercase tracking-wide font-semibold">To</span>
              <p className="mt-0.5">{user.email}</p>
            </div>
            <div>
              <span className="not-italic font-sans text-slate-400 text-xs uppercase tracking-wide font-semibold">Subject</span>
              <p className="mt-0.5">Your Login Credentials — {roleName} Portal</p>
            </div>
            <div>
              <span className="not-italic font-sans text-slate-400 text-xs uppercase tracking-wide font-semibold">Login Portal Link</span>
              <a
                href={loginUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 block break-all text-blue-600 hover:underline not-italic"
              >
                {loginUrl}
              </a>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Clicking <strong>Send Email</strong> will send this invite directly to the staff member from the server. 
            They will receive their login portal link and instructions to set up their password.
          </p>

          {/* Copy link */}
          <button
            onClick={() => void handleCopyLink()}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Copy className="h-4 w-4" />
            Copy Login Link
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-slate-200 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => void handleSendEmail()}
            disabled={sending}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition"
          >
            <Send className="h-4 w-4" />
            {sending ? 'Sending…' : 'Send Email'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

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
  const [inviteUser, setInviteUser] = useState<StaffUser | null>(null);

  const { toasts, addToast, removeToast } = useToast();

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
          <p className="text-sm font-medium text-blue-600">Staff &amp; Roles</p>
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
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold truncate">
                    {u.first_name} {u.last_name}
                  </p>
                  <p className="text-sm text-slate-500 truncate">{u.email}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {u.role.replaceAll('_', ' ')} &bull; {u.status}
                  </p>
                </div>

                {/* Send Login Invite — hidden for super admin */}
                {!SUPER_ADMIN_ROLES.has(u.role) && (
                  <button
                    onClick={() => setInviteUser(u)}
                    title="Send login invite email"
                    className="shrink-0 inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Invite
                  </button>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
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

      {/* Add / Edit Modal */}
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

      {/* Login Invite Modal */}
      {inviteUser ? (
        <InviteModal
          user={inviteUser}
          onClose={() => setInviteUser(null)}
          onToast={addToast}
        />
      ) : null}

      {/* Global Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
