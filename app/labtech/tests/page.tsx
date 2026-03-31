// app/technician/tests/page.tsx
'use client';

import { useState } from 'react';
import {
  Clock, Search, Filter, Eye, Upload, ChevronRight,
  Calendar, User, AlertCircle, CheckCircle2, X,
  Download, Printer, MoreHorizontal, Activity,
  Heart, Beaker, Microscope, TestTube, Brain,
  TrendingUp, TrendingDown, ChevronLeft,
  FileText, Pill, Stethoscope, Syringe, Thermometer
} from 'lucide-react';

// Mock Data for Different Departments
const pendingTestsData = {
  laboratory: {
    tests: [
      { 
        id: 'LAB001', 
        testName: 'Complete Blood Count (CBC)', 
        patientId: 'P001', 
        patientName: 'John Sharma',
        age: 45, gender: 'Male',
        priority: 'routine', 
        status: 'pending',
        orderDate: '2024-03-30',
        orderedBy: 'Dr. Rajesh Kumar',
        department: 'Cardiology',
        sampleType: 'Blood',
        sampleCollected: false,
        instructions: 'Fasting not required',
        parameters: ['Hemoglobin', 'WBC Count', 'Platelets', 'RBC Count']
      },
      { 
        id: 'LAB002', 
        testName: 'Lipid Profile', 
        patientId: 'P002', 
        patientName: 'Priya Patel',
        age: 32, gender: 'Female',
        priority: 'urgent', 
        status: 'in-progress',
        orderDate: '2024-03-30',
        orderedBy: 'Dr. Amit Patel',
        department: 'Endocrinology',
        sampleType: 'Blood',
        sampleCollected: true,
        collectedAt: '2024-03-30 09:30 AM',
        instructions: '12 hours fasting required',
        parameters: ['Total Cholesterol', 'HDL', 'LDL', 'Triglycerides']
      },
      { 
        id: 'LAB003', 
        testName: 'Thyroid Profile', 
        patientId: 'P003', 
        patientName: 'Aisha Khan',
        age: 58, gender: 'Female',
        priority: 'stat', 
        status: 'pending',
        orderDate: '2024-03-29',
        orderedBy: 'Dr. Priya Singh',
        department: 'Endocrinology',
        sampleType: 'Blood',
        sampleCollected: false,
        instructions: 'Fasting recommended',
        parameters: ['TSH', 'T3', 'T4']
      },
      { 
        id: 'LAB004', 
        testName: 'Blood Glucose Fasting', 
        patientId: 'P004', 
        patientName: 'Ravi Patel',
        age: 28, gender: 'Male',
        priority: 'routine', 
        status: 'pending',
        orderDate: '2024-03-29',
        orderedBy: 'Dr. Sarah Johnson',
        department: 'General Medicine',
        sampleType: 'Blood',
        sampleCollected: false,
        instructions: '12 hours fasting required',
        parameters: ['Fasting Glucose', 'Postprandial Glucose']
      },
      { 
        id: 'LAB005', 
        testName: 'Urinalysis', 
        patientId: 'P005', 
        patientName: 'Sara Ahmed',
        age: 35, gender: 'Female',
        priority: 'urgent', 
        status: 'pending',
        orderDate: '2024-03-30',
        orderedBy: 'Dr. Meera Desai',
        department: 'Nephrology',
        sampleType: 'Urine',
        sampleCollected: true,
        collectedAt: '2024-03-30 08:15 AM',
        instructions: 'First morning urine preferred',
        parameters: ['Appearance', 'pH', 'Protein', 'Glucose', 'Microscopy']
      },
      { 
        id: 'LAB006', 
        testName: 'Liver Function Test', 
        patientId: 'P006', 
        patientName: 'Arun Mehta',
        age: 52, gender: 'Male',
        priority: 'routine', 
        status: 'pending',
        orderDate: '2024-03-28',
        orderedBy: 'Dr. Vikram Sharma',
        department: 'Gastroenterology',
        sampleType: 'Blood',
        sampleCollected: false,
        instructions: 'Fasting required',
        parameters: ['ALT', 'AST', 'ALP', 'Bilirubin']
      }
    ]
  },
  radiology: {
    tests: [
      { 
        id: 'RAD001', 
        testName: 'Chest X-Ray', 
        patientId: 'P007', 
        patientName: 'Neha Gupta',
        age: 42, gender: 'Female',
        priority: 'urgent', 
        status: 'pending',
        orderDate: '2024-03-30',
        orderedBy: 'Dr. Rajesh Kumar',
        department: 'Cardiology',
        instructions: 'Remove metal objects',
        parameters: ['Chest PA View', 'Chest Lateral View']
      },
      { 
        id: 'RAD002', 
        testName: 'MRI Brain', 
        patientId: 'P008', 
        patientName: 'Vikram Singh',
        age: 38, gender: 'Male',
        priority: 'routine', 
        status: 'in-progress',
        orderDate: '2024-03-29',
        orderedBy: 'Dr. Priya Singh',
        department: 'Neurology',
        instructions: 'No metal implants',
        parameters: ['T1 Weighted', 'T2 Weighted', 'FLAIR', 'DWI']
      }
    ]
  },
  cardiology: {
    tests: [
      { 
        id: 'CARD001', 
        testName: 'ECG', 
        patientId: 'P009', 
        patientName: 'Meera Desai',
        age: 65, gender: 'Female',
        priority: 'urgent', 
        status: 'pending',
        orderDate: '2024-03-30',
        orderedBy: 'Dr. Amit Patel',
        department: 'Cardiology',
        instructions: 'Rest for 10 minutes before test',
        parameters: ['Heart Rate', 'PR Interval', 'QT Interval', 'ST Segment']
      },
      { 
        id: 'CARD002', 
        testName: 'Echocardiogram', 
        patientId: 'P010', 
        patientName: 'Rajesh Gupta',
        age: 55, gender: 'Male',
        priority: 'routine', 
        status: 'pending',
        orderDate: '2024-03-29',
        orderedBy: 'Dr. Rajesh Kumar',
        department: 'Cardiology',
        instructions: 'No caffeine before test',
        parameters: ['LVEF', 'Wall Motion', 'Valve Function']
      }
    ]
  },
  dialysis: {
    tests: [
      { 
        id: 'DIA001', 
        testName: 'Dialysis Session', 
        patientId: 'P011', 
        patientName: 'Sunil Kumar',
        age: 48, gender: 'Male',
        priority: 'routine', 
        status: 'in-progress',
        orderDate: '2024-03-30',
        orderedBy: 'Dr. Meera Desai',
        department: 'Nephrology',
        instructions: 'Check vitals before session',
        parameters: ['Pre-dialysis weight', 'Post-dialysis weight', 'Blood flow rate']
      }
    ]
  }
};

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

