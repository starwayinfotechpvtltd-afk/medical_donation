'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, Users, ClipboardList, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const nurseNavItems = [
  { name: 'Dashboard', href: '/nurse', icon: LayoutDashboard },
  { name: 'Care Timetable', href: '/nurse/attendance', icon: Calendar },
  { name: 'Patient Lookup', href: '/nurse/patient-lookup', icon: Users },
  { name: 'Assignments', href: '/nurse/staff-records', icon: ClipboardList },
];

export function NurseSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-pink-100 to-rose-100 border-r border-pink-200 min-h-screen fixed left-0 top-0 pt-20 flex flex-col">
      <nav className="flex-1 px-4 py-6">
        {nurseNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive 
                  ? 'bg-pink-500 text-white' 
                  : 'text-slate-700 hover:bg-pink-200'
              }`}>
                <Icon className="w-5 h-5" />
                <span className="font-semibold text-sm">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>
      <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 mx-4 mb-4 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors font-semibold">
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </aside>
  );
}
