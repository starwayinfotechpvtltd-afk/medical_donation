// app/admin/activity/page.tsx
'use client';

import { useState } from "react";
import {
  Activity, Search, Filter, Download, Printer, RefreshCw,
  User, Calendar, Clock, Eye, FileText, UserPlus,
  Edit2, Trash2, LogIn, LogOut, Settings, Shield,
  Mail, Phone, Heart, Stethoscope, FlaskConical,
  Calendar as CalendarIcon, MessageSquare, CheckCircle2,
  XCircle, AlertCircle, Info, ChevronLeft, ChevronRight,
  MoreHorizontal, Archive, Flag, Star, Users, Building2,
  X,
  Upload,
  Plus
} from "lucide-react";

// Types
type ActivityType = 'user' | 'patient' | 'appointment' | 'medical' | 'system' | 'security';
type ActivityAction = 'create' | 'update' | 'delete' | 'view' | 'login' | 'logout' | 'export' | 'import';
type ActivitySeverity = 'info' | 'warning' | 'error' | 'success';

interface ActivityLog {
  id: string;
  user: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  action: ActivityAction;
  type: ActivityType;
  description: string;
  details?: {
    oldValue?: any;
    newValue?: any;
    ipAddress?: string;
    device?: string;
    location?: string;
  };
  timestamp: string;
  severity: ActivitySeverity;
  target?: {
    type: string;
    id: string;
    name: string;
  };
}

// Mock Data
const mockActivities: ActivityLog[] = [
  {
    id: "1",
    user: {
      id: "1",
      name: "Dr. Rajesh Kumar",
      role: "Doctor",
    },
    action: "update",
    type: "patient",
    description: "Updated patient medical record for John Sharma",
    details: {
      oldValue: { diagnosis: "Hypertension" },
      newValue: { diagnosis: "Hypertension, Type 2 Diabetes" },
      ipAddress: "192.168.1.100",
      device: "Chrome on Windows",
    },
    timestamp: "2024-03-27T10:30:00",
    severity: "info",
    target: {
      type: "patient",
      id: "1",
      name: "John Sharma",
    },
  },
  {
    id: "2",
    user: {
      id: "2",
      name: "Priya Patel",
      role: "Lab Tech",
    },
    action: "create",
    type: "medical",
    description: "Uploaded lab results for CBC test",
    details: {
      ipAddress: "192.168.1.101",
      device: "MacOS Safari",
    },
    timestamp: "2024-03-27T09:15:00",
    severity: "success",
    target: {
      type: "lab",
      id: "2",
      name: "CBC Test Results",
    },
  },
  {
    id: "3",
    user: {
      id: "3",
      name: "Aisha Khan",
      role: "Nurse",
    },
    action: "view",
    type: "patient",
    description: "Viewed patient records for emergency case",
    details: {
      ipAddress: "192.168.1.102",
      device: "iPad Safari",
    },
    timestamp: "2024-03-27T08:45:00",
    severity: "info",
    target: {
      type: "patient",
      id: "3",
      name: "Emergency Patient",
    },
  },
  {
    id: "4",
    user: {
      id: "4",
      name: "Admin",
      role: "Administrator",
    },
    action: "create",
    type: "user",
    description: "Created new user account for Dr. Sarah Johnson",
    details: {
      newValue: { role: "Doctor", department: "Cardiology" },
      ipAddress: "192.168.1.1",
      device: "Chrome on Windows",
    },
    timestamp: "2024-03-27T08:00:00",
    severity: "success",
    target: {
      type: "user",
      id: "5",
      name: "Dr. Sarah Johnson",
    },
  },
  {
    id: "5",
    user: {
      id: "1",
      name: "Dr. Rajesh Kumar",
      role: "Doctor",
    },
    action: "login",
    type: "security",
    description: "User logged in successfully",
    details: {
      ipAddress: "192.168.1.100",
      device: "Chrome on Windows",
      location: "Mumbai, India",
    },
    timestamp: "2024-03-27T07:45:00",
    severity: "info",
  },
  {
    id: "6",
    user: {
      id: "5",
      name: "Sarah Johnson",
      role: "Doctor",
    },
    action: "update",
    type: "appointment",
    description: "Rescheduled appointment for Ravi Patel",
    details: {
      oldValue: { time: "10:00 AM", date: "2024-03-27" },
      newValue: { time: "2:00 PM", date: "2024-03-27" },
      ipAddress: "192.168.1.105",
      device: "iPhone Safari",
    },
    timestamp: "2024-03-26T16:20:00",
    severity: "warning",
    target: {
      type: "appointment",
      id: "3",
      name: "Ravi Patel",
    },
  },
  {
    id: "7",
    user: {
      id: "6",
      name: "Arun Mehta",
      role: "Lab Tech",
    },
    action: "delete",
    type: "medical",
    description: "Deleted duplicate lab test entry",
    details: {
      oldValue: { testId: "LAB-2024-123", patient: "Jane Smith" },
      ipAddress: "192.168.1.106",
      device: "Firefox on Windows",
    },
    timestamp: "2024-03-26T15:30:00",
    severity: "warning",
  },
  {
    id: "8",
    user: {
      id: "7",
      name: "System",
      role: "System",
    },
    action: "export",
    type: "system",
    description: "Generated monthly patient report",
    details: {
      ipAddress: "localhost",
      device: "Server",
    },
    timestamp: "2024-03-26T14:00:00",
    severity: "info",
  },
  {
    id: "9",
    user: {
      id: "2",
      name: "Priya Patel",
      role: "Lab Tech",
    },
    action: "import",
    type: "medical",
    description: "Imported bulk lab results from external system",
    details: {
      count: 45,
      ipAddress: "192.168.1.101",
      device: "MacOS Chrome",
    },
    timestamp: "2024-03-26T11:45:00",
    severity: "success",
  },
  {
    id: "10",
    user: {
      id: "4",
      name: "Admin",
      role: "Administrator",
    },
    action: "update",
    type: "security",
    description: "Modified role permissions for Receptionist role",
    details: {
      oldValue: { permissions: ["view_patients"] },
      newValue: { permissions: ["view_patients", "edit_patients"] },
      ipAddress: "192.168.1.1",
      device: "Chrome on Windows",
    },
    timestamp: "2024-03-26T10:00:00",
    severity: "warning",
  },
  {
    id: "11",
    user: {
      id: "8",
      name: "Receptionist",
      role: "Receptionist",
    },
    action: "create",
    type: "appointment",
    description: "Booked new appointment for Sara Ahmed",
    details: {
      newValue: { doctor: "Dr. Priya Singh", time: "3:30 PM" },
      ipAddress: "192.168.1.107",
      device: "Chrome on Windows",
    },
    timestamp: "2024-03-26T09:30:00",
    severity: "success",
    target: {
      type: "appointment",
      id: "4",
      name: "Sara Ahmed",
    },
  },
  {
    id: "12",
    user: {
      id: "3",
      name: "Aisha Khan",
      role: "Nurse",
    },
    action: "logout",
    type: "security",
    description: "User logged out",
    details: {
      ipAddress: "192.168.1.102",
      device: "iPad Safari",
    },
    timestamp: "2024-03-26T17:00:00",
    severity: "info",
  },
];

