'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Eye, EyeOff, Lock, Save } from 'lucide-react';
import { api } from '@/lib/api-client';

export default function NurseAdminSettingsPage() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('saving');
    setMessage('');
    try {
      await api.post('/auth/change-password', form);
      setStatus('success');
      setMessage('Password updated successfully.');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Failed to update password.');
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
      <div className="flex items-center gap-3">
        <Link href="/nurse-admin-dashboard" className="rounded-lg border bg-white p-2 text-slate-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Settings</h1>
          <p className="mt-1 text-sm text-slate-500">Update your nurse admin password.</p>
        </div>
      </div>

      <form onSubmit={save} className="rounded-lg border bg-white p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Change Password</h2>
        </div>

        <div className="space-y-4">
          {[
            ['currentPassword', 'Current Password', showCurrent, setShowCurrent],
            ['newPassword', 'New Password', showNew, setShowNew],
            ['confirmPassword', 'Confirm New Password', showConfirm, setShowConfirm],
          ].map(([key, label, visible, setVisible]) => (
            <label key={String(key)} className="block text-sm font-medium text-slate-700">
              {String(label)}
              <div className="relative mt-2">
                <input
                  type={visible ? 'text' : 'password'}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [String(key)]: e.target.value }))}
                  className="w-full rounded-lg border px-3 py-2 pr-10 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => (setVisible as React.Dispatch<React.SetStateAction<boolean>>)((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>
          ))}
        </div>

        {message ? (
          <div className={`mt-4 rounded-lg border p-3 text-sm ${status === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
            {message}
          </div>
        ) : null}

        <button disabled={status === 'saving'} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
          {status === 'success' ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {status === 'saving' ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
