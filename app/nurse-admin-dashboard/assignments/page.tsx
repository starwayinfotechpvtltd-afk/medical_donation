'use client';

import { useEffect, useMemo, useState } from 'react';
import { RefreshCw, Search } from 'lucide-react';
import { nurseAdminApi, type NurseAppointment, type NurseAssignment, type NurseUser } from '@/lib/nurse-admin-api';

const today = () => new Date().toISOString().slice(0, 10);
const inDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};
const fmtDate = (value?: string | null) => (value ? String(value).slice(0, 10) : '-');
const fmtTime = (value?: string | null) => (value ? String(value).slice(0, 5) : '-');

export default function NurseAssignmentsPage() {
  const [nurses, setNurses] = useState<NurseUser[]>([]);
  const [appointments, setAppointments] = useState<NurseAppointment[]>([]);
  const [assignments, setAssignments] = useState<NurseAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState(today());
  const [dateTo, setDateTo] = useState(inDays(14));
  const [status, setStatus] = useState('');
  const [selectedNurses, setSelectedNurses] = useState<Record<number, string>>({});

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [nurseRows, appointmentRows, assignmentRows] = await Promise.all([
        nurseAdminApi.getNurses({ status: 'active' }),
        nurseAdminApi.getAppointments({ date_from: dateFrom || undefined, date_to: dateTo || undefined, status: status || undefined }),
        nurseAdminApi.getAssignments(),
      ]);
      setNurses(nurseRows);
      setAppointments(appointmentRows);
      setAssignments(assignmentRows);
      setSelectedNurses(Object.fromEntries(appointmentRows.map((appt) => [appt.id, appt.nurse_user_id ? String(appt.nurse_user_id) : ''])));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load assignments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [dateFrom, dateTo, status]);

  const filteredAppointments = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return appointments;
    return appointments.filter((item) =>
      `${item.patient_first_name} ${item.patient_last_name} ${item.patient_registration_no || ''} ${item.department_name || ''}`
        .toLowerCase()
        .includes(term)
    );
  }, [appointments, search]);

  const assign = async (appointment: NurseAppointment) => {
    const nurseId = Number(selectedNurses[appointment.id]);
    if (!nurseId) {
      setError('Select a nurse before assigning.');
      return;
    }
    try {
      await nurseAdminApi.createAssignment({
        nurse_user_id: nurseId,
        patient_id: appointment.patient_id,
        appointment_id: appointment.id,
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign nurse.');
    }
  };

  const updateAssignmentStatus = async (assignment: NurseAssignment, nextStatus: NurseAssignment['status']) => {
    await nurseAdminApi.updateAssignment(assignment.id, { status: nextStatus });
    await load();
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Assignments</h1>
          <p className="mt-1 text-sm text-slate-500">Assign active nurses to patient appointments and review assignment status.</p>
        </div>
        <button onClick={load} className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-5">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border px-10 py-2 text-sm" placeholder="Search patient, registration, department" />
        </div>
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="rounded-lg border px-3 py-2 text-sm" />
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="rounded-lg border px-3 py-2 text-sm" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border px-3 py-2 text-sm">
          <option value="">All appointment status</option>
          <option value="pending">pending</option>
          <option value="confirmed">confirmed</option>
          <option value="in_progress">in progress</option>
          <option value="completed">completed</option>
          <option value="cancelled">cancelled</option>
        </select>
      </div>

      {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}

      <section className="rounded-lg border bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">Appointments</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b text-xs uppercase text-slate-500">
              <tr>
                <th className="py-3 pr-4">Patient</th>
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4">Doctor</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Nurse</th>
                <th className="py-3 pr-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="border-b last:border-0">
                  <td className="py-3 pr-4">
                    <p className="font-medium text-slate-900">{appointment.patient_first_name} {appointment.patient_last_name}</p>
                    <p className="text-xs text-slate-500">{appointment.patient_registration_no || appointment.patient_phone || '-'}</p>
                  </td>
                  <td className="py-3 pr-4">{fmtDate(appointment.scheduled_date)} {fmtTime(appointment.scheduled_time)}</td>
                  <td className="py-3 pr-4">{appointment.doctor_first_name ? `${appointment.doctor_first_name} ${appointment.doctor_last_name}` : 'Unassigned'}</td>
                  <td className="py-3 pr-4">{appointment.status}</td>
                  <td className="py-3 pr-4">
                    <select
                      value={selectedNurses[appointment.id] || ''}
                      onChange={(e) => setSelectedNurses((prev) => ({ ...prev, [appointment.id]: e.target.value }))}
                      className="min-w-44 rounded-lg border px-3 py-2 text-sm"
                    >
                      <option value="">Select nurse</option>
                      {nurses.map((nurse) => (
                        <option key={nurse.id} value={nurse.id}>{nurse.first_name} {nurse.last_name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 pr-4">
                    <button onClick={() => assign(appointment)} className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-medium text-white">
                      {appointment.nurse_user_id ? 'Reassign' : 'Assign'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && !filteredAppointments.length ? <p className="py-6 text-sm text-slate-500">No appointments found.</p> : null}
        </div>
      </section>

      <section className="rounded-lg border bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">Current Assignments</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="rounded-lg border p-4 text-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{assignment.patient_first_name} {assignment.patient_last_name}</p>
                  <p className="text-slate-500">Nurse: {assignment.nurse_first_name} {assignment.nurse_last_name}</p>
                  <p className="text-slate-500">Appointment: {fmtDate(assignment.scheduled_date)} {fmtTime(assignment.scheduled_time)}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{assignment.status}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => updateAssignmentStatus(assignment, 'completed')} className="rounded-lg border px-3 py-1.5 text-xs">Complete</button>
                <button onClick={() => updateAssignmentStatus(assignment, 'cancelled')} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-700">Cancel</button>
              </div>
            </div>
          ))}
        </div>
        {!loading && !assignments.length ? <p className="py-6 text-sm text-slate-500">No assignments yet.</p> : null}
      </section>
    </div>
  );
}
