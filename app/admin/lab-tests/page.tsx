// app/admin/lab-tests/page.tsx
'use client';

import { useState } from "react";
import {
  FlaskConical, Search, Filter, Plus, Download, Printer,
  Eye, Edit2, Trash2, CheckCircle2, XCircle, Clock,
  AlertCircle, Calendar, User, Stethoscope, FileText,
  Upload, Send, ChevronLeft, ChevronRight, X,
  Microscope, TestTube, Beaker, Activity, Heart,
  Brain, Bone, Droplet, Thermometer, Pill, BarChart3
} from "lucide-react";

// Types
type TestStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'urgent';
type TestPriority = 'routine' | 'urgent' | 'stat';
type TestCategory = 'blood' | 'urine' | 'imaging' | 'pathology' | 'microbiology' | 'genetics';

interface LabTest {
  id: string;
  testName: string;
  category: TestCategory;
  patientName: string;
  patientId: string;
  doctorName: string;
  doctorId: string;
  requestedDate: string;
  sampleCollectedDate?: string;
  completedDate?: string;
  status: TestStatus;
  priority: TestPriority;
  results?: {
    parameters: {
      name: string;
      value: string;
      unit: string;
      referenceRange: string;
      abnormal: boolean;
    }[];
    summary: string;
    fileUrl?: string;
  };
  notes?: string;
  instructions?: string;
  sampleType?: string;
  labTechnician?: string;
}

// Mock Data
const mockLabTests: LabTest[] = [
  {
    id: "1",
    testName: "Complete Blood Count (CBC)",
    category: "blood",
    patientName: "John Sharma",
    patientId: "P001",
    doctorName: "Dr. Rajesh Kumar",
    doctorId: "D001",
    requestedDate: "2024-03-25",
    sampleCollectedDate: "2024-03-26",
    status: "completed",
    priority: "routine",
    results: {
      parameters: [
        { name: "Hemoglobin", value: "14.2", unit: "g/dL", referenceRange: "13.5-17.5", abnormal: false },
        { name: "WBC Count", value: "7.5", unit: "x10³/µL", referenceRange: "4.5-11.0", abnormal: false },
        { name: "Platelets", value: "250", unit: "x10³/µL", referenceRange: "150-450", abnormal: false },
        { name: "RBC Count", value: "4.8", unit: "x10⁶/µL", referenceRange: "4.5-5.9", abnormal: false }
      ],
      summary: "All parameters within normal range. No significant abnormalities detected."
    },
    labTechnician: "Priya Patel"
  },
  {
    id: "2",
    testName: "Lipid Profile",
    category: "blood",
    patientName: "Priya Patel",
    patientId: "P002",
    doctorName: "Dr. Amit Patel",
    doctorId: "D002",
    requestedDate: "2024-03-26",
    sampleCollectedDate: "2024-03-27",
    status: "in-progress",
    priority: "routine",
    labTechnician: "Arun Mehta"
  },
  {
    id: "3",
    testName: "Urinalysis",
    category: "urine",
    patientName: "Aisha Khan",
    patientId: "P003",
    doctorName: "Dr. Priya Singh",
    doctorId: "D003",
    requestedDate: "2024-03-27",
    status: "pending",
    priority: "urgent",
    instructions: "First morning urine sample preferred",
    sampleType: "Urine"
  },
  {
    id: "4",
    testName: "X-Ray Chest",
    category: "imaging",
    patientName: "Ravi Patel",
    patientId: "P004",
    doctorName: "Dr. Rajesh Kumar",
    doctorId: "D001",
    requestedDate: "2024-03-24",
    sampleCollectedDate: "2024-03-24",
    completedDate: "2024-03-25",
    status: "completed",
    priority: "routine",
    results: {
      parameters: [
        { name: "Findings", value: "Normal cardiac silhouette, clear lung fields", unit: "", referenceRange: "", abnormal: false }
      ],
      summary: "Chest X-ray shows no acute cardiopulmonary abnormalities."
    }
  },
  {
    id: "5",
    testName: "Blood Glucose Fasting",
    category: "blood",
    patientName: "Sara Ahmed",
    patientId: "P005",
    doctorName: "Dr. Sarah Johnson",
    doctorId: "D004",
    requestedDate: "2024-03-27",
    status: "pending",
    priority: "stat",
    instructions: "12 hours fasting required",
    sampleType: "Blood"
  },
  {
    id: "6",
    testName: "Thyroid Profile",
    category: "blood",
    patientName: "Arun Mehta",
    patientId: "P006",
    doctorName: "Dr. Priya Singh",
    doctorId: "D003",
    requestedDate: "2024-03-23",
    sampleCollectedDate: "2024-03-24",
    completedDate: "2024-03-25",
    status: "completed",
    priority: "routine",
    results: {
      parameters: [
        { name: "TSH", value: "3.2", unit: "µIU/mL", referenceRange: "0.5-4.5", abnormal: false },
        { name: "T3", value: "120", unit: "ng/dL", referenceRange: "80-200", abnormal: false },
        { name: "T4", value: "8.5", unit: "µg/dL", referenceRange: "5.0-12.0", abnormal: false }
      ],
      summary: "Thyroid function tests within normal limits."
    }
  }
];

