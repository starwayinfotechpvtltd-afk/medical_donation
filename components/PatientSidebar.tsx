'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Pill, FileText, History, Calendar, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function PatientSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isActive = (path: string) => pathname === path;

  const menuItems = [
    { href: '/patient', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/patient/appointments-view', label: 'Appointments', icon: Calendar },
    { href: '/patient/prescriptions-view', label: 'Prescriptions', icon: Pill },
    { href: '/patient/lab-reports-view', label: 'Lab Reports', icon: FileText },
    { href: '/patient/medical-history-view', label: 'Medical History', icon: History },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-emerald-100 to-green-100 text-slate-900 min-h-screen flex flex-col border-r border-emerald-200">
      {/* Header */}
      <div className="p-6 border-b border-emerald-200">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-white">
            P
          </div>
          <span className="font-bold text-lg text-slate-900">Patient</span>
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-emerald-500 text-white'
                  : 'text-slate-700 hover:bg-emerald-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-emerald-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-100 transition-colors font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
