// app/admin/departments/page.tsx
'use client';

import { useState } from "react";
import Image from "next/image";
import { 
  Trash2, Plus, Edit2, X, Hospital, Users, Bed, 
  Stethoscope, Activity, Calendar, ChevronRight, 
  Search, Filter, MoreHorizontal, Eye, Clock,
  CheckCircle2, AlertCircle, Building2, FileText
} from "lucide-react";

// Types
interface Department {
  id: string;
  name: string;
  description: string;
  icon: string;
  image: string;
  doctors: number;
  beds: number;
  services: string[];
  headOfDept?: string;
  established?: string;
  status: 'active' | 'inactive';
  appointmentsToday?: number;
  occupancyRate?: number;
}

// Mock Data
const mockDepartments: Department[] = [
  {
    id: "1",
    name: "Cardiology",
    description: "Comprehensive cardiac care including diagnostics, interventions, and rehabilitation.",
    icon: "❤️",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop",
    doctors: 12,
    beds: 45,
    services: ["ECG", "Echocardiography", "Cardiac Catheterization", "Heart Surgery"],
    headOfDept: "Dr. Rajesh Kumar",
    established: "1995",
    status: "active",
    appointmentsToday: 28,
    occupancyRate: 85
  },
  {
    id: "2",
    name: "Neurology",
    description: "Advanced neurological care for disorders of the nervous system.",
    icon: "🧠",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
    doctors: 8,
    beds: 30,
    services: ["EEG", "EMG", "Stroke Care", "Neurological Surgery"],
    headOfDept: "Dr. Priya Singh",
    established: "2000",
    status: "active",
    appointmentsToday: 18,
    occupancyRate: 72
  },
  {
    id: "3",
    name: "Orthopedics",
    description: "Specialized care for bone, joint, and muscle conditions.",
    icon: "🦴",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&h=400&fit=crop",
    doctors: 10,
    beds: 40,
    services: ["Joint Replacement", "Sports Medicine", "Spine Surgery", "Fracture Care"],
    headOfDept: "Dr. Amit Patel",
    established: "1998",
    status: "active",
    appointmentsToday: 22,
    occupancyRate: 78
  },
  {
    id: "4",
    name: "Pediatrics",
    description: "Comprehensive healthcare for infants, children, and adolescents.",
    icon: "👶",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&h=400&fit=crop",
    doctors: 15,
    beds: 50,
    services: ["Neonatal Care", "Child Vaccination", "Pediatric Surgery", "Adolescent Medicine"],
    headOfDept: "Dr. Sarah Johnson",
    established: "1992",
    status: "active",
    appointmentsToday: 32,
    occupancyRate: 82
  },
  {
    id: "5",
    name: "Radiology",
    description: "Advanced diagnostic imaging services.",
    icon: "🩻",
    image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&h=400&fit=crop",
    doctors: 6,
    beds: 15,
    services: ["MRI", "CT Scan", "X-Ray", "Ultrasound"],
    headOfDept: "Dr. Anjali Desai",
    established: "2005",
    status: "active",
    appointmentsToday: 45,
    occupancyRate: 68
  },
  {
    id: "6",
    name: "Emergency",
    description: "24/7 emergency care for critical conditions.",
    icon: "🚨",
    image: "https://images.unsplash.com/photo-1516849677043-ef67c9557e16?w=800&h=400&fit=crop",
    doctors: 20,
    beds: 60,
    services: ["Trauma Care", "Critical Care", "Ambulance Services", "ER Triage"],
    headOfDept: "Dr. Vikram Sharma",
    established: "1990",
    status: "active",
    appointmentsToday: 56,
    occupancyRate: 92
  }
];

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const config = {
    active: { icon: CheckCircle2, color: "bg-emerald-50 text-emerald-700", label: "Active" },
    inactive: { icon: AlertCircle, color: "bg-red-50 text-red-700", label: "Inactive" }
  };
  const { icon: Icon, color, label } = config[status as keyof typeof config] || config.active;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

