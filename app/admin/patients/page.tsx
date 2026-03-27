// app/admin/patients/page.tsx
'use client';

import { useState } from "react";
import {
  Users, Search, Filter, MoreHorizontal, Eye, Edit2, 
  Trash2, Plus, UserPlus, Mail, Phone, Calendar, 
  MapPin, Activity, Heart, Stethoscope, FileText,
  Download, Printer, ChevronLeft, ChevronRight,
  X, CheckCircle2, AlertCircle, Clock, Shield,
  Baby, Briefcase, CreditCard, Hospital, Upload,
  RefreshCw, Star, MessageSquare, Pill, Thermometer
} from "lucide-react";
import Image from "next/image";

// Types
type PatientStatus = 'active' | 'inactive' | 'critical' | 'recovered';
type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
type Gender = 'Male' | 'Female' | 'Other';

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: Gender;
  bloodGroup: BloodGroup;
  address: string;
  status: PatientStatus;
  lastVisit: string;
  nextAppointment?: string;
  medicalHistory: string[];
  allergies: string[];
  currentMedications: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  insuranceProvider?: string;
  insuranceNumber?: string;
  avatar?: string;
  vitalSigns?: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    weight: number;
    height: number;
  };
}

// Mock Data
const mockPatients: Patient[] = [
  {
    id: "1",
    name: "John Sharma",
    email: "john.sharma@email.com",
    phone: "+91 98765 43210",
    dateOfBirth: "1985-03-15",
    gender: "Male",
    bloodGroup: "O+",
    address: "123 Main Street, Mumbai, Maharashtra 400001",
    status: "active",
    lastVisit: "2024-03-20",
    nextAppointment: "2024-04-10",
    medicalHistory: ["Hypertension", "Type 2 Diabetes"],
    allergies: ["Penicillin", "Peanuts"],
    currentMedications: ["Metformin 500mg", "Lisinopril 10mg"],
    emergencyContact: {
      name: "Sarah Sharma",
      relationship: "Spouse",
      phone: "+91 98765 43211"
    },
    insuranceProvider: "Star Health",
    insuranceNumber: "SH123456789",
    vitalSigns: {
      bloodPressure: "120/80",
      heartRate: 72,
      temperature: 98.6,
      weight: 75,
      height: 175
    }
  },
  {
    id: "2",
    name: "Priya Patel",
    email: "priya.patel@email.com",
    phone: "+91 98765 43212",
    dateOfBirth: "1992-07-22",
    gender: "Female",
    bloodGroup: "A+",
    address: "456 Park Avenue, Delhi, Delhi 110001",
    status: "active",
    lastVisit: "2024-03-25",
    nextAppointment: "2024-04-05",
    medicalHistory: ["Asthma", "Allergic Rhinitis"],
    allergies: ["Dust", "Pollen"],
    currentMedications: ["Inhaler (Salbutamol)"],
    emergencyContact: {
      name: "Raj Patel",
      relationship: "Brother",
      phone: "+91 98765 43213"
    },
    insuranceProvider: "ICICI Lombard",
    insuranceNumber: "ICICI987654321",
    vitalSigns: {
      bloodPressure: "118/76",
      heartRate: 68,
      temperature: 98.4,
      weight: 62,
      height: 165
    }
  },
  {
    id: "3",
    name: "Aisha Khan",
    email: "aisha.khan@email.com",
    phone: "+91 98765 43214",
    dateOfBirth: "1978-11-03",
    gender: "Female",
    bloodGroup: "B+",
    address: "789 Lake View, Bangalore, Karnataka 560001",
    status: "critical",
    lastVisit: "2024-03-28",
    medicalHistory: ["Coronary Artery Disease", "High Cholesterol"],
    allergies: ["Sulfa drugs"],
    currentMedications: ["Atorvastatin 20mg", "Aspirin 75mg"],
    emergencyContact: {
      name: "Mohammed Khan",
      relationship: "Spouse",
      phone: "+91 98765 43215"
    },
    insuranceProvider: "HDFC Ergo",
    insuranceNumber: "HDFC456789123",
    vitalSigns: {
      bloodPressure: "145/90",
      heartRate: 88,
      temperature: 99.1,
      weight: 82,
      height: 162
    }
  },
  {
    id: "4",
    name: "Ravi Patel",
    email: "ravi.patel@email.com",
    phone: "+91 98765 43216",
    dateOfBirth: "1995-01-20",
    gender: "Male",
    bloodGroup: "AB+",
    address: "321 Green Road, Ahmedabad, Gujarat 380001",
    status: "recovered",
    lastVisit: "2024-03-15",
    medicalHistory: ["Fractured Arm"],
    allergies: [],
    currentMedications: [],
    emergencyContact: {
      name: "Suresh Patel",
      relationship: "Father",
      phone: "+91 98765 43217"
    },
    insuranceProvider: "Bajaj Allianz",
    insuranceNumber: "BAJ123456789"
  },
  {
    id: "5",
    name: "Sara Ahmed",
    email: "sara.ahmed@email.com",
    phone: "+91 98765 43218",
    dateOfBirth: "1988-09-12",
    gender: "Female",
    bloodGroup: "O-",
    address: "654 Ocean Drive, Chennai, Tamil Nadu 600001",
    status: "active",
    lastVisit: "2024-03-22",
    nextAppointment: "2024-04-15",
    medicalHistory: ["Migraine", "Anxiety"],
    allergies: ["Latex"],
    currentMedications: ["Sumatriptan 50mg"],
    emergencyContact: {
      name: "Ahmed Khan",
      relationship: "Spouse",
      phone: "+91 98765 43219"
    },
    insuranceProvider: "Star Health",
    insuranceNumber: "SH987654321",
    vitalSigns: {
      bloodPressure: "110/70",
      heartRate: 65,
      temperature: 98.2,
      weight: 58,
      height: 160
    }
  },
  {
    id: "6",
    name: "Arun Mehta",
    email: "arun.mehta@email.com",
    phone: "+91 98765 43220",
    dateOfBirth: "1965-05-30",
    gender: "Male",
    bloodGroup: "B-",
    address: "987 Hill Station, Pune, Maharashtra 411001",
    status: "active",
    lastVisit: "2024-03-18",
    nextAppointment: "2024-04-08",
    medicalHistory: ["Arthritis", "Glaucoma"],
    allergies: ["Ibuprofen"],
    currentMedications: ["Acetaminophen 500mg", "Latanoprost eye drops"],
    emergencyContact: {
      name: "Neha Mehta",
      relationship: "Daughter",
      phone: "+91 98765 43221"
    },
    insuranceProvider: "ICICI Lombard",
    insuranceNumber: "ICICI456789123",
    vitalSigns: {
      bloodPressure: "135/85",
      heartRate: 75,
      temperature: 98.5,
      weight: 70,
      height: 168
    }
  }
];

