'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function DoctorLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = login(email, password, 'doctor');

    if (success) {
      router.push('/doctor');
    } else {
      setError('Invalid email or password');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">D</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Doctor Login</h1>
            <p className="text-slate-600 mt-2">Access your patient dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@hospital.com"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-600 hover:text-slate-800"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-slate-700 font-semibold mb-2">Demo Credentials:</p>
            <p className="text-sm text-slate-600">Email: <code className="font-mono bg-white px-2 py-1 rounded">doctor@hospital.com</code></p>
            <p className="text-sm text-slate-600">Password: <code className="font-mono bg-white px-2 py-1 rounded">doctor123</code></p>
          </div>

          <div className="mt-6 text-center space-y-2">
            <p className="text-slate-600">
              Not a doctor?{' '}
              <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
                Go back home
              </Link>
            </p>
            <div className="flex gap-2 justify-center text-sm text-slate-600">
              <Link href="/patient/login" className="text-blue-600 hover:text-blue-700">Patient Login</Link>
              <span>•</span>
              <Link href="/admin/login" className="text-blue-600 hover:text-blue-700">Admin Login</Link>
              <span>•</span>
              <Link href="/labtech/login" className="text-blue-600 hover:text-blue-700">Lab Tech Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
