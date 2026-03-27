// admin/staff-roles/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Users, Shield, UserPlus, Search, Filter, MoreHorizontal,
  Eye, Edit2, Trash2, CheckCircle2, XCircle, Clock,
  Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap,
  ChevronDown, ChevronRight, Plus, Upload, Download,
  Settings, Key, Lock, Unlock, UserCheck, UserX,
  Award, Star, TrendingUp, AlertCircle, MessageSquare,
  FileText, Activity, PieChart, BarChart3
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  lastActive: string;
  avatar?: string;
  permissions: string[];
  specialization?: string;
  experience: number;
  qualification: string;
  shift: string;
  performance: {
    rating: number;
    totalPatients: number;
    completedTasks: number;
    satisfaction: number;
  };
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  memberCount: number;
  color: string;
  icon: any;
}

interface Permission {
  id: string;
  category: string;
  permissions: {
    id: string;
    name: string;
    description: string;
    module: string;
  }[];
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

const roles: Role[] = [
  { 
    id: '1', 
    name: 'Administrator', 
    description: 'Full system access with all permissions',
    permissions: ['all'],
    memberCount: 3,
    color: 'bg-purple-500',
    icon: Shield
  },
  { 
    id: '2', 
    name: 'Doctor', 
    description: 'Can manage patients, prescribe medication, view medical records',
    permissions: ['view_patients', 'edit_patients', 'prescribe', 'view_lab_results'],
    memberCount: 48,
    color: 'bg-blue-500',
    icon: Shield
  },
  { 
    id: '3', 
    name: 'Nurse', 
    description: 'Can update patient vitals, assist in care, manage appointments',
    permissions: ['view_patients', 'edit_vitals', 'manage_appointments'],
    memberCount: 86,
    color: 'bg-pink-500',
    icon: Shield
  },
  { 
    id: '4', 
    name: 'Lab Technician', 
    description: 'Can manage lab tests, upload results, view patient data',
    permissions: ['view_lab_tests', 'upload_results', 'view_patients'],
    memberCount: 34,
    color: 'bg-green-500',
    icon: Shield
  },
  { 
    id: '5', 
    name: 'Receptionist', 
    description: 'Can manage appointments, patient registration, billing',
    permissions: ['manage_appointments', 'register_patients', 'view_billing'],
    memberCount: 12,
    color: 'bg-amber-500',
    icon: Shield
  },
  { 
    id: '6', 
    name: 'Pharmacist', 
    description: 'Can manage prescriptions, inventory, dispense medication',
    permissions: ['view_prescriptions', 'manage_inventory', 'dispense'],
    memberCount: 8,
    color: 'bg-teal-500',
    icon: Shield
  },
];

const staffMembers: StaffMember[] = [
  {
    id: '1',
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@hospital.com',
    phone: '+91 98765 43210',
    role: 'Doctor',
    department: 'Cardiology',
    status: 'active',
    joinDate: '2022-01-15',
    lastActive: '2024-03-27T10:30:00',
    specialization: 'Interventional Cardiology',
    experience: 12,
    qualification: 'MD, DM Cardiology',
    shift: 'Day Shift (9 AM - 5 PM)',
    permissions: ['view_patients', 'edit_patients', 'prescribe', 'view_lab_results'],
    performance: {
      rating: 4.8,
      totalPatients: 284,
      completedTasks: 1240,
      satisfaction: 96
    }
  },
  {
    id: '2',
    name: 'Priya Patel',
    email: 'priya.patel@hospital.com',
    phone: '+91 98765 43211',
    role: 'Lab Tech',
    department: 'Laboratory',
    status: 'active',
    joinDate: '2023-03-10',
    lastActive: '2024-03-27T09:15:00',
    specialization: 'Hematology',
    experience: 5,
    qualification: 'B.Sc. Medical Lab Technology',
    shift: 'Morning Shift (7 AM - 3 PM)',
    permissions: ['view_lab_tests', 'upload_results', 'view_patients'],
    performance: {
      rating: 4.6,
      totalPatients: 312,
      completedTasks: 845,
      satisfaction: 92
    }
  },
  {
    id: '3',
    name: 'Aisha Khan',
    email: 'aisha.khan@hospital.com',
    phone: '+91 98765 43212',
    role: 'Nurse',
    department: 'General Ward',
    status: 'inactive',
    joinDate: '2021-06-20',
    lastActive: '2024-03-20T14:45:00',
    specialization: 'Critical Care',
    experience: 8,
    qualification: 'B.Sc. Nursing',
    shift: 'Night Shift (9 PM - 6 AM)',
    permissions: ['view_patients', 'edit_vitals', 'manage_appointments'],
    performance: {
      rating: 4.9,
      totalPatients: 156,
      completedTasks: 2100,
      satisfaction: 98
    }
  },
  {
    id: '4',
    name: 'Dr. Priya Singh',
    email: 'priya.singh@hospital.com',
    phone: '+91 98765 43213',
    role: 'Doctor',
    department: 'Neurology',
    status: 'active',
    joinDate: '2022-08-05',
    lastActive: '2024-03-27T11:00:00',
    specialization: 'Neuromuscular Disorders',
    experience: 10,
    qualification: 'MD, DM Neurology',
    shift: 'Day Shift (9 AM - 5 PM)',
    permissions: ['view_patients', 'edit_patients', 'prescribe', 'view_lab_results'],
    performance: {
      rating: 4.9,
      totalPatients: 312,
      completedTasks: 1450,
      satisfaction: 98
    }
  },
  {
    id: '5',
    name: 'Arun Mehta',
    email: 'arun.mehta@hospital.com',
    phone: '+91 98765 43214',
    role: 'Lab Tech',
    department: 'Pathology',
    status: 'pending',
    joinDate: '2024-02-01',
    lastActive: '2024-03-26T16:20:00',
    specialization: 'Histopathology',
    experience: 3,
    qualification: 'M.Sc. Medical Microbiology',
    shift: 'Evening Shift (3 PM - 11 PM)',
    permissions: ['view_lab_tests', 'upload_results', 'view_patients'],
    performance: {
      rating: 4.5,
      totalPatients: 98,
      completedTasks: 320,
      satisfaction: 89
    }
  },
  {
    id: '6',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@hospital.com',
    phone: '+91 98765 43215',
    role: 'Doctor',
    department: 'Pediatrics',
    status: 'active',
    joinDate: '2021-11-12',
    lastActive: '2024-03-27T08:45:00',
    specialization: 'Neonatology',
    experience: 15,
    qualification: 'MD Pediatrics, Fellowship in Neonatology',
    shift: 'Day Shift (9 AM - 5 PM)',
    permissions: ['view_patients', 'edit_patients', 'prescribe', 'view_lab_results'],
    performance: {
      rating: 4.9,
      totalPatients: 356,
      completedTasks: 1890,
      satisfaction: 99
    }
  },
];

const permissionsData: Permission[] = [
  {
    id: 'patients',
    category: 'Patient Management',
    permissions: [
      { id: 'view_patients', name: 'View Patients', description: 'View patient records and history', module: 'Patients' },
      { id: 'edit_patients', name: 'Edit Patients', description: 'Create and edit patient records', module: 'Patients' },
      { id: 'delete_patients', name: 'Delete Patients', description: 'Remove patient records', module: 'Patients' },
    ]
  },
  {
    id: 'appointments',
    category: 'Appointments',
    permissions: [
      { id: 'view_appointments', name: 'View Appointments', description: 'View appointment schedule', module: 'Appointments' },
      { id: 'manage_appointments', name: 'Manage Appointments', description: 'Create, edit, cancel appointments', module: 'Appointments' },
    ]
  },
  {
    id: 'medical',
    category: 'Medical Records',
    permissions: [
      { id: 'prescribe', name: 'Prescribe Medication', description: 'Create and manage prescriptions', module: 'Medical' },
      { id: 'view_lab_results', name: 'View Lab Results', description: 'Access laboratory results', module: 'Medical' },
      { id: 'edit_vitals', name: 'Edit Vitals', description: 'Record and update patient vitals', module: 'Medical' },
    ]
  },
  {
    id: 'lab',
    category: 'Laboratory',
    permissions: [
      { id: 'view_lab_tests', name: 'View Lab Tests', description: 'View test requests and results', module: 'Lab' },
      { id: 'upload_results', name: 'Upload Results', description: 'Upload test results', module: 'Lab' },
      { id: 'manage_tests', name: 'Manage Tests', description: 'Create and manage test types', module: 'Lab' },
    ]
  },
  {
    id: 'billing',
    category: 'Billing & Finance',
    permissions: [
      { id: 'view_billing', name: 'View Billing', description: 'View billing information', module: 'Finance' },
      { id: 'create_invoice', name: 'Create Invoice', description: 'Generate patient invoices', module: 'Finance' },
      { id: 'manage_payments', name: 'Manage Payments', description: 'Process payments and refunds', module: 'Finance' },
    ]
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const config = {
    active: { icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-700', label: 'Active' },
    inactive: { icon: XCircle, color: 'bg-red-50 text-red-700', label: 'Inactive' },
    pending: { icon: Clock, color: 'bg-amber-50 text-amber-700', label: 'Pending' }
  };
  const { icon: Icon, color, label } = config[status as keyof typeof config];
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

function RoleBadge({ role, count }: { role: string; count?: number }) {
  const roleColor = {
    Administrator: 'bg-purple-100 text-purple-700 border-purple-200',
    Doctor: 'bg-blue-100 text-blue-700 border-blue-200',
    Nurse: 'bg-pink-100 text-pink-700 border-pink-200',
    'Lab Tech': 'bg-green-100 text-green-700 border-green-200',
    Receptionist: 'bg-amber-100 text-amber-700 border-amber-200',
    Pharmacist: 'bg-teal-100 text-teal-700 border-teal-200',
  };
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${roleColor[role as keyof typeof roleColor] || 'bg-slate-100 text-slate-700'}`}>
      {role}
      {count !== undefined && <span className="ml-1 opacity-75">({count})</span>}
    </span>
  );
}

function PerformanceRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3 h-3 ${star <= Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
        />
      ))}
      <span className="text-xs font-medium text-slate-600 ml-1">{rating}</span>
    </div>
  );
}

function StaffCard({ staff, onEdit, onDelete }: { staff: StaffMember; onEdit: (id: string) => void; onDelete: (id: string) => void }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
            {staff.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{staff.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <RoleBadge role={staff.role} />
              <span className="text-xs text-slate-400">{staff.department}</span>
            </div>
          </div>
        </div>
        <StatusBadge status={staff.status} />
      </div>
      
      <div className="space-y-2 mb-3 text-sm">
        <div className="flex items-center gap-2 text-slate-500">
          <Mail className="w-3.5 h-3.5" />
          <span className="text-xs truncate">{staff.email}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <Phone className="w-3.5 h-3.5" />
          <span className="text-xs">{staff.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <Briefcase className="w-3.5 h-3.5" />
          <span className="text-xs">{staff.experience} years experience</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1">
          <PerformanceRating rating={staff.performance.rating} />
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onEdit(staff.id)}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => onDelete(staff.id)}
            className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function RoleCard({ role, onEdit, onDelete, onViewMembers }: { role: Role; onEdit: (id: string) => void; onDelete: (id: string) => void; onViewMembers: (role: string) => void }) {
  const Icon = role.icon;
  
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-lg ${role.color} bg-opacity-10`}>
          <Icon className={`w-5 h-5 ${role.color.replace('bg-', 'text-')}`} />
        </div>
        <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-100 rounded-lg transition-all">
          <MoreHorizontal className="w-4 h-4 text-slate-400" />
        </button>
      </div>
      
      <h3 className="font-semibold text-slate-900 mb-1">{role.name}</h3>
      <p className="text-xs text-slate-500 mb-3 line-clamp-2">{role.description}</p>
      
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <button 
          onClick={() => onViewMembers(role.name)}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          {role.memberCount} members
        </button>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onEdit(role.id)}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => onDelete(role.id)}
            className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function PermissionCheckbox({ permission, checked, onChange }: { permission: any; checked: boolean; onChange: (id: string) => void }) {
  return (
    <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onChange(permission.id)}
        className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
      />
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-700">{permission.name}</p>
        <p className="text-xs text-slate-400 mt-0.5">{permission.description}</p>
      </div>
      <span className="text-xs text-slate-400">{permission.module}</span>
    </label>
  );
}

// ─── Main Staff & Roles Page ─────────────────────────────────────────────────

export default function StaffRolesPage() {
  const [activeTab, setActiveTab] = useState<'staff' | 'roles' | 'permissions'>('staff');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  
  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         staff.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || staff.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || staff.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  const uniqueRoles = ['All', ...new Set(staffMembers.map(s => s.role))];
  
  const stats = {
    totalStaff: staffMembers.length,
    activeStaff: staffMembers.filter(s => s.status === 'active').length,
    totalRoles: roles.length,
    departments: [...new Set(staffMembers.map(s => s.department))].length,
  };
  
  const handleEditStaff = (id: string) => {
    console.log('Edit staff:', id);
    // Open edit modal
  };
  
  const handleDeleteStaff = (id: string) => {
    console.log('Delete staff:', id);
    // Confirm and delete
  };
  
  const handleEditRole = (id: string) => {
    console.log('Edit role:', id);
    setSelectedRole(roles.find(r => r.id === id) || null);
    setShowRoleModal(true);
  };
  
  const handleDeleteRole = (id: string) => {
    console.log('Delete role:', id);
    // Confirm and delete
  };
  
  const handleViewRoleMembers = (roleName: string) => {
    setRoleFilter(roleName);
    setActiveTab('staff');
  };
  
  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Staff & Roles</h1>
            <p className="text-sm text-slate-500 mt-1">Manage your team members and their access permissions</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowStaffModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Add Staff
            </button>
            <button 
              onClick={() => setShowRoleModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors"
            >
              <Shield className="w-4 h-4" />
              Add Role
            </button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-2xl font-bold text-slate-900">{stats.totalStaff}</span>
            </div>
            <p className="text-sm text-slate-500">Total Staff</p>
            <p className="text-xs text-emerald-600 mt-1">↑ {stats.activeStaff} active</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-5 h-5 text-purple-500" />
              <span className="text-2xl font-bold text-slate-900">{stats.totalRoles}</span>
            </div>
            <p className="text-sm text-slate-500">Roles Defined</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <Briefcase className="w-5 h-5 text-green-500" />
              <span className="text-2xl font-bold text-slate-900">{stats.departments}</span>
            </div>
            <p className="text-sm text-slate-500">Departments</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              <span className="text-2xl font-bold text-slate-900">94.2%</span>
            </div>
            <p className="text-sm text-slate-500">Staff Satisfaction</p>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <div className="flex items-center gap-1 px-5 border-b border-slate-100">
            {(['staff', 'roles', 'permissions'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium capitalize transition-all border-b-2 -mb-px ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab === 'staff' ? 'Staff Members' : tab === 'roles' ? 'Roles' : 'Permissions'}
              </button>
            ))}
          </div>
          
          <div className="p-5">
            {/* Staff Tab */}
            {activeTab === 'staff' && (
              <div>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search staff by name, email, or department..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {uniqueRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="All">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
                
                {/* Staff Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredStaff.map(staff => (
                    <StaffCard
                      key={staff.id}
                      staff={staff}
                      onEdit={handleEditStaff}
                      onDelete={handleDeleteStaff}
                    />
                  ))}
                </div>
                
                {filteredStaff.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No staff members found</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Roles Tab */}
            {activeTab === 'roles' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {roles.map(role => (
                    <RoleCard
                      key={role.id}
                      role={role}
                      onEdit={handleEditRole}
                      onDelete={handleDeleteRole}
                      onViewMembers={handleViewRoleMembers}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Permissions Tab */}
            {activeTab === 'permissions' && (
              <div>
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-800 font-medium">Role-Based Access Control</p>
                      <p className="text-xs text-blue-600 mt-1">Manage permissions for different roles. Changes will affect all users with that role.</p>
                    </div>
                  </div>
                </div>
                
                {permissionsData.map(category => (
                  <div key={category.id} className="mb-6">
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">{category.category}</h3>
                    <div className="bg-white rounded-xl border border-slate-100 divide-y divide-slate-100">
                      {category.permissions.map(permission => (
                        <PermissionCheckbox
                          key={permission.id}
                          permission={permission}
                          checked={false}
                          onChange={() => {}}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <button className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all">
            <Upload className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Bulk Import</span>
          </button>
          <button className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all">
            <Download className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Export Data</span>
          </button>
          <button className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all">
            <FileText className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Generate Report</span>
          </button>
          <button className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all">
            <Settings className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Access Logs</span>
          </button>
        </div>
      </div>
      
      {/* Modals would go here - implement as needed */}
    </div>
  );
}