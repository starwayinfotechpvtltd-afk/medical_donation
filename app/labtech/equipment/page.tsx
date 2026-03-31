// app/technician/equipment/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Microscope, Activity, HeartPulse, Syringe, 
  Search, Filter, Plus, Edit2, Trash2, 
  AlertCircle, CheckCircle, Clock, Wrench,
  Calendar, Settings, BarChart3, Download,
  ChevronLeft, ChevronRight, X, Save,
  FileText, Bell, Printer, RefreshCw,
  Thermometer, Droplet, Wind, Battery,
  Monitor, Cpu, Shield, AlertTriangle,
  Eye, Calendar as CalendarIcon, DollarSign,
  Users, Package, Truck, Scissors
} from 'lucide-react';

// Mock Equipment Data
const equipmentData = {
  laboratory: {
    name: 'Laboratory Equipment',
    icon: Microscope,
    color: 'blue',
    items: [
      {
        id: 'LAB-001',
        name: 'Hematology Analyzer',
        model: 'XN-9000',
        manufacturer: 'Sysmex',
        serialNumber: 'SYX-2024-001',
        location: 'Main Lab - Room 101',
        status: 'operational',
        lastMaintenance: '2024-03-15',
        nextMaintenance: '2024-04-15',
        warrantyExpiry: '2026-12-31',
        purchaseDate: '2023-01-15',
        cost: 45000,
        usageHours: 1250,
        issues: [],
        calibrationDue: '2024-04-01',
        department: 'laboratory'
      },
      {
        id: 'LAB-002',
        name: 'Centrifuge',
        model: '5804 R',
        manufacturer: 'Eppendorf',
        serialNumber: 'EPP-2024-002',
        location: 'Sample Processing Area',
        status: 'maintenance',
        lastMaintenance: '2024-02-28',
        nextMaintenance: '2024-03-28',
        warrantyExpiry: '2025-06-30',
        purchaseDate: '2022-08-20',
        cost: 8500,
        usageHours: 3200,
        issues: ['Unusual noise during operation', 'Needs rotor balancing'],
        calibrationDue: '2024-03-25',
        department: 'laboratory'
      },
      {
        id: 'LAB-003',
        name: 'Microscope',
        model: 'BX53',
        manufacturer: 'Olympus',
        serialNumber: 'OLY-2024-003',
        location: 'Microscopy Room',
        status: 'operational',
        lastMaintenance: '2024-03-10',
        nextMaintenance: '2024-04-10',
        warrantyExpiry: '2027-01-31',
        purchaseDate: '2023-03-10',
        cost: 12000,
        usageHours: 850,
        issues: [],
        calibrationDue: '2024-04-15',
        department: 'laboratory'
      },
      {
        id: 'LAB-004',
        name: 'Chemistry Analyzer',
        model: 'AU680',
        manufacturer: 'Beckman Coulter',
        serialNumber: 'BECK-2024-004',
        location: 'Clinical Chemistry',
        status: 'repair',
        lastMaintenance: '2024-02-10',
        nextMaintenance: '2024-03-10',
        warrantyExpiry: '2025-08-31',
        purchaseDate: '2022-09-01',
        cost: 78000,
        usageHours: 2800,
        issues: ['Reagent probe error', 'Temperature fluctuation'],
        calibrationDue: '2024-03-20',
        department: 'laboratory'
      }
    ]
  },
  radiology: {
    name: 'Radiology Equipment',
    icon: Activity,
    color: 'purple',
    items: [
      {
        id: 'RAD-001',
        name: 'X-Ray Machine',
        model: 'DigitalDiagnost',
        manufacturer: 'Philips',
        serialNumber: 'PHL-2024-005',
        location: 'X-Ray Room 1',
        status: 'operational',
        lastMaintenance: '2024-03-01',
        nextMaintenance: '2024-04-01',
        warrantyExpiry: '2025-12-31',
        purchaseDate: '2022-11-15',
        cost: 125000,
        usageHours: 1850,
        issues: [],
        calibrationDue: '2024-03-30',
        department: 'radiology'
      },
      {
        id: 'RAD-002',
        name: 'MRI Machine',
        model: 'Ingenia 3.0T',
        manufacturer: 'Philips',
        serialNumber: 'PHL-2024-006',
        location: 'MRI Suite',
        status: 'operational',
        lastMaintenance: '2024-03-05',
        nextMaintenance: '2024-04-05',
        warrantyExpiry: '2026-05-31',
        purchaseDate: '2023-05-20',
        cost: 850000,
        usageHours: 950,
        issues: [],
        calibrationDue: '2024-04-10',
        department: 'radiology'
      },
      {
        id: 'RAD-003',
        name: 'CT Scanner',
        model: 'Somatom go.Top',
        manufacturer: 'Siemens',
        serialNumber: 'SIE-2024-007',
        location: 'CT Room',
        status: 'maintenance',
        lastMaintenance: '2024-03-12',
        nextMaintenance: '2024-04-12',
        warrantyExpiry: '2026-08-31',
        purchaseDate: '2023-08-15',
        cost: 450000,
        usageHours: 720,
        issues: ['Software update required'],
        calibrationDue: '2024-04-05',
        department: 'radiology'
      }
    ]
  },
  cardiology: {
    name: 'Cardiology Equipment',
    icon: HeartPulse,
    color: 'red',
    items: [
      {
        id: 'CARD-001',
        name: 'ECG Machine',
        model: 'MAC 2000',
        manufacturer: 'GE Healthcare',
        serialNumber: 'GE-2024-008',
        location: 'Cardiology Dept',
        status: 'operational',
        lastMaintenance: '2024-03-08',
        nextMaintenance: '2024-04-08',
        warrantyExpiry: '2025-10-31',
        purchaseDate: '2023-10-10',
        cost: 8500,
        usageHours: 450,
        issues: [],
        calibrationDue: '2024-04-20',
        department: 'cardiology'
      },
      {
        id: 'CARD-002',
        name: 'Echocardiogram',
        model: 'Vivid T8',
        manufacturer: 'GE Healthcare',
        serialNumber: 'GE-2024-009',
        location: 'Echo Lab',
        status: 'operational',
        lastMaintenance: '2024-03-14',
        nextMaintenance: '2024-04-14',
        warrantyExpiry: '2026-03-31',
        purchaseDate: '2024-01-20',
        cost: 65000,
        usageHours: 280,
        issues: [],
        calibrationDue: '2024-05-01',
        department: 'cardiology'
      },
      {
        id: 'CARD-003',
        name: 'Holter Monitor',
        model: 'Lifecard CF',
        manufacturer: 'Spacelabs',
        serialNumber: 'SPC-2024-010',
        location: 'Cardiology Dept',
        status: 'repair',
        lastMaintenance: '2024-02-20',
        nextMaintenance: '2024-03-20',
        warrantyExpiry: '2025-04-30',
        purchaseDate: '2022-04-15',
        cost: 3200,
        usageHours: 1200,
        issues: ['Battery not holding charge', 'Data transfer error'],
        calibrationDue: '2024-03-28',
        department: 'cardiology'
      }
    ]
  },
  dialysis: {
    name: 'Dialysis Equipment',
    icon: Syringe,
    color: 'green',
    items: [
      {
        id: 'DIA-001',
        name: 'Dialysis Machine',
        model: 'AK 98',
        manufacturer: 'Baxter',
        serialNumber: 'BAX-2024-011',
        location: 'Dialysis Unit - Bed 1',
        status: 'operational',
        lastMaintenance: '2024-03-10',
        nextMaintenance: '2024-04-10',
        warrantyExpiry: '2025-11-30',
        purchaseDate: '2023-11-01',
        cost: 28000,
        usageHours: 580,
        issues: [],
        calibrationDue: '2024-04-15',
        department: 'dialysis'
      },
      {
        id: 'DIA-002',
        name: 'RO Water System',
        model: 'AquaB Plus',
        manufacturer: 'Fresenius',
        serialNumber: 'FRE-2024-012',
        location: 'Water Treatment Room',
        status: 'operational',
        lastMaintenance: '2024-03-05',
        nextMaintenance: '2024-04-05',
        warrantyExpiry: '2026-09-30',
        purchaseDate: '2023-09-15',
        cost: 45000,
        usageHours: 2100,
        issues: [],
        calibrationDue: '2024-04-01',
        department: 'dialysis'
      },
      {
        id: 'DIA-003',
        name: 'Portable Dialysis Unit',
        model: 'NxStage',
        manufacturer: 'Fresenius',
        serialNumber: 'FRE-2024-013',
        location: 'Mobile Unit',
        status: 'maintenance',
        lastMaintenance: '2024-03-01',
        nextMaintenance: '2024-04-01',
        warrantyExpiry: '2025-07-31',
        purchaseDate: '2023-07-20',
        cost: 32000,
        usageHours: 890,
        issues: ['Flow rate calibration needed'],
        calibrationDue: '2024-03-25',
        department: 'dialysis'
      }
    ]
  }
};

