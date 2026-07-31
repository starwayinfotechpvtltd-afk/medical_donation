'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, RefreshCw } from 'lucide-react';
import { NurseSidebar } from '@/components/NurseSidebar';
import { nurseApi, type CareTask } from '@/lib/nurse-api';

const today = () => new Date().toISOString().slice(0, 10);
const fmtDate = (value?: string | null) => (value ? String(value).slice(0, 10) : '-');
const fmtTime = (value?: string | null) => (value ? String(value).slice(0, 5) : '-');

export default function NurseTimetablePage() {
  const [tasks, setTasks] = useState<CareTask[]>([]);
  const [dateFrom, setDateFrom] = useState(today());
  const [dateTo, setDateTo] = useState(today());
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setTasks(await nurseApi.getTimetable({ date_from: dateFrom || undefined, date_to: dateTo || undefined, status: status || undefined }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load timetable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [dateFrom, dateTo, status]);

  const updateStatus = async (task: CareTask, nextStatus: CareTask['status']) => {
    await nurseApi.updateTimetableEntry(task.id, { status: nextStatus });
    await load();
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <NurseSidebar />
      <main className="ml-64 flex-1 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">Care Timetable</h1>
              <p className="mt-1 text-sm text-slate-500">Track medicine, checkup, vitals, and nursing care tasks.</p>
            </div>
            <button onClick={load} className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          <div className="grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-3">
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="rounded-lg border px-3 py-2 text-sm" />
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="rounded-lg border px-3 py-2 text-sm" />
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border px-3 py-2 text-sm">
              <option value="">All status</option>
              <option value="pending">pending</option>
              <option value="done">done</option>
              <option value="missed">missed</option>
              <option value="cancelled">cancelled</option>
            </select>
          </div>

          {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tasks.map((task) => (
              <div key={task.id} className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{task.title}</p>
                    <p className="text-sm text-slate-500">{task.patient_first_name} {task.patient_last_name}</p>
                    <p className="text-sm text-slate-500">{fmtDate(task.scheduled_date)} {fmtTime(task.scheduled_time)}</p>
                    <p className="mt-1 text-xs text-slate-500">{task.notes || task.medicine_name || ''}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{task.status}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={() => updateStatus(task, 'done')} className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Done
                  </button>
                  <button onClick={() => updateStatus(task, 'missed')} className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs">
                    <Clock className="h-3.5 w-3.5" />
                    Missed
                  </button>
                </div>
              </div>
            ))}
          </div>
          {!loading && !tasks.length ? <div className="rounded-lg border bg-white p-8 text-sm text-slate-500">No timetable tasks found.</div> : null}
        </div>
      </main>
    </div>
  );
}
