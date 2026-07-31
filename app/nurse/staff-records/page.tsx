'use client';

import { useEffect, useState } from 'react';
import { ClipboardList, RefreshCw } from 'lucide-react';
import { NurseSidebar } from '@/components/NurseSidebar';
import { nurseApi, type AssignedPatient } from '@/lib/nurse-api';

const fmtDate = (value?: string | null) => (value ? String(value).slice(0, 10) : '-');
const fmtTime = (value?: string | null) => (value ? String(value).slice(0, 5) : '-');

export default function NurseAssignmentRecordsPage() {
  const [patients, setPatients] = useState<AssignedPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setPatients(await nurseApi.getAssignedPatients());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load assignment records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <NurseSidebar />
      <main className="ml-64 flex-1 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">Assignment Records</h1>
              <p className="mt-1 text-sm text-slate-500">Read-only list of patients assigned to you by nurse admin.</p>
            </div>
            <button onClick={load} className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}

          <div className="rounded-lg border bg-white p-5">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b text-xs uppercase text-slate-500">
                  <tr>
                    <th className="py-3 pr-4">Patient</th>
                    <th className="py-3 pr-4">Appointment</th>
                    <th className="py-3 pr-4">Doctor</th>
                    <th className="py-3 pr-4">Department</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 pr-4">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.assignment_id} className="border-b last:border-0">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <ClipboardList className="h-4 w-4 text-pink-600" />
                          <div>
                            <p className="font-medium text-slate-900">{patient.first_name} {patient.last_name}</p>
                            <p className="text-xs text-slate-500">{patient.registration_no || patient.phone || '-'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4">{fmtDate(patient.scheduled_date)} {fmtTime(patient.scheduled_time)}</td>
                      <td className="py-3 pr-4">{patient.doctor_first_name ? `${patient.doctor_first_name} ${patient.doctor_last_name}` : '-'}</td>
                      <td className="py-3 pr-4">{patient.department_name || '-'}</td>
                      <td className="py-3 pr-4">{patient.assignment_status}</td>
                      <td className="py-3 pr-4">{patient.assignment_notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!loading && !patients.length ? <p className="py-6 text-sm text-slate-500">No assignment records found.</p> : null}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
