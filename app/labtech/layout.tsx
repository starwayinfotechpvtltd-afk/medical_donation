'use client';

import { usePathname } from 'next/navigation';
import { LabTechSidebar } from '@/components/LabTechSidebar';
import LabTechProtected from '@/components/LabTechProtected';

export default function LabTechLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/labtech/login';

  // Don't apply protection to login page
  if (isLoginPage) {
    return children;
  }

  return (
    <LabTechProtected>
      <div className="flex bg-slate-950 text-white min-h-screen">
        <LabTechSidebar />
        <main className="flex-1 ml-64 bg-slate-900">
          {children}
        </main>
      </div>
    </LabTechProtected>
  );
}
