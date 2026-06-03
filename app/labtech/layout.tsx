// app/technician/layout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import LabTechProtected from '@/components/LabTechProtected';
import { api } from '@/lib/api-client';
import {
  Beaker, Activity, Heart, Clock, Upload, CheckCircle2,
  Settings, Menu, Microscope, Bell, Search,
  LogOut, Plus, LayoutDashboard
} from 'lucide-react';

function TechnicianSidebar({ activeDept, onDeptChange, collapsed, onToggle, mobileOpen, onMobileClose, departments }: any) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/labtech', icon: LayoutDashboard },
    { label: 'Pending Tests', href: '/labtech/tests', icon: Clock, badge: '28' },
    { label: 'Upload Results', href: '/labtech/upload', icon: Upload },
    { label: 'Completed', href: '/labtech/completed', icon: CheckCircle2, badge: '45' },
    { label: 'Manage Department', href: '/labtech/manage-departments', icon: Plus },
    { label: 'Equipment', href: '/labtech/equipment', icon: Settings },
  ];

  const isNavActive = (href: string) => (href === '/labtech' ? pathname === '/labtech' : pathname.startsWith(href));

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onMobileClose} />}

      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen flex-col bg-gradient-to-b from-blue-600 to-blue-700 text-white transition-all duration-300
          ${collapsed ? 'w-16' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className={`flex h-16 items-center border-b border-white/10 ${collapsed ? 'justify-center px-2' : 'px-4'}`}>
          <div className="flex flex-1 items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
              <Microscope className="h-5 w-5 text-blue-600" />
            </div>
            {!collapsed && (
              <div>
                <p className="text-sm font-bold leading-none">Technician Portal</p>
                <p className="mt-0.5 text-xs leading-none text-white/70">Medical Diagnostics</p>
              </div>
            )}
          </div>
          <button onClick={onToggle} className={`rounded-lg p-1.5 transition-colors hover:bg-white/10 ${collapsed ? 'hidden' : ''}`}>
            <Menu className="h-4 w-4" />
          </button>
        </div>

        {!collapsed && (
          <div className="border-b border-white/10 px-3 py-4">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/50">Department</p>
            <div className="space-y-1">
              {departments.map((dept: any) => {
                const iconMap: Record<string, any> = { all: LayoutDashboard, laboratory: Beaker, radiology: Activity, cardiology: Heart, dialysis: Activity };
                const Icon = iconMap[dept.id] || Beaker;
                return (
                  <button
                    key={dept.id}
                    onClick={() => onDeptChange(dept.id)}
                    className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${activeDept === dept.id ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="flex-1 text-left">{dept.name}</span>
                    <span className="rounded bg-white/20 px-1.5 py-0.5 text-xs">{dept.count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isNavActive(item.href);
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isActive ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'} ${collapsed ? 'justify-center' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && <span className="rounded bg-white/20 px-1.5 py-0.5 text-xs">{item.badge}</span>}
                    </>
                  )}
                </a>
              );
            })}
          </div>
        </nav>

        <div className={`border-t border-white/10 p-3 ${collapsed ? 'flex justify-center' : ''}`}>
          {collapsed ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white">PT</div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 font-bold text-white">PT</div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-white">Priya Patel</p>
                <p className="truncate text-xs text-white/60">Lab Technician</p>
              </div>
              <button className="rounded-lg p-1 transition-colors hover:bg-white/10"><LogOut className="h-3.5 w-3.5 text-white/70" /></button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function TechnicianTopBar({ onMenuClick, department, technicianName }: any) {
  const [notifications] = useState(3);
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-100 bg-white px-4 sm:gap-4 sm:px-6">
      <button onClick={onMenuClick} className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-50 lg:hidden"><Menu className="h-5 w-5" /></button>
      <div className="flex-1">
        <div className="relative max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search tests, patients..." className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <button className="relative rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700">
          <Bell className="h-5 w-5" />
          {notifications > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white" />}
        </button>
        <div className="hidden items-center gap-2 rounded-lg bg-slate-50 px-2 py-1 sm:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-bold text-white">PT</div>
          <div className="text-left">
            <p className="text-xs font-semibold text-slate-900">{technicianName}</p>
            <p className="text-xs text-slate-500">{department}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function TechnicianLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [activeDept, setActiveDept] = useState('all');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [departments, setDepartments] = useState<Array<{ id: string; name: string; count: number }>>([
    { id: 'all', name: 'All Departments', count: 28 },
    { id: 'laboratory', name: 'Laboratory', count: 12 },
    { id: 'radiology', name: 'Radiology', count: 8 },
    { id: 'cardiology', name: 'Cardiology', count: 5 },
    { id: 'dialysis', name: 'Dialysis', count: 3 },
  ]);

  const isLoginPage = pathname === '/labtechLogin' || pathname === '/technician/login';

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setMobileSidebarOpen(false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const loadDepts = async () => {
    try {
      const res = await api.get<Array<{ department_key: string; department_name: string }>>('/lab/my-departments');
      const base = [
        { id: 'all', name: 'All Departments', count: 28 },
        { id: 'laboratory', name: 'Laboratory', count: 12 },
        { id: 'radiology', name: 'Radiology', count: 8 },
        { id: 'cardiology', name: 'Cardiology', count: 5 },
        { id: 'dialysis', name: 'Dialysis', count: 3 },
      ];
      const baseIds = new Set(base.map((b) => b.id));
      const extra = (res.data || []).filter((d) => !baseIds.has(d.department_key)).map((d) => ({ id: d.department_key, name: d.department_name, count: 0 }));
      setDepartments([...base, ...extra]);
    } catch {}
  };

  useEffect(() => {
    const savedDept = localStorage.getItem('technicianDepartment');
    if (savedDept) setActiveDept(savedDept);
    void loadDepts();
    const onStorage = (e: StorageEvent) => { if (e.key === 'labtechDeptRefresh') void loadDepts(); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleDeptChange = (dept: string) => {
    setActiveDept(dept);
    localStorage.setItem('technicianDepartment', dept);
  };

  const getDepartmentTitle = () => {
    if (activeDept === 'all') return 'All Departments';
    switch(activeDept) {
      case 'laboratory': return 'Clinical Laboratory';
      case 'radiology': return 'Radiology & Imaging';
      case 'cardiology': return 'Cardiology Diagnostics';
      case 'dialysis': return 'Dialysis Unit';
      default: return 'Medical Diagnostics';
    }
  };

  if (isLoginPage) return children;

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement<{ activeDept?: string }>(child)) return React.cloneElement(child, { activeDept });
    return child;
  });

  return (
    <LabTechProtected>
      <div className="min-h-screen bg-slate-50/50">
        <TechnicianSidebar
          activeDept={activeDept}
          onDeptChange={handleDeptChange}
          departments={departments}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        <div className={`min-h-screen flex flex-col transition-all duration-300 ${!isMobile && (sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64')}`}>
          <TechnicianTopBar onMenuClick={() => setMobileSidebarOpen(true)} department={getDepartmentTitle()} technicianName="Priya Patel" />
          <main className="flex-1">{childrenWithProps}</main>
        </div>
      </div>
    </LabTechProtected>
  );
}
