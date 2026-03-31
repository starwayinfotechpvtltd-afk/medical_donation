// app/technician/page.tsx
'use client';

import { useState } from 'react';
import {
  Beaker, Upload, CheckCircle2, Clock, Download, Plus,
  Activity, Heart, Brain, Bone, Microscope, TestTube,
  Calendar, Users, FileText, TrendingUp, AlertCircle,
  ChevronRight, Eye, Filter, Search, X, Printer,
  DownloadCloud, Settings, User, Bell
} from 'lucide-react';

// Mock Data for Different Technician Types
const technicianData = {
  laboratory: {
    name: 'Clinical Laboratory',
    icon: <Beaker className="w-5 h-5" />,
    stats: {
      pendingTests: 12,
      completedToday: 8,
      totalResults: 45,
      avgTurnaround: '24 hrs'
    },
    tests: [
      { id: 'LAB001', testName: 'Complete Blood Count', patientId: 'P001', patientName: 'John Sharma', priority: 'routine', status: 'pending', orderDate: '2024-03-30' },
      { id: 'LAB002', testName: 'Lipid Profile', patientId: 'P002', patientName: 'Priya Patel', priority: 'urgent', status: 'in-progress', orderDate: '2024-03-30' },
      { id: 'LAB003', testName: 'Thyroid Function', patientId: 'P003', patientName: 'Aisha Khan', priority: 'stat', status: 'pending', orderDate: '2024-03-29' },
      { id: 'LAB004', testName: 'Blood Glucose', patientId: 'P004', patientName: 'Ravi Patel', priority: 'routine', status: 'pending', orderDate: '2024-03-29' }
    ]
  },
  radiology: {
    name: 'Radiology & Imaging',
    icon: <Activity className="w-5 h-5" />,
    stats: {
      pendingTests: 8,
      completedToday: 12,
      totalResults: 32,
      avgTurnaround: '2 hrs'
    },
    tests: [
      { id: 'RAD001', testName: 'Chest X-Ray', patientId: 'P005', patientName: 'Sara Ahmed', priority: 'urgent', status: 'pending', orderDate: '2024-03-30' },
      { id: 'RAD002', testName: 'MRI Brain', patientId: 'P006', patientName: 'Arun Mehta', priority: 'routine', status: 'in-progress', orderDate: '2024-03-29' },
      { id: 'RAD003', testName: 'CT Abdomen', patientId: 'P007', patientName: 'Neha Gupta', priority: 'stat', status: 'pending', orderDate: '2024-03-30' }
    ]
  },
  cardiology: {
    name: 'Cardiology Diagnostics',
    icon: <Heart className="w-5 h-5" />,
    stats: {
      pendingTests: 5,
      completedToday: 6,
      totalResults: 28,
      avgTurnaround: '1.5 hrs'
    },
    tests: [
      { id: 'CARD001', testName: 'ECG', patientId: 'P008', patientName: 'Vikram Singh', priority: 'urgent', status: 'pending', orderDate: '2024-03-30' },
      { id: 'CARD002', testName: 'Echocardiogram', patientId: 'P009', patientName: 'Meera Desai', priority: 'routine', status: 'in-progress', orderDate: '2024-03-29' }
    ]
  },
  dialysis: {
    name: 'Dialysis Unit',
    icon: <Activity className="w-5 h-5" />,
    stats: {
      pendingTests: 3,
      completedToday: 8,
      totalResults: 52,
      avgTurnaround: '4 hrs'
    },
    tests: [
      { id: 'DIA001', testName: 'Dialysis Session', patientId: 'P010', patientName: 'Rajesh Gupta', priority: 'routine', status: 'in-progress', orderDate: '2024-03-30' }
    ]
  }
};