// Severity Badge Component
function SeverityBadge({ severity }: { severity: ActivitySeverity }) {
  const config = {
    'info': { icon: Info, color: "bg-blue-50 text-blue-700", label: "Info" },
    'warning': { icon: AlertCircle, color: "bg-amber-50 text-amber-700", label: "Warning" },
    'error': { icon: XCircle, color: "bg-red-50 text-red-700", label: "Error" },
    'success': { icon: CheckCircle2, color: "bg-emerald-50 text-emerald-700", label: "Success" }
  };
  const { icon: Icon, color, label } = config[severity];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

// Action Badge Component
function ActionBadge({ action }: { action: ActivityAction }) {
  const config = {
    'create': { icon: Plus, color: "bg-emerald-100 text-emerald-700", label: "Created" },
    'update': { icon: Edit2, color: "bg-blue-100 text-blue-700", label: "Updated" },
    'delete': { icon: Trash2, color: "bg-red-100 text-red-700", label: "Deleted" },
    'view': { icon: Eye, color: "bg-slate-100 text-slate-700", label: "Viewed" },
    'login': { icon: LogIn, color: "bg-green-100 text-green-700", label: "Login" },
    'logout': { icon: LogOut, color: "bg-orange-100 text-orange-700", label: "Logout" },
    'export': { icon: Download, color: "bg-purple-100 text-purple-700", label: "Exported" },
    'import': { icon: Upload, color: "bg-cyan-100 text-cyan-700", label: "Imported" }
  };
  const { icon: Icon, color, label } = config[action];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

// Activity Type Badge
function TypeBadge({ type }: { type: ActivityType }) {
  const config = {
    'user': { icon: Users, color: "bg-purple-100 text-purple-700", label: "User" },
    'patient': { icon: Heart, color: "bg-pink-100 text-pink-700", label: "Patient" },
    'appointment': { icon: CalendarIcon, color: "bg-blue-100 text-blue-700", label: "Appointment" },
    'medical': { icon: Stethoscope, color: "bg-emerald-100 text-emerald-700", label: "Medical" },
    'system': { icon: Settings, color: "bg-slate-100 text-slate-700", label: "System" },
    'security': { icon: Shield, color: "bg-amber-100 text-amber-700", label: "Security" }
  };
  const { icon: Icon, color, label } = config[type];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

// Activity Log Card (Mobile View)
function ActivityCard({ activity }: { activity: ActivityLog }) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
            {activity.user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{activity.user.name}</h3>
            <p className="text-xs text-slate-500">{activity.user.role}</p>
          </div>
        </div>
        <SeverityBadge severity={activity.severity} />
      </div>
      
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2">
          <ActionBadge action={activity.action} />
          <TypeBadge type={activity.type} />
        </div>
        <p className="text-sm text-slate-600">{activity.description}</p>
        {activity.target && (
          <p className="text-xs text-slate-500">
            Target: <span className="font-medium text-slate-700">{activity.target.name}</span>
          </p>
        )}
      </div>
      
      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3" />
          <span>{formatTime(activity.timestamp)}</span>
        </div>
        {activity.details?.ipAddress && (
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            <span>{activity.details.ipAddress}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Activity Log Table Row (Desktop View)
function ActivityRow({ activity }: { activity: ActivityLog }) {
  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
            {activity.user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">{activity.user.name}</p>
            <p className="text-xs text-slate-500">{activity.user.role}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <ActionBadge action={activity.action} />
      </td>
      <td className="px-4 py-3">
        <TypeBadge type={activity.type} />
      </td>
      <td className="px-4 py-3">
        <div>
          <p className="text-sm text-slate-600">{activity.description}</p>
          {activity.target && (
            <p className="text-xs text-slate-400 mt-0.5">
              {activity.target.type}: {activity.target.name}
            </p>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <SeverityBadge severity={activity.severity} />
      </td>
      <td className="px-4 py-3">
        <div className="text-sm text-slate-600">{formatDateTime(activity.timestamp)}</div>
        {activity.details?.ipAddress && (
          <div className="text-xs text-slate-400">IP: {activity.details.ipAddress}</div>
        )}
      </td>
    </tr>
  );
}

// Activity Detail Modal
function ActivityDetailModal({ 
  activity, 
  isOpen, 
  onClose 
}: { 
  activity: ActivityLog | null; 
  isOpen: boolean; 
  onClose: () => void;
}) {
  if (!isOpen || !activity) return null;
  
  const formatFullDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Activity Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Header Info */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
              {activity.user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{activity.user.name}</h3>
              <p className="text-sm text-slate-500">{activity.user.role}</p>
            </div>
            <div className="ml-auto flex gap-2">
              <ActionBadge action={activity.action} />
              <TypeBadge type={activity.type} />
              <SeverityBadge severity={activity.severity} />
            </div>
          </div>
          
          {/* Description */}
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-sm font-medium text-slate-700 mb-1">Description</p>
            <p className="text-slate-900">{activity.description}</p>
          </div>
          
          {/* Target Info */}
          {activity.target && (
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm font-medium text-slate-700 mb-2">Target Information</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-500">Type</p>
                  <p className="text-sm text-slate-900 capitalize">{activity.target.type}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">ID</p>
                  <p className="text-sm text-slate-900">{activity.target.id}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500">Name</p>
                  <p className="text-sm text-slate-900 font-medium">{activity.target.name}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Details */}
          {activity.details && (
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm font-medium text-slate-700 mb-2">Additional Details</p>
              <div className="space-y-2">
                {activity.details.ipAddress && (
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">IP Address</span>
                    <span className="text-sm text-slate-900">{activity.details.ipAddress}</span>
                  </div>
                )}
                {activity.details.device && (
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">Device</span>
                    <span className="text-sm text-slate-900">{activity.details.device}</span>
                  </div>
                )}
                {activity.details.location && (
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">Location</span>
                    <span className="text-sm text-slate-900">{activity.details.location}</span>
                  </div>
                )}
                {activity.details.oldValue && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Previous Value</p>
                    <pre className="text-xs bg-white p-2 rounded-lg overflow-x-auto">
                      {JSON.stringify(activity.details.oldValue, null, 2)}
                    </pre>
                  </div>
                )}
                {activity.details.newValue && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">New Value</p>
                    <pre className="text-xs bg-white p-2 rounded-lg overflow-x-auto">
                      {JSON.stringify(activity.details.newValue, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Timestamp */}
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-sm font-medium text-slate-700 mb-1">Timestamp</p>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-900">{formatFullDateTime(activity.timestamp)}</span>
            </div>
          </div>
        </div>
        
        <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Component
export default function AdminActivityLogs() {
  const [activities, setActivities] = useState<ActivityLog[]>(mockActivities);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [actionFilter, setActionFilter] = useState<string>("All");
  const [severityFilter, setSeverityFilter] = useState<string>("All");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: ""
  });
  const [selectedActivity, setSelectedActivity] = useState<ActivityLog | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Filter activities
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (activity.target?.name.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    const matchesType = typeFilter === "All" || activity.type === typeFilter;
    const matchesAction = actionFilter === "All" || activity.action === actionFilter;
    const matchesSeverity = severityFilter === "All" || activity.severity === severityFilter;
    
    let matchesDate = true;
    if (dateRange.start && dateRange.end) {
      const activityDate = new Date(activity.timestamp);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      matchesDate = activityDate >= startDate && activityDate <= endDate;
    }
    
    return matchesSearch && matchesType && matchesAction && matchesSeverity && matchesDate;
  });
  
  // Pagination
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const stats = {
    total: activities.length,
    today: activities.filter(a => {
      const today = new Date().toDateString();
      return new Date(a.timestamp).toDateString() === today;
    }).length,
    thisWeek: activities.filter(a => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(a.timestamp) >= weekAgo;
    }).length,
    warnings: activities.filter(a => a.severity === "warning").length,
    errors: activities.filter(a => a.severity === "error").length,
  };
  
  const handleRefresh = () => {
    // Simulate refresh
    alert("Refreshing activity logs...");
  };
  
  const handleExport = () => {
    alert("Exporting activity logs...");
  };
  
  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Activity Logs</h1>
            <p className="text-sm text-slate-500 mt-1">Track all user activities and system events</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-white rounded-lg transition-colors border border-slate-200"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-white rounded-lg transition-colors border border-slate-200"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <span className="text-2xl font-bold text-slate-900">{stats.total}</span>
            </div>
            <p className="text-sm text-slate-500">Total Activities</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <CalendarIcon className="w-5 h-5 text-emerald-500" />
              <span className="text-2xl font-bold text-slate-900">{stats.today}</span>
            </div>
            <p className="text-sm text-slate-500">Today</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-purple-500" />
              <span className="text-2xl font-bold text-slate-900">{stats.thisWeek}</span>
            </div>
            <p className="text-sm text-slate-500">This Week</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <span className="text-2xl font-bold text-slate-900">{stats.warnings}</span>
            </div>
            <p className="text-sm text-slate-500">Warnings</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-2xl font-bold text-slate-900">{stats.errors}</span>
            </div>
            <p className="text-sm text-slate-500">Errors</p>
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex flex-col gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by user, description, or target..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="All">All Types</option>
                <option value="user">User</option>
                <option value="patient">Patient</option>
                <option value="appointment">Appointment</option>
                <option value="medical">Medical</option>
                <option value="system">System</option>
                <option value="security">Security</option>
              </select>
              <select
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="All">All Actions</option>
                <option value="create">Created</option>
                <option value="update">Updated</option>
                <option value="delete">Deleted</option>
                <option value="view">Viewed</option>
                <option value="login">Login</option>
                <option value="logout">Logout</option>
                <option value="export">Exported</option>
                <option value="import">Imported</option>
              </select>
              <select
                value={severityFilter}
                onChange={(e) => {
                  setSeverityFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="All">All Severity</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="success">Success</option>
              </select>
              <div className="flex gap-2">
                <input
                  type="date"
                  placeholder="Start Date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <input
                  type="date"
                  placeholder="End Date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Activity Logs Table (Desktop) */}
        {paginatedActivities.length > 0 ? (
          <>
            <div className="hidden lg:block bg-white rounded-xl border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Severity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Timestamp
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedActivities.map((activity) => (
                      <tr
                        key={activity.id}
                        className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedActivity(activity);
                          setShowDetailModal(true);
                        }}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                              {activity.user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-900">{activity.user.name}</p>
                              <p className="text-xs text-slate-500">{activity.user.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <ActionBadge action={activity.action} />
                        </td>
                        <td className="px-4 py-3">
                          <TypeBadge type={activity.type} />
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm text-slate-600">{activity.description}</p>
                            {activity.target && (
                              <p className="text-xs text-slate-400 mt-0.5">
                                {activity.target.type}: {activity.target.name}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <SeverityBadge severity={activity.severity} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-slate-600">
                            {new Date(activity.timestamp).toLocaleString()}
                          </div>
                          {activity.details?.ipAddress && (
                            <div className="text-xs text-slate-400">IP: {activity.details.ipAddress}</div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Activity Logs Cards (Mobile) */}
            <div className="lg:hidden space-y-3">
              {paginatedActivities.map((activity) => (
                <div
                  key={activity.id}
                  onClick={() => {
                    setSelectedActivity(activity);
                    setShowDetailModal(true);
                  }}
                  className="cursor-pointer"
                >
                  <ActivityCard activity={activity} />
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-white rounded-xl border border-slate-100 px-4 py-3">
                <p className="text-sm text-slate-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredActivities.length)} of{" "}
                  {filteredActivities.length} results
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white"
                              : "text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
            <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-lg font-medium">No activity logs found</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
      
      {/* Activity Detail Modal */}
      <ActivityDetailModal
        activity={selectedActivity}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedActivity(null);
        }}
      />
    </div>
  );
}