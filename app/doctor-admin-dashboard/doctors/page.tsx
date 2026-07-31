'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Edit3, Eye, Plus, RefreshCw, Search, Stethoscope, UserCheck, UserX, X } from 'lucide-react';
import { api } from '@/lib/api-client';
import { doctorAdminApi, type DoctorAdminDoctor, type DoctorAdminPatient, type DoctorPayload } from '@/lib/doctor-admin-api';
import type { Department } from '@/lib/admin-api';

type FormState = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended';
  specialization: string;
  qualification: string;
  license_number: string;
  years_of_experience: string;
  consultation_fee: string;
  available_days: string;
  available_time_start: string;
  available_time_end: string;
  department_ids: string[];
  bio: string;
};

const emptyForm: FormState = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  phone: '',
  status: 'active',
  specialization: '',
  qualification: '',
  license_number: '',
  years_of_experience: '',
  consultation_fee: '',
  available_days: '',
  available_time_start: '',
  available_time_end: '',
  department_ids: [],
  bio: '',
};

const toForm = (doctor: DoctorAdminDoctor): FormState => ({
  first_name: doctor.first_name || '',
  last_name: doctor.last_name || '',
  email: doctor.email || '',
  password: '',
  phone: doctor.phone || '',
  status: doctor.status || 'active',
  specialization: doctor.specialization || '',
  qualification: doctor.qualification || '',
  license_number: doctor.license_number || '',
  years_of_experience: doctor.years_of_experience == null ? '' : String(doctor.years_of_experience),
  consultation_fee: doctor.consultation_fee == null ? '' : String(doctor.consultation_fee),
  available_days: doctor.available_days || '',
  available_time_start: doctor.available_time_start ? String(doctor.available_time_start).slice(0, 5) : '',
  available_time_end: doctor.available_time_end ? String(doctor.available_time_end).slice(0, 5) : '',
  department_ids: [],
  bio: doctor.bio || '',
});

const toPayload = (form: FormState): DoctorPayload => ({
  first_name: form.first_name.trim(),
  last_name: form.last_name.trim(),
  email: form.email.trim().toLowerCase(),
  password: form.password || undefined,
  phone: form.phone.trim() || undefined,
  status: form.status,
  specialization: form.specialization.trim() || undefined,
  qualification: form.qualification.trim() || undefined,
  license_number: form.license_number.trim() || undefined,
  years_of_experience: form.years_of_experience ? Number(form.years_of_experience) : null,
  consultation_fee: form.consultation_fee ? Number(form.consultation_fee) : null,
  available_days: form.available_days.trim() || undefined,
  available_time_start: form.available_time_start || undefined,
  available_time_end: form.available_time_end || undefined,
  department_ids: form.department_ids.map(Number),
  bio: form.bio.trim() || undefined,
});

const statusClass = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  inactive: 'bg-slate-100 text-slate-700 border-slate-200',
  suspended: 'bg-red-50 text-red-700 border-red-200',
};

