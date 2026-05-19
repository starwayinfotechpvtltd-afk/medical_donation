'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api, ApiException } from '@/lib/api-client';
import { Eye, EyeOff, KeyRound, MailCheck, ShieldCheck } from 'lucide-react';
import { getDashboardPathForRole } from '@/lib/auth-routes';

type SetupStep = 1 | 2 | 3;

export default function DoctorLoginPage() {
  const [mode, setMode] = useState<'login' | 'setup'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [setupStep, setSetupStep] = useState<SetupStep>(1);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      const result = await login(email, password, 'doctor');
      if (result.success) {
        router.push(getDashboardPathForRole('doctor'));
        return;
      }

      if (result.message.toLowerCase().includes('setup')) {
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
      await api.post('/auth/doctor/request-otp', { email });
      setSetupStep(2);
      setSuccess('OTP sent to your doctor email.');
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
      await api.post('/auth/doctor/verify-otp', { email, otp });
      setSetupStep(3);
      setSuccess('OTP verified. Set your password now.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const setDoctorPassword = async () => {
    clearMessages();
    setLoading(true);
    try {
      await api.post('/auth/doctor/set-password', { email, password: newPassword });
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">D</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Doctor Access</h1>
          <p className="text-slate-600 mt-2">Login or complete first-time password setup</p>
        </div>

        <div className="mb-6 inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
          <button
            onClick={() => {
              setMode('login');
              clearMessages();
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${mode === 'login' ? 'bg-blue-600 text-white' : 'text-slate-700'}`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setMode('setup');
              clearMessages();
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${mode === 'setup' ? 'bg-blue-600 text-white' : 'text-slate-700'}`}
          >
            First Time Setup
          </button>
        </div>

        {error ? <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
        {success ? <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{success}</div> : null}

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <FieldEmail email={email} setEmail={setEmail} />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-blue-500"
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
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login to Dashboard'}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <FieldEmail email={email} setEmail={setEmail} />

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              Step {setupStep} of 3: {setupStep === 1 ? 'Request OTP' : setupStep === 2 ? 'Verify OTP' : 'Set Password'}
            </div>

            {setupStep === 1 ? (
              <button
                onClick={() => void requestOtp()}
                disabled={loading || !email}
                className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <span className="inline-flex items-center gap-2"><MailCheck size={18} />{loading ? 'Sending OTP...' : 'Send OTP to Email'}</span>
              </button>
            ) : null}

            {setupStep === 2 ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Enter 6-digit OTP</label>
                  <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={() => void verifyOtp()}
                  disabled={loading || otp.length !== 6}
                  className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <span className="inline-flex items-center gap-2"><ShieldCheck size={18} />{loading ? 'Verifying...' : 'Verify OTP'}</span>
                </button>
              </>
            ) : null}

            {setupStep === 3 ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Create New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 8 chars, upper/lower/number"
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-blue-500"
                    />
                    <button type="button" onClick={() => setShowNewPassword((v) => !v)} className="absolute right-3 top-3 text-slate-600">
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => void setDoctorPassword()}
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
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

function FieldEmail({ email, setEmail }: { email: string; setEmail: (value: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">Doctor Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="doctor@hospital.com"
        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        required
      />
    </div>
  );
}
