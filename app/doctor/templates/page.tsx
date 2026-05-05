// app/doctor/templates/page.tsx
'use client';

import { useState } from 'react';
import {
  ClipboardList, Plus, Search, Edit2, Trash2, Copy,
  Eye, MoreHorizontal, CheckCircle2, XCircle,
  ChevronLeft, ChevronRight, FileText, Pill,
  Calendar, User, Stethoscope, Clock, Save, X
} from 'lucide-react';

// Mock Templates Data
const mockTemplates = [
  {
    id: 'TPL001',
    name: 'Standard Hypertension',
    category: 'Cardiology',
    description: 'Standard treatment protocol for hypertension management',
    diagnosis: 'Hypertension',
    medications: [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take in the morning' },
      { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take with food' }
    ],
    notes: 'Monitor blood pressure weekly. Reduce salt intake.',
    followUpDays: 14,
    usageCount: 24,
    isActive: true,
    createdAt: '2024-01-15',
    lastUsed: '2024-03-27'
  },
  {
    id: 'TPL002',
    name: 'Diabetes Type 2 Management',
    category: 'Endocrinology',
    description: 'Comprehensive diabetes management protocol',
    diagnosis: 'Type 2 Diabetes Mellitus',
    medications: [
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '90 days', instructions: 'Take with meals' },
      { name: 'Glimepiride', dosage: '2mg', frequency: 'Once daily', duration: '90 days', instructions: 'Take with breakfast' }
    ],
    notes: 'Monitor HbA1c every 3 months. Encourage lifestyle modifications.',
    followUpDays: 90,
    usageCount: 18,
    isActive: true,
    createdAt: '2024-01-20',
    lastUsed: '2024-03-25'
  },
  {
    id: 'TPL003',
    name: 'Cardiac Care Protocol',
    category: 'Cardiology',
    description: 'Post-cardiac event management',
    diagnosis: 'Coronary Artery Disease',
    medications: [
      { name: 'Aspirin', dosage: '75mg', frequency: 'Once daily', duration: '365 days', instructions: 'Take with food' },
      { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', duration: '365 days', instructions: 'Take in the evening' },
      { name: 'Clopidogrel', dosage: '75mg', frequency: 'Once daily', duration: '365 days', instructions: 'Take with food' }
    ],
    notes: 'Regular ECG monitoring. Avoid strenuous activities.',
    followUpDays: 30,
    usageCount: 12,
    isActive: true,
    createdAt: '2024-02-01',
    lastUsed: '2024-03-22'
  },
  {
    id: 'TPL004',
    name: 'Migraine Protocol',
    category: 'Neurology',
    description: 'Acute and preventive migraine treatment',
    diagnosis: 'Migraine',
    medications: [
      { name: 'Sumatriptan', dosage: '50mg', frequency: 'As needed', duration: '10 tablets', instructions: 'At onset of migraine' },
      { name: 'Propranolol', dosage: '40mg', frequency: 'Once daily', duration: '90 days', instructions: 'Preventive medication' }
    ],
    notes: 'Identify triggers. Keep headache diary.',
    followUpDays: 30,
    usageCount: 8,
    isActive: true,
    createdAt: '2024-02-10',
    lastUsed: '2024-03-20'
  },
  {
    id: 'TPL005',
    name: 'Respiratory Infection',
    category: 'Pulmonology',
    description: 'Upper respiratory tract infection treatment',
    diagnosis: 'Acute Bronchitis',
    medications: [
      { name: 'Amoxicillin', dosage: '500mg', frequency: 'Three times daily', duration: '7 days', instructions: 'Complete full course' },
      { name: 'Acetylcysteine', dosage: '600mg', frequency: 'Once daily', duration: '5 days', instructions: 'For mucus clearance' }
    ],
    notes: 'Stay hydrated. Rest recommended.',
    followUpDays: 7,
    usageCount: 5,
    isActive: false,
    createdAt: '2024-02-15',
    lastUsed: '2024-03-10'
  }
];

function TemplateCard({ template, onEdit, onDelete, onUse, onDuplicate }: any) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-slate-900">{template.name}</h3>
          </div>
          <div className="flex items-center gap-1">
            {template.isActive ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
        </div>
        
        <p className="text-xs text-slate-500 mb-2">{template.category}</p>
        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{template.description}</p>
        
        <div className="bg-slate-50 rounded-lg p-3 mb-3">
          <p className="text-xs text-slate-500 mb-1">Diagnosis</p>
          <p className="text-sm font-medium text-slate-900">{template.diagnosis}</p>
        </div>
        
        <div className="bg-slate-50 rounded-lg p-3 mb-3">
          <p className="text-xs text-slate-500 mb-1">Medications ({template.medications.length})</p>
          <div className="space-y-1">
            {template.medications.slice(0, 2).map((med: any, idx: number) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <Pill className="w-3 h-3 text-blue-500" />
                <span className="text-slate-700">{med.name} {med.dosage}</span>
              </div>
            ))}
            {template.medications.length > 2 && (
              <p className="text-xs text-slate-500">+{template.medications.length - 2} more</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
          <span>Used {template.usageCount} times</span>
          <span>Follow-up: {template.followUpDays} days</span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => onUse(template)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            Use Template
          </button>
          <button
            onClick={() => onEdit(template)}
            className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDuplicate(template)}
            className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
            title="Duplicate"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(template.id)}
            className="p-2 bg-slate-50 hover:bg-red-50 rounded-lg text-slate-600 hover:text-red-600 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function TemplateModal({ template, isOpen, onClose, onSave }: any) {
  const [formData, setFormData] = useState(template || {
    name: '',
    category: '',
    description: '',
    diagnosis: '',
    medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
    notes: '',
    followUpDays: 14,
    isActive: true
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
      id: template?.id || `TPL${Date.now()}`,
      createdAt: template?.createdAt || new Date().toISOString().split('T')[0],
      usageCount: template?.usageCount || 0
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {template ? 'Edit Template' : 'Create New Template'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Template Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Endocrinology">Endocrinology</option>
                <option value="Pulmonology">Pulmonology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Diagnosis *
            </label>
            <input
              type="text"
              value={formData.diagnosis}
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
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
              Doctor's Notes (Default)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Follow-up Days
              </label>
              <input
                type="number"
                value={formData.followUpDays}
                onChange={(e) => setFormData({ ...formData, followUpDays: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Status
              </label>
              <select
                value={formData.isActive ? 'active' : 'inactive'}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4 inline mr-2" />
              {template ? 'Update Template' : 'Create Template'}
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

export default function DoctorTemplates() {
  const [templates, setTemplates] = useState(mockTemplates);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || 
                          (statusFilter === 'Active' && t.isActive) ||
                          (statusFilter === 'Inactive' && !t.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const paginatedTemplates = filteredTemplates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const categories = ['All', ...new Set(templates.map(t => t.category))];
  
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      setTemplates(templates.filter(t => t.id !== id));
    }
  };
  
  const handleDuplicate = (template: any) => {
    const newTemplate = {
      ...template,
      id: `TPL${Date.now()}`,
      name: `${template.name} (Copy)`,
      usageCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTemplates([newTemplate, ...templates]);
  };
  
  const handleUseTemplate = (template: any) => {
    // Navigate to prescription creation with template data
    console.log('Using template:', template);
    alert(`Creating new prescription from template: ${template.name}`);
  };
  
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Prescription Templates</h1>
          <p className="text-sm text-slate-500 mt-1">Create and manage reusable prescription templates</p>
        </div>
        <button
          onClick={() => {
            setSelectedTemplate(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Template
        </button>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <ClipboardList className="w-5 h-5 text-blue-500" />
            <span className="text-2xl font-bold text-slate-900">{templates.length}</span>
          </div>
          <p className="text-sm text-slate-500">Total Templates</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="text-2xl font-bold text-slate-900">{templates.filter(t => t.isActive).length}</span>
          </div>
          <p className="text-sm text-slate-500">Active</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <Pill className="w-5 h-5 text-purple-500" />
            <span className="text-2xl font-bold text-slate-900">
              {templates.reduce((sum, t) => sum + t.medications.length, 0)}
            </span>
          </div>
          <p className="text-sm text-slate-500">Medications in Templates</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 text-amber-500" />
            <span className="text-2xl font-bold text-slate-900">
              {templates.reduce((sum, t) => sum + t.usageCount, 0)}
            </span>
          </div>
          <p className="text-sm text-slate-500">Total Uses</p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by template name or diagnosis..."
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
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
      
      {/* Templates Grid */}
      {paginatedTemplates.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onEdit={(t: any) => {
                  setSelectedTemplate(t);
                  setShowModal(true);
                }}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onUse={handleUseTemplate}
              />
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-xl border border-slate-100 px-4 py-3">
              <p className="text-sm text-slate-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredTemplates.length)} of{' '}
                {filteredTemplates.length} templates
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
          <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-lg font-medium">No templates found</p>
          <p className="text-sm text-slate-400 mt-1">Create your first prescription template</p>
        </div>
      )}
      
      {/* Template Modal */}
      <TemplateModal
        template={selectedTemplate}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedTemplate(null);
        }}
        onSave={(data: any) => {
          if (selectedTemplate) {
            setTemplates(templates.map(t => t.id === data.id ? data : t));
          } else {
            setTemplates([data, ...templates]);
          }
          setShowModal(false);
          setSelectedTemplate(null);
        }}
      />
    </div>
  );
}