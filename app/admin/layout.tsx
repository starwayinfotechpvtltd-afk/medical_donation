// app/admin/layout.tsx (Global Admin Layout)
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Shield, Activity, Settings, LogOut,
  Bell, Search, Menu, Heart, Calendar, FlaskConical, Stethoscope,
  BarChart3, MessageSquare, Building2, FileText, TestTube,
  ChevronDown, Plus, X
} from 'lucide-react';

// Navigation configuration
const navigation = {
  overview: [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3, exact: false },
  ],
  management: [
    { href: '/admin/staff-roles', label: 'Staff & Roles', icon: Shield, exact: false },
    { href: '/admin/patients', label: 'Patients', icon: Users, exact: false },
    { href: '/admin/appointments', label: 'Appointments', icon: Calendar, exact: false },
    { href: '/admin/lab-tests', label: 'Lab Tests', icon: FlaskConical, exact: false },
    { href: '/admin/departments', label: 'Departments', icon: Building2, exact: false },
  ],
  communication: [
    { href: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare, exact: false },
    { href: '/admin/activity', label: 'Activity Logs', icon: Activity, exact: false },
  ],
  system: [
    { href: '/admin/settings', label: 'Settings', icon: Settings, exact: false },
  ],
};

function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: { 
  collapsed: boolean; 
  onToggle: () => void; 
  mobileOpen: boolean; 
  onMobileClose: () => void;
}) {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}
      
      <aside
        className={`fixed left-0 top-0 h-screen bg-white border-r border-slate-100 flex flex-col transition-all duration-300 z-40
          ${collapsed ? 'w-16' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ boxShadow: '1px 0 20px rgba(0,0,0,0.04)' }}
      >
        {/* Logo Area */}
        <div className={`flex items-center h-16 border-b border-slate-100 ${collapsed ? 'justify-center px-2' : 'px-4'}`}>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Heart className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <div>
                <p className="text-sm font-bold text-slate-900 leading-none">MediCare</p>
                <p className="text-xs text-slate-400 leading-none mt-0.5">Admin Portal</p>
              </div>
            )}
          </div>
          <button
            onClick={onToggle}
            className={`p-1.5 rounded-lg hover:bg-slate-50 transition-colors text-slate-400 ${collapsed ? 'hidden' : ''}`}
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          {Object.entries(navigation).map(([category, items]) => (
            <div key={category} className="mb-6">
              {!collapsed && (
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-2">
                  {category}
                </p>
              )}
              <div className="space-y-1">
                {items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href, item.exact);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => onMobileClose()}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                        active
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      } ${collapsed ? 'justify-center' : ''}`}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                      {!collapsed && <span className="flex-1">{item.label}</span>}
                      {!collapsed && active && (
                        <div className="w-1 h-6 bg-blue-600 rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Section */}
        <div className={`border-t border-slate-100 p-3 ${collapsed ? 'flex justify-center' : ''}`}>
          {collapsed ? (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
              HA
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                HA
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">Hospital Admin</p>
                <p className="text-xs text-slate-400 truncate">admin@hospital.com</p>
              </div>
              <button className="p-1 hover:bg-slate-50 rounded-lg transition-colors text-slate-400">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const [notifications, setNotifications] = useState(3);
  
  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center px-4 sm:px-6 gap-3 sm:gap-4 sticky top-0 z-30">
      <button 
        onClick={onMenuClick}
        className="lg:hidden p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-500"
      >
        <Menu className="w-5 h-5" />
      </button>
      
      <div className="flex-1">
        <div className="relative max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search patients, staff, reports..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-1 sm:gap-2">
        <button className="relative p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          {notifications > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-white" />
          )}
        </button>
        <button className="hidden sm:flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          Quick Action
        </button>
      </div>
    </header>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Sidebar 
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      
      <div className={`transition-all duration-300 min-h-screen flex flex-col
        ${!isMobile && (sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64')}
      `}>
        <TopBar onMenuClick={() => setMobileSidebarOpen(true)} />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}