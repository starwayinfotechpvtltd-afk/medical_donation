'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, TestTube } from 'lucide-react';
import { labAdminApi } from '@/lib/lab-admin-api';

const text = (value: unknown) => (value === null || value === undefined ? '' : String(value));
const statusClass = (status: string) => ({
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}[status] || 'bg-gray-100 text-gray-800');

export default function LabAdminTestsPage() {
  const [tests, setTests] = useState<Array<Record<string, unknown>>>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setTests(await labAdminApi.getLabTests());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load lab tests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return tests.filter((test) => {
      const matchesStatus = !status || text(test.status) === status;
      const matchesSearch = !term || [
        test.test_name,
        test.test_type,
        test.patient_reg_no,
        `${text(test.patient_first_name)} ${text(test.patient_last_name)}`,
        `${text(test.doctor_first_name)} ${text(test.doctor_last_name)}`,
        `${text(test.technician_first_name)} ${text(test.technician_last_name)}`,
      ].some((value) => text(value).toLowerCase().includes(term));
      return matchesStatus && matchesSearch;
    });
  }, [tests, search, status]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lab Tests</h1>
        <p className="mt-1 text-gray-600">Live lab test requests and result status</p>
      </div>

      <div className="mb-6 grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-3">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tests" className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2">
          <option value="">All status</option>
          <option value="pending">pending</option>
          <option value="in_progress">in progress</option>
          <option value="completed">completed</option>
          <option value="cancelled">cancelled</option>
        </select>
      </div>

      {loading ? <div className="rounded-xl border bg-white p-6 text-sm text-gray-500">Loading tests...</div> : null}
      {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</div> : null}

      {!loading && !error ? (
        <div className="overflow-hidden rounded-xl border bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Test</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Technician</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((test) => (
                  <tr key={text(test.id)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <TestTube className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{text(test.test_name)}</p>
                          <p className="text-xs text-gray-500">{text(test.test_type) || text(test.category)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{`${text(test.patient_first_name)} ${text(test.patient_last_name)}`.trim()}<br /><span className="text-xs text-gray-400">{text(test.patient_reg_no)}</span></td>
                    <td className="px-6 py-4 text-sm text-gray-700">{`${text(test.doctor_first_name)} ${text(test.doctor_last_name)}`.trim() || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{`${text(test.technician_first_name)} ${text(test.technician_last_name)}`.trim() || 'Unassigned'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{text(test.priority)}</td>
                    <td className="px-6 py-4"><span className={`rounded-full px-2 py-1 text-xs font-medium ${statusClass(text(test.status))}`}>{text(test.status).replace('_', ' ')}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 ? <div className="p-6 text-sm text-gray-500">No lab tests found.</div> : null}
        </div>
      ) : null}
    </div>
  );
}
