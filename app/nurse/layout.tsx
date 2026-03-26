'use client';

import { usePathname } from 'next/navigation';
import { Heart, Camera, Clock, Search } from 'lucide-react';

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

  return <>{children}</>;
}
