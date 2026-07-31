'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api, ApiException } from '@/lib/api-client';
import { Eye, EyeOff, KeyRound, MailCheck, ShieldCheck, Users } from 'lucide-react';
import { getDashboardPathForRole } from '@/lib/auth-routes';

type SetupStep = 1 | 2 | 3;

export default function NurseAdminLoginPage() {
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
      const result = await login(email, password, 'nurse_admin');
      if (result.success) {
        router.push(getDashboardPathForRole('nurse_admin'));
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
      await api.post('/auth/nurse-admin/request-otp', { email });
      setSetupStep(2);
      setSuccess('OTP sent to your nurse admin email.');
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
      await api.post('/auth/nurse-admin/verify-otp', { email, otp });
      setSetupStep(3);
      setSuccess('OTP verified. Set your password now.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const setNurseAdminPassword = async () => {
    clearMessages();
    setLoading(true);
    try {
      await api.post('/auth/nurse-admin/set-password', { email, password: newPassword });
      setSuccess('Password set successfully. You can login now.');
      setMode('login');
      setPassword('');
      setSetupStep(1);
    } catch (err) {
      if (err instanceof ApiException) setError(err.message);
      else setError('Failed to set password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(to bottom right, #fdf2f8, #f1f5f9)',
      padding: '2.5rem 1rem'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '28rem', 
        borderRadius: '1rem', 
        border: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
        padding: '2rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            width: '4rem', 
            height: '4rem', 
            backgroundColor: '#db2777',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto'
          }}>
            <Users style={{ height: '2rem', width: '2rem', color: '#ffffff' }} />
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0f172a' }}>Nurse Admin Access</h1>
          <p style={{ color: '#475569', marginTop: '0.5rem' }}>Login or complete first-time password setup</p>
        </div>

        <div style={{ 
          display: 'inline-flex', 
          borderRadius: '0.75rem', 
          border: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc',
          padding: '0.25rem',
          width: '100%',
          marginBottom: '1.5rem'
        }}>
          <button
            onClick={() => {
              setMode('login');
              clearMessages();
            }}
            style={{ 
              flex: 1,
              borderRadius: '0.5rem',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              backgroundColor: mode === 'login' ? '#db2777' : 'transparent',
              color: mode === 'login' ? '#ffffff' : '#334155',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
          <button
            onClick={() => {
              setMode('setup');
              clearMessages();
            }}
            style={{ 
              flex: 1,
              borderRadius: '0.5rem',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              backgroundColor: mode === 'setup' ? '#db2777' : 'transparent',
              color: mode === 'setup' ? '#ffffff' : '#334155',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            First Time Setup
          </button>
        </div>

        {error && (
          <div style={{ 
            marginBottom: '1rem', 
            borderRadius: '0.5rem', 
            border: '1px solid #fecaca',
            backgroundColor: '#fef2f2',
            padding: '0.75rem',
            fontSize: '0.875rem',
            color: '#dc2626'
          }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ 
            marginBottom: '1rem', 
            borderRadius: '0.5rem', 
            border: '1px solid #a7f3d0',
            backgroundColor: '#ecfdf5',
            padding: '0.75rem',
            fontSize: '0.875rem',
            color: '#059669'
          }}>
            {success}
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>
                Nurse Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nurse.admin@hospital.com"
                style={{
                  width: '100%',
                  borderRadius: '0.5rem',
                  border: '1px solid #cbd5e1',
                  padding: '0.75rem 1rem',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#db2777'}
                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    borderRadius: '0.5rem',
                    border: '1px solid #cbd5e1',
                    padding: '0.75rem 3rem 0.75rem 1rem',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#db2777'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{ 
                    position: 'absolute', 
                    right: '0.75rem', 
                    top: '0.75rem',
                    color: '#475569',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                borderRadius: '0.5rem',
                backgroundColor: '#db2777',
                padding: '0.75rem',
                fontWeight: 600,
                color: '#ffffff',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#be185d')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#db2777')}
            >
              {loading ? 'Logging in...' : 'Login to Dashboard'}
            </button>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>
                Nurse Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nurse.admin@hospital.com"
                style={{
                  width: '100%',
                  borderRadius: '0.5rem',
                  border: '1px solid #cbd5e1',
                  padding: '0.75rem 1rem',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#db2777'}
                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                required
              />
            </div>

            <div style={{ 
              borderRadius: '0.75rem', 
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
              padding: '0.75rem',
              fontSize: '0.75rem',
              color: '#475569'
            }}>
              Step {setupStep} of 3: {setupStep === 1 ? 'Request OTP' : setupStep === 2 ? 'Verify OTP' : 'Set Password'}
            </div>

            {setupStep === 1 && (
              <button
                onClick={() => void requestOtp()}
                disabled={loading || !email}
                style={{
                  width: '100%',
                  borderRadius: '0.5rem',
                  backgroundColor: '#db2777',
                  padding: '0.75rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  border: 'none',
                  cursor: (loading || !email) ? 'not-allowed' : 'pointer',
                  opacity: (loading || !email) ? 0.5 : 1
                }}
                onMouseEnter={(e) => !loading && email && (e.currentTarget.style.backgroundColor = '#be185d')}
                onMouseLeave={(e) => !loading && email && (e.currentTarget.style.backgroundColor = '#db2777')}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MailCheck size={18} />
                  {loading ? 'Sending OTP...' : 'Send OTP to Email'}
                </span>
              </button>
            )}

            {setupStep === 2 && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>
                    Enter 6-digit OTP
                  </label>
                  <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    style={{
                      width: '100%',
                      borderRadius: '0.5rem',
                      border: '1px solid #cbd5e1',
                      padding: '0.75rem 1rem',
                      outline: 'none',
                      textAlign: 'center',
                      fontSize: '1.125rem',
                      letterSpacing: '0.1em'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#db2777'}
                    onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                  />
                </div>
                <button
                  onClick={() => void verifyOtp()}
                  disabled={loading || otp.length !== 6}
                  style={{
                    width: '100%',
                    borderRadius: '0.5rem',
                    backgroundColor: '#db2777',
                    padding: '0.75rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    border: 'none',
                    cursor: (loading || otp.length !== 6) ? 'not-allowed' : 'pointer',
                    opacity: (loading || otp.length !== 6) ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => !loading && otp.length === 6 && (e.currentTarget.style.backgroundColor = '#be185d')}
                  onMouseLeave={(e) => !loading && otp.length === 6 && (e.currentTarget.style.backgroundColor = '#db2777')}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={18} />
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </span>
                </button>
              </>
            )}

            {setupStep === 3 && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>
                    Create New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 8 chars, upper/lower/number"
                      style={{
                        width: '100%',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        padding: '0.75rem 3rem 0.75rem 1rem',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#db2777'}
                      onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((v) => !v)}
                      style={{ 
                        position: 'absolute', 
                        right: '0.75rem', 
                        top: '0.75rem',
                        color: '#475569',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => void setNurseAdminPassword()}
                  disabled={loading || newPassword.length < 8}
                  style={{
                    width: '100%',
                    borderRadius: '0.5rem',
                    backgroundColor: '#059669',
                    padding: '0.75rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    border: 'none',
                    cursor: (loading || newPassword.length < 8) ? 'not-allowed' : 'pointer',
                    opacity: (loading || newPassword.length < 8) ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => !loading && newPassword.length >= 8 && (e.currentTarget.style.backgroundColor = '#047857')}
                  onMouseLeave={(e) => !loading && newPassword.length >= 8 && (e.currentTarget.style.backgroundColor = '#059669')}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <KeyRound size={18} />
                    {loading ? 'Saving...' : 'Set Password'}
                  </span>
                </button>
              </>
            )}
          </div>
        )}

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#475569' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link href="/" style={{ color: '#db2777', fontWeight: 500, textDecoration: 'none' }}>
              Back to Home
            </Link>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <Link href="/patient/login" style={{ color: '#db2777', textDecoration: 'none' }}>
                Patient Login
              </Link>
              <span>|</span>
              <Link href="/doctorLogin" style={{ color: '#db2777', textDecoration: 'none' }}>
                Doctor Login
              </Link>
              <span>|</span>
              <Link href="/adminLogin" style={{ color: '#db2777', textDecoration: 'none' }}>
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}