// Status Badge Component
function StatusBadge({ status }: { status: PatientStatus }) {
  const config = {
    'active': { icon: CheckCircle2, color: "bg-emerald-50 text-emerald-700", label: "Active" },
    'inactive': { icon: Clock, color: "bg-slate-50 text-slate-700", label: "Inactive" },
    'critical': { icon: AlertCircle, color: "bg-red-50 text-red-700", label: "Critical" },
    'recovered': { icon: Star, color: "bg-blue-50 text-blue-700", label: "Recovered" }
  };
  const { icon: Icon, color, label } = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

// Patient Card Component
function PatientCard({ 
  patient, 
  onView, 
  onEdit, 
  onDelete 
}: { 
  patient: Patient; 
  onView: (patient: Patient) => void; 
  onEdit: (patient: Patient) => void; 
  onDelete: (id: string) => void;
}) {
  const calculateAge = (dob: string) => {
    const age = Math.floor((new Date().getTime() - new Date(dob).getTime()) / 31557600000);
    return age;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all group">
      <div className="p-5">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {patient.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-slate-900 text-lg truncate">{patient.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">ID: {patient.id}</p>
              </div>
              <StatusBadge status={patient.status} />
            </div>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
              <span>{calculateAge(patient.dateOfBirth)} years</span>
              <span>•</span>
              <span>{patient.gender}</span>
              <span>•</span>
              <span>{patient.bloodGroup}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600 truncate">{patient.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">{patient.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">Last visit: {new Date(patient.lastVisit).toLocaleDateString()}</span>
          </div>
          {patient.nextAppointment && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-blue-600 font-medium">Next: {new Date(patient.nextAppointment).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        
        {patient.vitalSigns && (
          <div className="bg-slate-50 rounded-lg p-3 mb-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-slate-500">BP</p>
                <p className="text-sm font-semibold text-slate-700">{patient.vitalSigns.bloodPressure}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Heart Rate</p>
                <p className="text-sm font-semibold text-slate-700">{patient.vitalSigns.heartRate}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Temp</p>
                <p className="text-sm font-semibold text-slate-700">{patient.vitalSigns.temperature}°F</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          <button
            onClick={() => onView(patient)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-600 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            View
          </button>
          <button
            onClick={() => onEdit(patient)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-medium text-blue-600 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={() => onDelete(patient.id)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-medium text-red-600 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// Patient Detail Modal
function PatientDetailModal({ 
  patient, 
  isOpen, 
  onClose 
}: { 
  patient: Patient | null; 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'info' | 'medical' | 'vitals'>('info');
  
  if (!isOpen || !patient) return null;
  
  const calculateAge = (dob: string) => {
    return Math.floor((new Date().getTime() - new Date(dob).getTime()) / 31557600000);
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
              {patient.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{patient.name}</h2>
              <p className="text-sm text-slate-500">Patient ID: {patient.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <div className="flex border-b border-slate-100 px-6">
          {(['info', 'medical', 'vitals'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium capitalize transition-all border-b-2 -mb-px ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'info' ? 'Personal Info' : tab === 'medical' ? 'Medical History' : 'Vital Signs'}
            </button>
          ))}
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Personal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-500">Full Name</p>
                      <p className="text-sm text-slate-900">{patient.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Email Address</p>
                      <p className="text-sm text-slate-900">{patient.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Phone Number</p>
                      <p className="text-sm text-slate-900">{patient.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Date of Birth</p>
                      <p className="text-sm text-slate-900">{new Date(patient.dateOfBirth).toLocaleDateString()} ({calculateAge(patient.dateOfBirth)} years)</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Gender</p>
                      <p className="text-sm text-slate-900">{patient.gender}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Blood Group</p>
                      <p className="text-sm text-slate-900">{patient.bloodGroup}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Contact & Insurance</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-500">Address</p>
                      <p className="text-sm text-slate-900">{patient.address}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Emergency Contact</p>
                      <p className="text-sm text-slate-900">{patient.emergencyContact.name} ({patient.emergencyContact.relationship})</p>
                      <p className="text-sm text-slate-600">{patient.emergencyContact.phone}</p>
                    </div>
                    {patient.insuranceProvider && (
                      <>
                        <div>
                          <p className="text-xs text-slate-500">Insurance Provider</p>
                          <p className="text-sm text-slate-900">{patient.insuranceProvider}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Insurance Number</p>
                          <p className="text-sm text-slate-900">{patient.insuranceNumber}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'medical' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Medical History</h3>
                <div className="flex flex-wrap gap-2">
                  {patient.medicalHistory.length > 0 ? (
                    patient.medicalHistory.map((condition, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm">
                        {condition}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No medical history recorded</p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Allergies</h3>
                <div className="flex flex-wrap gap-2">
                  {patient.allergies.length > 0 ? (
                    patient.allergies.map((allergy, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm">
                        {allergy}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No known allergies</p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Current Medications</h3>
                <div className="space-y-2">
                  {patient.currentMedications.length > 0 ? (
                    patient.currentMedications.map((med, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                        <Pill className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-slate-700">{med}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No current medications</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'vitals' && patient.vitalSigns && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-5 h-5 text-red-500" />
                    <h3 className="font-semibold text-slate-900">Blood Pressure</h3>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{patient.vitalSigns.bloodPressure}</p>
                  <p className="text-xs text-slate-500 mt-1">mmHg</p>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold text-slate-900">Heart Rate</h3>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{patient.vitalSigns.heartRate}</p>
                  <p className="text-xs text-slate-500 mt-1">bpm</p>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Thermometer className="w-5 h-5 text-orange-500" />
                    <h3 className="font-semibold text-slate-900">Temperature</h3>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{patient.vitalSigns.temperature}°F</p>
                  <p className="text-xs text-slate-500 mt-1">Fahrenheit</p>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="w-5 h-5 text-green-500" />
                    <h3 className="font-semibold text-slate-900">BMI</h3>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    {(patient.vitalSigns.weight / ((patient.vitalSigns.height / 100) ** 2)).toFixed(1)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {patient.vitalSigns.weight} kg / {patient.vitalSigns.height} cm
                  </p>
                </div>
              </div>
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
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Schedule Appointment
          </button>
        </div>
      </div>
    </div>
  );
}

// Add/Edit Patient Modal
function PatientModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (data: any) => void; 
  initialData?: Patient | null;
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    dateOfBirth: initialData?.dateOfBirth || "",
    gender: initialData?.gender || "Male",
    bloodGroup: initialData?.bloodGroup || "O+",
    address: initialData?.address || "",
    emergencyContactName: initialData?.emergencyContact.name || "",
    emergencyContactRelationship: initialData?.emergencyContact.relationship || "",
    emergencyContactPhone: initialData?.emergencyContact.phone || "",
    insuranceProvider: initialData?.insuranceProvider || "",
    insuranceNumber: initialData?.insuranceNumber || "",
  });
  
  if (!isOpen) return null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      emergencyContact: {
        name: formData.emergencyContactName,
        relationship: formData.emergencyContactRelationship,
        phone: formData.emergencyContactPhone,
      },
      status: "active",
      lastVisit: new Date().toISOString().split('T')[0],
      medicalHistory: [],
      allergies: [],
      currentMedications: [],
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {initialData ? "Edit Patient" : "Add New Patient"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Phone *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Date of Birth *
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Blood Group
              </label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
          </div>
          
          <div className="border-t border-slate-100 pt-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.emergencyContactName}
                  onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Relationship
                </label>
                <input
                  type="text"
                  value={formData.emergencyContactRelationship}
                  onChange={(e) => setFormData({ ...formData, emergencyContactRelationship: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-100 pt-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Insurance Information (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Insurance Provider
                </label>
                <input
                  type="text"
                  value={formData.insuranceProvider}
                  onChange={(e) => setFormData({ ...formData, insuranceProvider: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Insurance Number
                </label>
                <input
                  type="text"
                  value={formData.insuranceNumber}
                  onChange={(e) => setFormData({ ...formData, insuranceNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {initialData ? "Update Patient" : "Add Patient"}
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
export default function AdminPatients() {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [genderFilter, setGenderFilter] = useState<string>("All");
  const [bloodGroupFilter, setBloodGroupFilter] = useState<string>("All");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  
  // Filter patients
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          patient.phone.includes(searchQuery);
    const matchesStatus = statusFilter === "All" || patient.status === statusFilter;
    const matchesGender = genderFilter === "All" || patient.gender === genderFilter;
    const matchesBloodGroup = bloodGroupFilter === "All" || patient.bloodGroup === bloodGroupFilter;
    return matchesSearch && matchesStatus && matchesGender && matchesBloodGroup;
  });
  
  // Pagination
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const stats = {
    total: patients.length,
    active: patients.filter(p => p.status === "active").length,
    critical: patients.filter(p => p.status === "critical").length,
    recovered: patients.filter(p => p.status === "recovered").length,
  };
  
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this patient?")) {
      setPatients(patients.filter(p => p.id !== id));
    }
  };
  
  const handleAddPatient = (data: any) => {
    const newPatient: Patient = {
      id: `${Date.now()}`,
      ...data,
      status: "active",
      lastVisit: new Date().toISOString().split('T')[0],
      medicalHistory: [],
      allergies: [],
      currentMedications: [],
    };
    setPatients([newPatient, ...patients]);
    setShowAddModal(false);
  };
  
  const handleEditPatient = (data: any) => {
    if (selectedPatient) {
      const updatedPatients = patients.map(p =>
        p.id === selectedPatient.id
          ? { ...p, ...data }
          : p
      );
      setPatients(updatedPatients);
      setSelectedPatient(null);
      setShowEditModal(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Patients</h1>
            <p className="text-sm text-slate-500 mt-1">Manage patient records and medical information</p>
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
              <UserPlus className="w-4 h-4" />
              Add Patient
            </button>
          </div>
        </div>
        
        {/* Stats Cards */}
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
            <p className="text-sm text-slate-500">Critical</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-5 h-5 text-blue-500" />
              <span className="text-2xl font-bold text-slate-900">{stats.recovered}</span>
            </div>
            <p className="text-sm text-slate-500">Recovered</p>
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="critical">Critical</option>
              <option value="recovered">Recovered</option>
            </select>
            <select
              value={genderFilter}
              onChange={(e) => {
                setGenderFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <select
              value={bloodGroupFilter}
              onChange={(e) => {
                setBloodGroupFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="All">All Blood Groups</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
        </div>
        
        {/* Patients Grid */}
        {paginatedPatients.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedPatients.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onView={(p) => {
                    setSelectedPatient(p);
                    setShowDetailModal(true);
                  }}
                  onEdit={(p) => {
                    setSelectedPatient(p);
                    setShowEditModal(true);
                  }}
                  onDelete={handleDelete}
                />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-white rounded-xl border border-slate-100 px-4 py-3">
                <p className="text-sm text-slate-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredPatients.length)} of{" "}
                  {filteredPatients.length} results
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
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-lg font-medium">No patients found</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
      
      {/* Modals */}
      <PatientDetailModal
        patient={selectedPatient}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedPatient(null);
        }}
      />
      
      <PatientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddPatient}
      />
      
      <PatientModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedPatient(null);
        }}
        onSubmit={handleEditPatient}
        initialData={selectedPatient}
      />
    </div>
  );
}