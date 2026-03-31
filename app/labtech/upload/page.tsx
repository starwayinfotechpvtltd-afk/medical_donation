// app/technician/upload/page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Upload, Search, Filter, X, CheckCircle2, AlertCircle,
  Clock, FileText, Download, Eye, Trash2, Plus,
  User, Calendar, Activity, Beaker, Microscope,
  ChevronRight, ChevronLeft, Printer, Save,
  FileUp, Image, File, FileCheck, AlertTriangle,
  Loader2, RefreshCw, Settings, Bell, Home,
  Users, FlaskConical, HeartPulse, Syringe,
  Menu, ChevronDown, LogOut, UserCircle
} from 'lucide-react';

// Mock Data for Tests Ready for Upload
const pendingUploadsData = {
  laboratory: {
    name: 'Laboratory',
    icon: Beaker,
    color: 'blue',
    tests: [
      { 
        id: 'LAB001', 
        testName: 'Complete Blood Count (CBC)', 
        patientId: 'P001', 
        patientName: 'John Sharma',
        age: 45, gender: 'Male',
        priority: 'routine',
        status: 'in-progress',
        orderDate: '2024-03-30',
        sampleCollected: true,
        collectedAt: '2024-03-30 09:15 AM',
        parameters: ['Hemoglobin', 'WBC Count', 'Platelets', 'RBC Count'],
        results: null
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
        sampleCollected: true,
        collectedAt: '2024-03-30 10:30 AM',
        parameters: ['Total Cholesterol', 'HDL', 'LDL', 'Triglycerides'],
        results: null
      },
      { 
        id: 'LAB003', 
        testName: 'Thyroid Profile', 
        patientId: 'P003', 
        patientName: 'Aisha Khan',
        age: 58, gender: 'Female',
        priority: 'stat',
        status: 'completed',
        orderDate: '2024-03-29',
        sampleCollected: true,
        collectedAt: '2024-03-29 08:00 AM',
        parameters: ['TSH', 'T3', 'T4'],
        results: {
          uploadedAt: '2024-03-30 11:45 AM',
          fileUrl: '/results/thyroid_lab003.pdf',
          parameters: [
            { name: 'TSH', value: '3.2', unit: 'µIU/mL', reference: '0.5-4.5', status: 'normal' },
            { name: 'T3', value: '120', unit: 'ng/dL', reference: '80-200', status: 'normal' },
            { name: 'T4', value: '8.5', unit: 'µg/dL', reference: '5.0-12.0', status: 'normal' }
          ]
        }
      },
      { 
        id: 'LAB004', 
        testName: 'Liver Function Test', 
        patientId: 'P004', 
        patientName: 'Rajesh Kumar',
        age: 52, gender: 'Male',
        priority: 'routine',
        status: 'pending',
        orderDate: '2024-03-31',
        sampleCollected: true,
        collectedAt: '2024-03-31 08:45 AM',
        parameters: ['ALT', 'AST', 'ALP', 'Total Bilirubin'],
        results: null
      }
    ]
  },
  radiology: {
    name: 'Radiology',
    icon: Microscope,
    color: 'purple',
    tests: [
      { 
        id: 'RAD001', 
        testName: 'Chest X-Ray', 
        patientId: 'P007', 
        patientName: 'Neha Gupta',
        age: 42, gender: 'Female',
        priority: 'urgent',
        status: 'in-progress',
        orderDate: '2024-03-30',
        sampleCollected: true,
        collectedAt: '2024-03-30 11:20 AM',
        parameters: ['Chest PA View', 'Chest Lateral View'],
        results: null
      },
      { 
        id: 'RAD002', 
        testName: 'MRI Brain', 
        patientId: 'P008', 
        patientName: 'Vikram Singh',
        age: 35, gender: 'Male',
        priority: 'stat',
        status: 'pending',
        orderDate: '2024-03-31',
        sampleCollected: true,
        collectedAt: '2024-03-31 09:30 AM',
        parameters: ['T1', 'T2', 'FLAIR', 'DWI'],
        results: null
      }
    ]
  },
  cardiology: {
    name: 'Cardiology',
    icon: HeartPulse,
    color: 'red',
    tests: [
      { 
        id: 'CARD001', 
        testName: 'ECG', 
        patientId: 'P009', 
        patientName: 'Meera Desai',
        age: 65, gender: 'Female',
        priority: 'urgent',
        status: 'in-progress',
        orderDate: '2024-03-30',
        sampleCollected: true,
        collectedAt: '2024-03-30 02:15 PM',
        parameters: ['Heart Rate', 'PR Interval', 'QT Interval', 'ST Segment'],
        results: null
      },
      { 
        id: 'CARD002', 
        testName: 'Echocardiogram', 
        patientId: 'P010', 
        patientName: 'Ramesh Gupta',
        age: 58, gender: 'Male',
        priority: 'routine',
        status: 'pending',
        orderDate: '2024-03-31',
        sampleCollected: false,
        parameters: ['LVEF', 'Wall Motion', 'Valvular Function'],
        results: null
      }
    ]
  },
  dialysis: {
    name: 'Dialysis',
    icon: Syringe,
    color: 'green',
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
        sampleCollected: true,
        collectedAt: '2024-03-30 07:00 AM',
        parameters: ['Pre-dialysis weight', 'Post-dialysis weight', 'Blood flow rate', 'Urea reduction'],
        results: null
      }
    ]
  }
};

