'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getDashboardPathForRole } from '@/lib/auth-routes';

export default function NurseLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password, 'nurse');
      if (result.success) {
        router.push(getDashboardPathForRole('nurse'));
      } else {
        setError(result.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-sky-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-sky-500 p-8 text-white">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Heart className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold">Nurse Login</h1>
            </div>
            <p className="text-sky-100 text-center">Nursing Staff Portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-5 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nurse@hospital.com"
                  className="w-full px-4 py-3 border-2 border-sky-200 rounded-lg focus:border-sky-500 focus:outline-none font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-sky-200 rounded-lg focus:border-sky-500 focus:outline-none font-medium"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border-2 border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6 font-medium text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
            >
              {loading ? 'Logging in...' : 'Login as Nurse'}
            </button>

            {/* Demo Credentials */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mt-6">
              <p className="text-xs font-bold text-blue-900 mb-2">Demo Credentials:</p>
              <p className="text-xs text-blue-800">Email: nurse@hospital.com</p>
              <p className="text-xs text-blue-800">Password: nurse123</p>
            </div>

            {/* Footer Links */}
            <div className="mt-6 text-center space-y-2 border-t-2 border-sky-100 pt-6">
              <p className="text-slate-600 text-sm">
                Not a nurse?{' '}
                <Link href="/" className="text-sky-600 hover:text-sky-700 font-bold">
                  Return Home
                </Link>
              </p>
              <p className="text-slate-600 text-sm">
                <Link href="/patient/login" className="text-sky-600 hover:text-sky-700 font-bold">
                  Patient Login
                </Link>
                {' | '}
                <Link href="/doctorLogin" className="text-blue-600 hover:text-blue-700 font-bold">
                  Doctor Login
                </Link>
                {' | '}
                <Link href="/adminLogin" className="text-slate-600 hover:text-slate-700 font-bold">
                  Admin Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
