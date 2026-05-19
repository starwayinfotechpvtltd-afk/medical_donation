// app/doctor/lab-tests/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api, ApiException } from '@/lib/api-client';
import {
  FlaskConical, Search, Filter, Plus, Download, Printer,
  Eye, Edit2, Trash2, CheckCircle2, XCircle, Clock,
  AlertCircle, User, Stethoscope, Calendar, FileText,
  ChevronLeft, ChevronRight, X, Upload, Microscope,
  TestTube, Beaker, Activity, Brain, Heart, Bone
} from 'lucide-react';

// Mock Lab Tests Data
const mockLabTests = [
  {
    id: 'LAB001',
    testName: 'Complete Blood Count (CBC)',
    category: 'Hematology',
    patientName: 'John Sharma',
    patientId: 'P001',
    requestedDate: '2024-03-25',
    collectionDate: '2024-03-26',
    resultDate: '2024-03-27',
    status: 'completed',
    priority: 'routine',
    results: {
      parameters: [
        { name: 'Hemoglobin', value: '14.2', unit: 'g/dL', referenceRange: '13.5-17.5', abnormal: false },
        { name: 'WBC Count', value: '7.5', unit: 'x10³/µL', referenceRange: '4.5-11.0', abnormal: false },
        { name: 'Platelets', value: '250', unit: 'x10³/µL', referenceRange: '150-450', abnormal: false },
        { name: 'RBC Count', value: '4.8', unit: 'x10⁶/µL', referenceRange: '4.5-5.9', abnormal: false }
      ],
      summary: 'All parameters within normal range. No significant abnormalities detected.',
      technician: 'Priya Patel'
    },
    notes: 'Patient fasting required? No'
  },
  {
    id: 'LAB002',
    testName: 'Lipid Profile',
    category: 'Biochemistry',
    patientName: 'Priya Patel',
    patientId: 'P002',
    requestedDate: '2024-03-26',
    collectionDate: '2024-03-27',
    status: 'in-progress',
    priority: 'routine',
    notes: 'Fasting required for 12 hours',
    technician: 'Arun Mehta'
  },
  {
    id: 'LAB003',
    testName: 'Thyroid Profile',
    category: 'Endocrinology',
    patientName: 'Aisha Khan',
    patientId: 'P003',
    requestedDate: '2024-03-27',
    status: 'pending',
    priority: 'urgent',
    notes: 'TSH, T3, T4 required'
  },
  {
    id: 'LAB004',
    testName: 'Blood Glucose Fasting',
    category: 'Biochemistry',
    patientName: 'Ravi Patel',
    patientId: 'P004',
    requestedDate: '2024-03-27',
    status: 'pending',
    priority: 'stat',
    notes: 'Fasting for 12 hours required'
  },
  {
    id: 'LAB005',
    testName: 'ECG',
    category: 'Cardiology',
    patientName: 'Sara Ahmed',
    patientId: 'P005',
    requestedDate: '2024-03-24',
    collectionDate: '2024-03-24',
    resultDate: '2024-03-25',
    status: 'completed',
    priority: 'routine',
    results: {
      parameters: [
        { name: 'Heart Rate', value: '72', unit: 'bpm', referenceRange: '60-100', abnormal: false },
        { name: 'PR Interval', value: '160', unit: 'ms', referenceRange: '120-200', abnormal: false },
        { name: 'QT Interval', value: '380', unit: 'ms', referenceRange: '350-440', abnormal: false }
      ],
      summary: 'Normal sinus rhythm. No ST-T changes.',
      technician: 'Dr. Rajesh'
    }
  },
  {
    id: 'LAB006',
    testName: 'X-Ray Chest',
    category: 'Radiology',
    patientName: 'Arun Mehta',
    patientId: 'P006',
    requestedDate: '2024-03-23',
    collectionDate: '2024-03-23',
    resultDate: '2024-03-24',
    status: 'completed',
    priority: 'routine',
    results: {
      parameters: [
        { name: 'Findings', value: 'Normal cardiac silhouette, clear lung fields', unit: '', referenceRange: '', abnormal: false }
      ],
      summary: 'Chest X-ray shows no acute cardiopulmonary abnormalities.',
      technician: 'Dr. Meera'
    }
  }
];

