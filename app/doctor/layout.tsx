// app/doctor/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import DoctorProtected from '@/components/DoctorProtected';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard, Users, FileText, FlaskConical, Calendar,
  Heart, MessageSquare, Settings, LogOut, Bell, Search,
  Menu, Stethoscope, ClipboardList, Pill,
  ChevronDown, User, Clock
} from 'lucide-react';

// Doctor Navigation
const doctorNavigation = {
  overview: [
    { href: '/doctor', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/doctor/patients', label: 'My Patients', icon: Users, exact: false },
    { href: '/doctor/appointments', label: 'Appointments', icon: Calendar, exact: false },
  ],
  clinical: [
    { href: '/doctor/prescriptions', label: 'Prescriptions', icon: FileText, exact: false },
    { href: '/doctor/templates', label: 'Prescription Templates', icon: ClipboardList, exact: false },
    { href: '/doctor/lab-tests', label: 'Lab Tests', icon: FlaskConical, exact: false },
    { href: '/doctor/medications', label: 'Medications', icon: Pill, exact: false },
  ],
  patientCare: [
    { href: '/doctor/vital-signs', label: 'Vital Signs', icon: Heart, exact: false },
    { href: '/doctor/follow-ups', label: 'Follow-ups', icon: Clock, exact: false },
    { href: '/doctor/messages', label: 'Messages', icon: MessageSquare, exact: false },
  ],
  settings: [
    { href: '/doctor/settings', label: 'Settings', icon: Settings, exact: false },
  ],
};

function DoctorSidebar({ collapsed, onToggle, mobileOpen, onMobileClose, doctorName, doctorDept, onLogout }: {
  collapsed: boolean; 
  onToggle: () => void; 
  mobileOpen: boolean; 
  onMobileClose: () => void;
  doctorName: string;
  doctorDept: string;
  onLogout: () => void;
}) {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}
      
      <aside
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-blue-600 to-blue-700 text-white flex flex-col transition-all duration-300 z-40
          ${collapsed ? 'w-16' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo Area */}
        <div className={`flex items-center h-16 border-b border-white/10 ${collapsed ? 'justify-center px-2' : 'px-4'}`}>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-5 h-5 text-blue-600" />
            </div>
            {!collapsed && (
              <div>
                <p className="text-sm font-bold leading-none">Doctor Portal</p>
                <p className="text-xs text-white/70 leading-none mt-0.5 truncate">{doctorName}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          {Object.entries(doctorNavigation).map(([category, items]) => (
            <div key={category} className="mb-6">
              {!collapsed && (
                <p className="text-[10px] font-semibold text-white/50 uppercase tracking-widest px-3 mb-2">
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
                          ? 'bg-white/20 text-white'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      } ${collapsed ? 'justify-center' : ''}`}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-white' : 'text-white/60 group-hover:text-white'}`} />
                      {!collapsed && <span className="flex-1">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Doctor Info */}
        <div className={`border-t border-white/10 p-3 ${collapsed ? 'flex justify-center' : ''}`}>
          {collapsed ? (
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
              DR
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                DR
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{doctorName}</p>
                <p className="text-xs text-white/60 truncate">{doctorDept}</p>
              </div>
              <button
                onClick={onLogout}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Logout"
                title="Logout"
              >
                <LogOut className="w-4 h-4 text-white/70" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function DoctorTopBar({
  onMenuClick,
  onToggleSidebar,
  isMobile,
  doctorName,
  doctorDept,
}: {
  onMenuClick: () => void;
  onToggleSidebar: () => void;
  isMobile: boolean;
  doctorName: string;
  doctorDept: string;
}) {
  const [notifications] = useState(3);
  
  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center px-4 sm:px-6 gap-3 sm:gap-4 sticky top-0 z-30">
      {isMobile ? (
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-500"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      ) : (
        <button
          onClick={onToggleSidebar}
          className="hidden lg:inline-flex p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-500"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}
      
      <div className="flex-1">
        <div className="relative max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search patients, appointments..."
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
            DR
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-slate-900 truncate max-w-[160px]">{doctorName}</p>
            <p className="text-xs text-slate-500 truncate max-w-[160px]">{doctorDept}</p>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </header>
  );
}

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const doctorName = user?.name || [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'Doctor';
  const doctorDept = user?.department || 'Department not set';
  const doctorMeta = user?.specialization
    ? (user?.years_of_experience != null
      ? `${user.specialization} • ${user.years_of_experience} yrs exp`
      : user.specialization)
    : (user?.years_of_experience != null ? `${user.years_of_experience} yrs exp` : 'Doctor');

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

  const handleLogout = () => {
    logout();
    router.push('/doctorLogin');
  };

  return (
    <DoctorProtected>
      <div className="min-h-screen bg-slate-50">
      <DoctorSidebar 
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
        doctorName={doctorName}
        doctorDept={doctorDept}
        onLogout={handleLogout}
      />
      
        <div className={`transition-all duration-300 min-h-screen flex flex-col
          ${!isMobile && (sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64')}
        `}>
          <DoctorTopBar
            onMenuClick={() => setMobileSidebarOpen(true)}
            onToggleSidebar={() => setSidebarCollapsed((v) => !v)}
            isMobile={isMobile}
            doctorName={doctorName}
            doctorDept={doctorMeta}
          />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </DoctorProtected>
  );
}
