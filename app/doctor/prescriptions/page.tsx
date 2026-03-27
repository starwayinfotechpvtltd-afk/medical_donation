// app/doctor/prescriptions/page.tsx
'use client';

import { useState } from 'react';
import {
  FileText, Search, Filter, Plus, Download, Printer,
  Eye, Edit2, Trash2, Copy, Share2, Calendar,
  User, Stethoscope, Pill, Clock, CheckCircle2,
  AlertCircle, ChevronLeft, ChevronRight, X,
  Printer as PrinterIcon, Mail, FileDown, QrCode
} from 'lucide-react';

// Mock Prescriptions Data
const mockPrescriptions = [
  {
    id: 'RX001',
    patientName: 'John Sharma',
    patientId: 'P001',
    date: '2024-03-20',
    diagnosis: 'Hypertension, Type 2 Diabetes',
    medications: [
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '30 days', instructions: 'Take with meals' },
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take in the morning' }
    ],
    notes: 'Monitor blood pressure regularly. Follow up in 2 weeks.',
    followUpDate: '2024-04-03',
    status: 'active',
    template: 'Standard Hypertension'
  },
  {
    id: 'RX002',
    patientName: 'Priya Patel',
    patientId: 'P002',
    date: '2024-03-18',
    diagnosis: 'Diabetes Type 2, Hypothyroidism',
    medications: [
      { name: 'Metformin', dosage: '850mg', frequency: 'Twice daily', duration: '60 days', instructions: 'Take with meals' },
      { name: 'Levothyroxine', dosage: '50mcg', frequency: 'Once daily', duration: '60 days', instructions: 'Take on empty stomach' }
    ],
    notes: 'HbA1c target < 7%. Thyroid function test in 6 weeks.',
    followUpDate: '2024-04-15',
    status: 'active',
    template: 'Diabetes Management'
  },
  {
    id: 'RX003',
    patientName: 'Aisha Khan',
    patientId: 'P003',
    date: '2024-03-22',
    diagnosis: 'Coronary Artery Disease, Hyperlipidemia',
    medications: [
      { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', duration: '90 days', instructions: 'Take in the evening' },
      { name: 'Aspirin', dosage: '75mg', frequency: 'Once daily', duration: '90 days', instructions: 'Take with food' }
    ],
    notes: 'Monitor lipid profile. ECG scheduled for next week.',
    followUpDate: '2024-04-05',
    status: 'active',
    template: 'Cardiac Care'
  },
  {
    id: 'RX004',
    patientName: 'Ravi Patel',
    patientId: 'P004',
    date: '2024-03-15',
    diagnosis: 'Migraine',
    medications: [
      { name: 'Sumatriptan', dosage: '50mg', frequency: 'As needed', duration: '10 tablets', instructions: 'At onset of migraine' },
      { name: 'Propranolol', dosage: '40mg', frequency: 'Once daily', duration: '30 days', instructions: 'Preventive medication' }
    ],
    notes: 'Avoid triggers. Keep headache diary.',
    followUpDate: '2024-03-29',
    status: 'completed',
    template: 'Migraine Protocol'
  }
];

