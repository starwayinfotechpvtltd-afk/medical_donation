// lab-admin-dashboard/layout.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  TestTube,
  Users,
  Microscope,
  Settings,
  LogOut,
  Menu,
  X,
  FlaskRound,
  Bell,
  User,
  ChevronDown
} from 'lucide-react';
import LabAdminProtected from '@/components/LabAdminProtected';
import { useAuth } from '@/context/AuthContext';
import { getLoginPathForRole } from '@/lib/auth-routes';

export default function LabAdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navItems = [
    {
      href: '/lab-admin-dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      exact: true
    },
    {
      href: '/lab-admin-dashboard/overview',
      label: 'Overview',
      icon: LayoutDashboard,
      exact: false
    },
    {
      href: '/lab-admin-dashboard/tests',
      label: 'Lab Tests',
      icon: TestTube,
      exact: false
    },
    {
      href: '/lab-admin-dashboard/technicians',
      label: 'Technicians',
      icon: Users,
      exact: false
    },
    {
      href: '/lab-admin-dashboard/equipment',
      label: 'Equipment',
      icon: Microscope,
      exact: false
    }
  ];

  const isActive = (href: string, exact: boolean = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            {/* Logo */}
            <Link href="/lab-admin-dashboard" className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <FlaskRound className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900">LabAdmin</h1>
                <p className="text-xs text-gray-500">Laboratory Management</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden md:inline text-sm font-medium text-gray-700">{user?.name || 'Lab Admin'}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user?.name || 'Lab Admin'}</p>
                      <p className="text-xs text-gray-500">{user?.email || ''}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/lab-admin-dashboard/settings"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                          router.replace(getLoginPathForRole('lab_admin'));
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      style={{ top: '60px' }}>
        <nav className="h-full overflow-y-auto p-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    active
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Bottom Section */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="pt-4 border-t border-gray-200">
              <Link
                href="/lab-admin-dashboard/settings"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
              <button
                onClick={() => {
                  logout();
                  router.replace(getLoginPathForRole('lab_admin'));
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 pt-[60px]">
        <LabAdminProtected>{children}</LabAdminProtected>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          style={{ top: '60px' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
