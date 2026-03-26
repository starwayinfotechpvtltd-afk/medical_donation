'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

interface LightSidebarProps {
  title: string;
  items: SidebarItem[];
  userRole: string;
}

export function LightSidebar({ title, items, userRole }: LightSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-50 to-sky-50 border-r border-blue-200 min-h-screen flex flex-col shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-blue-200">
        <h2 className="text-2xl font-bold text-blue-900 mb-1">{title}</h2>
        <p className="text-sm text-blue-600">{userRole}</p>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                isActive
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-blue-900 hover:bg-blue-100 text-slate-700'
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-blue-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