function StatusBadge({ status }: { status: string }) {
  const config = {
    active: 'bg-emerald-100 text-emerald-700',
    completed: 'bg-slate-100 text-slate-700',
    expired: 'bg-red-100 text-red-700'
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config[status as keyof typeof config]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function PrescriptionCard({ prescription, onView, onEdit, onPrint, onShare }: any) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-slate-900">{prescription.id}</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">{new Date(prescription.date).toLocaleDateString()}</p>
          </div>
          <StatusBadge status={prescription.status} />
        </div>
        
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-900">{prescription.patientName}</span>
            <span className="text-xs text-slate-500">ID: {prescription.patientId}</span>
          </div>
          <p className="text-sm text-slate-600 line-clamp-2">{prescription.diagnosis}</p>
        </div>
        
        <div className="bg-slate-50 rounded-lg p-3 mb-3">
          <p className="text-xs text-slate-500 mb-2">Medications ({prescription.medications.length})</p>
          <div className="space-y-1">
            {prescription.medications.slice(0, 2).map((med: any, idx: number) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <Pill className="w-3 h-3 text-blue-500" />
                <span className="text-slate-700">{med.name} {med.dosage}</span>
              </div>
            ))}
            {prescription.medications.length > 2 && (
              <p className="text-xs text-slate-500">+{prescription.medications.length - 2} more</p>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => onView(prescription)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-600 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            View
          </button>
          <button
            onClick={() => onEdit(prescription)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-medium text-blue-600 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={() => onPrint(prescription)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-sm font-medium text-emerald-600 transition-colors"
          >
            <PrinterIcon className="w-3.5 h-3.5" />
            Print
          </button>
        </div>
      </div>
    </div>
  );
}

function PrescriptionModal({ prescription, isOpen, onClose, onSave }: any) {
  const [formData, setFormData] = useState(prescription || {
    patientName: '',
    patientId: '',
    diagnosis: '',
    medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
    notes: '',
    followUpDate: '',
    template: ''
  });
  
  if (!isOpen) return null;
  
  const addMedication = () => {
    setFormData({
      ...formData,
      medications: [...formData.medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
    });
  };
  
  const removeMedication = (index: number) => {
    setFormData({
      ...formData,
      medications: formData.medications.filter((_: any, i: number) => i !== index)
    });
  };
  
  const updateMedication = (index: number, field: string, value: string) => {
    const updated = [...formData.medications];
    updated[index][field] = value;
    setFormData({ ...formData, medications: updated });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: prescription?.id || `RX${Date.now()}`,
      date: prescription?.date || new Date().toISOString().split('T')[0],
      status: 'active'
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {prescription ? 'Edit Prescription' : 'New Prescription'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Patient Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Patient Name *
              </label>
              <input
                type="text"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Diagnosis *
            </label>
            <textarea
              value={formData.diagnosis}
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>
          
          {/* Medications */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-slate-700">
                Medications *
              </label>
              <button
                type="button"
                onClick={addMedication}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                + Add Medication
              </button>
            </div>
            <div className="space-y-3">
              {formData.medications.map((med: any, idx: number) => (
                <div key={idx} className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-slate-700">Medication {idx + 1}</p>
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => removeMedication(idx)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Medicine Name</label>
                      <input
                        type="text"
                        value={med.name}
                        onChange={(e) => updateMedication(idx, 'name', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Dosage</label>
                      <input
                        type="text"
                        value={med.dosage}
                        onChange={(e) => updateMedication(idx, 'dosage', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="e.g., 500mg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Frequency</label>
                      <input
                        type="text"
                        value={med.frequency}
                        onChange={(e) => updateMedication(idx, 'frequency', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="e.g., Twice daily"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Duration</label>
                      <input
                        type="text"
                        value={med.duration}
                        onChange={(e) => updateMedication(idx, 'duration', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="e.g., 30 days"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs text-slate-500 mb-1">Instructions</label>
                      <input
                        type="text"
                        value={med.instructions}
                        onChange={(e) => updateMedication(idx, 'instructions', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="e.g., Take with meals"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Doctor's Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="Additional instructions for the patient..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Follow-up Date
              </label>
              <input
                type="date"
                value={formData.followUpDate}
                onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Template Used
              </label>
              <input
                type="text"
                value={formData.template}
                onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g., Standard Hypertension"
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {prescription ? 'Update Prescription' : 'Create Prescription'}
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

function PrescriptionViewModal({ prescription, onClose, onPrint }: any) {
  if (!prescription) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-8">
          {/* Prescription Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-blue-50 rounded-full mb-3">
              <Stethoscope className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">MediCare Hospital</h1>
            <p className="text-sm text-slate-500">123 Healthcare Avenue, Mumbai - 400001</p>
            <p className="text-xs text-slate-400">Tel: +91 98765 43210 | Email: contact@medicare.com</p>
          </div>
          
          {/* Prescription Info */}
          <div className="border-t border-b border-slate-100 py-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">Prescription ID</p>
                <p className="text-sm font-semibold text-slate-900">{prescription.id}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Date</p>
                <p className="text-sm font-semibold text-slate-900">{new Date(prescription.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Patient Name</p>
                <p className="text-sm font-semibold text-slate-900">{prescription.patientName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Patient ID</p>
                <p className="text-sm font-semibold text-slate-900">{prescription.patientId}</p>
              </div>
            </div>
          </div>
          
          {/* Diagnosis */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Diagnosis</h3>
            <p className="text-sm text-slate-700">{prescription.diagnosis}</p>
          </div>
          
          {/* Medications */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Medications</h3>
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Medicine</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Dosage</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Frequency</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Duration</th>
                </tr>
              </thead>
              <tbody>
                {prescription.medications.map((med: any, idx: number) => (
                  <tr key={idx} className="border-b border-slate-100">
                    <td className="px-3 py-2 text-sm text-slate-700">{med.name}</td>
                    <td className="px-3 py-2 text-sm text-slate-700">{med.dosage}</td>
                    <td className="px-3 py-2 text-sm text-slate-700">{med.frequency}</td>
                    <td className="px-3 py-2 text-sm text-slate-700">{med.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Instructions */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Instructions</h3>
            {prescription.medications.map((med: any, idx: number) => (
              med.instructions && (
                <p key={idx} className="text-sm text-slate-600 mb-1">• {med.name}: {med.instructions}</p>
              )
            ))}
          </div>
          
          {/* Notes */}
          {prescription.notes && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Doctor's Notes</h3>
              <p className="text-sm text-slate-600">{prescription.notes}</p>
            </div>
          )}
          
          {/* Follow-up */}
          {prescription.followUpDate && (
            <div className="mb-6 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Follow-up Date:</strong> {new Date(prescription.followUpDate).toLocaleDateString()}
              </p>
            </div>
          )}
          
          {/* Doctor Signature */}
          <div className="mt-8 pt-4 border-t border-slate-100">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm font-semibold text-slate-900">Dr. Rajesh Kumar</p>
                <p className="text-xs text-slate-500">MBBS, MD (Cardiology)</p>
                <p className="text-xs text-slate-500">Reg. No: MC-12345</p>
              </div>
              <div className="text-right">
                <div className="w-32 h-12 border-b border-slate-300 mb-1"></div>
                <p className="text-xs text-slate-500">Doctor's Signature</p>
              </div>
            </div>
          </div>
          
          {/* QR Code Placeholder */}
          <div className="mt-4 flex justify-center">
            <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
              <QrCode className="w-8 h-8 text-slate-400" />
            </div>
          </div>
        </div>
        
        <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onPrint}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700"
          >
            <PrinterIcon className="w-4 h-4 inline mr-2" />
            Print Prescription
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DoctorPrescriptions() {
  const [prescriptions, setPrescriptions] = useState(mockPrescriptions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const filteredPrescriptions = prescriptions.filter(p => 
    p.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredPrescriptions.length / itemsPerPage);
  const paginatedPrescriptions = filteredPrescriptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const handlePrint = (prescription: any) => {
    window.print();
  };
  
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Prescriptions</h1>
          <p className="text-sm text-slate-500 mt-1">Manage patient prescriptions and medications</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Prescription
          </button>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-5 h-5 text-blue-500" />
            <span className="text-2xl font-bold text-slate-900">{prescriptions.length}</span>
          </div>
          <p className="text-sm text-slate-500">Total Prescriptions</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="text-2xl font-bold text-slate-900">{prescriptions.filter(p => p.status === 'active').length}</span>
          </div>
          <p className="text-sm text-slate-500">Active</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <Pill className="w-5 h-5 text-purple-500" />
            <span className="text-2xl font-bold text-slate-900">
              {prescriptions.reduce((sum, p) => sum + p.medications.length, 0)}
            </span>
          </div>
          <p className="text-sm text-slate-500">Medications Prescribed</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 text-amber-500" />
            <span className="text-2xl font-bold text-slate-900">
              {prescriptions.filter(p => p.followUpDate && new Date(p.followUpDate) > new Date()).length}
            </span>
          </div>
          <p className="text-sm text-slate-500">Upcoming Follow-ups</p>
        </div>
      </div>
      
      {/* Search */}
      <div className="bg-white rounded-xl border border-slate-100 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by patient name, ID, or diagnosis..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>
      
      {/* Prescriptions Grid */}
      {paginatedPrescriptions.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPrescriptions.map((prescription) => (
              <PrescriptionCard
                key={prescription.id}
                prescription={prescription}
                onView={(p: any) => {
                  setSelectedPrescription(p);
                  setShowViewModal(true);
                }}
                onEdit={(p: any) => {
                  setSelectedPrescription(p);
                  setShowEditModal(true);
                }}
                onPrint={handlePrint}
                onShare={() => {}}
              />
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-xl border border-slate-100 px-4 py-3">
              <p className="text-sm text-slate-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredPrescriptions.length)} of{' '}
                {filteredPrescriptions.length} prescriptions
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
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-lg font-medium">No prescriptions found</p>
          <p className="text-sm text-slate-400 mt-1">Create your first prescription</p>
        </div>
      )}
      
      {/* Modals */}
      <PrescriptionViewModal
        prescription={selectedPrescription}
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedPrescription(null);
        }}
        onPrint={handlePrint}
      />
      
      <PrescriptionModal
        prescription={selectedPrescription}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedPrescription(null);
        }}
        onSave={(data: any) => {
          setPrescriptions(prescriptions.map(p => p.id === data.id ? data : p));
          setShowEditModal(false);
          setSelectedPrescription(null);
        }}
      />
      
      <PrescriptionModal
        prescription={null}
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        onSave={(data: any) => {
          setPrescriptions([data, ...prescriptions]);
          setShowNewModal(false);
        }}
      />
    </div>
  );
}