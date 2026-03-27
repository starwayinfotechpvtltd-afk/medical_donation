// app/doctor/patients/page.tsx
'use client';

import { useState } from 'react';
import {
  Search, Filter, Eye, Edit2, MessageSquare, Calendar,
  FileText, FlaskConical, Pill, Heart, Activity,
  ChevronRight, ChevronLeft, Download, Printer,
  User, Mail, Phone, MapPin, Calendar as CalendarIcon,
  Clock, AlertCircle, CheckCircle2, XCircle,
  TrendingUp, TrendingDown, MoreHorizontal,
  Users,
  Thermometer
} from 'lucide-react';

// Mock Patient Data
const mockPatients = [
  {
    id: 'P001',
    name: 'John Sharma',
    age: 45,
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '+91 98765 43210',
    email: 'john.sharma@email.com',
    lastVisit: '2024-03-20',
    nextAppointment: '2024-04-10',
    condition: 'Hypertension',
    status: 'active',
    medicalHistory: ['Hypertension', 'Type 2 Diabetes'],
    currentMedications: ['Metformin 500mg', 'Lisinopril 10mg'],
    recentTests: [
      { name: 'CBC', date: '2024-03-15', status: 'completed', result: 'Normal' },
      { name: 'Lipid Profile', date: '2024-03-15', status: 'completed', result: 'Abnormal' }
    ],
    vitalSigns: {
      bloodPressure: '120/80',
      heartRate: 72,
      temperature: 98.6,
      weight: 75,
      height: 175
    }
  },
  {
    id: 'P002',
    name: 'Priya Patel',
    age: 32,
    gender: 'Female',
    bloodGroup: 'A+',
    phone: '+91 98765 43211',
    email: 'priya.patel@email.com',
    lastVisit: '2024-03-18',
    nextAppointment: '2024-04-05',
    condition: 'Diabetes Type 2',
    status: 'active',
    medicalHistory: ['Diabetes Type 2', 'Thyroid'],
    currentMedications: ['Metformin 850mg', 'Levothyroxine 50mcg'],
    recentTests: [
      { name: 'HbA1c', date: '2024-03-18', status: 'completed', result: '7.2%' },
      { name: 'Thyroid Profile', date: '2024-03-18', status: 'pending', result: '' }
    ],
    vitalSigns: {
      bloodPressure: '118/76',
      heartRate: 68,
      temperature: 98.4,
      weight: 62,
      height: 165
    }
  },
  {
    id: 'P003',
    name: 'Aisha Khan',
    age: 58,
    gender: 'Female',
    bloodGroup: 'B+',
    phone: '+91 98765 43212',
    email: 'aisha.khan@email.com',
    lastVisit: '2024-03-22',
    nextAppointment: '2024-04-08',
    condition: 'Coronary Artery Disease',
    status: 'critical',
    medicalHistory: ['CAD', 'High Cholesterol'],
    currentMedications: ['Atorvastatin 20mg', 'Aspirin 75mg'],
    recentTests: [
      { name: 'ECG', date: '2024-03-22', status: 'completed', result: 'Abnormal' },
      { name: 'Echocardiogram', date: '2024-03-22', status: 'pending', result: '' }
    ],
    vitalSigns: {
      bloodPressure: '145/90',
      heartRate: 88,
      temperature: 99.1,
      weight: 82,
      height: 162
    }
  },
  {
    id: 'P004',
    name: 'Ravi Patel',
    age: 28,
    gender: 'Male',
    bloodGroup: 'AB+',
    phone: '+91 98765 43213',
    email: 'ravi.patel@email.com',
    lastVisit: '2024-03-15',
    nextAppointment: '2024-03-29',
    condition: 'Migraine',
    status: 'stable',
    medicalHistory: ['Migraine', 'Anxiety'],
    currentMedications: ['Sumatriptan 50mg', 'Propranolol 40mg'],
    recentTests: [
      { name: 'MRI Brain', date: '2024-03-15', status: 'completed', result: 'Normal' }
    ],
    vitalSigns: {
      bloodPressure: '110/70',
      heartRate: 65,
      temperature: 98.2,
      weight: 68,
      height: 170
    }
  },
  {
    id: 'P005',
    name: 'Sara Ahmed',
    age: 35,
    gender: 'Female',
    bloodGroup: 'O-',
    phone: '+91 98765 43214',
    email: 'sara.ahmed@email.com',
    lastVisit: '2024-03-25',
    nextAppointment: '2024-04-12',
    condition: 'Asthma',
    status: 'active',
    medicalHistory: ['Asthma', 'Allergic Rhinitis'],
    currentMedications: ['Inhaler', 'Montelukast 10mg'],
    recentTests: [
      { name: 'Pulmonary Function', date: '2024-03-25', status: 'pending', result: '' }
    ],
    vitalSigns: {
      bloodPressure: '115/75',
      heartRate: 70,
      temperature: 98.5,
      weight: 58,
      height: 160
    }
  }
];

