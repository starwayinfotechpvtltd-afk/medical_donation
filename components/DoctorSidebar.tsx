'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Users, FileText, History, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function DoctorSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isActive = (path: string) => pathname === path;

  const menuItems = [
    { href: '/doctor', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/doctor/patients-list', label: 'My Patients', icon: Users },
    { href: '/doctor/write-prescription', label: 'Write Prescription', icon: FileText },
    { href: '/doctor/patient-history', label: 'Patient History', icon: History }
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-100 to-sky-100 text-slate-900 fixed left-0 top-0 h-screen flex flex-col border-r border-blue-200">
      <div className="p-6 border-b border-blue-200">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white">D</div>
          Doctor Portal
        </h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                active
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-700 hover:bg-blue-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-blue-200 space-y-2">
        <div className="px-4 py-2 text-sm">
          <p className="font-semibold text-slate-900">{user?.name}</p>
          <p className="text-slate-600">{user?.department}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
