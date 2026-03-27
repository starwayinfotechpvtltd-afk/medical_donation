// app/doctor/medications/page.tsx
'use client';

import { useState } from 'react';
import {
  Pill, Search, Filter, Plus, Download, Printer,
  Eye, Edit2, Trash2, AlertCircle, CheckCircle2,
  XCircle, Clock, ChevronLeft, ChevronRight, X,
  Package, Calendar, User, Stethoscope, Info,
  AlertTriangle, TrendingUp, TrendingDown,
  FileText
} from 'lucide-react';

// Mock Medications Data
const mockMedications = [
  {
    id: 'MED001',
    name: 'Metformin',
    genericName: 'Metformin Hydrochloride',
    category: 'Antidiabetic',
    dosage: '500mg',
    form: 'Tablet',
    manufacturer: 'Sun Pharma',
    batchNo: 'MF12345',
    expiryDate: '2025-12-31',
    stock: 2450,
    unitPrice: 2.50,
    prescriptionRequired: true,
    status: 'active',
    sideEffects: ['Nausea', 'Diarrhea', 'Abdominal discomfort'],
    interactions: ['Alcohol', 'Insulin', 'Contrast media'],
    indications: 'Type 2 diabetes mellitus',
    contraindications: 'Severe renal impairment, metabolic acidosis'
  },
  {
    id: 'MED002',
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    category: 'Antihypertensive',
    dosage: '10mg',
    form: 'Tablet',
    manufacturer: 'Cipla',
    batchNo: 'LIS9876',
    expiryDate: '2025-10-15',
    stock: 1850,
    unitPrice: 3.20,
    prescriptionRequired: true,
    status: 'active',
    sideEffects: ['Cough', 'Dizziness', 'Headache'],
    interactions: ['NSAIDs', 'Potassium supplements', 'Diuretics'],
    indications: 'Hypertension, Heart failure',
    contraindications: 'History of angioedema, Pregnancy'
  },
  {
    id: 'MED003',
    name: 'Atorvastatin',
    genericName: 'Atorvastatin Calcium',
    category: 'Lipid Lowering',
    dosage: '20mg',
    form: 'Tablet',
    manufacturer: 'Dr. Reddy\'s',
    batchNo: 'ATR4567',
    expiryDate: '2025-08-20',
    stock: 3200,
    unitPrice: 4.50,
    prescriptionRequired: true,
    status: 'active',
    sideEffects: ['Muscle pain', 'Joint pain', 'Nausea'],
    interactions: ['Grapefruit juice', 'Warfarin', 'Antifungals'],
    indications: 'Hypercholesterolemia, Cardiovascular risk reduction',
    contraindications: 'Active liver disease, Pregnancy'
  },
  {
    id: 'MED004',
    name: 'Paracetamol',
    genericName: 'Acetaminophen',
    category: 'Analgesic',
    dosage: '500mg',
    form: 'Tablet',
    manufacturer: 'GSK',
    batchNo: 'PAR3210',
    expiryDate: '2026-03-30',
    stock: 8500,
    unitPrice: 1.00,
    prescriptionRequired: false,
    status: 'active',
    sideEffects: ['Rare allergic reactions'],
    interactions: ['Alcohol', 'Warfarin'],
    indications: 'Pain, Fever',
    contraindications: 'Severe liver disease'
  },
  {
    id: 'MED005',
    name: 'Amoxicillin',
    genericName: 'Amoxicillin Trihydrate',
    category: 'Antibiotic',
    dosage: '500mg',
    form: 'Capsule',
    manufacturer: 'Abbott',
    batchNo: 'AMX7890',
    expiryDate: '2025-06-15',
    stock: 1800,
    unitPrice: 5.50,
    prescriptionRequired: true,
    status: 'low-stock',
    sideEffects: ['Diarrhea', 'Rash', 'Nausea'],
    interactions: ['Probenecid', 'Allopurinol', 'Oral contraceptives'],
    indications: 'Bacterial infections',
    contraindications: 'Penicillin allergy'
  },
  {
    id: 'MED006',
    name: 'Aspirin',
    genericName: 'Acetylsalicylic Acid',
    category: 'Antiplatelet',
    dosage: '75mg',
    form: 'Tablet',
    manufacturer: 'Bayer',
    batchNo: 'ASP5678',
    expiryDate: '2025-11-30',
    stock: 4200,
    unitPrice: 1.80,
    prescriptionRequired: true,
    status: 'active',
    sideEffects: ['Bleeding', 'Gastric irritation'],
    interactions: ['Warfarin', 'NSAIDs', 'Alcohol'],
    indications: 'Cardiovascular protection, Pain relief',
    contraindications: 'Active bleeding, Aspirin allergy'
  }
];