function StatusBadge({ status }: { status: string }) {
  const config = {
    active: 'bg-emerald-100 text-emerald-700',
    critical: 'bg-red-100 text-red-700',
    stable: 'bg-blue-100 text-blue-700',
    completed: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    abnormal: 'bg-red-100 text-red-700',
    normal: 'bg-emerald-100 text-emerald-700'
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config[status as keyof typeof config] || 'bg-slate-100 text-slate-700'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function PatientCard({ patient, onView, onMessage, onPrescribe }: any) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all">
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
              {patient.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{patient.name}</h3>
              <p className="text-xs text-slate-500">ID: {patient.id}</p>
            </div>
          </div>
          <StatusBadge status={patient.status} />
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-50 rounded-lg p-2">
            <p className="text-xs text-slate-500">Age/Gender</p>
            <p className="text-sm font-medium text-slate-900">{patient.age} yrs / {patient.gender}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-2">
            <p className="text-xs text-slate-500">Blood Group</p>
            <p className="text-sm font-medium text-slate-900">{patient.bloodGroup}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-2">
            <p className="text-xs text-slate-500">Last Visit</p>
            <p className="text-sm font-medium text-slate-900">{new Date(patient.lastVisit).toLocaleDateString()}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-2">
            <p className="text-xs text-slate-500">Next Visit</p>
            <p className="text-sm font-medium text-slate-900">{new Date(patient.nextAppointment).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="flex gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => onView(patient)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-600 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            View
          </button>
          <button
            onClick={() => onPrescribe(patient)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-medium text-blue-600 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            Prescribe
          </button>
          <button
            onClick={() => onMessage(patient)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-sm font-medium text-emerald-600 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Message
          </button>
        </div>
      </div>
    </div>
  );
}

function PatientDetailModal({ patient, onClose }: { patient: any; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('info');
  
  if (!patient) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
              {patient.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{patient.name}</h2>
              <p className="text-sm text-slate-500">Patient ID: {patient.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
            <XCircle className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <div className="flex border-b border-slate-100 px-6">
          {['info', 'medical', 'tests', 'vitals'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium capitalize transition-all border-b-2 -mb-px ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'info' ? 'Information' : tab === 'medical' ? 'Medical History' : tab === 'tests' ? 'Test Results' : 'Vital Signs'}
            </button>
          ))}
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-2">Contact Information</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-700">{patient.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-700">{patient.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-2">Demographics</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-slate-400">Age</p>
                      <p className="text-sm font-medium">{patient.age} years</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Gender</p>
                      <p className="text-sm font-medium">{patient.gender}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Blood Group</p>
                      <p className="text-sm font-medium">{patient.bloodGroup}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-2">Condition</p>
                <p className="text-sm font-medium text-slate-900">{patient.condition}</p>
              </div>
            </div>
          )}
          
          {activeTab === 'medical' && (
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-2">Medical History</p>
                <div className="flex flex-wrap gap-2">
                  {patient.medicalHistory.map((condition: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {condition}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-2">Current Medications</p>
                <div className="space-y-2">
                  {patient.currentMedications.map((med: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-white rounded-lg">
                      <Pill className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-slate-700">{med}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'tests' && (
            <div className="space-y-3">
              {patient.recentTests.map((test: any, idx: number) => (
                <div key={idx} className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-900">{test.name}</h4>
                    <StatusBadge status={test.status} />
                  </div>
                  <p className="text-sm text-slate-500">Date: {new Date(test.date).toLocaleDateString()}</p>
                  {test.result && (
                    <div className="mt-2 p-2 bg-white rounded-lg">
                      <p className="text-xs text-slate-500">Result</p>
                      <p className="text-sm font-medium text-slate-900">{test.result}</p>
                    </div>
                  )}
                  <button className="mt-3 text-sm text-blue-600 hover:text-blue-700">
                    Download Report
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'vitals' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <p className="text-xs text-slate-500">Blood Pressure</p>
                <p className="text-lg font-bold text-slate-900">{patient.vitalSigns.bloodPressure}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <Activity className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-xs text-slate-500">Heart Rate</p>
                <p className="text-lg font-bold text-slate-900">{patient.vitalSigns.heartRate} bpm</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <Thermometer className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                <p className="text-xs text-slate-500">Temperature</p>
                <p className="text-lg font-bold text-slate-900">{patient.vitalSigns.temperature}°F</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <Activity className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-xs text-slate-500">BMI</p>
                <p className="text-lg font-bold text-slate-900">
                  {(patient.vitalSigns.weight / ((patient.vitalSigns.height / 100) ** 2)).toFixed(1)}
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex justify-end gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
            <FileText className="w-4 h-4 inline mr-2" />
            Write Prescription
          </button>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700">
            <Calendar className="w-4 h-4 inline mr-2" />
            Schedule Follow-up
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DoctorPatients() {
  const [patients, setPatients] = useState(mockPatients);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          patient.condition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || patient.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });
  
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const stats = {
    total: patients.length,
    active: patients.filter(p => p.status === 'active').length,
    critical: patients.filter(p => p.status === 'critical').length,
    stable: patients.filter(p => p.status === 'stable').length,
  };
  
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Patients</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and view your patient records</p>
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
      
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="text-2xl font-bold text-slate-900">{stats.total}</span>
          </div>
          <p className="text-sm text-slate-500">Total Patients</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="text-2xl font-bold text-slate-900">{stats.active}</span>
          </div>
          <p className="text-sm text-slate-500">Active Patients</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-2xl font-bold text-slate-900">{stats.critical}</span>
          </div>
          <p className="text-sm text-slate-500">Critical Cases</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-blue-500" />
            <span className="text-2xl font-bold text-slate-900">{stats.stable}</span>
          </div>
          <p className="text-sm text-slate-500">Stable</p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, ID, or condition..."
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
            <option value="active">Active</option>
            <option value="critical">Critical</option>
            <option value="stable">Stable</option>
          </select>
        </div>
      </div>
      
      {/* Patient Grid */}
      {paginatedPatients.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPatients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                onView={(p: any) => {
                  setSelectedPatient(p);
                  setShowDetailModal(true);
                }}
                onMessage={(p: any) => console.log('Message', p)}
                onPrescribe={(p: any) => console.log('Prescribe', p)}
              />
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-xl border border-slate-100 px-4 py-3">
              <p className="text-sm text-slate-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredPatients.length)} of{' '}
                {filteredPatients.length} patients
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
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-lg font-medium">No patients found</p>
          <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filter criteria</p>
        </div>
      )}
      
      {/* Patient Detail Modal */}
      <PatientDetailModal
        patient={selectedPatient}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedPatient(null);
        }}
      />
    </div>
  );
}