// Types
interface Equipment {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  serialNumber: string;
  location: string;
  status: 'operational' | 'maintenance' | 'repair' | 'inactive';
  lastMaintenance: string;
  nextMaintenance: string;
  warrantyExpiry: string;
  purchaseDate: string;
  cost: number;
  usageHours: number;
  issues: string[];
  calibrationDue: string;
  department: string;
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; icon: any; text: string }> = {
    operational: { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle, text: 'Operational' },
    maintenance: { color: 'bg-amber-100 text-amber-700', icon: Wrench, text: 'Maintenance' },
    repair: { color: 'bg-red-100 text-red-700', icon: AlertCircle, text: 'Repair Needed' },
    inactive: { color: 'bg-slate-100 text-slate-700', icon: X, text: 'Inactive' }
  };
  const { color, icon: Icon, text } = config[status] || config.operational;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3" />
      {text}
    </span>
  );
}

function EquipmentCard({ equipment, onEdit, onDelete, onViewDetails }: any) {
  const getDaysUntilMaintenance = () => {
    const today = new Date();
    const maintenanceDate = new Date(equipment.nextMaintenance);
    const diffTime = maintenanceDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntil = getDaysUntilMaintenance();
  const isUrgent = daysUntil <= 7 && daysUntil > 0;
  const isOverdue = daysUntil < 0;

  return (
    <div className="bg-white rounded-xl border border-slate-100 hover:shadow-lg transition-all group">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-slate-900 text-lg">{equipment.name}</h3>
              <StatusBadge status={equipment.status} />
            </div>
            <p className="text-sm text-slate-500">{equipment.model} - {equipment.manufacturer}</p>
          </div>
          <div className="text-xs text-slate-400 font-mono">{equipment.id}</div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="p-1 bg-slate-100 rounded">
              <Settings className="w-3 h-3 text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Serial #</p>
              <p className="text-sm font-medium text-slate-700">{equipment.serialNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="p-1 bg-slate-100 rounded">
              <MapPin className="w-3 h-3 text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Location</p>
              <p className="text-sm font-medium text-slate-700 truncate">{equipment.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="p-1 bg-slate-100 rounded">
              <Calendar className="w-3 h-3 text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Next Maintenance</p>
              <p className={`text-sm font-medium ${isOverdue ? 'text-red-600' : isUrgent ? 'text-amber-600' : 'text-slate-700'}`}>
                {new Date(equipment.nextMaintenance).toLocaleDateString()}
                {!isOverdue && daysUntil > 0 && (
                  <span className="text-xs ml-1">({daysUntil} days)</span>
                )}
                {isOverdue && <span className="text-xs ml-1">(Overdue)</span>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="p-1 bg-slate-100 rounded">
              <Activity className="w-3 h-3 text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Usage Hours</p>
              <p className="text-sm font-medium text-slate-700">{equipment.usageHours} hrs</p>
            </div>
          </div>
        </div>

        {/* Issues Alert */}
        {equipment.issues && equipment.issues.length > 0 && (
          <div className="mb-4 p-2 bg-red-50 rounded-lg border border-red-100">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-medium text-red-700">Issues Reported:</p>
                <ul className="text-xs text-red-600 mt-1">
                  {equipment.issues.slice(0, 2).map((issue: string, idx: number) => (
                    <li key={idx}>• {issue}</li>
                  ))}
                  {equipment.issues.length > 2 && (
                    <li>• +{equipment.issues.length - 2} more</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={() => onViewDetails(equipment)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Details
          </button>
          <button
            onClick={() => onEdit(equipment)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(equipment)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function EquipmentDetailsModal({ equipment, isOpen, onClose }: any) {
  const [activeTab, setActiveTab] = useState<'info' | 'maintenance' | 'issues'>('info');

  if (!isOpen || !equipment) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{equipment.name}</h2>
            <p className="text-sm text-slate-500 mt-1">{equipment.model} - {equipment.manufacturer}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="border-b border-slate-100 px-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'info'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Information
            </button>
            <button
              onClick={() => setActiveTab('maintenance')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'maintenance'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Maintenance History
            </button>
            <button
              onClick={() => setActiveTab('issues')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'issues'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Issues & Reports
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-500">Equipment ID</label>
                    <p className="text-sm font-medium text-slate-900 font-mono">{equipment.id}</p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Serial Number</label>
                    <p className="text-sm font-medium text-slate-900">{equipment.serialNumber}</p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Location</label>
                    <p className="text-sm text-slate-700">{equipment.location}</p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Purchase Date</label>
                    <p className="text-sm text-slate-700">{new Date(equipment.purchaseDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-500">Status</label>
                    <div className="mt-1">
                      <StatusBadge status={equipment.status} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Warranty Expiry</label>
                    <p className="text-sm text-slate-700">{new Date(equipment.warrantyExpiry).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Total Cost</label>
                    <p className="text-sm font-semibold text-slate-900">${equipment.cost.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Usage Hours</label>
                    <p className="text-sm text-slate-700">{equipment.usageHours} hours</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="font-semibold text-slate-900 mb-2">Maintenance Schedule</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Last Maintenance</p>
                    <p className="text-sm font-medium text-slate-700">{new Date(equipment.lastMaintenance).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Next Maintenance</p>
                    <p className="text-sm font-medium text-slate-700">{new Date(equipment.nextMaintenance).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Calibration Due</p>
                    <p className="text-sm font-medium text-slate-700">{new Date(equipment.calibrationDue).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="space-y-4">
              <div className="bg-amber-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Upcoming Maintenance</p>
                    <p className="text-xs text-amber-700">Due on {new Date(equipment.nextMaintenance).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              {/* Mock Maintenance History */}
              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Technician</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-4 py-3 text-sm text-slate-700">2024-03-15</td>
                      <td className="px-4 py-3 text-sm text-slate-700">Routine Check</td>
                      <td className="px-4 py-3 text-sm text-slate-700">John Smith</td>
                      <td className="px-4 py-3"><span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Completed</span></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-slate-700">2024-02-15</td>
                      <td className="px-4 py-3 text-sm text-slate-700">Calibration</td>
                      <td className="px-4 py-3 text-sm text-slate-700">Sarah Johnson</td>
                      <td className="px-4 py-3"><span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Completed</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'issues' && (
            <div className="space-y-4">
              {equipment.issues && equipment.issues.length > 0 ? (
                equipment.issues.map((issue: string, idx: number) => (
                  <div key={idx} className="bg-red-50 rounded-xl p-4 border border-red-100">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-800">Issue #{idx + 1}</p>
                        <p className="text-sm text-red-700 mt-1">{issue}</p>
                        <div className="flex gap-3 mt-2">
                          <button className="text-xs text-red-700 hover:text-red-800 font-medium">Report Fixed</button>
                          <button className="text-xs text-red-700 hover:text-red-800 font-medium">View Details</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                  <p className="text-slate-600">No issues reported for this equipment</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AddEquipmentModal({ isOpen, onClose, onSave }: any) {
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    manufacturer: '',
    location: '',
    cost: '',
    department: 'laboratory'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Add New Equipment</h2>
            <p className="text-sm text-slate-500 mt-1">Enter equipment details</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Equipment Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g., Hematology Analyzer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Model *</label>
              <input
                type="text"
                required
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g., XN-9000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Manufacturer *</label>
              <input
                type="text"
                required
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g., Sysmex"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location *</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g., Main Lab - Room 101"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cost ($) *</label>
              <input
                type="number"
                required
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g., 45000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department *</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="laboratory">Laboratory</option>
                <option value="radiology">Radiology</option>
                <option value="cardiology">Cardiology</option>
                <option value="dialysis">Dialysis</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Equipment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EquipmentPage() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleViewDetails = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setShowDetailsModal(true);
  };

  const handleEdit = (equipment: Equipment) => {
    console.log('Edit equipment:', equipment);
    // Implement edit functionality
  };

  const handleDelete = (equipment: Equipment) => {
    if (confirm(`Are you sure you want to delete ${equipment.name}?`)) {
      console.log('Delete equipment:', equipment);
      // Implement delete functionality
    }
  };

  const handleAddEquipment = (data: any) => {
    console.log('Add new equipment:', data);
    // Implement add functionality
  };

  const getFilteredEquipment = () => {
    let items: Equipment[] = [];
    
    if (selectedDepartment === 'all') {
      Object.keys(equipmentData).forEach(dept => {
        items = [...items, ...equipmentData[dept as keyof typeof equipmentData].items];
      });
    } else {
      items = equipmentData[selectedDepartment as keyof typeof equipmentData]?.items || [];
    }

    if (searchQuery) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return items;
  };

  const getStatistics = () => {
    const allItems = getFilteredEquipment();
    const total = allItems.length;
    const operational = allItems.filter(i => i.status === 'operational').length;
    const maintenance = allItems.filter(i => i.status === 'maintenance').length;
    const repair = allItems.filter(i => i.status === 'repair').length;
    const totalValue = allItems.reduce((sum, i) => sum + i.cost, 0);
    
    return { total, operational, maintenance, repair, totalValue };
  };

  const stats = getStatistics();
  const equipment = getFilteredEquipment();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-600 rounded-xl shadow-lg">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                  Equipment Management
                </h1>
              </div>
              <p className="text-slate-600 ml-12">Manage medical equipment, track maintenance, and monitor status</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add Equipment</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Settings className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xs text-slate-400">Total</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            <p className="text-xs text-slate-500 mt-1">Equipment Units</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-emerald-600">{stats.operational}</p>
            <p className="text-xs text-slate-500 mt-1">Operational</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-amber-50 rounded-lg">
                <Wrench className="w-4 h-4 text-amber-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-amber-600">{stats.maintenance}</p>
            <p className="text-xs text-slate-500 mt-1">Under Maintenance</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-red-600">{stats.repair}</p>
            <p className="text-xs text-slate-500 mt-1">Repair Needed</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-purple-50 rounded-lg">
                <DollarSign className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <p className="text-xl font-bold text-slate-900">${(stats.totalValue / 1000).toFixed(0)}k</p>
            <p className="text-xs text-slate-500 mt-1">Total Value</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, model, serial number, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Departments</option>
                <option value="laboratory">Laboratory</option>
                <option value="radiology">Radiology</option>
                <option value="cardiology">Cardiology</option>
                <option value="dialysis">Dialysis</option>
              </select>
              <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                >
                  <div className="grid grid-cols-2 gap-0.5">
                    <div className="w-2 h-2 bg-current rounded-sm"></div>
                    <div className="w-2 h-2 bg-current rounded-sm"></div>
                    <div className="w-2 h-2 bg-current rounded-sm"></div>
                    <div className="w-2 h-2 bg-current rounded-sm"></div>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                >
                  <div className="w-4 h-4 flex flex-col gap-1">
                    <div className="w-full h-0.5 bg-current rounded"></div>
                    <div className="w-full h-0.5 bg-current rounded"></div>
                    <div className="w-full h-0.5 bg-current rounded"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Equipment Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipment.map((item) => (
              <EquipmentCard
                key={item.id}
                equipment={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Equipment</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Model/Serial</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Next Maintenance</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {equipment.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                          <p className="text-xs text-slate-500">{item.manufacturer}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-slate-700">{item.model}</p>
                          <p className="text-xs text-slate-400 font-mono">{item.serialNumber}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{item.location}</td>
                      <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-700">{new Date(item.nextMaintenance).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDetails(item)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
        )}

        {equipment.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex p-4 bg-slate-100 rounded-full mb-4">
              <Settings className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No equipment found</h3>
            <p className="text-slate-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <EquipmentDetailsModal
        equipment={selectedEquipment}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />

      <AddEquipmentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddEquipment}
      />
    </div>
  );
}

// Helper component for MapPin (add this at the top with other imports if needed)
const MapPin = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);