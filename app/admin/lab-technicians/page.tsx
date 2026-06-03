'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/admin-api';
import { api, ApiException } from '@/lib/api-client';

interface LabTechnicianProfile {
  id: number;
  user_id: number;
  first_name?: string;
  last_name?: string;
  lab_name: string;
  licence_number: string;
  certificate_image?: string | null;
  gst_number?: string | null;
  address: string;
  email: string;
  mobile_number: string;
  pan_number?: string | null;
  pan_image?: string | null;
  lab_profile_image?: string | null;
  lab_time?: string | null;
  cert_number?: string | null;
}

const emptyForm = {
  first_name: '', last_name: '', password: '',
  user_id: '', lab_name: '', licence_number: '', gst_number: '', address: '', email: '', mobile_number: '', pan_number: '', lab_time: '', cert_number: '',
};

const assetBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
const toAbsoluteUrl = (input?: string | null) => {
  if (!input) return '';
  if (input.startsWith('http://') || input.startsWith('https://')) return input;
  return `${assetBase}${input}`;
};

export default function AdminLabTechniciansPage() {
  const [profiles, setProfiles] = useState<LabTechnicianProfile[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [panFile, setPanFile] = useState<File | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [certificatePreview, setCertificatePreview] = useState('');
  const [panPreview, setPanPreview] = useState('');
  const [profilePreview, setProfilePreview] = useState('');
  const [detailProfile, setDetailProfile] = useState<LabTechnicianProfile | null>(null);

  const deactivateProfile = async (profile: LabTechnicianProfile) => {
    if (!window.confirm(`Deactivate ${profile.first_name || ''} ${profile.last_name || ''}?`)) return;
    try {
      await adminApi.deactivateUser(profile.user_id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deactivate lab technician.');
    }
  };

  const deleteProfile = async (profile: LabTechnicianProfile) => {
    if (!window.confirm(`Delete ${profile.first_name || ''} ${profile.last_name || ''}? This cannot be undone.`)) return;
    try {
      await adminApi.deleteUser(profile.user_id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete lab technician.');
    }
  };
  const generateTempPassword = () => `LT@${Math.random().toString(36).slice(-8)}!9`;

  const load = async () => {
    setLoading(true); setError('');
    try {
      const pRes = await api.get<LabTechnicianProfile[]>('/lab/lab-technician-profiles');
      setProfiles((pRes.data ?? []) as LabTechnicianProfile[]);
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to load lab technicians.');
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []);

  const submit = async () => {
    if (!form.lab_name || !form.licence_number || !form.address || !form.email || !form.mobile_number) return;
    setSaving(true); setError('');
    try {
      let profileUserId = Number(form.user_id || 0);
      if (!editingId) {
        if (!form.first_name || !form.last_name) {
          setSaving(false);
          setError('First name and last name are required.');
          return;
        }
        const createdUser = await adminApi.createUser({
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          email: form.email.trim(),
          password: form.password || generateTempPassword(),
          phone: form.mobile_number.trim() || undefined,
          role: 'lab_technician',
        });
        profileUserId = createdUser.id;
      }
      const payload = new FormData();
      payload.append('user_id', String(profileUserId));
      payload.append('lab_name', form.lab_name);
      payload.append('licence_number', form.licence_number);
      payload.append('gst_number', form.gst_number || '');
      payload.append('address', form.address);
      payload.append('email', form.email);
      payload.append('mobile_number', form.mobile_number);
      payload.append('pan_number', form.pan_number || '');
      payload.append('lab_time', form.lab_time || '');
      payload.append('cert_number', form.cert_number || '');
      if (certificateFile) payload.append('certificate_image', certificateFile);
      if (panFile) payload.append('pan_image', panFile);
      if (profileFile) payload.append('lab_profile_image', profileFile);
      if (editingId) await api.patch(`/lab/lab-technician-profiles/${editingId}`, payload);
      else await api.post('/lab/lab-technician-profiles', payload);
      setForm(emptyForm); setEditingId(null); setCertificateFile(null); setPanFile(null); setProfileFile(null); setCertificatePreview(''); setPanPreview(''); setProfilePreview(''); await load();
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to save profile.');
    } finally { setSaving(false); }
  };
 
  return <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
    <div><h1 className="text-2xl font-bold text-slate-900">Lab Technicians</h1><p className="text-sm text-slate-500">Add and manage only lab technician profiles.</p></div>
    {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

    <section className="rounded-xl border border-slate-100 bg-white p-4 space-y-3">
      <h2 className="font-semibold text-slate-900">{editingId ? 'Edit Profile' : 'Add Profile'}</h2>
      <div className="grid gap-3 md:grid-cols-3">
        {!editingId && (
          <>
            <input className="rounded border border-slate-200 px-3 py-2 text-sm" placeholder="First Name (User)" value={form.first_name} onChange={(e) => setForm((s) => ({ ...s, first_name: e.target.value }))} />
            <input className="rounded border border-slate-200 px-3 py-2 text-sm" placeholder="Last Name (User)" value={form.last_name} onChange={(e) => setForm((s) => ({ ...s, last_name: e.target.value }))} />
            <input type="password" className="rounded border border-slate-200 px-3 py-2 text-sm" placeholder="Password (optional)" value={form.password} onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))} />
          </>
        )}
        <input className="rounded border border-slate-200 px-3 py-2 text-sm" placeholder="Lab Name" value={form.lab_name} onChange={(e) => setForm((s) => ({ ...s, lab_name: e.target.value }))} />
        <input className="rounded border border-slate-200 px-3 py-2 text-sm" placeholder="Licence Number" value={form.licence_number} onChange={(e) => setForm((s) => ({ ...s, licence_number: e.target.value }))} />
        <input className="rounded border border-slate-200 px-3 py-2 text-sm" placeholder="Email" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} />
        <input className="rounded border border-slate-200 px-3 py-2 text-sm" placeholder="Mobile Number" value={form.mobile_number} onChange={(e) => setForm((s) => ({ ...s, mobile_number: e.target.value }))} />
        <input className="rounded border border-slate-200 px-3 py-2 text-sm" placeholder="GST Number" value={form.gst_number} onChange={(e) => setForm((s) => ({ ...s, gst_number: e.target.value }))} />
        <input className="rounded border border-slate-200 px-3 py-2 text-sm" placeholder="PAN Number" value={form.pan_number} onChange={(e) => setForm((s) => ({ ...s, pan_number: e.target.value }))} />
        <input className="rounded border border-slate-200 px-3 py-2 text-sm" placeholder="Lab Time" value={form.lab_time} onChange={(e) => setForm((s) => ({ ...s, lab_time: e.target.value }))} />
        <input className="rounded border border-slate-200 px-3 py-2 text-sm md:col-span-3" placeholder="Address" value={form.address} onChange={(e) => setForm((s) => ({ ...s, address: e.target.value }))} />

<div className="space-y-2">
  <label className="text-xs font-medium text-slate-600">
    Certificate Image
  </label>

  <input
    type="file"
    accept="image/*,.pdf"
    className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
    onChange={(e) => {
      const f = e.target.files?.[0] || null;
      setCertificateFile(f);
      setCertificatePreview(f ? URL.createObjectURL(f) : '');
    }}
  />

  {(certificatePreview ||
    (editingId &&
      profiles.find((x) => x.id === editingId)?.certificate_image)) && (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <img
        src={
          certificatePreview ||
          profiles.find((x) => x.id === editingId)?.certificate_image ||
          ''
        }
        alt="Certificate"
        className="h-32 w-full object-cover"
      />
    </div>
  )}
</div>

<div className="space-y-2">
  <label className="text-xs font-medium text-slate-600">
    PAN Image
  </label>

  <input
    type="file"
    accept="image/*,.pdf"
    className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
    onChange={(e) => {
      const f = e.target.files?.[0] || null;
      setPanFile(f);
      setPanPreview(f ? URL.createObjectURL(f) : '');
    }}
  />

  {(panPreview ||
    (editingId &&
      profiles.find((x) => x.id === editingId)?.pan_image)) && (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <img
        src={
          panPreview ||
          profiles.find((x) => x.id === editingId)?.pan_image ||
          ''
        }
        alt="PAN"
        className="h-32 w-full object-cover"
      />
    </div>
  )}
</div>

<div className="space-y-2">
  <label className="text-xs font-medium text-slate-600">
    Lab Profile Image
  </label>

  <input
    type="file"
    accept="image/*"
    className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
    onChange={(e) => {
      const f = e.target.files?.[0] || null;
      setProfileFile(f);
      setProfilePreview(f ? URL.createObjectURL(f) : '');
    }}
  />

  {(profilePreview ||
    (editingId &&
      profiles.find((x) => x.id === editingId)?.lab_profile_image)) && (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <img
        src={
          profilePreview ||
          profiles.find((x) => x.id === editingId)?.lab_profile_image ||
          ''
        }
        alt="Profile"
        className="h-32 w-full object-cover"
      />
    </div>
  )}
</div>
      </div>
      <div className="flex gap-3">
        <button onClick={() => void submit()} disabled={saving} className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving...' : editingId ? 'Update Profile' : 'Create Profile'}</button>
        {editingId && <button onClick={() => { setEditingId(null); setForm(emptyForm); }} className="rounded bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Cancel Edit</button>}
      </div>
    </section>

    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {profiles.map((p) => <article key={p.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
        <div className="flex items-start gap-3">
          <div className="h-14 w-14 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            {p.lab_profile_image ? (
              <img src={toAbsoluteUrl(p.lab_profile_image)} alt={`${p.first_name || ''} ${p.last_name || ''}`} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center text-xs font-semibold text-slate-400">
                {(p.first_name?.[0] || '')}{(p.last_name?.[0] || '')}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-900">{p.first_name} {p.last_name}</p>
            <p className="truncate text-xs text-slate-500">{p.lab_name}</p>
            <p className="mt-1 text-xs text-slate-600">Licence: {p.licence_number}</p>
          </div>
        </div>

        <div className="mt-3 space-y-1">
          <p className="truncate text-xs text-slate-600"><span className="font-semibold">Email:</span> {p.email}</p>
          <p className="text-xs text-slate-600"><span className="font-semibold">Mobile:</span> {p.mobile_number}</p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button onClick={() => setDetailProfile(p)} className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">View Details</button>
          <button onClick={() => { setEditingId(p.id); setForm({ first_name: p.first_name || '', last_name: p.last_name || '', password: '', user_id: String(p.user_id), lab_name: p.lab_name || '', licence_number: p.licence_number || '', gst_number: p.gst_number || '', address: p.address || '', email: p.email || '', mobile_number: p.mobile_number || '', pan_number: p.pan_number || '', lab_time: p.lab_time || '', cert_number: p.cert_number || '' }); setCertificatePreview(''); setPanPreview(''); setProfilePreview(''); setCertificateFile(null); setPanFile(null); setProfileFile(null); }} className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">Edit</button>
          <button onClick={() => void deactivateProfile(p)} className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">Deactivate</button>
          <button onClick={() => void deleteProfile(p)} className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">Delete</button>
        </div>
      </article>)}
      {!loading && profiles.length === 0 && <div className="rounded-xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-500">No lab technician profiles found.</div>}
      {loading && <div className="rounded-xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-500 md:col-span-2 xl:col-span-3">Loading...</div>}
    </section>
    {detailProfile && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setDetailProfile(null)}>
        <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Lab Technician Details</h3>
            <button onClick={() => setDetailProfile(null)} className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">Close</button>
          </div>
          <div className="grid gap-3 text-sm md:grid-cols-2">
            <p><span className="font-semibold">Name:</span> {detailProfile.first_name} {detailProfile.last_name}</p>
            <p><span className="font-semibold">Lab Name:</span> {detailProfile.lab_name}</p>
            <p><span className="font-semibold">Licence:</span> {detailProfile.licence_number}</p>
            <p><span className="font-semibold">Email:</span> {detailProfile.email}</p>
            <p><span className="font-semibold">Mobile:</span> {detailProfile.mobile_number}</p>
            <p><span className="font-semibold">GST:</span> {detailProfile.gst_number || '-'}</p>
            <p><span className="font-semibold">PAN:</span> {detailProfile.pan_number || '-'}</p>
            <p><span className="font-semibold">Lab Time:</span> {detailProfile.lab_time || '-'}</p>
            <p><span className="font-semibold">Certificate No:</span> {detailProfile.cert_number || '-'}</p>
            <p className="md:col-span-2"><span className="font-semibold">Address:</span> {detailProfile.address}</p>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div>
              <p className="mb-2 text-xs font-semibold text-slate-600">Lab Profile Photo</p>
              {detailProfile.lab_profile_image ? <img src={toAbsoluteUrl(detailProfile.lab_profile_image)} alt="Lab profile" className="h-32 w-full rounded border object-cover" /> : <div className="h-32 rounded border bg-slate-50 text-xs text-slate-400 grid place-items-center">No image</div>}
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold text-slate-600">Certificate</p>
              {detailProfile.certificate_image ? <img src={toAbsoluteUrl(detailProfile.certificate_image)} alt="Certificate" className="h-32 w-full rounded border object-cover" /> : <div className="h-32 rounded border bg-slate-50 text-xs text-slate-400 grid place-items-center">No image</div>}
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold text-slate-600">PAN Image</p>
              {detailProfile.pan_image ? <img src={toAbsoluteUrl(detailProfile.pan_image)} alt="PAN" className="h-32 w-full rounded border object-cover" /> : <div className="h-32 rounded border bg-slate-50 text-xs text-slate-400 grid place-items-center">No image</div>}
            </div>
          </div>
        </div>
      </div>
    )}
  </div>;
}
