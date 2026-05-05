'use client';

import { usePathname } from 'next/navigation';
import PatientSidebar from '@/components/PatientSidebar';
import PatientProtected from '@/components/PatientProtected';

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/patient/login';

  // Don't apply protection to login page
  if (isLoginPage) {
    return children;
  }

  return (
    <PatientProtected>
      <div className="flex">

        <main className="flex-1 bg-gray-50">
          {children}
        </main>
      </div>
    </PatientProtected>
  );
}
