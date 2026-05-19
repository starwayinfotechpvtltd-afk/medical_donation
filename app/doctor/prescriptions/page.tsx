'use client';

import { useEffect, useMemo, useState } from 'react';
import { api, ApiException } from '@/lib/api-client';
import jsPDF from 'jspdf';
import { useSearchParams } from 'next/navigation';

interface DoctorPrescription {
  id: number;
  patient_id: number;
  patient_reg_no?: string;
  patient_first_name?: string;
  patient_last_name?: string;
  patient_email?: string;
  patient_phone?: string;
  patient_gender?: string;
  patient_date_of_birth?: string | null;
  patient_blood_type?: string | null;
  date_issued: string;
  follow_up_date?: string | null;
  notes?: string | null;
  template_name?: string | null;
  template_image_url?: string | null;
  medicines: Array<{
    id: number;
    medicine_name: string;
    dosage?: string | null;
    frequency?: string | null;
    duration?: string | null;
  }>;
}

interface Template {
  id: number;
  name: string;
  diagnosis?: string | null;
}

interface Medication {
  id: number;
  name: string;
  default_dosage?: string | null;
  default_frequency?: string | null;
  default_duration?: string | null;
  default_route?: string | null;
  is_active: number;
}

export default function DoctorPrescriptionsPage() {
  const searchParams = useSearchParams();
  const initialPatientRegNo = (searchParams.get('patientRegNo') || '').trim();
  const action = (searchParams.get('action') || '').trim().toLowerCase();
  const [rows, setRows] = useState<DoctorPrescription[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [patientRegFilter, setPatientRegFilter] = useState<string>(searchParams.get('patientRegNo') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [newRx, setNewRx] = useState({
    patient_reg_no: initialPatientRegNo,
    template_id: '',
    notes: '',
    follow_up_date: '',
    medicines: [{ medicine_name: '', dosage: '', frequency: '', duration: '', route: 'oral' }],
  });

  const load = async (patientRegNo?: string) => {
    setLoading(true);
    setError('');
    try {
      const params = patientRegNo ? { patient_reg_no: patientRegNo } : undefined;
      const [rxRes, tRes, mRes] = await Promise.all([
        api.get<DoctorPrescription[]>('/medical/doctor/prescriptions', params),
        api.get<Template[]>('/medical/doctor/templates'),
        api.get<Medication[]>('/medical/doctor/medications'),
      ]);
      setRows((rxRes.data ?? []) as DoctorPrescription[]);
      setTemplates((tRes.data ?? []) as Template[]);
      setMedications(((mRes.data ?? []) as Medication[]).filter((m) => !!m.is_active));
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to load prescriptions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    void load(patientRegFilter.trim());
  }, [patientRegFilter]);

  useEffect(() => {
    if (!initialPatientRegNo) return;
    setNewRx((s) => ({ ...s, patient_reg_no: initialPatientRegNo }));
    if (action === 'create') {
      const el = document.getElementById('create-prescription-form');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [initialPatientRegNo, action]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const patient = `${r.patient_first_name || ''} ${r.patient_last_name || ''}`.toLowerCase();
      const meds = (r.medicines || []).map((m) => m.medicine_name.toLowerCase()).join(' ');
      return patient.includes(q) || String(r.id).includes(q) || String(r.patient_id).includes(q) || String(r.patient_reg_no || '').toLowerCase().includes(q) || meds.includes(q);
    });
  }, [rows, query]);

  const addMedicineRow = () => {
    setNewRx((s) => ({
      ...s,
      medicines: [...s.medicines, { medicine_name: '', dosage: '', frequency: '', duration: '', route: 'oral' }],
    }));
  };

  const removeMedicineRow = (idx: number) => {
    setNewRx((s) => ({ ...s, medicines: s.medicines.filter((_, i) => i !== idx) }));
  };

  const onMedicineSelect = (idx: number, medicineName: string) => {
    const med = medications.find((m) => m.name === medicineName);
    setNewRx((s) => ({
      ...s,
      medicines: s.medicines.map((row, i) =>
        i !== idx
          ? row
          : {
              ...row,
              medicine_name: medicineName,
              dosage: med?.default_dosage || '',
              frequency: med?.default_frequency || '',
              duration: med?.default_duration || '',
              route: med?.default_route || 'oral',
            }
      ),
    }));
  };

  const createPrescription = async () => {
    setCreating(true);
    setError('');
    try {
      await api.post('/medical/prescriptions', {
        patient_reg_no: newRx.patient_reg_no.trim(),
        template_id: newRx.template_id ? Number(newRx.template_id) : null,
        notes: newRx.notes || null,
        follow_up_date: newRx.follow_up_date || null,
        medicines: newRx.medicines.filter((m) => m.medicine_name.trim()),
      });
      setNewRx({
        patient_reg_no: '',
        template_id: '',
        notes: '',
        follow_up_date: '',
        medicines: [{ medicine_name: '', dosage: '', frequency: '', duration: '', route: 'oral' }],
      });
      await load(patientRegFilter.trim());
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to create prescription.');
    } finally {
      setCreating(false);
    }
  };

  const beginEdit = (rx: DoctorPrescription) => {
    setEditingId(rx.id);
    setNewRx({
      patient_reg_no: rx.patient_reg_no || '',
      template_id: '',
      notes: rx.notes || '',
      follow_up_date: rx.follow_up_date ? String(rx.follow_up_date).slice(0, 10) : '',
      medicines: (rx.medicines || []).length
        ? rx.medicines.map((m) => ({
            medicine_name: m.medicine_name || '',
            dosage: m.dosage || '',
            frequency: m.frequency || '',
            duration: m.duration || '',
            route: 'oral',
          }))
        : [{ medicine_name: '', dosage: '', frequency: '', duration: '', route: 'oral' }],
    });
    const el = document.getElementById('create-prescription-form');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewRx({
      patient_reg_no: initialPatientRegNo,
      template_id: '',
      notes: '',
      follow_up_date: '',
      medicines: [{ medicine_name: '', dosage: '', frequency: '', duration: '', route: 'oral' }],
    });
  };

  const updatePrescription = async () => {
    if (!editingId) return;
    setCreating(true);
    setError('');
    try {
      await api.patch(`/medical/prescriptions/${editingId}`, {
        follow_up_date: newRx.follow_up_date || null,
        notes: newRx.notes || null,
        medicines: newRx.medicines.filter((m) => m.medicine_name.trim()),
      });
      cancelEdit();
      await load(patientRegFilter.trim());
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to update prescription.');
    } finally {
      setCreating(false);
    }
  };

  const deletePrescription = async (id: number) => {
    const ok = window.confirm(`Delete prescription #${id}? This cannot be undone.`);
    if (!ok) return;
    setDeletingId(id);
    setError('');
    try {
      await api.delete(`/medical/prescriptions/${id}`);
      if (editingId === id) cancelEdit();
      await load(patientRegFilter.trim());
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to delete prescription.');
    } finally {
      setDeletingId(null);
    }
  };

  const assetBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');

  const toAbsoluteUrl = (input?: string | null) => {
    if (!input) return '';
    if (input.startsWith('http://') || input.startsWith('https://')) return input;
    return `${assetBase}${input}`;
  };

  const toDataUrl = async (url: string) => {
    const res = await fetch(url, { mode: 'cors', credentials: 'include' });
    if (!res.ok) throw new Error(`Failed to fetch image (${res.status})`);
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(String(reader.result || ''));
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const downloadPdf = async (rx: DoctorPrescription) => {
    setDownloadingId(rx.id);
    try {
      const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imageUrl = toAbsoluteUrl(rx.template_image_url);

      if (imageUrl) {
        try {
          const imageDataUrl = await toDataUrl(imageUrl);
          pdf.addImage(imageDataUrl, 'JPEG', 0, 0, pageW, pageH);
        } catch {
          // keep going with text-only layer
        }
      }

      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(26, 26, pageW - 52, pageH - 52, 12, 12, 'F');

      const patientName = `${rx.patient_first_name || ''} ${rx.patient_last_name || ''}`.trim() || '-';
      const startX = 46;
      let y = 58;
      pdf.setTextColor(15, 23, 42);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(20);
      pdf.text(`Prescription #${rx.id}`, startX, y);
      y += 24;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(12);

      const infoLines = [
        `Patient: ${patientName}`,
        `Email: ${rx.patient_email || '-'}`,
        `Phone: ${rx.patient_phone || '-'}`,
        `Gender: ${rx.patient_gender || '-'}`,
        `DOB: ${rx.patient_date_of_birth ? new Date(rx.patient_date_of_birth).toLocaleDateString() : '-'}`,
        `Blood Group: ${rx.patient_blood_type || '-'}`,
        `Template: ${rx.template_name || '-'}`,
        `Issued: ${new Date(rx.date_issued).toLocaleDateString()}`,
        `Follow-up: ${rx.follow_up_date ? new Date(rx.follow_up_date).toLocaleDateString() : '-'}`,
      ];

      for (const line of infoLines) {
        pdf.text(line, startX, y);
        y += 18;
      }

      y += 6;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Medicines:', startX, y);
      y += 16;
      pdf.setFont('helvetica', 'normal');
      for (const [idx, m] of (rx.medicines || []).entries()) {
        const medLine = `${idx + 1}. ${m.medicine_name} | ${m.dosage || '-'} | ${m.frequency || '-'} | ${m.duration || '-'}`;
        const lines = pdf.splitTextToSize(medLine, pageW - 100);
        for (const line of lines) {
          pdf.text(line, startX, y);
          y += 14;
          if (y > pageH - 40) {
            pdf.addPage();
            y = 40;
          }
        }
      }

      y += 8;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Notes:', startX, y);
      y += 14;
      pdf.setFont('helvetica', 'normal');
      const noteLines = pdf.splitTextToSize(rx.notes || '-', pageW - 100);
      pdf.text(noteLines, startX, y);
      pdf.save(`prescription-${rx.id}.pdf`);
    } catch (err) {
      try {
        const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
        const patientName = `${rx.patient_first_name || ''} ${rx.patient_last_name || ''}`.trim() || '-';
        let y = 48;
        pdf.setFontSize(16);
        pdf.text(`Prescription #${rx.id}`, 40, y);
        y += 24;
        pdf.setFontSize(11);
        pdf.text(`Patient: ${patientName}`, 40, y);
        y += 16;
        pdf.text(`Template: ${rx.template_name || '-'}`, 40, y);
        y += 16;
        pdf.text(`Issued: ${new Date(rx.date_issued).toLocaleDateString()}`, 40, y);
        y += 24;
        pdf.setFontSize(12);
        pdf.text('Medicines:', 40, y);
        y += 16;
        pdf.setFontSize(10);
        for (const [idx, m] of (rx.medicines || []).entries()) {
          const line = `${idx + 1}. ${m.medicine_name} | ${m.dosage || '-'} | ${m.frequency || '-'} | ${m.duration || '-'}`;
          pdf.text(line, 40, y);
          y += 14;
          if (y > 790) {
            pdf.addPage();
            y = 40;
          }
        }
        pdf.save(`prescription-${rx.id}.pdf`);
      } catch {
        setError(err instanceof Error ? err.message : 'Failed to generate PDF.');
      }
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Prescriptions</h1>
        <p className="text-sm text-slate-500">Filter by patient, inspect prescriptions, and create from your templates.</p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div id="create-prescription-form" className="rounded-xl border border-slate-100 bg-white p-4 space-y-3">
        <p className="text-sm font-semibold text-slate-800">{editingId ? `Edit Prescription #${editingId}` : 'Create Prescription'}</p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Patient Reg No (e.g. PTJOH9876AB12CD34)"
            value={newRx.patient_reg_no}
            onChange={(e) => setNewRx((s) => ({ ...s, patient_reg_no: e.target.value }))}
          />
          <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm" value={newRx.template_id} onChange={(e) => setNewRx((s) => ({ ...s, template_id: e.target.value }))}>
            <option value="">Select template (optional)</option>
            {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <input type="date" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" value={newRx.follow_up_date} onChange={(e) => setNewRx((s) => ({ ...s, follow_up_date: e.target.value }))} />
          <button disabled={creating || (!editingId && !newRx.patient_reg_no.trim()) || !newRx.medicines.some((m) => m.medicine_name.trim())} onClick={() => void (editingId ? updatePrescription() : createPrescription())} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{creating ? (editingId ? 'Updating...' : 'Creating...') : (editingId ? 'Update Prescription' : 'Create Prescription')}</button>
        </div>
        {editingId && (
          <div>
            <button type="button" onClick={cancelEdit} className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">Cancel Edit</button>
          </div>
        )}
        <textarea className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" rows={2} placeholder="Optional notes override" value={newRx.notes} onChange={(e) => setNewRx((s) => ({ ...s, notes: e.target.value }))} />
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Medicines</p>
          {newRx.medicines.map((m, idx) => (
            <div key={idx} className="grid grid-cols-1 gap-2 md:grid-cols-6">
              <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm md:col-span-2" value={m.medicine_name} onChange={(e) => onMedicineSelect(idx, e.target.value)}>
                <option value="">Select medicine</option>
                {medications.map((med) => <option key={med.id} value={med.name}>{med.name}</option>)}
                {!!m.medicine_name && !medications.some((med) => med.name === m.medicine_name) && <option value={m.medicine_name}>{m.medicine_name}</option>}
              </select>
              <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Dosage" value={m.dosage || ''} onChange={(e) => setNewRx((s) => ({ ...s, medicines: s.medicines.map((x, i) => i === idx ? { ...x, dosage: e.target.value } : x) }))} />
              <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Frequency" value={m.frequency || ''} onChange={(e) => setNewRx((s) => ({ ...s, medicines: s.medicines.map((x, i) => i === idx ? { ...x, frequency: e.target.value } : x) }))} />
              <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Duration" value={m.duration || ''} onChange={(e) => setNewRx((s) => ({ ...s, medicines: s.medicines.map((x, i) => i === idx ? { ...x, duration: e.target.value } : x) }))} />
              <button type="button" onClick={() => removeMedicineRow(idx)} className="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700">Remove</button>
            </div>
          ))}
          <button type="button" onClick={addMedicineRow} className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">+ Add Medicine</button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm md:col-span-2" placeholder="Search by patient, reg no, prescription id, medicine" value={query} onChange={(e) => setQuery(e.target.value)} />
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Filter by Patient Reg No"
            value={patientRegFilter}
            onChange={(e) => setPatientRegFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3">
        {!loading && filtered.length === 0 && <div className="rounded-xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-500">No prescriptions found.</div>}
        {filtered.map((r) => (
          <article key={r.id} className="rounded-xl border border-slate-100 bg-white p-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">
                Prescription #{r.id} - {(r.patient_first_name || '').trim()} {(r.patient_last_name || '').trim()} - {r.template_name || 'No Template'}
              </h2>
              <p className="text-xs text-slate-500">Issued: {new Date(r.date_issued).toLocaleDateString()}</p>
            </div>
            <p className="text-sm text-slate-700">{r.patient_first_name} {r.patient_last_name}</p>
            <p className="mt-1 text-xs text-slate-500">Reg No: {r.patient_reg_no || '-'}</p>
            <p className="mt-1 text-xs text-slate-500">
              {r.patient_email || '-'} | {r.patient_phone || '-'} | {r.patient_gender || '-'} | {r.patient_blood_type || '-'}
            </p>
            <p className="mt-1 text-xs text-slate-500">Template: {r.template_name || '-'}</p>
            {r.template_image_url && (
              <div className="mt-2">
                <img
                  src={toAbsoluteUrl(r.template_image_url)}
                  alt={r.template_name || 'Template preview'}
                  className="h-32 w-auto rounded border border-slate-200 object-contain"
                />
              </div>
            )}
            <p className="mt-1 text-xs text-slate-500">Follow-up: {r.follow_up_date ? new Date(r.follow_up_date).toLocaleDateString() : '-'}</p>
            <div className="mt-3 rounded-lg border border-slate-100 p-3">
              <p className="mb-2 text-xs font-medium text-slate-500">Medicines</p>
              <div className="space-y-1">
                {(r.medicines || []).map((m) => (
                  <p key={m.id} className="text-sm text-slate-700">
                    {m.medicine_name} {m.dosage ? `| ${m.dosage}` : ''} {m.frequency ? `| ${m.frequency}` : ''} {m.duration ? `| ${m.duration}` : ''}
                  </p>
                ))}
              </div>
            </div>
            {r.notes && <p className="mt-2 text-sm text-slate-600">{r.notes}</p>}
            <div className="mt-3">
              <button
                type="button"
                onClick={() => beginEdit(r)}
                className="mr-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => void deletePrescription(r.id)}
                disabled={deletingId === r.id}
                className="mr-2 rounded-lg bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 disabled:opacity-50"
              >
                {deletingId === r.id ? 'Deleting...' : 'Delete'}
              </button>
              <button
                type="button"
                onClick={() => void downloadPdf(r)}
                disabled={downloadingId === r.id}
                className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
              >
                {downloadingId === r.id ? 'Preparing PDF...' : 'Download PDF'}
              </button>
            </div>
          </article>
        ))}
        {loading && <div className="rounded-xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-500">Loading prescriptions...</div>}
      </div>
    </div>
  );
}
