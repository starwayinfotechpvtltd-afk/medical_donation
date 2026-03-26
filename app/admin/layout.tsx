'use client';

import { usePathname } from 'next/navigation';
import { AdminSidebar } from "@/components/AdminSidebar";
import AdminProtected from "@/components/AdminProtected";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  // Don't apply protection to login page
  if (isLoginPage) {
    return children;
  }

  return (
    <AdminProtected>
      <div className="flex bg-slate-950 text-white min-h-screen">
        <AdminSidebar />
        <main className="flex-1 ml-64 bg-slate-900">
          {children}
        </main>
      </div>
    </AdminProtected>
  );
}