// Status Badge Component
function StatusBadge({ status }: { status: TestStatus }) {
  const config = {
    'pending': { icon: Clock, color: "bg-amber-50 text-amber-700", label: "Pending" },
    'in-progress': { icon: Activity, color: "bg-blue-50 text-blue-700", label: "In Progress" },
    'completed': { icon: CheckCircle2, color: "bg-emerald-50 text-emerald-700", label: "Completed" },
    'cancelled': { icon: XCircle, color: "bg-red-50 text-red-700", label: "Cancelled" },
    'urgent': { icon: AlertCircle, color: "bg-red-50 text-red-700", label: "Urgent" }
  };
  const { icon: Icon, color, label } = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: TestPriority }) {
  const config = {
    'routine': { color: "bg-slate-100 text-slate-700", label: "Routine" },
    'urgent': { color: "bg-amber-100 text-amber-700", label: "Urgent" },
    'stat': { color: "bg-red-100 text-red-700", label: "STAT" }
  };
  const { color, label } = config[priority];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}

function CategoryBadge({ category }: { category: TestCategory }) {
  const config = {
    'blood': { icon: Droplet, color: "bg-red-100 text-red-700", label: "Blood" },
    'urine': { icon: Beaker, color: "bg-amber-100 text-amber-700", label: "Urine" },
    'imaging': { icon: Activity, color: "bg-blue-100 text-blue-700", label: "Imaging" },
    'pathology': { icon: Microscope, color: "bg-purple-100 text-purple-700", label: "Pathology" },
    'microbiology': { icon: TestTube, color: "bg-green-100 text-green-700", label: "Microbiology" },
    'genetics': { icon: Brain, color: "bg-indigo-100 text-indigo-700", label: "Genetics" }
  };
  const { icon: Icon, color, label } = config[category];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

// Lab Test Card Component (Mobile View)
function LabTestCard({ test, onView, onEdit, onDelete, onUpdateStatus }: { 
  test: LabTest;
  onView: (test: LabTest) => void;
  onEdit: (test: LabTest) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: TestStatus) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <FlaskConical className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{test.testName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <CategoryBadge category={test.category} />
              <PriorityBadge priority={test.priority} />
            </div>
          </div>
        </div>
        <StatusBadge status={test.status} />
      </div>
      
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm">
          <User className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600">{test.patientName}</span>
          <span className="text-xs text-slate-400">ID: {test.patientId}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Stethoscope className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600">{test.doctorName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600">Requested: {new Date(test.requestedDate).toLocaleDateString()}</span>
        </div>
        {test.sampleCollectedDate && (
          <div className="flex items-center gap-2 text-sm">
            <TestTube className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">Collected: {new Date(test.sampleCollectedDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>
      
      <div className="flex gap-2 pt-2 border-t border-slate-100">
        <button
          onClick={() => onView(test)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-600 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          View
        </button>
        <button
          onClick={() => onEdit(test)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-medium text-blue-600 transition-colors"
        >
          <Edit2 className="w-3.5 h-3.5" />
          Edit
        </button>
        <select
          value={test.status}
          onChange={(e) => onUpdateStatus(test.id, e.target.value as TestStatus)}
          className="px-2 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm text-slate-600 border-0 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>
  );
}

// Lab Test Detail Modal
function LabTestDetailModal({ test, isOpen, onClose }: { test: LabTest | null; isOpen: boolean; onClose: () => void }) {
  if (!isOpen || !test) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{test.testName}</h2>
            <p className="text-sm text-slate-500 mt-1">Lab Test Details</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Test Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Patient Information</p>
              <p className="text-sm font-medium text-slate-900">{test.patientName}</p>
              <p className="text-xs text-slate-500">ID: {test.patientId}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Requesting Doctor</p>
              <p className="text-sm font-medium text-slate-900">{test.doctorName}</p>
              <p className="text-xs text-slate-500">ID: {test.doctorId}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Test Details</p>
              <div className="flex items-center gap-2 mt-1">
                <CategoryBadge category={test.category} />
                <PriorityBadge priority={test.priority} />
                <StatusBadge status={test.status} />
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Dates</p>
              <p className="text-sm text-slate-900">Requested: {new Date(test.requestedDate).toLocaleDateString()}</p>
              {test.sampleCollectedDate && (
                <p className="text-sm text-slate-900">Collected: {new Date(test.sampleCollectedDate).toLocaleDateString()}</p>
              )}
              {test.completedDate && (
                <p className="text-sm text-slate-900">Completed: {new Date(test.completedDate).toLocaleDateString()}</p>
              )}
            </div>
          </div>
          
          {/* Sample Information */}
          {(test.sampleType || test.instructions) && (
            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Sample Information</h3>
              {test.sampleType && (
                <p className="text-sm text-blue-800 mb-1">Type: {test.sampleType}</p>
              )}
              {test.instructions && (
                <p className="text-sm text-blue-800">Instructions: {test.instructions}</p>
              )}
            </div>
          )}
          
          {/* Test Results */}
          {test.results && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Test Results</h3>
              {test.results.parameters.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-4">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Parameter</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Result</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Reference Range</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {test.results.parameters.map((param, idx) => (
                        <tr key={idx} className="border-t border-slate-100">
                          <td className="px-4 py-2 text-sm text-slate-700">{param.name}</td>
                          <td className="px-4 py-2 text-sm font-medium text-slate-900">{param.value} {param.unit}</td>
                          <td className="px-4 py-2 text-sm text-slate-500">{param.referenceRange}</td>
                          <td className="px-4 py-2">
                            {param.abnormal ? (
                              <span className="inline-flex items-center gap-1 text-xs text-red-600">
                                <AlertCircle className="w-3 h-3" />
                                Abnormal
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                                <CheckCircle2 className="w-3 h-3" />
                                Normal
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm font-medium text-slate-700 mb-2">Summary</p>
                <p className="text-sm text-slate-600">{test.results.summary}</p>
              </div>
            </div>
          )}
          
          {test.notes && (
            <div className="bg-amber-50 rounded-xl p-4">
              <p className="text-sm font-medium text-amber-800 mb-1">Notes</p>
              <p className="text-sm text-amber-700">{test.notes}</p>
            </div>
          )}
        </div>
        
        <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
          {test.status !== 'completed' && (
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              <Upload className="w-4 h-4 inline mr-2" />
              Upload Results
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Add/Edit Test Modal
function TestModal({ isOpen, onClose, onSubmit, initialData }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (data: any) => void; 
  initialData?: LabTest | null;
}) {
  const [formData, setFormData] = useState({
    testName: initialData?.testName || "",
    category: initialData?.category || "blood",
    patientName: initialData?.patientName || "",
    patientId: initialData?.patientId || "",
    doctorName: initialData?.doctorName || "",
    doctorId: initialData?.doctorId || "",
    priority: initialData?.priority || "routine",
    instructions: initialData?.instructions || "",
    sampleType: initialData?.sampleType || "",
  });
  
  if (!isOpen) return null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      requestedDate: new Date().toISOString().split('T')[0],
      status: "pending",
    });
  };
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {initialData ? "Edit Lab Test" : "Request New Lab Test"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Test Name *
              </label>
              <input
                type="text"
                value={formData.testName}
                onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as TestCategory })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              >
                <option value="blood">Blood Test</option>
                <option value="urine">Urine Test</option>
                <option value="imaging">Imaging</option>
                <option value="pathology">Pathology</option>
                <option value="microbiology">Microbiology</option>
                <option value="genetics">Genetics</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Priority *
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as TestPriority })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              >
                <option value="routine">Routine</option>
                <option value="urgent">Urgent</option>
                <option value="stat">STAT</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Patient Name *
              </label>
              <input
                type="text"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Patient ID *
              </label>
              <input
                type="text"
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Doctor Name *
              </label>
              <input
                type="text"
                value={formData.doctorName}
                onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Doctor ID *
              </label>
              <input
                type="text"
                value={formData.doctorId}
                onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Sample Type
              </label>
              <input
                type="text"
                value={formData.sampleType}
                onChange={(e) => setFormData({ ...formData, sampleType: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                placeholder="e.g., Blood, Urine, Tissue"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Instructions
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                placeholder="Any special instructions for the patient..."
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {initialData ? "Update Test" : "Request Test"}
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
export default function AdminLabTests() {
  const [tests, setTests] = useState<LabTest[]>(mockLabTests);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  // Filter tests
  const filteredTests = tests.filter(test => {
    const matchesSearch = test.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          test.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          test.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || test.status === statusFilter;
    const matchesCategory = categoryFilter === "All" || test.category === categoryFilter;
    const matchesPriority = priorityFilter === "All" || test.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });
  
  // Pagination
  const totalPages = Math.ceil(filteredTests.length / itemsPerPage);
  const paginatedTests = filteredTests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const stats = {
    total: tests.length,
    pending: tests.filter(t => t.status === "pending").length,
    inProgress: tests.filter(t => t.status === "in-progress").length,
    completed: tests.filter(t => t.status === "completed").length,
    urgent: tests.filter(t => t.priority === "urgent" || t.priority === "stat").length,
  };
  
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this lab test?")) {
      setTests(tests.filter(t => t.id !== id));
    }
  };
  
  const handleUpdateStatus = (id: string, newStatus: TestStatus) => {
    setTests(tests.map(t => 
      t.id === id ? { 
        ...t, 
        status: newStatus,
        completedDate: newStatus === "completed" ? new Date().toISOString().split('T')[0] : t.completedDate
      } : t
    ));
  };
  
  const handleAddTest = (data: any) => {
    const newTest: LabTest = {
      id: `${Date.now()}`,
      ...data,
      status: "pending",
      requestedDate: new Date().toISOString().split('T')[0],
    };
    setTests([newTest, ...tests]);
    setShowAddModal(false);
  };
  
  const handleEditTest = (data: any) => {
    if (selectedTest) {
      const updatedTests = tests.map(t =>
        t.id === selectedTest.id
          ? { ...t, ...data }
          : t
      );
      setTests(updatedTests);
      setSelectedTest(null);
      setShowEditModal(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Lab Tests</h1>
            <p className="text-sm text-slate-500 mt-1">Manage laboratory tests and results</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-white rounded-lg transition-colors border border-slate-200">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-white rounded-lg transition-colors border border-slate-200">
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Request Test
            </button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <FlaskConical className="w-5 h-5 text-blue-500" />
              <span className="text-2xl font-bold text-slate-900">{stats.total}</span>
            </div>
            <p className="text-sm text-slate-500">Total Tests</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <span className="text-2xl font-bold text-slate-900">{stats.pending}</span>
            </div>
            <p className="text-sm text-slate-500">Pending</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <span className="text-2xl font-bold text-slate-900">{stats.inProgress}</span>
            </div>
            <p className="text-sm text-slate-500">In Progress</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="text-2xl font-bold text-slate-900">{stats.completed}</span>
            </div>
            <p className="text-sm text-slate-500">Completed</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-2xl font-bold text-slate-900">{stats.urgent}</span>
            </div>
            <p className="text-sm text-slate-500">Urgent/STAT</p>
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by test name, patient, or doctor..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="All">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="All">All Categories</option>
              <option value="blood">Blood</option>
              <option value="urine">Urine</option>
              <option value="imaging">Imaging</option>
              <option value="pathology">Pathology</option>
              <option value="microbiology">Microbiology</option>
              <option value="genetics">Genetics</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="All">All Priority</option>
              <option value="routine">Routine</option>
              <option value="urgent">Urgent</option>
              <option value="stat">STAT</option>
            </select>
          </div>
        </div>
        
        {/* Desktop Table View */}
        {paginatedTests.length > 0 ? (
          <>
            <div className="hidden lg:block bg-white rounded-xl border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Test Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Patient</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Doctor</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Priority</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Requested</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTests.map((test) => (
                      <tr key={test.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <FlaskConical className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium text-slate-900">{test.testName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">{test.patientName}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{test.doctorName}</td>
                        <td className="px-4 py-3"><CategoryBadge category={test.category} /></td>
                        <td className="px-4 py-3"><PriorityBadge priority={test.priority} /></td>
                        <td className="px-4 py-3"><StatusBadge status={test.status} /></td>
                        <td className="px-4 py-3 text-sm text-slate-500">{new Date(test.requestedDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setSelectedTest(test);
                                setShowDetailModal(true);
                              }}
                              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedTest(test);
                                setShowEditModal(true);
                              }}
                              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(test.id)}
                              className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Mobile Card View */}
            <div className="lg:hidden space-y-3">
              {paginatedTests.map((test) => (
                <LabTestCard
                  key={test.id}
                  test={test}
                  onView={(t) => {
                    setSelectedTest(t);
                    setShowDetailModal(true);
                  }}
                  onEdit={(t) => {
                    setSelectedTest(t);
                    setShowEditModal(true);
                  }}
                  onDelete={handleDelete}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-white rounded-xl border border-slate-100 px-4 py-3">
                <p className="text-sm text-slate-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredTests.length)} of{" "}
                  {filteredTests.length} results
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
            <FlaskConical className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-lg font-medium">No lab tests found</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
      
      {/* Modals */}
      <LabTestDetailModal
        test={selectedTest}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedTest(null);
        }}
      />
      
      <TestModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddTest}
      />
      
      <TestModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedTest(null);
        }}
        onSubmit={handleEditTest}
        initialData={selectedTest}
      />
    </div>
  );
}