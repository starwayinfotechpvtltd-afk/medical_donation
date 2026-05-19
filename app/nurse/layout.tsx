'use client';

import { usePathname } from 'next/navigation';
import NurseProtected from '@/components/NurseProtected';

export default function NurseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/nurse/login';

  if (isLoginPage) {
    return children;
  }

  return <NurseProtected>{children}</NurseProtected>;
}
