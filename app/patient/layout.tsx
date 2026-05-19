'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, Calendar, ClipboardList, FileText, LayoutDashboard, LogOut, Menu, User } from 'lucide-react';
import PatientProtected from '@/components/PatientProtected';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { href: '/patient', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/patient/appointments-view', label: 'Appointments', icon: Calendar },
  { href: '/patient/prescriptions-view', label: 'Prescriptions', icon: ClipboardList },
  { href: '/patient/lab-reports-view', label: 'Lab Reports', icon: FileText },
  { href: '/patient/medical-history-view', label: 'Medical History', icon: User },
];

function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();

  const isActive = (href: string, exact = false) => (exact ? pathname === href : pathname.startsWith(href));

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed left-0 top-0 z-50 h-screen w-64 bg-gradient-to-b from-emerald-600 to-emerald-700 text-white transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex h-16 items-center border-b border-white/10 px-4">
          <div className="rounded-lg bg-white p-1.5 text-emerald-700"><User className="h-4 w-4" /></div>
          <div className="ml-2">
            <p className="text-sm font-semibold">Patient Portal</p>
            <p className="text-xs text-emerald-100">{user?.name || 'Patient'}</p>
          </div>
        </div>
        <nav className="space-y-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${isActive(item.href, item.exact) ? 'bg-white/20 text-white' : 'text-emerald-50 hover:bg-white/10'}`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 w-full border-t border-white/10 p-3">
          <button
            onClick={() => {
              logout();
              router.push('/patient/login');
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

function Topbar({ onMenu }: { onMenu: () => void }) {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-100 bg-white px-4 sm:px-6">
      <button onClick={onMenu} className="rounded-lg p-2 text-slate-500 hover:bg-slate-50 lg:hidden">
        <Menu className="h-5 w-5" />
      </button>
      <div className="ml-2 flex-1">
        <p className="text-sm font-semibold text-slate-900">Welcome back, {user?.first_name || 'Patient'}</p>
        <p className="text-xs text-slate-500">Track your care journey</p>
      </div>
      <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-50">
        <Bell className="h-5 w-5" />
      </button>
    </header>
  );
}

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === '/patient/login') return children;

  return (
    <PatientProtected>
      <div className="min-h-screen bg-slate-50">
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="min-h-screen lg:ml-64">
          <Topbar onMenu={() => setMobileOpen(true)} />
          <main>{children}</main>
        </div>
      </div>
    </PatientProtected>
  );
}