export default function DoctorAdminDoctorsPage() {
  const [doctors, setDoctors] = useState<DoctorAdminDoctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [patients, setPatients] = useState<DoctorAdminPatient[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<DoctorAdminDoctor | null>(null);
  const [viewing, setViewing] = useState<DoctorAdminDoctor | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [doctorRows, deptResponse] = await Promise.all([
        doctorAdminApi.getDoctors({ search, status }),
        api.get<Department[]>('/departments'),
      ]);
      setDoctors(doctorRows);
      setDepartments((deptResponse.data ?? []) as Department[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load doctors.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => doctors, [doctors]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (doctor: DoctorAdminDoctor) => {
    setEditing(doctor);
    setForm(toForm(doctor));
    setFormOpen(true);
  };

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = toPayload(form);
      if (editing) {
        await doctorAdminApi.updateDoctor(editing.user_id, payload);
      } else {
        await doctorAdminApi.createDoctor(payload);
      }
      setFormOpen(false);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save doctor.');
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (doctor: DoctorAdminDoctor, nextStatus: 'active' | 'inactive') => {
    await doctorAdminApi.updateDoctorStatus(doctor.user_id, nextStatus);
    await load();
  };

  const viewPatients = async (doctor: DoctorAdminDoctor) => {
    setViewing(doctor);
    setPatients([]);
    try {
      setPatients(await doctorAdminApi.getDoctorPatients(doctor.doctor_profile_id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load assigned patients.');
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">Doctors</h1>
          <p className="mt-1 text-sm text-slate-600">Add doctors, update profiles, toggle active status, and inspect assigned patient details.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
          <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
            <Plus className="h-4 w-4" /> Add Doctor
          </button>
        </div>
      </div>

      {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-3 border-b border-slate-200 p-4 lg:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, or specialization" className="w-full rounded-lg border border-slate-200 px-9 py-2 text-sm text-slate-900 outline-none focus:border-blue-500" />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500">
            <option value="">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          <button onClick={load} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Apply</button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Doctor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Specialization</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Schedule</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Patients</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((doctor) => (
                <tr key={doctor.doctor_profile_id}>
                  <td className="px-4 py-4">
                    <p className="font-medium text-slate-950">Dr. {doctor.first_name} {doctor.last_name}</p>
                    <p className="text-sm text-slate-500">{doctor.email}</p>
                    <p className="text-xs text-slate-500">{doctor.phone || 'No phone'}</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    <p>{doctor.specialization || 'General Medicine'}</p>
                    <p className="text-xs text-slate-500">{doctor.qualification || 'No qualification'} · {doctor.years_of_experience ?? 0} yrs</p>
                    <p className="text-xs text-slate-500">{doctor.departments || 'No department'}</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    <p>{doctor.available_days || 'Not set'}</p>
                    <p className="text-xs text-slate-500">{doctor.available_time_start ? String(doctor.available_time_start).slice(0, 5) : '--'} - {doctor.available_time_end ? String(doctor.available_time_end).slice(0, 5) : '--'}</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    <button onClick={() => viewPatients(doctor)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                      <Eye className="h-3.5 w-3.5" /> {doctor.assigned_patients_count} assigned
                    </button>
                    <p className="mt-1 text-xs text-slate-500">{doctor.upcoming_appointments_count} upcoming</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusClass[doctor.status]}`}>{doctor.status}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(doctor)} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50" title="Edit doctor"><Edit3 className="h-4 w-4" /></button>
                      {doctor.status === 'active' ? (
                        <button onClick={() => changeStatus(doctor, 'inactive')} className="rounded-lg border border-amber-200 bg-amber-50 p-2 text-amber-700" title="Set inactive"><UserX className="h-4 w-4" /></button>
                      ) : (
                        <button onClick={() => changeStatus(doctor, 'active')} className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-700" title="Set active"><UserCheck className="h-4 w-4" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filtered.length === 0 ? <p className="p-6 text-sm text-slate-500">No doctors found.</p> : null}
          {loading ? <p className="p-6 text-sm text-slate-500">Loading doctors...</p> : null}
        </div>
      </section>

      {formOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-lg font-semibold text-slate-950">{editing ? 'Edit Doctor' : 'Add Doctor'}</h2>
              <button onClick={() => setFormOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid gap-4 p-5 md:grid-cols-2">
              <Input label="First name" value={form.first_name} onChange={(value) => setForm((s) => ({ ...s, first_name: value }))} />
              <Input label="Last name" value={form.last_name} onChange={(value) => setForm((s) => ({ ...s, last_name: value }))} />
              <Input label="Email" value={form.email} onChange={(value) => setForm((s) => ({ ...s, email: value }))} type="email" />
              <Input label={editing ? 'Password unchanged' : 'Temporary password'} value={form.password} onChange={(value) => setForm((s) => ({ ...s, password: value }))} type="password" disabled={!!editing} />
              <Input label="Phone" value={form.phone} onChange={(value) => setForm((s) => ({ ...s, phone: value }))} />
              <label className="space-y-1 text-sm font-medium text-slate-700">Status<select value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as FormState['status'] }))} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900"><option value="active">active</option><option value="inactive">inactive</option><option value="suspended">suspended</option></select></label>
              <Input label="Specialization" value={form.specialization} onChange={(value) => setForm((s) => ({ ...s, specialization: value }))} />
              <Input label="Qualification" value={form.qualification} onChange={(value) => setForm((s) => ({ ...s, qualification: value }))} />
              <Input label="License number" value={form.license_number} onChange={(value) => setForm((s) => ({ ...s, license_number: value }))} />
              <Input label="Years of experience" value={form.years_of_experience} onChange={(value) => setForm((s) => ({ ...s, years_of_experience: value }))} type="number" />
              <Input label="Consultation fee" value={form.consultation_fee} onChange={(value) => setForm((s) => ({ ...s, consultation_fee: value }))} type="number" />
              <Input label="Available days" value={form.available_days} onChange={(value) => setForm((s) => ({ ...s, available_days: value }))} placeholder="Mon,Tue,Wed" />
              <Input label="Start time" value={form.available_time_start} onChange={(value) => setForm((s) => ({ ...s, available_time_start: value }))} type="time" />
              <Input label="End time" value={form.available_time_end} onChange={(value) => setForm((s) => ({ ...s, available_time_end: value }))} type="time" />
              <label className="space-y-1 text-sm font-medium text-slate-700 md:col-span-2">Departments<select multiple value={form.department_ids} onChange={(e) => setForm((s) => ({ ...s, department_ids: Array.from(e.target.selectedOptions).map((o) => o.value) }))} className="min-h-28 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900">{departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}</select></label>
              <label className="space-y-1 text-sm font-medium text-slate-700 md:col-span-2">Bio<textarea value={form.bio} onChange={(e) => setForm((s) => ({ ...s, bio: e.target.value }))} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900" /></label>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
              <button onClick={() => setFormOpen(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
              <button onClick={save} disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">{saving ? 'Saving...' : 'Save Doctor'}</button>
            </div>
          </div>
        </div>
      ) : null}

      {viewing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40">
          <aside className="h-full w-full max-w-xl overflow-y-auto bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="font-semibold text-slate-950">Assigned Patients</h2>
                <p className="text-sm text-slate-500">Dr. {viewing.first_name} {viewing.last_name}</p>
              </div>
              <button onClick={() => setViewing(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X className="h-4 w-4" /></button>
            </div>
            <div className="divide-y divide-slate-100">
              {patients.map((patient) => (
                <div key={patient.id} className="p-5">
                  <p className="font-medium text-slate-950">{patient.first_name} {patient.last_name}</p>
                  <p className="text-sm text-slate-500">{patient.registration_no} · {patient.email}</p>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <Info label="Phone" value={patient.phone || '-'} />
                    <Info label="Blood" value={patient.blood_type || '-'} />
                    <Info label="Status" value={patient.registration_status} />
                    <Info label="Visits" value={patient.appointments_count} />
                    <Info label="Last visit" value={patient.last_appointment_date || '-'} />
                    <Info label="Next visit" value={patient.next_appointment_date || '-'} />
                  </div>
                </div>
              ))}
              {patients.length === 0 ? <p className="p-5 text-sm text-slate-500">No assigned patients found.</p> : null}
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}

function Input({ label, value, onChange, type = 'text', placeholder, disabled = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string; disabled?: boolean }) {
  return (
    <label className="space-y-1 text-sm font-medium text-slate-700">
      {label}
      <input disabled={disabled} type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 disabled:bg-slate-100" />
    </label>
  );
}

function Info({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-sm text-slate-900">{value}</p>
    </div>
  );
}

