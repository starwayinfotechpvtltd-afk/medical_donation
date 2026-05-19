'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Clock, FileText, Search, User, X, FlaskConical, PlusCircle } from 'lucide-react';
import { api, ApiException } from '@/lib/api-client';

type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

interface Appointment {
  id: number;
  patient_id: number;
  patient_registration_no?: string | null;
  patient_first_name: string;
  patient_last_name: string;
  patient_email?: string | null;
  patient_phone?: string | null;
  patient_blood_type?: string | null;
  patient_date_of_birth?: string | null;
  patient_gender?: string | null;
  patient_address?: string | null;
  patient_city?: string | null;
  patient_state?: string | null;
  patient_country?: string | null;
  patient_chronic_conditions?: string | null;
  patient_emergency_contact?: string | null;
  patient_emergency_phone?: string | null;
  patient_emergency_address?: string | null;
  scheduled_date: string;
  scheduled_time: string;
  status: AppointmentStatus;
  reason?: string | null;
}

interface PatientCardData {
  id: number;
  registration_no?: string | null;
  name: string;
  email?: string | null;
  phone?: string | null;
  blood_type?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  address?: string | null;
  chronic_conditions?: string | null;
  emergency_contact?: string | null;
  emergency_phone?: string | null;
  emergency_address?: string | null;
  latestAppointmentId: number;
  latestAppointmentDate: string;
  latestAppointmentTime: string;
  latestStatus: AppointmentStatus;
  visitsCount: number;
  pendingCount: number;
  recentReason: string;
}

function statusClasses(status: AppointmentStatus) {
  if (status === 'confirmed') return 'bg-emerald-100 text-emerald-700';
  if (status === 'in_progress') return 'bg-blue-100 text-blue-700';
  if (status === 'completed') return 'bg-indigo-100 text-indigo-700';
  if (status === 'pending') return 'bg-amber-100 text-amber-700';
  return 'bg-red-100 text-red-700';
}

