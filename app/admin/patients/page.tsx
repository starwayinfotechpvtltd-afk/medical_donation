'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock3, Eye, RefreshCw, Search, Trash2, UserMinus, UserX } from 'lucide-react';
import { adminApi, type AdminPatient, type AdminPatientDetail } from '@/lib/admin-api';

export default function AdminPatientsPage() {
  const [patients, setPatients] = useState<AdminPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected' | ''>('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<AdminPatient | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<AdminPatientDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadPatients = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminApi.getPatients(status || undefined);
      setPatients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load patients.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, [status]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter((p) =>
      `${p.first_name} ${p.last_name}`.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      (p.phone || '').toLowerCase().includes(q)
    );
  }, [patients, search]);

  const counters = useMemo(() => {
    return {
      total: patients.length,
      pending: patients.filter((p) => p.registration_status === 'pending').length,
      approved: patients.filter((p) => p.registration_status === 'approved').length,
      rejected: patients.filter((p) => p.registration_status === 'rejected').length,
    };
  }, [patients]);

  const approve = async (patient: AdminPatient) => {
    if (!window.confirm(`Approve ${patient.first_name} ${patient.last_name}?`)) return;
    setSubmitting(true);
    try {
      await adminApi.approvePatient(patient.id);
      await loadPatients();
      if (selected?.id === patient.id) {
        setSelected((prev) => (prev ? { ...prev, registration_status: 'approved', dashboard_enabled: 1 } : prev));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve patient.');
    } finally {
      setSubmitting(false);
    }
  };

  const reject = async (patient: AdminPatient) => {
    if (!rejectReason.trim()) {
      setError('Rejection reason is required.');
      return;
    }

    setSubmitting(true);
    try {
      await adminApi.rejectPatient(patient.id, rejectReason.trim());
      setRejectReason('');
      await loadPatients();
      if (selected?.id === patient.id) {
        setSelected((prev) => (prev ? { ...prev, registration_status: 'rejected', dashboard_enabled: 0 } : prev));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject patient.');
    } finally {
      setSubmitting(false);
    }
  };

  const deactivate = async (patient: AdminPatient) => {
    if (!window.confirm(`Deactivate ${patient.first_name} ${patient.last_name}?`)) return;
    setSubmitting(true);
    try {
      await adminApi.deactivatePatient(patient.id);
      await loadPatients();
      if (selected?.id === patient.id) {
        setSelected((prev) => (prev ? { ...prev, registration_status: 'suspended', dashboard_enabled: 0 } : prev));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deactivate patient.');
    } finally {
      setSubmitting(false);
    }
  };

  const removePatient = async (patient: AdminPatient) => {
    if (!window.confirm(`Delete ${patient.first_name} ${patient.last_name}? This cannot be undone.`)) return;
    setSubmitting(true);
    try {
      await adminApi.deletePatient(patient.id);
      setSelected((prev) => (prev?.id === patient.id ? null : prev));
      setSelectedDetail((prev) => (prev?.id === patient.id ? null : prev));
      await loadPatients();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete patient.');
    } finally {
      setSubmitting(false);
    }
  };

  const openDetail = async (patient: AdminPatient) => {
    setSelected(patient);
    setSelectedDetail(null);
    setDetailLoading(true);
    setError('');
    try {
      const detail = await adminApi.getPatientDetail(patient.id);
      setSelectedDetail(detail);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load patient details.');
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">Patient Approvals</p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">Registration Lifecycle</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-500">
            This page is fully migrated to `/admin/patients` and approval routes. It no longer uses old user-based patient create/edit flows.
          </p>
        </div>
        <button onClick={loadPatients} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total" value={counters.total} />
        <Stat label="Pending" value={counters.pending} />
        <Stat label="Approved" value={counters.approved} />
        <Stat label="Rejected" value={counters.rejected} />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1.2fr,0.8fr]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email, or phone"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-3 text-sm outline-none focus:border-blue-400"
            />
          </div>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as 'pending' | 'approved' | 'rejected' | '')}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
          >
            <option value="">All statuses</option>
            <option value="pending">pending</option>
            <option value="approved">approved</option>
            <option value="rejected">rejected</option>
          </select>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        {loading ? <p className="text-sm text-slate-500">Loading patients...</p> : null}
        {error ? <p className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</p> : null}

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((patient) => (
            <div key={patient.id} className="rounded-xl border border-slate-100 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{patient.first_name} {patient.last_name}</p>
                  <p className="text-sm text-slate-500">{patient.email}</p>
                </div>
                <StatusBadge status={patient.registration_status} />
              </div>

              <p className="mt-2 text-xs text-slate-600">Phone: {patient.phone || '-'}</p>
              <p className="text-xs text-slate-600">Dashboard: {patient.dashboard_enabled ? 'enabled' : 'locked'}</p>
              <p className="text-xs text-slate-500">Registered: {new Date(patient.created_at).toLocaleString()}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={() => openDetail(patient)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700">
                  <Eye className="h-3.5 w-3.5" />View
                </button>
                <button disabled={submitting} onClick={() => deactivate(patient)} className="inline-flex items-center gap-1 rounded-lg border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-700 disabled:opacity-50">
                  <UserMinus className="h-3.5 w-3.5" />Deactivate
                </button>
                <button disabled={submitting} onClick={() => removePatient(patient)} className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 disabled:opacity-50">
                  <Trash2 className="h-3.5 w-3.5" />Delete
                </button>
                {(patient.registration_status === 'pending' || patient.registration_status === 'rejected') ? (
                  <button disabled={submitting} onClick={() => approve(patient)} className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-700 disabled:opacity-50">
                    <CheckCircle2 className="h-3.5 w-3.5" />Approve
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelected(null)}>
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-blue-600">Patient Detail</p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900">{selected.first_name} {selected.last_name}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs">Close</button>
            </div>

            {detailLoading ? <p className="mt-4 text-sm text-slate-500">Loading full patient details...</p> : null}
            <div className="mt-4 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
              <p>Email: {selectedDetail?.email || selected.email}</p>
              <p>Phone: {selectedDetail?.phone || selected.phone || '-'}</p>
              <p>Status: <strong>{selectedDetail?.registration_status || selected.registration_status}</strong></p>
              <p>Dashboard: <strong>{(selectedDetail?.dashboard_enabled ?? selected.dashboard_enabled) ? 'enabled' : 'locked'}</strong></p>
              <p>DOB: {selectedDetail?.date_of_birth ? new Date(selectedDetail.date_of_birth).toLocaleDateString() : '-'}</p>
              <p>Blood Group: {selectedDetail?.blood_type || '-'}</p>
              <p>Gender: {selectedDetail?.gender || '-'}</p>
              <p>Emergency Contact: {selectedDetail?.emergency_contact || '-'}</p>
              <p className="md:col-span-2">Address: {[selectedDetail?.address, selectedDetail?.city, selectedDetail?.state, selectedDetail?.country].filter(Boolean).join(', ') || '-'}</p>
              <p className="md:col-span-2">Chronic Conditions: {selectedDetail?.chronic_conditions || '-'}</p>
              <p className="md:col-span-2">Allergies: {selectedDetail?.allergies || '-'}</p>
            </div>

            {selectedDetail ? (
              <>
                <div className="mt-4 rounded-xl border border-slate-200 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Doctor Timeline / Appointments</p>
                  <div className="mt-2 space-y-2">
                    {selectedDetail.appointments.length === 0 ? <p className="text-xs text-slate-500">No appointments found.</p> : selectedDetail.appointments.map((appt, index) => (
                      <div key={`${String(appt.id)}-${index}`} className="rounded-lg border border-slate-100 p-2 text-xs text-slate-700">
                        <p>Doctor: {String(appt.doctor_first_name || '')} {String(appt.doctor_last_name || '')} ({String(appt.doctor_specialization || 'N/A')})</p>
                        <p>Department: {String(appt.department_name || '-')}</p>
                        <p>Timeline: {String(appt.status || '-')} | Next appointment: {appt.scheduled_date ? new Date(String(appt.scheduled_date)).toLocaleDateString() : '-'} {String(appt.scheduled_time || '')}</p>
                        <p>Discharge: {String(appt.status) === 'completed' ? 'Discharged' : 'Not discharged'}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Prescriptions</p>
                  <div className="mt-2 space-y-2">
                    {selectedDetail.prescriptions.length === 0 ? <p className="text-xs text-slate-500">No prescriptions found.</p> : selectedDetail.prescriptions.map((rx, index) => (
                      <div key={`${String(rx.id)}-${index}`} className="rounded-lg border border-slate-100 p-2 text-xs text-slate-700">
                        <p>Date: {rx.date_issued ? new Date(String(rx.date_issued)).toLocaleDateString() : '-'}</p>
                        <p>Doctor: {String(rx.doctor_first_name || '')} {String(rx.doctor_last_name || '')}</p>
                        <p>Notes: {String(rx.notes || '-')}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Lab Reports</p>
                  <div className="mt-2 space-y-2">
                    {selectedDetail.lab_tests.length === 0 ? <p className="text-xs text-slate-500">No lab reports found.</p> : selectedDetail.lab_tests.map((lab, index) => (
                      <div key={`${String(lab.id)}-${index}-${String(lab.result_id || 'no-result')}`} className="rounded-lg border border-slate-100 p-2 text-xs text-slate-700">
                        <p>Test: {String(lab.test_name || '-')} ({String(lab.status || '-')})</p>
                        <p>Requested: {lab.request_date ? new Date(String(lab.request_date)).toLocaleDateString() : '-'}</p>
                        <p>Doctor: {String(lab.doctor_first_name || '')} {String(lab.doctor_last_name || '')}</p>
                        <p>Result: {String(lab.parameter || '-')} {String(lab.value || '')} {String(lab.unit || '')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : null}

            {selected.registration_status === 'pending' ? (
              <div className="mt-4 space-y-2 rounded-xl border border-slate-200 p-3">
                <p className="text-xs font-medium text-slate-600">Reject with reason</p>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Reason for rejection"
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
                <div className="flex gap-2">
                  <button disabled={submitting} onClick={() => approve(selected)} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white disabled:opacity-50">Approve</button>
                  <button disabled={submitting} onClick={() => reject(selected)} className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 disabled:opacity-50"><UserX className="h-3.5 w-3.5" />Reject</button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'approved') return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" />approved</span>;
  if (status === 'pending') return <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700"><Clock3 className="h-3.5 w-3.5" />pending</span>;
  return <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700"><UserX className="h-3.5 w-3.5" />rejected</span>;
}
