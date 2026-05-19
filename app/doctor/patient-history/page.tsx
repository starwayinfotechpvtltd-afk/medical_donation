'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Calendar, Clock, FileText, Pill } from 'lucide-react';
import { api, ApiException } from '@/lib/api-client';

type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled';

interface Appointment {
  id: number;
  patient_id: number;
  patient_first_name: string;
  patient_last_name: string;
  scheduled_date: string;
  scheduled_time: string;
  status: AppointmentStatus;
  reason?: string | null;
}

interface PrescriptionMedicine {
  id: number;
  medicine_name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface Prescription {
  id: number;
  patient_id: number;
  date_issued: string;
  notes?: string | null;
  medicines: PrescriptionMedicine[];
}

interface HistoryEvent {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  status?: string;
  type: 'appointment' | 'prescription';
}

function formatStatus(status: string) {
  if (status === 'pending') return 'Pending Approval';
  if (status === 'confirmed') return 'Approved';
  if (status === 'cancelled') return 'Rejected/Cancelled';
  return status;
}

export default function PatientHistoryPage() {
  const searchParams = useSearchParams();
  const selectedPatientId = Number(searchParams.get('patientId') || '');

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patientId, setPatientId] = useState<number>(Number.isFinite(selectedPatientId) ? selectedPatientId : 0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const apptRes = await api.get<Appointment[]>('/appointments');
        const appts = (apptRes.data ?? []) as Appointment[];
        setAppointments(appts);

        const firstPatient = appts[0]?.patient_id ?? 0;
        const activePatientId = patientId || selectedPatientId || firstPatient;
        if (activePatientId) {
          setPatientId(activePatientId);
          const rxRes = await api.get<Prescription[]>(`/medical/patients/${activePatientId}/prescriptions`);
          setPrescriptions((rxRes.data ?? []) as Prescription[]);
        } else {
          setPrescriptions([]);
        }
      } catch (err) {
        setError(err instanceof ApiException ? err.message : 'Failed to load patient history.');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [selectedPatientId]);

  useEffect(() => {
    const loadPrescriptionForPatient = async () => {
      if (!patientId) return;
      try {
        const rxRes = await api.get<Prescription[]>(`/medical/patients/${patientId}/prescriptions`);
        setPrescriptions((rxRes.data ?? []) as Prescription[]);
      } catch {
        setPrescriptions([]);
      }
    };
    void loadPrescriptionForPatient();
  }, [patientId]);

  const patientOptions = useMemo(() => {
    const unique = new Map<number, string>();
    for (const item of appointments) {
      unique.set(item.patient_id, `${item.patient_first_name} ${item.patient_last_name}`);
    }
    return [...unique.entries()].map(([id, name]) => ({ id, name }));
  }, [appointments]);

  const patientAppointments = useMemo(
    () => appointments.filter((a) => a.patient_id === patientId),
    [appointments, patientId]
  );

  const patientName = useMemo(
    () => patientOptions.find((p) => p.id === patientId)?.name || 'Patient',
    [patientOptions, patientId]
  );

  const events = useMemo(() => {
    const appointmentEvents: HistoryEvent[] = patientAppointments.map((a) => ({
      id: `appt-${a.id}`,
      date: `${a.scheduled_date}T${a.scheduled_time}`,
      title: `Appointment #${a.id}`,
      subtitle: a.reason || 'No reason provided',
      status: formatStatus(a.status),
      type: 'appointment',
    }));

    const prescriptionEvents: HistoryEvent[] = prescriptions.map((p) => ({
      id: `rx-${p.id}`,
      date: p.date_issued,
      title: `Prescription #${p.id}`,
      subtitle: `${p.medicines.length} medicine(s) prescribed`,
      type: 'prescription',
    }));

    return [...appointmentEvents, ...prescriptionEvents].sort((a, b) => b.date.localeCompare(a.date));
  }, [patientAppointments, prescriptions]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Patient History</h1>
        <p className="text-sm text-slate-500">Timeline with appointment approval flow and prescriptions.</p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="rounded-xl border border-slate-100 bg-white p-4">
        <label className="mb-2 block text-sm font-medium text-slate-700">Select patient</label>
        <select
          value={patientId || ''}
          onChange={(e) => setPatientId(Number(e.target.value))}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">Choose patient</option>
          {patientOptions.map((p) => (
            <option key={p.id} value={p.id}>{p.name} (#{p.id})</option>
          ))}
        </select>
      </div>

      {patientId > 0 && (
        <div className="rounded-xl border border-slate-100 bg-white p-4">
          <h2 className="text-lg font-semibold text-slate-900">{patientName}</h2>
          <p className="text-sm text-slate-500">Patient #{patientId}</p>
        </div>
      )}

      <div className="space-y-3">
        {!loading && events.length === 0 && (
          <div className="rounded-xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-500">No history records found for this patient.</div>
        )}
        {events.map((event) => (
          <article key={event.id} className="rounded-xl border border-slate-100 bg-white p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-slate-100 p-2 text-slate-700">
                  {event.type === 'appointment' ? <Calendar className="h-4 w-4" /> : <Pill className="h-4 w-4" />}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{event.title}</h3>
                  <p className="text-sm text-slate-600">{event.subtitle}</p>
                  {event.status && <p className="mt-1 text-xs font-medium text-slate-500">{event.status}</p>}
                </div>
              </div>
              <div className="text-right text-xs text-slate-500">
                <div className="flex items-center justify-end gap-1"><Clock className="h-3.5 w-3.5" />{new Date(event.date).toLocaleString()}</div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {loading && (
        <div className="rounded-xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-500">
          <span className="inline-flex items-center gap-2"><AlertCircle className="h-4 w-4 animate-pulse" /> Loading patient history...</span>
        </div>
      )}

      {prescriptions.length > 0 && (
        <div className="rounded-xl border border-slate-100 bg-white p-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900"><FileText className="h-4 w-4" /> Latest Prescriptions</h3>
          <div className="space-y-2">
            {prescriptions.slice(0, 5).map((rx) => (
              <div key={rx.id} className="rounded-lg border border-slate-100 p-3">
                <p className="text-sm font-medium text-slate-900">Prescription #{rx.id}</p>
                <p className="text-xs text-slate-500">{new Date(rx.date_issued).toLocaleDateString()}</p>
                <p className="mt-1 text-xs text-slate-600">{rx.medicines.map((m) => `${m.medicine_name} (${m.dosage})`).join(', ') || 'No medicines listed'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
