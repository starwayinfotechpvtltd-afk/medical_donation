'use client';

import { useEffect, useMemo, useState } from 'react';
import { FileText } from 'lucide-react';
import { api, ApiException } from '@/lib/api-client';

interface LabReportRow {
  id: number;
  test_name: string;
  request_date: string;
  status: string;
  doctor_first_name?: string | null;
  doctor_last_name?: string | null;
  doctor_specialization?: string | null;
  technician_first_name?: string | null;
  technician_last_name?: string | null;
  result_id?: number | null;
  parameter?: string | null;
  value?: string | null;
  unit?: string | null;
  normal_range?: string | null;
  result_status?: string | null;
  result_file_url?: string | null;
}

interface GroupedReport {
  id: number;
  test_name: string;
  request_date: string;
  status: string;
  doctor_name: string;
  doctor_specialization: string;
  technician_name: string;
  result_file_url?: string | null;
  results: Array<{
    result_id?: number | null;
    parameter?: string | null;
    value?: string | null;
    unit?: string | null;
    normal_range?: string | null;
    result_status?: string | null;
  }>;
}

const assetBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');

const toAbsoluteUrl = (input?: string | null) => {
  if (!input) return '';
  if (input.startsWith('http://') || input.startsWith('https://')) return input;
  return `${assetBase}${input}`;
};

export default function LabReportsViewPage() {
  const [rows, setRows] = useState<GroupedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get<LabReportRow[]>('/patient/lab-reports');
      const flat = (res.data ?? []) as LabReportRow[];
      const map = new Map<number, GroupedReport>();
      for (const r of flat) {
        if (!map.has(r.id)) {
          map.set(r.id, {
            id: r.id,
            test_name: r.test_name,
            request_date: r.request_date,
            status: r.status,
            doctor_name: `${r.doctor_first_name || ''} ${r.doctor_last_name || ''}`.trim() || '-',
            doctor_specialization: r.doctor_specialization || 'General',
            technician_name: `${r.technician_first_name || ''} ${r.technician_last_name || ''}`.trim() || '-',
            result_file_url: r.result_file_url || null,
            results: [],
          });
        }
        if (r.result_id) {
          map.get(r.id)?.results.push({
            result_id: r.result_id,
            parameter: r.parameter,
            value: r.value,
            unit: r.unit,
            normal_range: r.normal_range,
            result_status: r.result_status,
          });
        }
      }
      setRows([...map.values()]);
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to load lab reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const stats = useMemo(() => {
    const completed = rows.filter((r) => r.status === 'completed').length;
    return { total: rows.length, completed };
  }, [rows]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Lab Reports</h1>
        <p className="text-sm text-slate-500">Your test reports, parameters, and result files.</p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">Total Reports</p><p className="text-2xl font-bold">{stats.total}</p></div>
        <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">Completed</p><p className="text-2xl font-bold">{stats.completed}</p></div>
        <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">Parameters</p><p className="text-2xl font-bold">{rows.reduce((acc, r) => acc + r.results.length, 0)}</p></div>
      </div>

      <section className="space-y-3">
        {!loading && rows.length === 0 && <div className="rounded-xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-500">No lab reports found.</div>}
        {rows.map((report) => (
          <article key={report.id} className="rounded-xl border border-slate-100 bg-white p-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="inline-flex items-center gap-2 font-semibold text-slate-900"><FileText className="h-4 w-4" /> {report.test_name}</h2>
              <span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">{report.status}</span>
            </div>
            <p className="text-xs text-slate-500">Date: {new Date(report.request_date).toLocaleDateString()} • Doctor: Dr. {report.doctor_name} ({report.doctor_specialization}) • Technician: {report.technician_name}</p>

            {report.results.length > 0 ? (
              <div className="mt-3 overflow-x-auto rounded-lg border border-slate-100">
                <table className="w-full min-w-[600px] text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-3 py-2">Parameter</th>
                      <th className="px-3 py-2">Value</th>
                      <th className="px-3 py-2">Unit</th>
                      <th className="px-3 py-2">Range</th>
                      <th className="px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.results.map((r) => (
                      <tr key={r.result_id || `${report.id}-${r.parameter}`} className="border-t border-slate-100">
                        <td className="px-3 py-2">{r.parameter || '-'}</td>
                        <td className="px-3 py-2">{r.value || '-'}</td>
                        <td className="px-3 py-2">{r.unit || '-'}</td>
                        <td className="px-3 py-2">{r.normal_range || '-'}</td>
                        <td className="px-3 py-2">{r.result_status || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">No parameter-level results added yet.</p>
            )}

            {report.result_file_url && (
              <div className="mt-3">
                <a href={toAbsoluteUrl(report.result_file_url)} target="_blank" rel="noreferrer" className="text-xs font-semibold text-blue-600">Open Uploaded Report File</a>
              </div>
            )}
          </article>
        ))}
        {loading && <div className="rounded-xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-500">Loading lab reports...</div>}
      </section>
    </div>
  );
}