// Department Card Component
function DepartmentCard({ 
  department, 
  onEdit, 
  onDelete 
}: { 
  department: Department; 
  onEdit: (dept: Department) => void; 
  onDelete: (id: string) => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all group">
      <div className="relative h-48">
        <Image
          src={department.image}
          alt={department.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{department.icon}</span>
            <h3 className="text-xl font-bold text-white">{department.name}</h3>
          </div>
          <StatusBadge status={department.status} />
        </div>
      </div>
      
      <div className="p-5">
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">{department.description}</p>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-slate-500">Doctors</span>
            </div>
            <p className="text-lg font-bold text-slate-900">{department.doctors}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Bed className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-slate-500">Beds</span>
            </div>
            <p className="text-lg font-bold text-slate-900">{department.beds}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-purple-500" />
              <span className="text-xs text-slate-500">Today's Appts</span>
            </div>
            <p className="text-lg font-bold text-slate-900">{department.appointmentsToday || 0}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-amber-500" />
              <span className="text-xs text-slate-500">Occupancy</span>
            </div>
            <p className="text-lg font-bold text-slate-900">{department.occupancyRate || 0}%</p>
          </div>
        </div>
        
        {/* Services Preview */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1.5">
            {department.services.slice(0, 3).map((service, idx) => (
              <span key={idx} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                {service}
              </span>
            ))}
            {department.services.length > 3 && (
              <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                +{department.services.length - 3} more
              </span>
            )}
          </div>
        </div>
        
        {/* Expandable Details */}
        {showDetails && (
          <div className="mb-4 p-3 bg-slate-50 rounded-lg space-y-2 animate-slide-down">
            {department.headOfDept && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Head of Department:</span>
                <span className="font-medium text-slate-700">{department.headOfDept}</span>
              </div>
            )}
            {department.established && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Established:</span>
                <span className="font-medium text-slate-700">{department.established}</span>
              </div>
            )}
            <button 
              onClick={() => setShowDetails(false)}
              className="text-xs text-blue-600 hover:text-blue-700 mt-2"
            >
              Show less
            </button>
          </div>
        )}
        
        <div className="flex gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-600 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            {showDetails ? "Hide" : "Details"}
          </button>
          <button
            onClick={() => onEdit(department)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-medium text-blue-600 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={() => onDelete(department.id)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-medium text-red-600 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// Add/Edit Department Modal
function DepartmentModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (data: any) => void; 
  initialData?: Department | null;
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    beds: initialData?.beds || "",
    doctors: initialData?.doctors || "",
    headOfDept: initialData?.headOfDept || "",
    established: initialData?.established || "",
    status: initialData?.status || "active",
    services: initialData?.services?.join(", ") || "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      beds: parseInt(formData.beds),
      doctors: parseInt(formData.doctors),
      services: formData.services.split(",").map(s => s.trim()).filter(s => s),
      icon: "🏥",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {initialData ? "Edit Department" : "Add New Department"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Department Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Number of Beds *
              </label>
              <input
                type="number"
                value={formData.beds}
                onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Number of Doctors *
              </label>
              <input
                type="number"
                value={formData.doctors}
                onChange={(e) => setFormData({ ...formData, doctors: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Head of Department
              </label>
              <input
                type="text"
                value={formData.headOfDept}
                onChange={(e) => setFormData({ ...formData, headOfDept: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Established Year
              </label>
              <input
                type="text"
                value={formData.established}
                onChange={(e) => setFormData({ ...formData, established: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                placeholder="e.g., 1995"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Services (comma-separated)
            </label>
            <input
              type="text"
              value={formData.services}
              onChange={(e) => setFormData({ ...formData, services: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              placeholder="e.g., ECG, MRI, X-Ray"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {initialData ? "Update Department" : "Add Department"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main Component
export default function AdminDepartments() {
  const [departmentsList, setDepartmentsList] = useState<Department[]>(mockDepartments);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  // Filter departments
  const filteredDepartments = departmentsList.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dept.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || dept.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this department?")) {
      setDepartmentsList(departmentsList.filter((d) => d.id !== id));
    }
  };

  const handleAddDepartment = (data: any) => {
    const newDepartment: Department = {
      id: `${Date.now()}`,
      name: data.name,
      description: data.description,
      icon: "🏥",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop",
      doctors: data.doctors,
      beds: data.beds,
      services: data.services,
      headOfDept: data.headOfDept,
      established: data.established,
      status: data.status,
      appointmentsToday: 0,
      occupancyRate: 0,
    };
    setDepartmentsList([newDepartment, ...departmentsList]);
    setShowModal(false);
  };

  const handleEditDepartment = (data: any) => {
    if (editingDepartment) {
      const updatedDepartments = departmentsList.map(dept =>
        dept.id === editingDepartment.id
          ? {
              ...dept,
              name: data.name,
              description: data.description,
              doctors: data.doctors,
              beds: data.beds,
              services: data.services,
              headOfDept: data.headOfDept,
              established: data.established,
              status: data.status,
            }
          : dept
      );
      setDepartmentsList(updatedDepartments);
      setEditingDepartment(null);
      setShowModal(false);
    }
  };

  const stats = {
    total: departmentsList.length,
    active: departmentsList.filter(d => d.status === "active").length,
    totalBeds: departmentsList.reduce((sum, d) => sum + d.beds, 0),
    totalDoctors: departmentsList.reduce((sum, d) => sum + d.doctors, 0),
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Departments</h1>
            <p className="text-sm text-slate-500 mt-1">Manage hospital departments and their details</p>
          </div>
          <button
            onClick={() => {
              setEditingDepartment(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Department
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <Building2 className="w-5 h-5 text-blue-500" />
              <span className="text-2xl font-bold text-slate-900">{stats.total}</span>
            </div>
            <p className="text-sm text-slate-500">Total Departments</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="text-2xl font-bold text-slate-900">{stats.active}</span>
            </div>
            <p className="text-sm text-slate-500">Active Departments</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <Bed className="w-5 h-5 text-purple-500" />
              <span className="text-2xl font-bold text-slate-900">{stats.totalBeds}</span>
            </div>
            <p className="text-sm text-slate-500">Total Beds</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <Stethoscope className="w-5 h-5 text-amber-500" />
              <span className="text-2xl font-bold text-slate-900">{stats.totalDoctors}</span>
            </div>
            <p className="text-sm text-slate-500">Total Doctors</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search departments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Departments Grid */}
        {filteredDepartments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDepartments.map((dept) => (
              <DepartmentCard
                key={dept.id}
                department={dept}
                onEdit={(dept) => {
                  setEditingDepartment(dept);
                  setShowModal(true);
                }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-lg font-medium">No departments found</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <DepartmentModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingDepartment(null);
        }}
        onSubmit={editingDepartment ? handleEditDepartment : handleAddDepartment}
        initialData={editingDepartment}
      />

      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}