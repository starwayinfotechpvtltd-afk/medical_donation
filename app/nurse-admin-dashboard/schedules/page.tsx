'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { nurseAdminApi, type NurseSchedule, type NurseUser } from '@/lib/nurse-admin-api';

type ScheduleForm = {
  nurse_user_id: string;
  shift_date: string;
  shift_type: 'morning' | 'evening' | 'night' | 'custom';
  start_time: string;
  end_time: string;
  ward: string;
  notes: string;
};

const today = () => new Date().toISOString().slice(0, 10);
const inDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};
const emptyForm: ScheduleForm = {
  nurse_user_id: '',
  shift_date: today(),
  shift_type: 'morning',
  start_time: '08:00',
  end_time: '16:00',
  ward: '',
  notes: '',
};
const fmtDate = (value?: string | null) => (value ? String(value).slice(0, 10) : '-');
const fmtTime = (value?: string | null) => (value ? String(value).slice(0, 5) : '-');

export default function NurseSchedulesPage() {
  const [nurses, setNurses] = useState<NurseUser[]>([]);
  const [schedules, setSchedules] = useState<NurseSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateFrom, setDateFrom] = useState(today());
  const [dateTo, setDateTo] = useState(inDays(14));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ScheduleForm>(emptyForm);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [nurseRows, scheduleRows] = await Promise.all([
        nurseAdminApi.getNurses({ status: 'active' }),
        nurseAdminApi.getSchedules({ date_from: dateFrom || undefined, date_to: dateTo || undefined }),
      ]);
      setNurses(nurseRows);
      setSchedules(scheduleRows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load schedules.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [dateFrom, dateTo]);

  const counters = useMemo(() => ({
    total: schedules.length,
    scheduled: schedules.filter((s) => s.status === 'scheduled').length,
    completed: schedules.filter((s) => s.status === 'completed').length,
    cancelled: schedules.filter((s) => s.status === 'cancelled' || s.status === 'absent').length,
  }), [schedules]);

  const save = async () => {
    setError('');
    if (!form.nurse_user_id) {
      setError('Select a nurse.');
      return;
    }
    try {
      await nurseAdminApi.createSchedule({
        nurse_user_id: Number(form.nurse_user_id),
        shift_date: form.shift_date,
        shift_type: form.shift_type,
        start_time: form.start_time,
        end_time: form.end_time,
        ward: form.ward || undefined,
        notes: form.notes || undefined,
      });
      setShowForm(false);
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save schedule.');
    }
  };

  const updateStatus = async (schedule: NurseSchedule, status: NurseSchedule['status']) => {
    await nurseAdminApi.updateSchedule(schedule.id, { status });
    await load();
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Schedules</h1>
          <p className="mt-1 text-sm text-slate-500">Create nurse shifts and update schedule status.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white">
            <Plus className="h-4 w-4" />
            Add Shift
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Total Shifts', counters.total],
          ['Scheduled', counters.scheduled],
          ['Completed', counters.completed],
          ['Cancelled/Absent', counters.cancelled],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-lg border bg-white p-4">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-2">
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="rounded-lg border px-3 py-2 text-sm" />
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="rounded-lg border px-3 py-2 text-sm" />
      </div>

      {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}

      <div className="rounded-lg border bg-white p-5">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b text-xs uppercase text-slate-500">
              <tr>
                <th className="py-3 pr-4">Nurse</th>
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4">Shift</th>
                <th className="py-3 pr-4">Ward</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule) => (
                <tr key={schedule.id} className="border-b last:border-0">
                  <td className="py-3 pr-4 font-medium text-slate-900">{schedule.nurse_first_name} {schedule.nurse_last_name}</td>
                  <td className="py-3 pr-4">{fmtDate(schedule.shift_date)}</td>
                  <td className="py-3 pr-4">{schedule.shift_type} ({fmtTime(schedule.start_time)}-{fmtTime(schedule.end_time)})</td>
                  <td className="py-3 pr-4">{schedule.ward || '-'}</td>
                  <td className="py-3 pr-4">{schedule.status}</td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => updateStatus(schedule, 'completed')} className="rounded-lg border px-3 py-1.5 text-xs">Complete</button>
                      <button onClick={() => updateStatus(schedule, 'cancelled')} className="rounded-lg border px-3 py-1.5 text-xs">Cancel</button>
                      <button onClick={() => updateStatus(schedule, 'absent')} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-700">Absent</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && !schedules.length ? <p className="py-6 text-sm text-slate-500">No schedules found.</p> : null}
        </div>
      </div>

      {showForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-2xl rounded-lg bg-white p-5" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-semibold text-slate-900">Add Shift</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <select value={form.nurse_user_id} onChange={(e) => setForm((s) => ({ ...s, nurse_user_id: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm">
                <option value="">Select nurse</option>
                {nurses.map((nurse) => (
                  <option key={nurse.id} value={nurse.id}>{nurse.first_name} {nurse.last_name}</option>
                ))}
              </select>
              <input type="date" value={form.shift_date} onChange={(e) => setForm((s) => ({ ...s, shift_date: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm" />
              <select value={form.shift_type} onChange={(e) => setForm((s) => ({ ...s, shift_type: e.target.value as ScheduleForm['shift_type'] }))} className="rounded-lg border px-3 py-2 text-sm">
                <option value="morning">morning</option>
                <option value="evening">evening</option>
                <option value="night">night</option>
                <option value="custom">custom</option>
              </select>
              <input value={form.ward} onChange={(e) => setForm((s) => ({ ...s, ward: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm" placeholder="Ward" />
              <input type="time" value={form.start_time} onChange={(e) => setForm((s) => ({ ...s, start_time: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm" />
              <input type="time" value={form.end_time} onChange={(e) => setForm((s) => ({ ...s, end_time: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm" />
              <textarea value={form.notes} onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm md:col-span-2" placeholder="Notes" rows={3} />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="rounded-lg border px-4 py-2 text-sm">Cancel</button>
              <button onClick={save} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white">Save</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