function StatusBadge({ status }: { status: string }) {
  const config = {
    active: { icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-700', label: 'Active' },
    'low-stock': { icon: AlertCircle, color: 'bg-amber-100 text-amber-700', label: 'Low Stock' },
    discontinued: { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Discontinued' }
  };
  const { icon: Icon, color, label } = config[status as keyof typeof config] || config.active;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

function MedicationCard({ medication, onView, onEdit, onPrescribe }: any) {
  const isLowStock = medication.stock < 500;
  
  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-slate-900">{medication.name}</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">{medication.genericName}</p>
          </div>
          <StatusBadge status={medication.status} />
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-slate-50 rounded-lg p-2">
            <p className="text-xs text-slate-500">Dosage</p>
            <p className="text-sm font-medium text-slate-900">{medication.dosage}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-2">
            <p className="text-xs text-slate-500">Form</p>
            <p className="text-sm font-medium text-slate-900">{medication.form}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-2">
            <p className="text-xs text-slate-500">Stock</p>
            <div className="flex items-center gap-1">
              <Package className="w-3 h-3 text-slate-400" />
              <p className={`text-sm font-medium ${isLowStock ? 'text-amber-600' : 'text-slate-900'}`}>
                {medication.stock} units
              </p>
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-2">
            <p className="text-xs text-slate-500">Price</p>
            <p className="text-sm font-medium text-slate-900">₹{medication.unitPrice}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => onView(medication)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-600 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Details
          </button>
          <button
            onClick={() => onPrescribe(medication)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-medium text-blue-600 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            Prescribe
          </button>
        </div>
      </div>
    </div>
  );
}

function MedicationDetailModal({ medication, onClose, onPrescribe }: any) {
  if (!medication) return null;
  
  const expiryDays = Math.floor((new Date(medication.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = expiryDays < 90;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{medication.name}</h2>
            <p className="text-sm text-slate-500">{medication.genericName}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-500">Category</p>
              <p className="text-sm font-medium text-slate-900">{medication.category}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-500">Dosage</p>
              <p className="text-sm font-medium text-slate-900">{medication.dosage}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-500">Form</p>
              <p className="text-sm font-medium text-slate-900">{medication.form}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-500">Manufacturer</p>
              <p className="text-sm font-medium text-slate-900">{medication.manufacturer}</p>
            </div>
          </div>
          
          {/* Stock Info */}
          <div className="bg-slate-50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Inventory Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">Batch Number</p>
                <p className="text-sm text-slate-900">{medication.batchNo}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Expiry Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <p className={`text-sm font-medium ${isExpiringSoon ? 'text-amber-600' : 'text-slate-900'}`}>
                    {new Date(medication.expiryDate).toLocaleDateString()}
                  </p>
                  {isExpiringSoon && (
                    <span className="text-xs text-amber-600 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Expires in {expiryDays} days
                    </span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500">Current Stock</p>
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-slate-400" />
                  <p className="text-sm font-medium text-slate-900">{medication.stock} units</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500">Unit Price</p>
                <p className="text-sm font-medium text-slate-900">₹{medication.unitPrice}</p>
              </div>
            </div>
          </div>
          
          {/* Indications */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Indications</h3>
            <p className="text-sm text-blue-800">{medication.indications}</p>
          </div>
          
          {/* Side Effects */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Side Effects
            </h3>
            <div className="flex flex-wrap gap-2">
              {medication.sideEffects.map((effect: string, idx: number) => (
                <span key={idx} className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm">
                  {effect}
                </span>
              ))}
            </div>
          </div>
          
          {/* Drug Interactions */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Drug Interactions
            </h3>
            <div className="flex flex-wrap gap-2">
              {medication.interactions.map((interaction: string, idx: number) => (
                <span key={idx} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                  {interaction}
                </span>
              ))}
            </div>
          </div>
          
          {/* Contraindications */}
          <div className="bg-red-50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-red-900 mb-2">Contraindications</h3>
            <p className="text-sm text-red-800">{medication.contraindications}</p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => onPrescribe(medication)}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Prescribe Medication
            </button>
            <button className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700">
              <Info className="w-4 h-4 inline mr-2" />
              Patient Information Leaflet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DoctorMedications() {
  const [medications, setMedications] = useState(mockMedications);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const filteredMedications = medications.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          med.genericName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || med.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || med.status === statusFilter.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  const totalPages = Math.ceil(filteredMedications.length / itemsPerPage);
  const paginatedMedications = filteredMedications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const categories = ['All', ...new Set(medications.map(m => m.category))];
  
  const stats = {
    total: medications.length,
    active: medications.filter(m => m.status === 'active').length,
    lowStock: medications.filter(m => m.stock < 500).length,
    totalStock: medications.reduce((sum, m) => sum + m.stock, 0),
    avgPrice: (medications.reduce((sum, m) => sum + m.unitPrice, 0) / medications.length).toFixed(2)
  };
  
  const handlePrescribe = (medication: any) => {
    // Navigate to prescription creation with this medication
    alert(`Creating prescription with ${medication.name}`);
  };
  
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Medications</h1>
          <p className="text-sm text-slate-500 mt-1">Browse and prescribe medications</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-white rounded-lg transition-colors border border-slate-200">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-white rounded-lg transition-colors border border-slate-200">
            <Printer className="w-4 h-4" />
            Formulary
          </button>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <Pill className="w-5 h-5 text-blue-500" />
            <span className="text-2xl font-bold text-slate-900">{stats.total}</span>
          </div>
          <p className="text-sm text-slate-500">Total Medications</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="text-2xl font-bold text-slate-900">{stats.active}</span>
          </div>
          <p className="text-sm text-slate-500">Active</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <span className="text-2xl font-bold text-slate-900">{stats.lowStock}</span>
          </div>
          <p className="text-sm text-slate-500">Low Stock</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-5 h-5 text-purple-500" />
            <span className="text-2xl font-bold text-slate-900">{stats.totalStock.toLocaleString()}</span>
          </div>
          <p className="text-sm text-slate-500">Total Units</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-2xl font-bold text-slate-900">₹{stats.avgPrice}</span>
          </div>
          <p className="text-sm text-slate-500">Avg. Price</p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or generic name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
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
            <option value="low-stock">Low Stock</option>
            <option value="discontinued">Discontinued</option>
          </select>
        </div>
      </div>
      
      {/* Medications Grid */}
      {paginatedMedications.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedMedications.map((med) => (
              <MedicationCard
                key={med.id}
                medication={med}
                onView={(m: any) => {
                  setSelectedMedication(m);
                  setShowDetailModal(true);
                }}
                onPrescribe={handlePrescribe}
              />
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-xl border border-slate-100 px-4 py-3">
              <p className="text-sm text-slate-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredMedications.length)} of{' '}
                {filteredMedications.length} medications
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
          <Pill className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-lg font-medium">No medications found</p>
          <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filter criteria</p>
        </div>
      )}
      
      {/* Medication Detail Modal */}
      <MedicationDetailModal
        medication={selectedMedication}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedMedication(null);
        }}
        onPrescribe={handlePrescribe}
      />
    </div>
  );
}