function StatusBadge({ status }: { status: string }) {
  const config = {
    pending: { icon: Clock, color: 'bg-amber-100 text-amber-700', label: 'Pending' },
    'in-progress': { icon: Activity, color: 'bg-blue-100 text-blue-700', label: 'In Progress' },
    completed: { icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-700', label: 'Completed' },
    urgent: { icon: AlertCircle, color: 'bg-red-100 text-red-700', label: 'Urgent' },
    routine: { icon: Clock, color: 'bg-slate-100 text-slate-700', label: 'Routine' },
    stat: { icon: AlertCircle, color: 'bg-red-100 text-red-700', label: 'STAT' }
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

function StatsCard({ title, value, icon, color, trend }: any) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    sky: 'bg-sky-50 text-sky-600',
    cyan: 'bg-cyan-50 text-cyan-600',
    purple: 'bg-purple-50 text-purple-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600'
  };
  
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${
            trend.direction === 'up' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
          }`}>
            <TrendingUp className="w-3 h-3" />
            {trend.percentage}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-900 mb-1">{value}</p>
      <p className="text-sm text-slate-500">{title}</p>
    </div>
  );
}

function TestCard({ test, onStart, onUpload }: any) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900">{test.testName}</h3>
            <PriorityBadge priority={test.priority} />
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>Patient: {test.patientName}</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">ID: {test.patientId}</span>
          </div>
        </div>
        <StatusBadge status={test.status} />
      </div>
      
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
        <Calendar className="w-3.5 h-3.5" />
        <span>Ordered: {new Date(test.orderDate).toLocaleDateString()}</span>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => onStart(test)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-medium text-blue-600 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          Start Test
        </button>
        <button
          onClick={() => onUpload(test)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-sm font-medium text-emerald-600 transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          Upload Results
        </button>
      </div>
    </div>
  );
}

function UploadModal({ isOpen, onClose, onUpload }: any) {
  const [formData, setFormData] = useState({
    patientId: '',
    testName: '',
    parameters: '',
    notes: ''
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
          <h2 className="text-xl font-bold text-slate-900">Upload Test Results</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Patient ID *
            </label>
            <input
              type="text"
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>
          
          <div>
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
              Test Parameters & Values
            </label>
            <textarea
              value={formData.parameters}
              onChange={(e) => setFormData({ ...formData, parameters: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="e.g., Hemoglobin: 14.2 g/dL&#10;WBC Count: 7.5 x10³/µL"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Technician Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="Any observations or notes..."
            />
          </div>
          
          <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-blue-300 transition-colors">
            <DownloadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600">Drag and drop your test results file</p>
            <p className="text-xs text-slate-400 mt-1">PDF, Images, or Excel files supported</p>
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

export default function TechnicianDashboard({ activeDept = 'laboratory' }: { activeDept?: string }) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  
  const currentData = technicianData[activeDept as keyof typeof technicianData];
  const stats = currentData.stats;
  const tests = currentData.tests;
  
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

  //============

  const handleUpdate = (data: any) => {
    console.log(`Uploading results:`, data);
  alert('Results updatilg successfully!');
  }

  

  
  const getDepartmentIcon = () => {
    switch(activeDept) {
      case 'laboratory': return <Beaker className="w-6 h-6 text-blue-600" />;
      case 'radiology': return <Activity className="w-6 h-6 text-sky-600" />;
      case 'cardiology': return <Heart className="w-6 h-6 text-red-600" />;
      case 'dialysis': return <Activity className="w-6 h-6 text-cyan-600" />;
      default: return <Beaker className="w-6 h-6 text-blue-600" />;
    }
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
  
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {getDepartmentIcon()}
            <h1 className="text-2xl font-bold text-slate-900">{getDepartmentTitle()}</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">Manage tests, upload results, and track progress</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-white rounded-lg transition-colors border border-slate-200">
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-white rounded-lg transition-colors border border-slate-200">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Pending Tests"
          value={stats.pendingTests}
          icon={<Clock className="w-5 h-5" />}
          color="blue"
          trend={{ direction: 'down', percentage: 5 }}
        />
        <StatsCard
          title="Completed Today"
          value={stats.completedToday}
          icon={<CheckCircle2 className="w-5 h-5" />}
          color="emerald"
          trend={{ direction: 'up', percentage: 15 }}
        />
        <StatsCard
          title="Total Results"
          value={stats.totalResults}
          icon={<FileText className="w-5 h-5" />}
          color="purple"
        />
        <StatsCard
          title="Avg Turnaround"
          value={stats.avgTurnaround}
          icon={<Clock className="w-5 h-5" />}
          color="cyan"
        />
      </div>
      
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Tests List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-100">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Pending Tests</h3>
                <p className="text-sm text-slate-500 mt-1">Tests awaiting your attention</p>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              {tests.map((test) => (
                <TestCard
                  key={test.id}
                  test={test}
                  onStart={handleStartTest}
                  onUpload={handleUploadResults}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Quick Actions & Stats */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => setShowUploadModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload Results
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors">
                <Plus className="w-4 h-4" />
                Request New Test
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors">
                <FileText className="w-4 h-4" />
                View Templates
              </button>
            </div>
          </div>
          
          {/* Equipment Status */}
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Equipment Status</h3>
            <div className="space-y-3">
              {[
                { name: 'Hematology Analyzer', status: 'operational', usage: '85%' },
                { name: 'Chemistry Analyzer', status: 'maintenance', usage: '0%' },
                { name: 'Microscope', status: 'operational', usage: '45%' },
                { name: 'Centrifuge', status: 'operational', usage: '30%' }
              ].map((eq, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{eq.name}</p>
                    <p className="text-xs text-slate-500">Usage: {eq.usage}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    eq.status === 'operational' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {eq.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Test Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TestTube className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Blood Tests</h3>
          </div>
          <p className="text-2xl font-bold text-blue-900">8</p>
          <p className="text-xs text-blue-700 mt-1">Pending analysis</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Microscope className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-purple-900">Pathology</h3>
          </div>
          <p className="text-2xl font-bold text-purple-900">4</p>
          <p className="text-xs text-purple-700 mt-1">Pending analysis</p>
        </div>
        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-cyan-600" />
            <h3 className="font-semibold text-cyan-900">Imaging</h3>
          </div>
          <p className="text-2xl font-bold text-cyan-900">3</p>
          <p className="text-xs text-cyan-700 mt-1">Pending analysis</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-amber-900">Cardiology</h3>
          </div>
          <p className="text-2xl font-bold text-amber-900">2</p>
          <p className="text-xs text-amber-700 mt-1">Pending analysis</p>
        </div>
      </div>
      
      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setSelectedTest(null);
        }}
        onUpload={handleUpload}
      />
    </div>
  );
}