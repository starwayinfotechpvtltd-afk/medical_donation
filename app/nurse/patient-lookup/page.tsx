'use client';

import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Phone, RefreshCw, Search, User } from 'lucide-react';
import { NurseSidebar } from '@/components/NurseSidebar';
import { nurseApi, type AssignedPatient, type PatientDetail } from '@/lib/nurse-api';

const fmtDate = (value?: string | null) => (value ? String(value).slice(0, 10) : '-');
const fmtTime = (value?: string | null) => (value ? String(value).slice(0, 5) : '-');

export default function PatientLookupPage() {
  const [patients, setPatients] = useState<AssignedPatient[]>([]);
  const [selected, setSelected] = useState<PatientDetail | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const rows = await nurseApi.getAssignedPatients();
      setPatients(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load assigned patients.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return patients;
    return patients.filter((patient) =>
      `${patient.first_name} ${patient.last_name} ${patient.registration_no || ''} ${patient.phone || ''}`
        .toLowerCase()
        .includes(term)
    );
  }, [patients, search]);

  const openPatient = async (patientId: number) => {
    setError('');
    try {
      setSelected(await nurseApi.getPatientDetail(patientId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load patient details.');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <NurseSidebar />
      <main className="ml-64 flex-1 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">Assigned Patient Lookup</h1>
              <p className="mt-1 text-sm text-slate-500">Search and open only patients assigned to you by nurse admin.</p>
            </div>
            <button onClick={load} className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          <div className="relative rounded-lg border bg-white p-4">
            <Search className="absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border px-10 py-2 text-sm" placeholder="Search name, registration number, phone" />
          </div>

          {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}

          <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
            <section className="rounded-lg border bg-white p-5">
              <h2 className="text-lg font-semibold text-slate-900">Assigned Patients</h2>
              <div className="mt-4 space-y-3">
                {filtered.map((patient) => (
                  <button key={patient.assignment_id} onClick={() => openPatient(patient.patient_id)} className="w-full rounded-lg border p-4 text-left text-sm hover:bg-pink-50">
                    <p className="font-semibold text-slate-900">{patient.first_name} {patient.last_name}</p>
                    <p className="text-slate-500">{patient.registration_no || patient.phone || '-'}</p>
                    <p className="mt-1 text-xs text-slate-500">Appointment: {fmtDate(patient.scheduled_date)} {fmtTime(patient.scheduled_time)}</p>
                  </button>
                ))}
                {!loading && !filtered.length ? <p className="text-sm text-slate-500">No assigned patients found.</p> : null}
              </div>
            </section>

            <section className="rounded-lg border bg-white p-5">
              {selected?.patient ? (
                <div className="space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-pink-50 p-3 text-pink-600">
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold text-slate-900">{selected.patient.first_name} {selected.patient.last_name}</h2>
                        <p className="text-sm text-slate-500">{selected.patient.registration_no || 'No registration number'}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">Assigned</span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <Info label="Phone" value={selected.patient.phone || '-'} icon={<Phone className="h-4 w-4" />} />
                    <Info label="Gender" value={selected.patient.gender || '-'} />
                    <Info label="Blood Type" value={selected.patient.blood_type || '-'} />
                    <Info label="Allergies" value={selected.patient.allergies || '-'} />
                    <Info label="Conditions" value={selected.patient.chronic_conditions || '-'} />
                    <Info label="Emergency" value={selected.patient.emergency_phone || selected.patient.emergency_contact || '-'} />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Prescribed Medicines</h3>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      {selected.prescriptions.flatMap((prescription) => prescription.medicines.map((medicine) => (
                        <div key={`${prescription.id}-${medicine.id}`} className="rounded-lg border p-3 text-sm">
                          <p className="font-medium text-slate-900">{medicine.medicine_name}</p>
                          <p className="text-slate-500">{[medicine.dosage, medicine.frequency, medicine.duration].filter(Boolean).join(' | ') || '-'}</p>
                          <p className="text-xs text-slate-500">{medicine.instructions || ''}</p>
                        </div>
                      )))}
                      {!selected.prescriptions.flatMap((p) => p.medicines).length ? <p className="text-sm text-slate-500">No medicines found.</p> : null}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Timetable</h3>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      {selected.timetable.map((task) => (
                        <div key={task.id} className="rounded-lg border p-3 text-sm">
                          <div className="flex justify-between gap-3">
                            <p className="font-medium text-slate-900">{task.title}</p>
                            <span className="text-xs text-slate-500">{task.status}</span>
                          </div>
                          <p className="text-slate-500">{task.task_type} | {fmtDate(task.scheduled_date)} {fmtTime(task.scheduled_time)}</p>
                        </div>
                      ))}
                      {!selected.timetable.length ? <p className="text-sm text-slate-500">No timetable entries yet.</p> : null}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-72 flex-col items-center justify-center text-center">
                  <AlertCircle className="mb-3 h-10 w-10 text-slate-300" />
                  <p className="font-medium text-slate-900">Select a patient</p>
                  <p className="text-sm text-slate-500">Patient details are available only for your active assignments.</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function Info({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 text-sm">
      <p className="flex items-center gap-2 text-slate-500">{icon}{label}</p>
      <p className="mt-1 font-medium text-slate-900">{value}</p>
    </div>
  );
}
