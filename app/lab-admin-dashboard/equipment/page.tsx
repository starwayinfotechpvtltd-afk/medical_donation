'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle, Microscope, Plus, Search, Trash2, Wrench } from 'lucide-react';
import { labAdminApi, type LabEquipment } from '@/lib/lab-admin-api';

type EquipmentForm = {
  name: string;
  type: string;
  model: string;
  manufacturer: string;
  serial_number: string;
  location: string;
  status: LabEquipment['status'];
  condition_status: LabEquipment['condition_status'];
  next_calibration: string;
  next_maintenance: string;
  notes: string;
};

const emptyForm: EquipmentForm = {
  name: '',
  type: '',
  model: '',
  manufacturer: '',
  serial_number: '',
  location: '',
  status: 'operational',
  condition_status: 'good',
  next_calibration: '',
  next_maintenance: '',
  notes: '',
};

const statusClass = (status: string) => ({
  operational: 'bg-green-100 text-green-800',
  maintenance: 'bg-yellow-100 text-yellow-800',
  repair: 'bg-red-100 text-red-800',
  retired: 'bg-gray-100 text-gray-800',
}[status] || 'bg-gray-100 text-gray-800');

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<LabEquipment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<EquipmentForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setEquipment(await labAdminApi.getEquipment());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load lab equipment.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return equipment.filter((item) => {
      const matchesStatus = !status || item.status === status;
      const matchesSearch = !term || [item.name, item.type, item.model, item.manufacturer, item.serial_number, item.location]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
      return matchesStatus && matchesSearch;
    });
  }, [equipment, searchTerm, status]);

  const save = async () => {
    try {
      await labAdminApi.createEquipment(form);
      setShowForm(false);
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save equipment.');
    }
  };

  const remove = async (id: number, name: string) => {
    if (!window.confirm(`Delete ${name}?`)) return;
    await labAdminApi.deleteEquipment(id);
    await load();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lab Equipment</h1>
          <p className="mt-1 text-gray-600">Live equipment inventory and maintenance status</p>
        </div>
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Add Equipment
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl border bg-white p-5"><p className="text-sm text-gray-500">Total</p><p className="mt-2 text-2xl font-semibold">{equipment.length}</p></div>
        <div className="rounded-xl border bg-white p-5"><p className="text-sm text-gray-500">Operational</p><p className="mt-2 text-2xl font-semibold">{equipment.filter((e) => e.status === 'operational').length}</p></div>
        <div className="rounded-xl border bg-white p-5"><p className="text-sm text-gray-500">Maintenance</p><p className="mt-2 text-2xl font-semibold">{equipment.filter((e) => e.status === 'maintenance').length}</p></div>
        <div className="rounded-xl border bg-white p-5"><p className="text-sm text-gray-500">Repair</p><p className="mt-2 text-2xl font-semibold">{equipment.filter((e) => e.status === 'repair').length}</p></div>
      </div>

      <div className="mb-6 grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-3">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search equipment" className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2">
          <option value="">All status</option>
          <option value="operational">operational</option>
          <option value="maintenance">maintenance</option>
          <option value="repair">repair</option>
          <option value="retired">retired</option>
        </select>
      </div>

      {loading ? <div className="rounded-xl border bg-white p-6 text-sm text-gray-500">Loading equipment...</div> : null}
      {error ? <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</div> : null}

      {!loading ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <div key={item.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                    <Microscope className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.model || item.type || '-'}</p>
                  </div>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusClass(item.status)}`}>{item.status}</span>
              </div>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p>Serial: {item.serial_number || '-'}</p>
                <p>Location: {item.location || '-'}</p>
                <p>Condition: {item.condition_status}</p>
                <p>Next calibration: {item.next_calibration ? String(item.next_calibration).slice(0, 10) : '-'}</p>
                <p>Next maintenance: {item.next_maintenance ? String(item.next_maintenance).slice(0, 10) : '-'}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => void labAdminApi.updateEquipment(item.id, { status: item.status === 'operational' ? 'maintenance' : 'operational' }).then(load)} className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs">
                  <Wrench className="h-3.5 w-3.5" />
                  Toggle Maintenance
                </button>
                <button onClick={() => remove(item.id, item.name)} className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white">
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 ? <div className="rounded-xl border bg-white p-6 text-sm text-gray-500">No equipment found.</div> : null}
        </div>
      ) : null}

      {showForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-2xl rounded-xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-semibold text-gray-900">Add Equipment</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {(['name', 'type', 'model', 'manufacturer', 'serial_number', 'location'] as const).map((key) => (
                <input key={key} value={form[key]} onChange={(e) => setForm((s) => ({ ...s, [key]: e.target.value }))} placeholder={key.replace('_', ' ')} className="rounded-lg border px-3 py-2 text-sm" />
              ))}
              <select value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as LabEquipment['status'] }))} className="rounded-lg border px-3 py-2 text-sm">
                <option value="operational">operational</option>
                <option value="maintenance">maintenance</option>
                <option value="repair">repair</option>
                <option value="retired">retired</option>
              </select>
              <select value={form.condition_status} onChange={(e) => setForm((s) => ({ ...s, condition_status: e.target.value as LabEquipment['condition_status'] }))} className="rounded-lg border px-3 py-2 text-sm">
                <option value="excellent">excellent</option>
                <option value="good">good</option>
                <option value="fair">fair</option>
                <option value="poor">poor</option>
              </select>
              <input type="date" value={form.next_calibration} onChange={(e) => setForm((s) => ({ ...s, next_calibration: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm" />
              <input type="date" value={form.next_maintenance} onChange={(e) => setForm((s) => ({ ...s, next_maintenance: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm" />
              <textarea value={form.notes} onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))} placeholder="notes" className="rounded-lg border px-3 py-2 text-sm md:col-span-2" />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="rounded-lg border px-3 py-2 text-sm">Cancel</button>
              <button onClick={save} disabled={!form.name.trim()} className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white disabled:opacity-50">Save</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
