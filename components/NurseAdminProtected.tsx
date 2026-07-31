'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getLoginPathForRole } from '@/lib/auth-routes';

export default function NurseAdminProtected({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user?.role !== 'nurse_admin' && user?.role !== 'admin'))) {
      router.replace(getLoginPathForRole('nurse_admin'));
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-rose-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated || (user?.role !== 'nurse_admin' && user?.role !== 'admin')) return null;

  return <>{children}</>;
}
