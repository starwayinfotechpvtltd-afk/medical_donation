'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarClock, CheckCircle2, Clock, Pill, RefreshCw, Search, Stethoscope, Users } from 'lucide-react';
import { NurseSidebar } from '@/components/NurseSidebar';
import { nurseApi, type AssignedPatient, type CareTask, type PatientDetail } from '@/lib/nurse-api';

const today = () => new Date().toISOString().slice(0, 10);
const fmtDate = (value?: string | null) => (value ? String(value).slice(0, 10) : '-');
const fmtTime = (value?: string | null) => (value ? String(value).slice(0, 5) : '-');

type TaskForm = {
  patient_id: string;
  task_type: 'medicine' | 'checkup' | 'vitals' | 'note';
  title: string;
  scheduled_date: string;
  scheduled_time: string;
  notes: string;
  prescription_id: string;
  medicine_id: string;
};

const emptyForm: TaskForm = {
  patient_id: '',
  task_type: 'medicine',
  title: '',
  scheduled_date: today(),
  scheduled_time: '09:00',
  notes: '',
  prescription_id: '',
  medicine_id: '',
};

export default function NurseDashboard() {
  const [patients, setPatients] = useState<AssignedPatient[]>([]);
  const [tasks, setTasks] = useState<CareTask[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [detail, setDetail] = useState<PatientDetail | null>(null);
  const [form, setForm] = useState<TaskForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await nurseApi.getDashboard();
      setPatients(data.patients);
      setTasks(data.timetable);
      if (!selectedPatientId && data.patients[0]) setSelectedPatientId(data.patients[0].patient_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load nurse dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    if (!selectedPatientId) {
      setDetail(null);
      return;
    }
    nurseApi.getPatientDetail(selectedPatientId)
      .then((data) => {
        setDetail(data);
        setForm((prev) => ({ ...prev, patient_id: String(selectedPatientId) }));
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load patient detail.'));
  }, [selectedPatientId]);

  const filteredPatients = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return patients;
    return patients.filter((patient) =>
      `${patient.first_name} ${patient.last_name} ${patient.registration_no || ''} ${patient.phone || ''}`
        .toLowerCase()
        .includes(term)
    );
  }, [patients, search]);

  const todayTasks = tasks.filter((task) => fmtDate(task.scheduled_date) === today());
  const selectedMedicine = detail?.prescriptions
    .flatMap((prescription) => prescription.medicines.map((medicine) => ({ prescription, medicine })))
    .find((item) => String(item.medicine.id) === form.medicine_id);

  const saveTask = async () => {
    setError('');
    if (!form.patient_id || !form.title.trim()) {
      setError('Patient and title are required.');
      return;
    }
    try {
      await nurseApi.createTimetableEntry({
        patient_id: Number(form.patient_id),
        task_type: form.task_type,
        title: form.title,
        scheduled_date: form.scheduled_date,
        scheduled_time: form.scheduled_time,
        notes: form.notes || undefined,
        prescription_id: form.prescription_id ? Number(form.prescription_id) : selectedMedicine?.prescription.id ?? null,
        medicine_id: form.medicine_id ? Number(form.medicine_id) : null,
      });
      setForm((prev) => ({ ...emptyForm, patient_id: prev.patient_id }));
      await load();
      if (selectedPatientId) setDetail(await nurseApi.getPatientDetail(selectedPatientId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save timetable entry.');
    }
  };

  const updateTask = async (task: CareTask, status: CareTask['status']) => {
    await nurseApi.updateTimetableEntry(task.id, { status });
    await load();
    if (selectedPatientId) setDetail(await nurseApi.getPatientDetail(selectedPatientId));
  };

  const stats = [
    { label: 'Assigned Patients', value: patients.length, icon: Users },
    { label: 'Today Tasks', value: todayTasks.length, icon: CalendarClock },
    { label: 'Pending Tasks', value: tasks.filter((task) => task.status === 'pending').length, icon: Clock },
    { label: 'Completed', value: tasks.filter((task) => task.status === 'done').length, icon: CheckCircle2 },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <NurseSidebar />
      <main className="ml-64 flex-1 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-pink-600">Nurse Dashboard</p>
              <h1 className="mt-1 text-3xl font-semibold text-slate-900">Assigned Patient Care</h1>
              <p className="mt-1 text-sm text-slate-500">Only nurse admin can assign patients. You can manage care tasks for your assigned patients.</p>
            </div>
            <button onClick={load} className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}

          <div className="grid gap-4 md:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="rounded-lg border bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <Icon className="h-5 w-5 text-pink-600" />
                  </div>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{loading ? '-' : stat.value}</p>
                </div>
              );
            })}
          </div>

          <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
            <section className="rounded-lg border bg-white p-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border px-10 py-2 text-sm" placeholder="Search assigned patients" />
              </div>
              <div className="mt-4 space-y-3">
                {filteredPatients.map((patient) => (
                  <button
                    key={patient.assignment_id}
                    onClick={() => setSelectedPatientId(patient.patient_id)}
                    className={`w-full rounded-lg border p-4 text-left text-sm ${selectedPatientId === patient.patient_id ? 'border-pink-300 bg-pink-50' : 'bg-white hover:bg-slate-50'}`}
                  >
                    <p className="font-semibold text-slate-900">{patient.first_name} {patient.last_name}</p>
                    <p className="text-slate-500">{patient.registration_no || patient.phone || 'No registration number'}</p>
                    <p className="mt-1 text-xs text-slate-500">Appointment: {fmtDate(patient.scheduled_date)} {fmtTime(patient.scheduled_time)}</p>
                  </button>
                ))}
                {!loading && !filteredPatients.length ? <p className="text-sm text-slate-500">No assigned patients.</p> : null}
              </div>
            </section>

            <section className="space-y-6">
              <div className="rounded-lg border bg-white p-5">
                <h2 className="text-lg font-semibold text-slate-900">Patient Details</h2>
                {detail?.patient ? (
                  <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <Info label="Name" value={`${detail.patient.first_name} ${detail.patient.last_name}`} />
                    <Info label="Phone" value={detail.patient.phone || '-'} />
                    <Info label="Blood Type" value={detail.patient.blood_type || '-'} />
                    <Info label="Doctor" value={detail.appointments[0]?.doctor_first_name ? `${detail.appointments[0].doctor_first_name} ${detail.appointments[0].doctor_last_name}` : '-'} />
                    <Info label="Department" value={String(detail.appointments[0]?.department_name || '-')} />
                    <Info label="Emergency" value={detail.patient.emergency_phone || detail.patient.emergency_contact || '-'} />
                    <Info label="Allergies" value={detail.patient.allergies || '-'} />
                    <Info label="Conditions" value={detail.patient.chronic_conditions || '-'} />
                    <Info label="Address" value={[detail.patient.address, detail.patient.city, detail.patient.state].filter(Boolean).join(', ') || '-'} />
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-slate-500">Select an assigned patient.</p>
                )}
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-lg border bg-white p-5">
                  <h2 className="text-lg font-semibold text-slate-900">Medicine List</h2>
                  <div className="mt-4 space-y-3">
                    {detail?.prescriptions.flatMap((prescription) =>
                      prescription.medicines.map((medicine) => (
                        <button
                          key={`${prescription.id}-${medicine.id}`}
                          onClick={() => setForm((prev) => ({
                            ...prev,
                            patient_id: String(selectedPatientId || detail.patient.patient_id),
                            task_type: 'medicine',
                            title: medicine.medicine_name,
                            prescription_id: String(prescription.id),
                            medicine_id: String(medicine.id),
                            notes: [medicine.dosage, medicine.frequency, medicine.instructions].filter(Boolean).join(' | '),
                          }))}
                          className="w-full rounded-lg border p-3 text-left text-sm hover:bg-pink-50"
                        >
                          <div className="flex items-center gap-2 font-medium text-slate-900">
                            <Pill className="h-4 w-4 text-pink-600" />
                            {medicine.medicine_name}
                          </div>
                          <p className="mt-1 text-slate-500">{[medicine.dosage, medicine.frequency, medicine.duration].filter(Boolean).join(' | ') || 'No timing details'}</p>
                          <p className="text-xs text-slate-500">{medicine.instructions || ''}</p>
                        </button>
                      ))
                    )}
                    {detail && !detail.prescriptions.flatMap((p) => p.medicines).length ? <p className="text-sm text-slate-500">No medicines found.</p> : null}
                  </div>
                </div>

                <div className="rounded-lg border bg-white p-5">
                  <h2 className="text-lg font-semibold text-slate-900">Create Timetable Entry</h2>
                  <div className="mt-4 grid gap-3">
                    <select value={form.task_type} onChange={(e) => setForm((s) => ({ ...s, task_type: e.target.value as TaskForm['task_type'] }))} className="rounded-lg border px-3 py-2 text-sm">
                      <option value="medicine">medicine</option>
                      <option value="checkup">checkup</option>
                      <option value="vitals">vitals</option>
                      <option value="note">note</option>
                    </select>
                    <input value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm" placeholder="Task title" />
                    <div className="grid gap-3 md:grid-cols-2">
                      <input type="date" value={form.scheduled_date} onChange={(e) => setForm((s) => ({ ...s, scheduled_date: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm" />
                      <input type="time" value={form.scheduled_time} onChange={(e) => setForm((s) => ({ ...s, scheduled_time: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm" />
                    </div>
                    <textarea value={form.notes} onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm" rows={3} placeholder="Notes" />
                    <button onClick={saveTask} className="rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white">Save Timetable</button>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-white p-5">
                <h2 className="text-lg font-semibold text-slate-900">Care Timetable</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {(detail?.timetable.length ? detail.timetable : todayTasks).map((task) => (
                    <div key={task.id} className="rounded-lg border p-4 text-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">{task.title}</p>
                          <p className="text-slate-500">{task.task_type} | {fmtDate(task.scheduled_date)} {fmtTime(task.scheduled_time)}</p>
                          <p className="text-slate-500">{task.notes || task.medicine_name || ''}</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{task.status}</span>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button onClick={() => updateTask(task, 'done')} className="rounded-lg border px-3 py-1.5 text-xs">Done</button>
                        <button onClick={() => updateTask(task, 'missed')} className="rounded-lg border px-3 py-1.5 text-xs">Missed</button>
                      </div>
                    </div>
                  ))}
                </div>
                {!loading && !(detail?.timetable.length || todayTasks.length) ? <p className="mt-4 text-sm text-slate-500">No timetable entries yet.</p> : null}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 text-sm">
      <p className="text-slate-500">{label}</p>
      <p className="mt-1 font-medium text-slate-900">{value}</p>
    </div>
  );
}