function StatusBadge({ status }: { status: string }) {
  const config = {
    pending: { icon: Clock, color: 'bg-amber-100 text-amber-700', label: 'Pending' },
    'in-progress': { icon: Activity, color: 'bg-blue-100 text-blue-700', label: 'In Progress' },
    completed: { icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-700', label: 'Completed' }
  };
  const { icon: Icon, color, label } = config[status as keyof typeof config] || config.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

function SampleStatusBadge({ collected }: { collected: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
      collected ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
    }`}>
      {collected ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
      {collected ? 'Sample Collected' : 'Sample Pending'}
    </span>
  );
}

function TestCard({ test, onStart, onUpload, onViewDetails }: any) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-slate-900 text-lg">{test.testName}</h3>
            <PriorityBadge priority={test.priority} />
            <StatusBadge status={test.status} />
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4 text-slate-400" />
              <span>{test.patientName}</span>
              <span className="text-slate-400">({test.age} yrs, {test.gender})</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4 text-slate-400" />
              <span>ID: {test.patientId}</span>
            </div>
          </div>
        </div>
        <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">Ordered: {new Date(test.orderDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Stethoscope className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">By: {test.orderedBy}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Activity className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">Dept: {test.department}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <TestTube className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">Sample: {test.sampleType}</span>
          </div>
          <SampleStatusBadge collected={test.sampleCollected} />
          {test.sampleCollected && test.collectedAt && (
            <div className="text-xs text-slate-500">
              Collected: {test.collectedAt}
            </div>
          )}
        </div>
      </div>
      
      {test.instructions && (
        <div className="bg-blue-50 rounded-lg p-2 mb-4">
          <p className="text-xs text-blue-700">
            <strong>Instructions:</strong> {test.instructions}
          </p>
        </div>
      )}
      
      <div className="flex gap-2">
        <button
          onClick={() => onViewDetails(test)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-600 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          Details
        </button>
        <button
          onClick={() => onStart(test)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-medium text-blue-600 transition-colors"
        >
          <Activity className="w-3.5 h-3.5" />
          Start Test
        </button>
        <button
          onClick={() => onUpload(test)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-sm font-medium text-emerald-600 transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          Upload
        </button>
      </div>
    </div>
  );
}

function TestDetailModal({ test, isOpen, onClose, onStart, onUpload }: any) {
  if (!isOpen || !test) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Test Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Test Header */}
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{test.testName}</h3>
                <p className="text-sm text-slate-500">Test ID: {test.id}</p>
              </div>
              <div className="flex gap-2">
                <PriorityBadge priority={test.priority} />
                <StatusBadge status={test.status} />
              </div>
            </div>
          </div>
          
          {/* Patient Info */}
          <div className="bg-slate-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Patient Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">Name</p>
                <p className="text-sm font-medium text-slate-900">{test.patientName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Patient ID</p>
                <p className="text-sm font-medium text-slate-900">{test.patientId}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Age / Gender</p>
                <p className="text-sm font-medium text-slate-900">{test.age} yrs / {test.gender}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Department</p>
                <p className="text-sm font-medium text-slate-900">{test.department}</p>
              </div>
            </div>
          </div>
          
          {/* Order Info */}
          <div className="bg-slate-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Order Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">Ordered By</p>
                <p className="text-sm font-medium text-slate-900">{test.orderedBy}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Order Date</p>
                <p className="text-sm font-medium text-slate-900">{new Date(test.orderDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Sample Type</p>
                <p className="text-sm font-medium text-slate-900">{test.sampleType}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Sample Status</p>
                <SampleStatusBadge collected={test.sampleCollected} />
              </div>
            </div>
          </div>
          
          {/* Parameters */}
          <div className="bg-slate-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Test Parameters</h4>
            <div className="flex flex-wrap gap-2">
              {test.parameters.map((param: string, idx: number) => (
                <span key={idx} className="px-3 py-1 bg-white rounded-full text-sm text-slate-700 border border-slate-200">
                  {param}
                </span>
              ))}
            </div>
          </div>
          
          {/* Instructions */}
          {test.instructions && (
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Special Instructions</h4>
              <p className="text-sm text-blue-800">{test.instructions}</p>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                onStart(test);
                onClose();
              }}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
            >
              <Activity className="w-4 h-4 inline mr-2" />
              Start Testing
            </button>
            <button
              onClick={() => {
                onUpload(test);
                onClose();
              }}
              className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700"
            >
              <Upload className="w-4 h-4 inline mr-2" />
              Upload Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UploadModal({ isOpen, onClose, onUpload, test }: any) {
  const [formData, setFormData] = useState({
    parameters: '',
    notes: '',
    file: null
  });
  
  if (!isOpen) return null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpload(formData);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Upload Results</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-slate-50 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-slate-900">Test: {test?.testName}</p>
            <p className="text-xs text-slate-500">Patient: {test?.patientName} (ID: {test?.patientId})</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Test Parameters & Results *
            </label>
            <textarea
              value={formData.parameters}
              onChange={(e) => setFormData({ ...formData, parameters: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="e.g.,&#10;Hemoglobin: 14.2 g/dL (Reference: 13.5-17.5)&#10;WBC Count: 7.5 x10³/µL (Reference: 4.5-11.0)&#10;Platelets: 250 x10³/µL (Reference: 150-450)"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Technician Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="Any observations, abnormalities, or notes..."
            />
          </div>
          
          <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-blue-300 transition-colors cursor-pointer">
            <Download className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600">Click or drag and drop your test results file</p>
            <p className="text-xs text-slate-400 mt-1">PDF, Images, or Excel files supported (Max 10MB)</p>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Upload Results
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

export default function PendingTestsPage({ activeDept = 'laboratory' }: { activeDept?: string }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sampleFilter, setSampleFilter] = useState('All');
  const [selectedTest, setSelectedTest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const departmentData = pendingTestsData[activeDept as keyof typeof pendingTestsData];
  const allTests = departmentData?.tests || [];
  
  // Filter tests
  const filteredTests = allTests.filter(test => {
    const matchesSearch = test.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          test.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          test.patientId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'All' || test.priority === priorityFilter.toLowerCase();
    const matchesStatus = statusFilter === 'All' || test.status === statusFilter.toLowerCase();
    const matchesSample = sampleFilter === 'All' || 
                          (sampleFilter === 'Collected' && test.sampleCollected) ||
                          (sampleFilter === 'Pending' && !test.sampleCollected);
    return matchesSearch && matchesPriority && matchesStatus && matchesSample;
  });
  
  // Pagination
  const totalPages = Math.ceil(filteredTests.length / itemsPerPage);
  const paginatedTests = filteredTests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const stats = {
    total: allTests.length,
    pending: allTests.filter(t => t.status === 'pending').length,
    inProgress: allTests.filter(t => t.status === 'in-progress').length,
    urgent: allTests.filter(t => t.priority === 'urgent' || t.priority === 'stat').length,
    samplesCollected: allTests.filter(t => t.sampleCollected).length
  };
  
  const handleStartTest = (test: any) => {
    console.log('Starting test:', test);
    alert(`Starting ${test.testName} for patient ${test.patientName}`);
  };
  
  const handleUploadResults = (test: any) => {
    setSelectedTest(test);
    setShowUploadModal(true);
  };
  
  const handleUpload = (data: any) => {
    console.log('Uploading results:', data);
    alert('Results uploaded successfully!');
  };
  
  const getDepartmentIcon = () => {
    switch(activeDept) {
      case 'laboratory': return <Beaker className="w-6 h-6 text-blue-600" />;
      case 'radiology': return <Activity className="w-6 h-6 text-sky-600" />;
      case 'cardiology': return <Heart className="w-6 h-6 text-red-600" />;
      case 'dialysis': return <Activity className="w-6 h-6 text-cyan-600" />;
      default: return <Beaker className="w-6 h-6 text-blue-600" />;
    }
  };
  
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {getDepartmentIcon()}
            <h1 className="text-2xl font-bold text-slate-900">Pending Tests</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">Manage and process pending laboratory tests</p>
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
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-blue-500" />
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
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-2xl font-bold text-slate-900">{stats.urgent}</span>
          </div>
          <p className="text-sm text-slate-500">Urgent/STAT</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <TestTube className="w-5 h-5 text-emerald-500" />
            <span className="text-2xl font-bold text-slate-900">{stats.samplesCollected}</span>
          </div>
          <p className="text-sm text-slate-500">Samples Collected</p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by test name, patient name, or ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
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
          </select>
          <select
            value={sampleFilter}
            onChange={(e) => {
              setSampleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="All">All Samples</option>
            <option value="Collected">Sample Collected</option>
            <option value="Pending">Sample Pending</option>
          </select>
        </div>
      </div>
      
      {/* Tests List */}
      {paginatedTests.length > 0 ? (
        <>
          <div className="space-y-4">
            {paginatedTests.map((test) => (
              <TestCard
                key={test.id}
                test={test}
                onStart={handleStartTest}
                onUpload={handleUploadResults}
                onViewDetails={(t: any) => {
                  setSelectedTest(t);
                  setShowDetailModal(true);
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
          <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-lg font-medium">No pending tests found</p>
          <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filter criteria</p>
        </div>
      )}
      
      {/* Modals */}
      <TestDetailModal
        test={selectedTest}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedTest(null);
        }}
        onStart={handleStartTest}
        onUpload={handleUploadResults}
      />
      
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setSelectedTest(null);
        }}
        onUpload={handleUpload}
        test={selectedTest}
      />
    </div>
  );
}