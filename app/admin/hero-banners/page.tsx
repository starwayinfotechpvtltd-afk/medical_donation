'use client';

import { FormEvent, useEffect, useState } from 'react';
import { adminApi, type HeroBanner } from '@/lib/admin-api';
import { ApiException } from '@/lib/api-client';

export default function AdminHeroBannersPage() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', link_url: '', sort_order: '0', is_active: true, banner: null as File | null });

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setBanners(await adminApi.getHeroBannersAdmin());
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to load hero banners.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.banner) return setError('Please choose an image.');
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      const fd = new FormData();
      fd.append('banner', form.banner);
      fd.append('title', form.title.trim());
      fd.append('link_url', form.link_url.trim());
      fd.append('sort_order', form.sort_order);
      fd.append('is_active', form.is_active ? '1' : '0');
      await adminApi.createHeroBanner(fd);
      setForm({ title: '', link_url: '', sort_order: '0', is_active: true, banner: null });
      setMessage('Banner uploaded successfully.');
      await load();
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Could not upload banner.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (item: HeroBanner) => {
    setError(null);
    setMessage(null);
    try {
      await adminApi.updateHeroBanner(item.id, { is_active: item.is_active ? 0 : 1 });
      await load();
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Could not update banner.');
    }
  };

  const remove = async (id: number) => {
    if (!window.confirm('Delete this banner?')) return;
    setError(null);
    setMessage(null);
    try {
      await adminApi.deleteHeroBanner(id);
      await load();
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Could not delete banner.');
    }
  };

  const updateSort = async (id: number, value: number) => {
    try {
      await adminApi.updateHeroBanner(id, { sort_order: value });
      await load();
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Could not update sort order.');
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Hero Banners</h1>
        <p className="text-sm text-slate-500">Upload and manage homepage banner slides.</p>
      </div>

      {message && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}
      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <form onSubmit={onCreate} className="grid gap-3 rounded-xl border border-slate-100 bg-white p-4 sm:grid-cols-2">
        <input value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} placeholder="Title (optional)" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input value={form.link_url} onChange={(e) => setForm((s) => ({ ...s, link_url: e.target.value }))} placeholder="Link URL (optional)" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input type="number" value={form.sort_order} onChange={(e) => setForm((s) => ({ ...s, sort_order: e.target.value }))} placeholder="Sort order" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <label className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((s) => ({ ...s, is_active: e.target.checked }))} />
          Active
        </label>
        <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => setForm((s) => ({ ...s, banner: e.target.files?.[0] || null }))} className="sm:col-span-2 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <button disabled={submitting} className="sm:col-span-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
          {submitting ? 'Uploading...' : 'Upload Banner'}
        </button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
        <table className="w-full min-w-[760px]">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Preview</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Link</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {!loading && banners.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">No banners yet.</td></tr>
            )}
            {banners.map((item) => (
              <tr key={item.id} className="border-t border-slate-100 text-sm">
                <td className="px-4 py-3"><img src={item.image_url.startsWith('http') ? item.image_url : `${baseOrigin}${item.image_url}`} alt={item.title || `Banner ${item.id}`} className="h-14 w-24 rounded object-cover" /></td>
                <td className="px-4 py-3">{item.title || '-'}</td>
                <td className="max-w-[240px] truncate px-4 py-3">{item.link_url || '-'}</td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    defaultValue={item.sort_order}
                    onBlur={(e) => void updateSort(item.id, Number(e.target.value || 0))}
                    className="w-20 rounded border border-slate-200 px-2 py-1 text-sm"
                  />
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => void toggleActive(item)} className={`rounded px-2 py-1 text-xs font-medium ${item.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                    {item.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => void remove(item.id)} className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white">Delete</button>
                </td>
              </tr>
            ))}
            {loading && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">Loading banners...</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
  const baseOrigin = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