function StatusBadge({ status }: { status: string }) {
  const config = {
    pending: { icon: Clock, color: 'bg-amber-100 text-amber-700', label: 'Pending' },
    'in-progress': { icon: Activity, color: 'bg-blue-100 text-blue-700', label: 'In Progress' },
    completed: { icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-700', label: 'Completed' },
    cancelled: { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Cancelled' }
  };
  const { icon: Icon, color, label } = config[status as keyof typeof config] || config.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const config = {
    routine: 'bg-slate-100 text-slate-700',
    urgent: 'bg-amber-100 text-amber-700',
    stat: 'bg-red-100 text-red-700'
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${config[priority as keyof typeof config]}`}>
      {priority.toUpperCase()}
    </span>
  );
}

function LabTestCard({ test, onView, onEdit, onOrder }: any) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-slate-900">{test.testName}</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">{test.category}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <StatusBadge status={test.status} />
            <PriorityBadge priority={test.priority} />
          </div>
        </div>
        
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-900">{test.patientName}</span>
            <span className="text-xs text-slate-500">Reg No: {test.patientRegNo || test.patientId || '-'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>Requested: {new Date(test.requestedDate).toLocaleDateString()}</span>
          </div>
        </div>
        
        {test.results && (
          <div className="bg-slate-50 rounded-lg p-2 mb-3">
            <p className="text-xs text-slate-500">Latest Result</p>
            <p className="text-sm text-slate-700 line-clamp-1">{test.results.summary}</p>
          </div>
        )}
        
        <div className="flex gap-2">
          <button
            onClick={() => onView(test)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-600 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            View
          </button>
          <button
            onClick={() => onOrder(test)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-medium text-blue-600 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Order New
          </button>
        </div>
      </div>
    </div>
  );
}

function LabTestModal({ test, isOpen, onClose, onSave }: any) {
  const [formData, setFormData] = useState(test || {
    testName: '',
    category: '',
    patientRegNo: '',
    appointmentId: '',
    priority: 'routine',
    notes: ''
  });

  useEffect(() => {
    setFormData(test || {
      testName: '',
      category: '',
      patientRegNo: '',
      appointmentId: '',
      priority: 'routine',
      notes: ''
    });
  }, [test, isOpen]);
  
  if (!isOpen) return null;
  
  const testCategories = [
    'Hematology', 'Biochemistry', 'Microbiology', 'Pathology',
    'Radiology', 'Cardiology', 'Neurology', 'Endocrinology', 'Immunology'
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      patientName: formData.patientName || formData.patientRegNo,
      patientId: formData.patientId || formData.patientRegNo,
      id: test?.id || `LAB${Date.now()}`,
      requestedDate: test?.requestedDate || new Date().toISOString().split('T')[0],
      status: 'pending'
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {test ? 'Edit Lab Test' : 'Order New Lab Test'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
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
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              >
                <option value="">Select Category</option>
                {testCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Priority *
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="routine">Routine</option>
                <option value="urgent">Urgent</option>
                <option value="stat">STAT (Immediate)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Patient Reg No *
              </label>
              <input
                type="text"
                value={formData.patientRegNo}
                onChange={(e) => setFormData({ ...formData, patientRegNo: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Appointment ID
              </label>
              <input
                type="text"
                value={formData.appointmentId}
                onChange={(e) => setFormData({ ...formData, appointmentId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Auto-filled from shortcut if available"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Instructions / Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Special instructions for the patient or lab technician..."
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {test ? 'Update Test' : 'Order Test'}
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

function LabTestViewModal({ test, onClose, onOrderNew }: any) {
  if (!test) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Lab Test Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Header Info */}
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">Test Name</p>
                <p className="text-lg font-semibold text-slate-900">{test.testName}</p>
                <p className="text-sm text-slate-500">{test.category}</p>
              </div>
              <div className="text-right">
                <div className="flex justify-end gap-2 mb-2">
                  <StatusBadge status={test.status} />
                  <PriorityBadge priority={test.priority} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Patient Info */}
          <div className="bg-slate-50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Patient Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-700">{test.patientName}</span>
                <span className="text-xs text-slate-500">Reg No: {test.patientRegNo || test.patientId || '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-700">Requested: {new Date(test.requestedDate).toLocaleDateString()}</span>
              </div>
              {test.collectionDate && (
                <div className="flex items-center gap-2">
                  <TestTube className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-700">Collected: {new Date(test.collectionDate).toLocaleDateString()}</span>
                </div>
              )}
              {test.resultDate && (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm text-slate-700">Resulted: {new Date(test.resultDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Test Results */}
          {test.results && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Test Results</h3>
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
                    {test.results.parameters.map((param: any, idx: number) => (
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
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm font-medium text-slate-700 mb-2">Summary</p>
                <p className="text-sm text-slate-600">{test.results.summary}</p>
                {test.results.technician && (
                  <p className="text-xs text-slate-500 mt-2">Technician: {test.results.technician}</p>
                )}
              </div>
            </div>
          )}
          
          {/* Notes */}
          {test.notes && (
            <div className="bg-amber-50 rounded-xl p-4">
              <p className="text-sm font-medium text-amber-800 mb-1">Instructions / Notes</p>
              <p className="text-sm text-amber-700">{test.notes}</p>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                onClose();
                onOrderNew();
              }}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Order Similar Test
            </button>
            {test.results && (
              <button className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700">
                <Download className="w-4 h-4 inline mr-2" />
                Download Report
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DoctorLabTests() {
  const searchParams = useSearchParams();
  const [tests, setTests] = useState(mockLabTests);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedTest, setSelectedTest] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [prefillOrder, setPrefillOrder] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const filteredTests = tests.filter(test => {
    const matchesSearch = test.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          String(test.patientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          String(test.patientRegNo || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || test.status === statusFilter.toLowerCase();
    const matchesCategory = categoryFilter === 'All' || test.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });
  
  const totalPages = Math.ceil(filteredTests.length / itemsPerPage);
  const paginatedTests = filteredTests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const categories = ['All', ...new Set(tests.map(t => t.category))];
  
  const stats = {
    total: tests.length,
    pending: tests.filter(t => t.status === 'pending').length,
    inProgress: tests.filter(t => t.status === 'in-progress').length,
    completed: tests.filter(t => t.status === 'completed').length,
    urgent: tests.filter(t => t.priority === 'urgent' || t.priority === 'stat').length
  };
  
  const categoryToApi = (category: string) => {
    const normalized = (category || '').trim().toLowerCase();
    const allowed = ['hematology', 'biochemistry', 'microbiology', 'immunology', 'radiology', 'cardiology', 'pathology', 'other'];
    return allowed.includes(normalized) ? normalized : 'other';
  };

  const handleOrderTest = async (data: any) => {
    setError('');
    try {
      await api.post('/lab/lab-tests', {
        patient_reg_no: data.patientRegNo,
        appointment_id: data.appointmentId ? Number(data.appointmentId) : null,
        test_name: data.testName,
        test_type: data.testName,
        category: categoryToApi(data.category),
        priority: data.priority || 'routine',
        notes: data.notes || null,
      });
      setTests([data, ...tests]);
      setShowOrderModal(false);
      setPrefillOrder(null);
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to order lab test.');
    }
  };

  useEffect(() => {
    const patientRegNo = (searchParams.get('patientRegNo') || '').trim();
    const appointmentId = (searchParams.get('appointmentId') || '').trim();
    const action = (searchParams.get('action') || '').trim().toLowerCase();

    if (!patientRegNo) return;

    setSearchQuery(patientRegNo);
    setPrefillOrder({
      testName: '',
      category: '',
      patientRegNo,
      appointmentId,
      priority: 'routine',
      notes: '',
    });

    if (action === 'create') {
      setSelectedTest(null);
      setShowOrderModal(true);
    }
  }, [searchParams]);
  
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lab Tests</h1>
          <p className="text-sm text-slate-500 mt-1">Manage patient laboratory tests and results</p>
        </div>
        <button
          onClick={() => {
            setSelectedTest(null);
            setShowOrderModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Order Test
        </button>
      </div>
      
      {/* Stats */}
      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
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
              placeholder="Search by test name or patient..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Tests Grid */}
      {paginatedTests.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedTests.map((test) => (
              <LabTestCard
                key={test.id}
                test={test}
                onView={(t: any) => {
                  setSelectedTest(t);
                  setShowViewModal(true);
                }}
                onOrder={() => {
                  setSelectedTest(null);
                  setShowOrderModal(true);
                }}
              />
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-xl border border-slate-100 px-4 py-3">
              <p className="text-sm text-slate-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredTests.length)} of{' '}
                {filteredTests.length} tests
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum = i + 1;
                    if (totalPages > 5 && currentPage > 3) {
                      pageNum = currentPage - 2 + i;
                      if (pageNum > totalPages) return null;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-600 hover:bg-slate-100'
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
                  className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50"
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
          <p className="text-sm text-slate-400 mt-1">Order a new lab test to get started</p>
        </div>
      )}
      
      {/* Modals */}
      <LabTestViewModal
        test={selectedTest}
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedTest(null);
        }}
        onOrderNew={() => {
          setShowViewModal(false);
          setShowOrderModal(true);
        }}
      />
      
      <LabTestModal
        test={prefillOrder || selectedTest}
        isOpen={showOrderModal}
        onClose={() => {
          setShowOrderModal(false);
          setSelectedTest(null);
          setPrefillOrder(null);
        }}
        onSave={handleOrderTest}
      />
    </div>
  );
}
