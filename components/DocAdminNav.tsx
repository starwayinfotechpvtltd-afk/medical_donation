'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Calendar, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function DocAdminNav() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
    { href: '/doctor-admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/doctor-admin-dashboard/doctors', label: 'Doctors', icon: Users },
    { href: '/doctor-admin-dashboard/appointments', label: 'Appointments', icon: Calendar },
    { href: '/doctor-admin-dashboard/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900">MediCare Admin</h1>
        <p className="text-sm text-gray-500 mt-1">Doctor Management</p>
      </div>
      <nav className="mt-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
        <div className="border-t border-gray-200 mt-6 pt-4">
          <button onClick={logout} className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
}
