'use client';

import { useEffect, useMemo, useState } from 'react';
import { Mail, Phone, Search, UserRound, Users } from 'lucide-react';
import { labAdminApi, type LabTechnicianProfile } from '@/lib/lab-admin-api';

const nameOf = (tech: LabTechnicianProfile) => `${tech.first_name || ''} ${tech.last_name || ''}`.trim();

export default function TechniciansPage() {
  const [technicians, setTechnicians] = useState<LabTechnicianProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setTechnicians(await labAdminApi.getTechnicians());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load lab technicians.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return technicians;
    return technicians.filter((tech) =>
      [nameOf(tech), tech.user_email, tech.user_phone, tech.lab_name, tech.licence_number, tech.mobile_number]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [searchTerm, technicians]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lab Technicians</h1>
          <p className="mt-1 text-gray-600">Live technician profiles from the database</p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search technicians"
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4"
          />
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Total Technicians</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{technicians.length}</p>
        </div>
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Profiles With Lab Name</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{technicians.filter((t) => t.lab_name).length}</p>
        </div>
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Filtered Results</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{filtered.length}</p>
        </div>
      </div>

      {loading ? <div className="rounded-xl border bg-white p-6 text-sm text-gray-500">Loading technicians...</div> : null}
      {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</div> : null}

      {!loading && !error ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filtered.map((tech) => (
            <div key={tech.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  <UserRound className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900">{nameOf(tech) || 'Unnamed technician'}</h3>
                  <p className="text-sm text-gray-500">{tech.lab_name || 'Lab profile'}</p>
                  <p className="mt-1 text-xs text-gray-400">License: {tech.licence_number || '-'}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <p className="flex items-center gap-2 text-gray-600"><Mail className="h-4 w-4 text-gray-400" />{tech.user_email || tech.email || '-'}</p>
                <p className="flex items-center gap-2 text-gray-600"><Phone className="h-4 w-4 text-gray-400" />{tech.user_phone || tech.mobile_number || '-'}</p>
                <p className="text-gray-600">Address: {tech.address || '-'}</p>
                <p className="text-gray-600">Lab Time: {tech.lab_time || '-'}</p>
              </div>
            </div>
          ))}
          {filtered.length === 0 ? (
            <div className="rounded-xl border bg-white p-6 text-sm text-gray-500">
              No technicians found.
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
