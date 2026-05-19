'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, KeyRound, MailCheck, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api, ApiException } from '@/lib/api-client';
import { getDashboardPathForRole } from '@/lib/auth-routes';

type SetupStep = 1 | 2 | 3;

export default function PatientLoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [mode, setMode] = useState<'login' | 'setup'>('login');
  const [setupStep, setSetupStep] = useState<SetupStep>(1);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      const result = await login(email, password, 'patient');
      if (result.success) {
        router.push(getDashboardPathForRole('patient'));
        return;
      }

      if (result.message.toLowerCase().includes('first-time setup')) {
        setMode('setup');
        setSetupStep(1);
        setSuccess('First-time setup required. Request OTP to create your password.');
      } else {
        setError(result.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const requestOtp = async () => {
    clearMessages();
    setLoading(true);
    try {
      await api.post('/patient/request-otp', { email });
      setSetupStep(2);
      setSuccess('OTP sent to your email.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    clearMessages();
    setLoading(true);
    try {
      await api.post('/patient/verify-otp', { email, otp });
      setSetupStep(3);
      setSuccess('OTP verified. Set your new password.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const setPatientPassword = async () => {
    clearMessages();
    setLoading(true);
    try {
      await api.post('/patient/set-password', { email, password: newPassword });
      setSuccess('Password set successfully. You can login now.');
      setMode('login');
      setPassword('');
    } catch (err) {
      if (err instanceof ApiException) setError(err.message);
      else setError('Failed to set password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-emerald-600">
            <span className="text-2xl font-bold text-white">P</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Patient Access</h1>
          <p className="mt-2 text-slate-600">Login or complete first-time password setup</p>
        </div>

        <div className="mb-6 inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
          <button
            onClick={() => {
              setMode('login');
              clearMessages();
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${mode === 'login' ? 'bg-emerald-600 text-white' : 'text-slate-700'}`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setMode('setup');
              clearMessages();
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${mode === 'setup' ? 'bg-emerald-600 text-white' : 'text-slate-700'}`}
          >
            First Time Setup
          </button>
        </div>

        {error ? <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
        {success ? <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{success}</div> : null}

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <EmailField email={email} setEmail={setEmail} />

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-emerald-500"
                  required
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-3 text-slate-600">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login to Dashboard'}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <EmailField email={email} setEmail={setEmail} />

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              Step {setupStep} of 3: {setupStep === 1 ? 'Request OTP' : setupStep === 2 ? 'Verify OTP' : 'Set Password'}
            </div>

            {setupStep === 1 ? (
              <button
                onClick={() => void requestOtp()}
                disabled={loading || !email}
                className="w-full rounded-lg bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                <span className="inline-flex items-center gap-2"><MailCheck size={18} />{loading ? 'Sending OTP...' : 'Send OTP to Email'}</span>
              </button>
            ) : null}

            {setupStep === 2 ? (
              <>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Enter 6-digit OTP</label>
                  <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  onClick={() => void verifyOtp()}
                  disabled={loading || otp.length !== 6}
                  className="w-full rounded-lg bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  <span className="inline-flex items-center gap-2"><ShieldCheck size={18} />{loading ? 'Verifying...' : 'Verify OTP'}</span>
                </button>
              </>
            ) : null}

            {setupStep === 3 ? (
              <>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Create New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 8 chars, upper/lower/number"
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-emerald-500"
                    />
                    <button type="button" onClick={() => setShowNewPassword((v) => !v)} className="absolute right-3 top-3 text-slate-600">
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => void setPatientPassword()}
                  disabled={loading || newPassword.length < 8}
                  className="w-full rounded-lg bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  <span className="inline-flex items-center gap-2"><KeyRound size={18} />{loading ? 'Saving...' : 'Set Password'}</span>
                </button>
              </>
            ) : null}
          </div>
        )}

        <div className="mt-6 text-center text-sm text-slate-600">
          <Link href="/" className="font-medium text-emerald-600 hover:text-emerald-700">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

function EmailField({ email, setEmail }: { email: string; setEmail: (value: string) => void }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">Patient Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="patient@hospital.com"
        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
        required
      />
    </div>
  );
}
