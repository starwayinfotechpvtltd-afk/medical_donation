// app/technician/layout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  Beaker, Activity, Heart, Clock, Upload, CheckCircle2,
  Settings, Menu, Microscope, Bell, Search, User,
  X, LogOut, FileText, Plus, Calendar, AlertCircle,
  LayoutDashboard
} from 'lucide-react';

// Technician Sidebar Component
function TechnicianSidebar({ activeDept, onDeptChange, collapsed, onToggle, mobileOpen, onMobileClose }: any) {
  const pathname = usePathname();
  
  const departments = [
    { id: 'laboratory', name: 'Laboratory', icon: Beaker, count: 12, color: 'blue' },
    { id: 'radiology', name: 'Radiology', icon: Activity, count: 8, color: 'sky' },
    { id: 'cardiology', name: 'Cardiology', icon: Heart, count: 5, color: 'red' },
    { id: 'dialysis', name: 'Dialysis', icon: Activity, count: 3, color: 'cyan' }
  ];
  
  const navItems = [
    { label: 'Dashboard', href: '/labtech', icon: LayoutDashboard },
    { label: 'Pending Tests', href: '/labtech/tests', icon: Clock, badge: '28' },
    { label: 'Upload Results', href: '/labtech/upload', icon: Upload },
    { label: 'Completed', href: '/labtech/completed', icon: CheckCircle2, badge: '45' },
    { label: 'Equipment', href: '/labtech/equipment', icon: Settings },
  ];
  
  const isNavActive = (href: string) => {
    if (href === '/labtech') {
      return pathname === '/labtech';
    }
    return pathname.startsWith(href);
  };
  
  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onMobileClose} />
      )}
      
      <aside
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-blue-600 to-blue-700 text-white flex flex-col transition-all duration-300 z-40
          ${collapsed ? 'w-16' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 border-b border-white/10 ${collapsed ? 'justify-center px-2' : 'px-4'}`}>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Microscope className="w-5 h-5 text-blue-600" />
            </div>
            {!collapsed && (
              <div>
                <p className="text-sm font-bold leading-none">Technician Portal</p>
                <p className="text-xs text-white/70 leading-none mt-0.5">Medical Diagnostics</p>
              </div>
            )}
          </div>
          <button
            onClick={onToggle}
            className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${collapsed ? 'hidden' : ''}`}
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
        
        {/* Department Selector */}
        {!collapsed && (
          <div className="px-3 py-4 border-b border-white/10">
            <p className="text-[10px] font-semibold text-white/50 uppercase tracking-widest mb-2">
              Department
            </p>
            <div className="space-y-1">
              {departments.map((dept) => {
                const Icon = dept.icon;
                return (
                  <button
                    key={dept.id}
                    onClick={() => onDeptChange(dept.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      activeDept === dept.id
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="flex-1 text-left">{dept.name}</span>
                    <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded">
                      {dept.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isNavActive(item.href);
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  } ${collapsed ? 'justify-center' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </a>
              );
            })}
          </div>
        </nav>
        
        {/* User Info */}
        <div className={`border-t border-white/10 p-3 ${collapsed ? 'flex justify-center' : ''}`}>
          {collapsed ? (
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
              PT
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                PT
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">Priya Patel</p>
                <p className="text-xs text-white/60 truncate">Lab Technician</p>
              </div>
              <button className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                <LogOut className="w-3.5 h-3.5 text-white/70" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

// Technician Top Bar Component
function TechnicianTopBar({ onMenuClick, department, technicianName }: any) {
  const [notifications] = useState(3);
  
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
            placeholder="Search tests, patients..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
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
        <div className="hidden sm:flex items-center gap-2 px-2 py-1 bg-slate-50 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
            PT
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-slate-900">{technicianName}</p>
            <p className="text-xs text-slate-500">{department}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function TechnicianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [activeDept, setActiveDept] = useState('laboratory');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Don't apply layout to login page
  const isLoginPage = pathname === '/labtechLogin' || pathname === '/technician/login';
  
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
  
  // Store active department in localStorage to persist across pages
  useEffect(() => {
    const savedDept = localStorage.getItem('technicianDepartment');
    if (savedDept) {
      setActiveDept(savedDept);
    }
  }, []);
  
  const handleDeptChange = (dept: string) => {
    setActiveDept(dept);
    localStorage.setItem('technicianDepartment', dept);
  };
  
  const getDepartmentTitle = () => {
    switch(activeDept) {
      case 'laboratory': return 'Clinical Laboratory';
      case 'radiology': return 'Radiology & Imaging';
      case 'cardiology': return 'Cardiology Diagnostics';
      case 'dialysis': return 'Dialysis Unit';
      default: return 'Medical Diagnostics';
    }
  };
  
  const getTechnicianRole = () => {
    switch(activeDept) {
      case 'laboratory': return 'Lab Technician';
      case 'radiology': return 'Radiology Technician';
      case 'cardiology': return 'Cardiology Technician';
      case 'dialysis': return 'Dialysis Technician';
      default: return 'Medical Technician';
    }
  };
  
  if (isLoginPage) {
    return children;
  }
  
  // Type-safe way to pass props to children
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { activeDept });
    }
    return child;
  });
  
  return (
    <div className="min-h-screen bg-slate-50/50">
      <TechnicianSidebar
        activeDept={activeDept}
        onDeptChange={handleDeptChange}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      
      <div className={`transition-all duration-300 min-h-screen flex flex-col
        ${!isMobile && (sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64')}
      `}>
        <TechnicianTopBar
          onMenuClick={() => setMobileSidebarOpen(true)}
          department={getDepartmentTitle()}
          technicianName="Priya Patel"
        />
        <main className="flex-1">
          {childrenWithProps}
        </main>
      </div>
    </div>
  );
}