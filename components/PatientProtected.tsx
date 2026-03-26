'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface PatientProtectedProps {
  children: React.ReactNode;
}

export default function PatientProtected({ children }: PatientProtectedProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'patient') {
      router.push('/patient/login');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'patient') {
    return null;
  }

  return <>{children}</>;
}
