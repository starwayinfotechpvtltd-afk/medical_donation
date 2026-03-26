'use client';

import { usePathname } from 'next/navigation';
import { DoctorSidebar } from '@/components/DoctorSidebar';
import DoctorProtected from '@/components/DoctorProtected';

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/doctor/login';

  // Don't apply protection to login page
  if (isLoginPage) {
    return children;
  }

  return (
    <DoctorProtected>
      <div className="flex bg-slate-950 text-white min-h-screen">
        <DoctorSidebar />
        <main className="flex-1 ml-64 bg-slate-900">
          {children}
        </main>
      </div>
    </DoctorProtected>
  );
}