export default function DoctorPatientsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientCardData | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<Appointment[]>('/appointments');
        setAppointments((res.data ?? []) as Appointment[]);
      } catch (err) {
        setError(err instanceof ApiException ? err.message : 'Failed to load patient data.');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const patients = useMemo(() => {
    const approvedStatuses = new Set<AppointmentStatus>(['confirmed', 'in_progress', 'completed']);
    const hasApprovedByPatientId = new Set<number>(
      appointments.filter((a) => approvedStatuses.has(a.status)).map((a) => a.patient_id)
    );
    const map = new Map<number, PatientCardData>();
    for (const item of appointments) {
      if (!hasApprovedByPatientId.has(item.patient_id)) continue;
      const name = `${item.patient_first_name} ${item.patient_last_name}`;
      const existing = map.get(item.patient_id);
      if (!existing) {
        map.set(item.patient_id, {
          id: item.patient_id,
          registration_no: item.patient_registration_no || null,
          name,
          email: item.patient_email || null,
          phone: item.patient_phone || null,
          blood_type: item.patient_blood_type || null,
          date_of_birth: item.patient_date_of_birth || null,
          gender: item.patient_gender || null,
          address: [item.patient_address, item.patient_city, item.patient_state, item.patient_country].filter(Boolean).join(', ') || null,
          chronic_conditions: item.patient_chronic_conditions || null,
          emergency_contact: item.patient_emergency_contact || null,
          emergency_phone: item.patient_emergency_phone || null,
          emergency_address: item.patient_emergency_address || null,
          latestAppointmentId: item.id,
          latestAppointmentDate: item.scheduled_date,
          latestAppointmentTime: item.scheduled_time,
          latestStatus: item.status,
          visitsCount: 1,
          pendingCount: item.status === 'pending' ? 1 : 0,
          recentReason: item.reason || '-',
        });
        continue;
      }

      existing.visitsCount += 1;
      if (item.status === 'pending') existing.pendingCount += 1;

      const existingKey = `${existing.latestAppointmentDate}T${existing.latestAppointmentTime}`;
      const currentKey = `${item.scheduled_date}T${item.scheduled_time}`;
      if (currentKey > existingKey) {
        existing.latestAppointmentDate = item.scheduled_date;
        existing.latestAppointmentTime = item.scheduled_time;
        existing.latestStatus = item.status;
        existing.latestAppointmentId = item.id;
        existing.recentReason = item.reason || '-';
      }
    }
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [appointments]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return patients.filter((p) => {
      const matchText = !q || p.name.toLowerCase().includes(q) || String(p.id).includes(q);
      const matchDate = !dateFilter || p.latestAppointmentDate === dateFilter;
      return matchText && matchDate;
    });
  }, [patients, query, dateFilter]);

  const stats = useMemo(
    () => ({
      total: patients.length,
      withPending: patients.filter((p) => p.pendingCount > 0).length,
      totalPending: patients.reduce((sum, p) => sum + p.pendingCount, 0),
      totalVisits: patients.reduce((sum, p) => sum + p.visitsCount, 0),
    }),
    [patients]
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900">Patients</h1>
        <p className="text-sm text-slate-500">Patient roster derived from your appointment workflow.</p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">Patients</p><p className="text-2xl font-bold">{stats.total}</p></div>
        <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">Patients With Pending</p><p className="text-2xl font-bold text-amber-600">{stats.withPending}</p></div>
        <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">Pending Requests</p><p className="text-2xl font-bold text-amber-600">{stats.totalPending}</p></div>
        <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">Total Visits</p><p className="text-2xl font-bold text-blue-700">{stats.totalVisits}</p></div>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patient by name or id"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {!loading &&
          filtered.map((patient) => (
            <article key={patient.id} onClick={() => setSelectedPatient(patient)} className="cursor-pointer rounded-xl border border-slate-100 bg-white p-4 transition hover:border-blue-200 hover:shadow-sm">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-blue-100 p-2 text-blue-700"><User className="h-4 w-4" /></div>
                  <div>
                    <h2 className="font-semibold text-slate-900">{patient.name}</h2>
                    <p className="text-xs text-slate-500">Patient #{patient.id} {patient.registration_no ? `| ${patient.registration_no}` : ''}</p>
                  </div>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusClasses(patient.latestStatus)}`}>{patient.latestStatus}</span>
              </div>
              <p className="line-clamp-2 text-sm text-slate-600">{patient.recentReason}</p>
              <div className="mt-4 space-y-1 text-xs text-slate-500">
                <p className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Latest: {patient.latestAppointmentDate} {patient.latestAppointmentTime}</p>
                <p>Visits: {patient.visitsCount}</p>
                <p>Pending approvals: {patient.pendingCount}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <Link href={`/doctor/patient-history?patientId=${patient.id}`} className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
                  <FileText className="h-3.5 w-3.5" />
                  History
                </Link>
                <Link href={`/doctor/prescriptions?patientId=${patient.id}`} className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white">
                  View prescriptions
                </Link>
              </div>
            </article>
          ))}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="rounded-xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-500">No matching patients found.</div>
      )}

      {loading && (
        <div className="rounded-xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-500">
          <span className="inline-flex items-center gap-2"><AlertCircle className="h-4 w-4 animate-pulse" /> Loading patient list...</span>
        </div>
      )}

      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{selectedPatient.name}</h3>
                <p className="text-xs text-slate-500">Patient #{selectedPatient.id} {selectedPatient.registration_no ? `| ${selectedPatient.registration_no}` : ''}</p>
              </div>
              <button onClick={() => setSelectedPatient(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-5 px-5 py-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <p className="text-sm text-slate-700"><span className="font-semibold">Email:</span> {selectedPatient.email || '-'}</p>
                <p className="text-sm text-slate-700"><span className="font-semibold">Phone:</span> {selectedPatient.phone || '-'}</p>
                <p className="text-sm text-slate-700"><span className="font-semibold">Blood Group:</span> {selectedPatient.blood_type || '-'}</p>
                <p className="text-sm text-slate-700"><span className="font-semibold">DOB:</span> {selectedPatient.date_of_birth || '-'}</p>
                <p className="text-sm text-slate-700"><span className="font-semibold">Gender:</span> {selectedPatient.gender || '-'}</p>
                <p className="text-sm text-slate-700"><span className="font-semibold">Address:</span> {selectedPatient.address || '-'}</p>
                <p className="text-sm text-slate-700"><span className="font-semibold">Chronic Conditions:</span> {selectedPatient.chronic_conditions || '-'}</p>
                <p className="text-sm text-slate-700"><span className="font-semibold">Emergency Contact:</span> {selectedPatient.emergency_contact || '-'}</p>
                <p className="text-sm text-slate-700"><span className="font-semibold">Emergency Phone:</span> {selectedPatient.emergency_phone || '-'}</p>
                <p className="text-sm text-slate-700"><span className="font-semibold">Emergency Address:</span> {selectedPatient.emergency_address || '-'}</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Quick Actions</p>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  <Link href={`/doctor/patient-history?patientId=${selectedPatient.id}`} className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-700 border border-slate-200">
                    <FileText className="h-3.5 w-3.5" /> History
                  </Link>
                  <Link href={`/doctor/prescriptions?patientRegNo=${encodeURIComponent(selectedPatient.registration_no || '')}`} className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-700 border border-slate-200">
                    <FileText className="h-3.5 w-3.5" /> View Prescriptions
                  </Link>
                  <Link href={`/doctor/prescriptions?patientRegNo=${encodeURIComponent(selectedPatient.registration_no || '')}&action=create`} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white">
                    <PlusCircle className="h-3.5 w-3.5" /> Create Prescription
                  </Link>
                  <Link href={`/doctor/lab-tests?patientRegNo=${encodeURIComponent(selectedPatient.registration_no || '')}&appointmentId=${selectedPatient.latestAppointmentId}&action=create`} className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-700 border border-slate-200">
                    <PlusCircle className="h-3.5 w-3.5" /> Create Lab Report
                  </Link>
                  <Link href={`/doctor/lab-tests?patientRegNo=${encodeURIComponent(selectedPatient.registration_no || '')}&appointmentId=${selectedPatient.latestAppointmentId}`} className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-700 border border-slate-200">
                    <FlaskConical className="h-3.5 w-3.5" /> View Lab Reports
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
