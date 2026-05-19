'use client';

import { useEffect, useMemo, useState } from 'react';
import { Activity, Calendar, Eye, RefreshCw, Shield, TriangleAlert } from 'lucide-react';
import { adminApi, type AdminAuditLog, type AdminMeta } from '@/lib/admin-api';

const number = new Intl.NumberFormat('en-IN');

function prettyLabel(value: string | null | undefined) {
  if (!value) return 'Unknown';
  return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === 'success'
      ? 'bg-emerald-50 text-emerald-700'
      : status === 'warning'
      ? 'bg-amber-50 text-amber-700'
      : status === 'error'
      ? 'bg-red-50 text-red-700'
      : 'bg-slate-100 text-slate-700';

  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}>{prettyLabel(status)}</span>;
}

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [meta, setMeta] = useState<AdminMeta | null>(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [action, setAction] = useState('');
  const [entityType, setEntityType] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedLog, setSelectedLog] = useState<AdminAuditLog | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await adminApi.getAuditLogs({
        page,
        limit: 10,
        status: status || undefined,
        action: action || undefined,
        entity_type: entityType || undefined,
        from_date: fromDate || undefined,
        to_date: toDate || undefined,
      });

      setLogs(response.data);
      setMeta(response.meta ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audit logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [page, status, action, entityType, fromDate, toDate]);

  const overview = useMemo(() => {
    const success = logs.filter((log) => log.status === 'success').length;
    const warning = logs.filter((log) => log.status === 'warning').length;
    const failure = logs.filter((log) => log.status === 'error').length;

    return { success, warning, failure };
  }, [logs]);

  const openDetails = async (id: number) => {
    setDetailLoading(true);

    try {
      const log = await adminApi.getAuditLog(id);
      setSelectedLog(log);
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">Audit Trail</p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">System activity and access history</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-500">
            This page now uses the real `/api/admin/audit-logs` endpoints and drops the fake activity stream.
          </p>
        </div>
        <button
          onClick={loadLogs}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Visible Logs</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{number.format(logs.length)}</p>
          <p className="mt-2 text-xs text-slate-500">Current page result count</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Successful Events</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-600">{number.format(overview.success)}</p>
          <p className="mt-2 text-xs text-slate-500">Current page</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Warnings / Errors</p>
          <p className="mt-2 text-3xl font-semibold text-amber-600">
            {number.format(overview.warning + overview.failure)}
          </p>
          <p className="mt-2 text-xs text-slate-500">Potential issues requiring review</p>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-5">
          <select
            value={status}
            onChange={(event) => {
              setPage(1);
              setStatus(event.target.value);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400"
          >
            <option value="">All statuses</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="failed">Failed</option>
          </select>

          <input
            value={action}
            onChange={(event) => {
              setPage(1);
              setAction(event.target.value);
            }}
            placeholder="Filter action"
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400"
          />

          <input
            value={entityType}
            onChange={(event) => {
              setPage(1);
              setEntityType(event.target.value);
            }}
            placeholder="Entity type"
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400"
          />

          <input
            type="date"
            value={fromDate}
            onChange={(event) => {
              setPage(1);
              setFromDate(event.target.value);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400"
          />

          <input
            type="date"
            value={toDate}
            onChange={(event) => {
              setPage(1);
              setToDate(event.target.value);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400"
          />
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[260px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
              <p className="mt-3 text-sm text-slate-500">Loading audit log history...</p>
            </div>
          </div>
        ) : error ? (
          <div className="p-6">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">
            <Activity className="h-10 w-10 text-slate-300" />
            <p className="mt-4 text-sm font-medium text-slate-700">No audit logs match the current filters.</p>
            <p className="mt-1 text-sm text-slate-500">Try clearing one or more filters and refresh the log table.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Actor</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Action</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Entity</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Timestamp</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-slate-900">{log.actor_name || 'System'}</p>
                          <p className="text-sm text-slate-500">{prettyLabel(log.actor_role)}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">{prettyLabel(log.action)}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">
                        {prettyLabel(log.entity_type)}
                        {log.entity_id ? ` #${log.entity_id}` : ''}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={log.status} />
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-500">{new Date(log.created_at).toLocaleString()}</td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => openDetails(log.id)}
                          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {meta && (
              <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  Showing page {meta.page} of {meta.totalPages} · {number.format(meta.total)} total logs
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={meta.page <= 1}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((current) => Math.min(meta.totalPages, current + 1))}
                    disabled={meta.page >= meta.totalPages}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedLog(null)}>
          <div
            className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-blue-600">Audit log #{selectedLog.id}</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                  {prettyLabel(selectedLog.action)} · {prettyLabel(selectedLog.entity_type)}
                </h2>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
              >
                Close
              </button>
            </div>

            {detailLoading ? (
              <div className="py-12 text-center text-sm text-slate-500">Loading log details...</div>
            ) : (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-slate-500" />
                    <p className="text-sm font-semibold text-slate-900">Actor</p>
                  </div>
                  <p className="mt-3 text-sm text-slate-700">{selectedLog.actor_name || 'System'}</p>
                  <p className="text-sm text-slate-500">{prettyLabel(selectedLog.actor_role)}</p>
                  {selectedLog.ip_address && <p className="mt-2 text-xs text-slate-500">IP: {selectedLog.ip_address}</p>}
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <p className="text-sm font-semibold text-slate-900">Timestamp</p>
                  </div>
                  <p className="mt-3 text-sm text-slate-700">{new Date(selectedLog.created_at).toLocaleString()}</p>
                  <div className="mt-2">
                    <StatusBadge status={selectedLog.status} />
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2">
                  <p className="text-sm font-semibold text-slate-900">Metadata</p>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">Entity</p>
                      <p className="mt-1 text-sm text-slate-700">
                        {prettyLabel(selectedLog.entity_type)}
                        {selectedLog.entity_id ? ` #${selectedLog.entity_id}` : ''}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">User Agent</p>
                      <p className="mt-1 text-sm text-slate-700">{selectedLog.user_agent || 'Not recorded'}</p>
                    </div>
                  </div>
                </div>

                {(selectedLog.old_value || selectedLog.new_value) && (
                  <div className="rounded-2xl bg-slate-900 p-4 text-slate-100 md:col-span-2">
                    <div className="mb-3 flex items-center gap-2">
                      <TriangleAlert className="h-4 w-4 text-amber-300" />
                      <p className="text-sm font-semibold">Change Snapshot</p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">Old Value</p>
                        <pre className="overflow-x-auto rounded-xl bg-slate-800 p-3 text-xs">
                          {JSON.stringify(selectedLog.old_value ?? {}, null, 2)}
                        </pre>
                      </div>
                      <div>
                        <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">New Value</p>
                        <pre className="overflow-x-auto rounded-xl bg-slate-800 p-3 text-xs">
                          {JSON.stringify(selectedLog.new_value ?? {}, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