// Types
interface TestResult {
  id: string;
  testName: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  priority: 'routine' | 'urgent' | 'stat';
  status: 'pending' | 'in-progress' | 'completed';
  orderDate: string;
  sampleCollected: boolean;
  collectedAt?: string;
  parameters: string[];
  results: {
    uploadedAt?: string;
    fileUrl?: string;
    parameters?: Array<{
      name: string;
      value: string;
      unit: string;
      reference: string;
      status: string;
    }>;
    interpretation?: string;
    notes?: string;
  } | null;
}

interface DepartmentData {
  name: string;
  icon: any;
  color: string;
  tests: TestResult[];
}

function PriorityBadge({ priority }: { priority: string }) {
  const config: Record<string, string> = {
    routine: 'bg-slate-100 text-slate-700',
    urgent: 'bg-amber-100 text-amber-700',
    stat: 'bg-red-100 text-red-700'
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${config[priority]}`}>
      {priority.toUpperCase()}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; icon: any; text: string }> = {
    pending: { color: 'bg-slate-100 text-slate-700', icon: Clock, text: 'Pending' },
    'in-progress': { color: 'bg-blue-100 text-blue-700', icon: Activity, text: 'In Progress' },
    completed: { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2, text: 'Completed' }
  };
  const { color, icon: Icon, text } = config[status] || config.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3" />
      {text}
    </span>
  );
}

function UploadCard({ test, onUpload, onViewResults }: any) {
  const hasResults = test.results !== null;
  
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="font-semibold text-slate-900 text-lg">{test.testName}</h3>
            <PriorityBadge priority={test.priority} />
            <StatusBadge status={test.status} />
            {hasResults && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="w-3 h-3" />
                Results Uploaded
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-600 flex-wrap">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4 text-slate-400" />
              <span>{test.patientName}</span>
              <span className="text-slate-400">({test.age} yrs, {test.gender})</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4 text-slate-400" />
              <span>ID: {test.patientId}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Ordered: {new Date(test.orderDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded">
          {test.id}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          {test.sampleCollected && test.collectedAt && (
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-slate-600">Sample Collected: {test.collectedAt}</span>
            </div>
          )}
          {!test.sampleCollected && (
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span className="text-amber-600">Sample not collected yet</span>
            </div>
          )}
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Parameters</p>
          <div className="flex flex-wrap gap-1">
            {test.parameters.slice(0, 3).map((param: string, idx: number) => (
              <span key={idx} className="text-xs px-2 py-0.5 bg-slate-100 rounded-full">
                {param}
              </span>
            ))}
            {test.parameters.length > 3 && (
              <span className="text-xs px-2 py-0.5 bg-slate-100 rounded-full">
                +{test.parameters.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {hasResults && test.results && (
        <div className="bg-emerald-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-sm text-emerald-700">
                Results uploaded on {new Date(test.results.uploadedAt).toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => onViewResults(test)}
              className="text-sm text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              View Results
            </button>
          </div>
        </div>
      )}
      
      <button
        onClick={() => onUpload(test)}
        disabled={!test.sampleCollected && test.status !== 'completed'}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          hasResults
            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            : !test.sampleCollected && test.status !== 'completed'
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        <Upload className="w-4 h-4" />
        {hasResults ? 'Update Results' : 'Upload Results'}
      </button>
    </div>
  );
}

function ResultsViewModal({ isOpen, onClose, test }: any) {
  const [activeTab, setActiveTab] = useState<'parameters' | 'details'>('parameters');
  
  if (!isOpen || !test || !test.results) return null;
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'normal': return 'text-emerald-600 bg-emerald-50';
      case 'high': return 'text-red-600 bg-red-50';
      case 'low': return 'text-amber-600 bg-amber-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Test Results</h2>
            <p className="text-sm text-slate-500 mt-1">{test.testName} - {test.patientName}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <div className="border-b border-slate-100 px-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('parameters')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'parameters'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Parameters
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'details'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Details & Notes
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {activeTab === 'parameters' && test.results.parameters && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Test Parameters</h3>
              <div className="border border-slate-100 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Parameter</th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Value</th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Reference Range</th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {test.results.parameters.map((param: any, idx: number) => (
                      <tr key={idx}>
                        <td className="px-4 py-3 text-sm text-slate-900">{param.name}</td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-900">
                          {param.value} {param.unit}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">{param.reference}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(param.status)}`}>
                            {param.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'details' && (
            <div className="space-y-6">
              {test.results.interpretation && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Interpretation</h3>
                  <p className="text-slate-700 bg-slate-50 p-4 rounded-lg">{test.results.interpretation}</p>
                </div>
              )}
              {test.results.notes && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Technician Notes</h3>
                  <p className="text-slate-700 bg-slate-50 p-4 rounded-lg">{test.results.notes}</p>
                </div>
              )}
              {test.results.fileUrl && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Attached File</h3>
                  <a
                    href={test.results.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Report
                  </a>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Upload Information</h3>
                <div className="bg-slate-50 p-4 rounded-lg space-y-1">
                  <p className="text-sm text-slate-600">Uploaded on: {new Date(test.results.uploadedAt).toLocaleString()}</p>
                  <p className="text-sm text-slate-600">Uploaded by: Dr. Smith (Technician)</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="border-t border-slate-100 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function UploadModal({ isOpen, onClose, onUpload, test }: any) {
  const [uploadMethod, setUploadMethod] = useState<'manual' | 'file'>('manual');
  const [formData, setFormData] = useState({
    parameters: [] as Array<{ name: string; value: string; unit: string; reference: string }>,
    interpretation: '',
    notes: '',
    file: null as File | null
  });
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isOpen && test && uploadMethod === 'manual') {
      const params = getParameterFields();
      setFormData(prev => ({
        ...prev,
        parameters: params.map(p => ({ ...p, value: '' }))
      }));
    }
  }, [isOpen, test, uploadMethod]);
  
  if (!isOpen || !test) return null;
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (allowedTypes.includes(file.type) && file.size <= 10 * 1024 * 1024) {
        setFormData({ ...formData, file });
      } else {
        alert('Please upload a valid file (PDF, JPEG, PNG, or DOC) less than 10MB');
      }
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (allowedTypes.includes(file.type) && file.size <= 10 * 1024 * 1024) {
        setFormData({ ...formData, file });
      } else {
        alert('Please upload a valid file (PDF, JPEG, PNG, or DOC) less than 10MB');
      }
    }
  };
  
  const handleParameterChange = (index: number, value: string) => {
    const updatedParams = [...formData.parameters];
    updatedParams[index] = { ...updatedParams[index], value };
    setFormData({ ...formData, parameters: updatedParams });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadProgress(i);
    }
    
    onUpload({
      testId: test.id,
      method: uploadMethod,
      data: formData
    });
    
    setIsUploading(false);
    setUploadProgress(0);
    onClose();
  };
  
  const getParameterFields = () => {
    switch(test.testName) {
      case 'Complete Blood Count (CBC)':
        return [
          { name: 'Hemoglobin', unit: 'g/dL', reference: '13.5-17.5' },
          { name: 'WBC Count', unit: 'x10³/µL', reference: '4.5-11.0' },
          { name: 'Platelets', unit: 'x10³/µL', reference: '150-450' },
          { name: 'RBC Count', unit: 'x10⁶/µL', reference: '4.5-5.9' }
        ];
      case 'Lipid Profile':
        return [
          { name: 'Total Cholesterol', unit: 'mg/dL', reference: '<200' },
          { name: 'HDL', unit: 'mg/dL', reference: '>40' },
          { name: 'LDL', unit: 'mg/dL', reference: '<100' },
          { name: 'Triglycerides', unit: 'mg/dL', reference: '<150' }
        ];
      case 'Thyroid Profile':
        return [
          { name: 'TSH', unit: 'µIU/mL', reference: '0.5-4.5' },
          { name: 'T3', unit: 'ng/dL', reference: '80-200' },
          { name: 'T4', unit: 'µg/dL', reference: '5.0-12.0' }
        ];
      case 'Chest X-Ray':
        return [
          { name: 'Findings', unit: '', reference: '' },
          { name: 'Impression', unit: '', reference: '' }
        ];
      default:
        return test.parameters.map((param: string) => ({
          name: param,
          unit: '',
          reference: ''
        }));
    }
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const isFormValid = () => {
    if (uploadMethod === 'file') {
      return formData.file !== null;
    } else {
      return formData.parameters.every(p => p.value && p.value.trim() !== '');
    }
  };
  
  const parameters = getParameterFields();
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Upload Test Results</h2>
            <p className="text-sm text-slate-500 mt-1">{test.testName} - {test.patientName}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Upload Method Toggle */}
          <div className="flex gap-3 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setUploadMethod('manual');
                setFormData({ ...formData, file: null });
              }}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                uploadMethod === 'manual'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                Manual Entry
              </div>
            </button>
            <button
              type="button"
              onClick={() => {
                setUploadMethod('file');
                setFormData({ ...formData, parameters: [] });
              }}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                uploadMethod === 'file'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FileUp className="w-4 h-4" />
                Upload File
              </div>
            </button>
          </div>
          
          {uploadMethod === 'manual' ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Test Parameters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {parameters.map((param, idx) => (
                    <div key={idx}>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        {param.name}
                        {param.unit && <span className="text-xs text-slate-500 ml-1">({param.unit})</span>}
                      </label>
                      <input
                        type="text"
                        value={formData.parameters[idx]?.value || ''}
                        onChange={(e) => handleParameterChange(idx, e.target.value)}
                        placeholder={`Reference range: ${param.reference || 'N/A'}`}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Overall Interpretation / Summary
                </label>
                <textarea
                  rows={3}
                  value={formData.interpretation}
                  onChange={(e) => setFormData({ ...formData, interpretation: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="Add clinical interpretation or summary of findings..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Technician Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="Any observations or notes about the testing process..."
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : formData.file 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {!formData.file ? (
                  <div className="space-y-3">
                    <div className="flex justify-center">
                      <div className="p-3 bg-blue-50 rounded-full">
                        <Upload className="w-8 h-8 text-blue-500" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Drag and drop your file here, or click to browse
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Supports: PDF, JPEG, PNG, DOC (Max 10MB)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-center">
                      <div className="p-3 bg-emerald-50 rounded-full">
                        {formData.file.type.includes('pdf') ? (
                          <File className="w-8 h-8 text-emerald-500" />
                        ) : formData.file.type.includes('image') ? (
                          <Image className="w-8 h-8 text-emerald-500" />
                        ) : (
                          <FileText className="w-8 h-8 text-emerald-500" />
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {formData.file.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatFileSize(formData.file.size)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData({ ...formData, file: null });
                      }}
                      className="text-xs text-red-600 hover:text-red-700 font-medium"
                    >
                      Remove file
                    </button>
                  </div>
                )}
              </div>
              
              {/* Optional Notes for File Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="Add any notes about the uploaded file or testing process..."
                />
              </div>
            </div>
          )}
          
          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Uploading...</span>
                <span className="text-slate-600">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
          
          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !isFormValid()}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isUploading || !isFormValid()
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {uploadMethod === 'file' ? 'Upload File' : 'Save Results'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DepartmentSection({ department, data, onUpload, onViewResults }: any) {
  const Icon = data.icon;
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600',
    green: 'bg-green-50 text-green-600'
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorClasses[data.color as keyof typeof colorClasses]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{data.name}</h2>
          <p className="text-sm text-slate-500">{data.tests.length} test(s) pending upload</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {data.tests.map((test: TestResult) => (
          <UploadCard
            key={test.id}
            test={test}
            onUpload={onUpload}
            onViewResults={onViewResults}
          />
        ))}
      </div>
    </div>
  );
}

export default function UploadResultsPage() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTest, setSelectedTest] = useState<TestResult | null>(null);
  const [viewingResults, setViewingResults] = useState<TestResult | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [uploadData, setUploadData] = useState<any>(null);
  
  const departments = ['all', ...Object.keys(pendingUploadsData)];
  
  const handleUpload = (test: TestResult) => {
    setSelectedTest(test);
    setShowUploadModal(true);
  };
  
  const handleViewResults = (test: TestResult) => {
    setViewingResults(test);
  };
  
  const handleSaveResults = (uploadInfo: any) => {
    // In a real app, this would make an API call to save the results
    console.log('Saving results:', uploadInfo);
    setUploadData(uploadInfo);
    setShowSuccessToast(true);
    
    // Simulate updating the test with new results
    if (uploadInfo.method === 'manual') {
      const updatedResults = {
        uploadedAt: new Date().toLocaleString(),
        parameters: uploadInfo.data.parameters.map((p: any) => ({
          ...p,
          status: 'normal' // In real app, determine based on reference ranges
        })),
        interpretation: uploadInfo.data.interpretation,
        notes: uploadInfo.data.notes
      };
      
      // Update the test in the mock data
      for (const dept in pendingUploadsData) {
        const testIndex = pendingUploadsData[dept as keyof typeof pendingUploadsData].tests.findIndex(
          (t: TestResult) => t.id === uploadInfo.testId
        );
        if (testIndex !== -1) {
          pendingUploadsData[dept as keyof typeof pendingUploadsData].tests[testIndex].results = updatedResults;
          pendingUploadsData[dept as keyof typeof pendingUploadsData].tests[testIndex].status = 'completed';
          break;
        }
      }
    }
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);
  };
  
  const filteredData = () => {
    let data = pendingUploadsData;
    
    if (selectedDepartment !== 'all') {
      data = { [selectedDepartment]: pendingUploadsData[selectedDepartment as keyof typeof pendingUploadsData] } as any;
    }
    
    if (searchQuery) {
      const filtered: any = {};
      Object.keys(data).forEach(dept => {
        const tests = data[dept as keyof typeof data].tests.filter((test: TestResult) =>
          test.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          test.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          test.patientId.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (tests.length > 0) {
          filtered[dept] = { ...data[dept as keyof typeof data], tests };
        }
      });
      return filtered;
    }
    
    return data;
  };
  
  const getTotalPendingTests = () => {
    let total = 0;
    Object.keys(pendingUploadsData).forEach(dept => {
      total += pendingUploadsData[dept as keyof typeof pendingUploadsData].tests.filter(
        (t: TestResult) => !t.results
      ).length;
    });
    return total;
  };
  
  const getCompletedTests = () => {
    let total = 0;
    Object.keys(pendingUploadsData).forEach(dept => {
      total += pendingUploadsData[dept as keyof typeof pendingUploadsData].tests.filter(
        (t: TestResult) => t.results
      ).length;
    });
    return total;
  };
  
  const data = filteredData();
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Upload Results</h1>
                <p className="text-xs text-slate-500">Manage and upload test results</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-600">System Online</span>
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-slate-600" />
              </button>
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserCircle className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">Dr. Smith</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Tests</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {Object.keys(pendingUploadsData).reduce((acc, dept) => 
                    acc + pendingUploadsData[dept as keyof typeof pendingUploadsData].tests.length, 0
                  )}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Pending Upload</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{getTotalPendingTests()}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Completed</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{getCompletedTests()}</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Urgent/STAT</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {Object.keys(pendingUploadsData).reduce((acc, dept) => 
                    acc + pendingUploadsData[dept as keyof typeof pendingUploadsData].tests.filter(
                      (t: TestResult) => t.priority === 'stat' || t.priority === 'urgent'
                    ).length, 0
                  )}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by patient name, test name, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    selectedDepartment === dept
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {dept === 'all' ? 'All Departments' : dept.charAt(0).toUpperCase() + dept.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Department Sections */}
        <div className="space-y-8">
          {Object.keys(data).map((dept) => (
            <DepartmentSection
              key={dept}
              department={dept}
              data={data[dept as keyof typeof data]}
              onUpload={handleUpload}
              onViewResults={handleViewResults}
            />
          ))}
        </div>
        
        {Object.keys(data).length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex p-4 bg-slate-100 rounded-full mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No tests found</h3>
            <p className="text-slate-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
      
      {/* Modals */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setSelectedTest(null);
        }}
        onUpload={handleSaveResults}
        test={selectedTest}
      />
      
      <ResultsViewModal
        isOpen={viewingResults !== null}
        onClose={() => setViewingResults(null)}
        test={viewingResults}
      />
      
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right-5 duration-300">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="font-medium text-emerald-800">Results uploaded successfully!</p>
                <p className="text-sm text-emerald-600">The results have been saved and are now available</p>
              </div>
              <button
                onClick={() => setShowSuccessToast(false)}
                className="ml-4 text-emerald-600 hover:text-emerald-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}