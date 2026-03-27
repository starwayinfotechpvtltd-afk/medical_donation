// app/doctor/appointments/page.tsx
'use client';

import { useState } from 'react';
import {
  Calendar, Clock, User, Stethoscope, MapPin,
  Search, Filter, Eye, Edit2, CheckCircle2,
  XCircle, Clock as ClockIcon, ChevronLeft,
  ChevronRight, Download, Printer, MessageSquare,
  Video, Phone, MoreHorizontal, AlertCircle
} from 'lucide-react';

// Mock Appointments Data
const mockAppointments = [
  {
    id: 'APT001',
    patientName: 'John Sharma',
    patientId: 'P001',
    date: '2024-03-27',
    time: '09:00 AM',
    duration: 30,
    type: 'Follow-up',
    status: 'confirmed',
    mode: 'in-person',
    reason: 'Hypertension follow-up',
    notes: 'Patient has been taking medication regularly',
    vitals: { bp: '120/80', hr: 72, temp: '98.6' }
  },
  {
    id: 'APT002',
    patientName: 'Priya Patel',
    patientId: 'P002',
    date: '2024-03-27',
    time: '10:30 AM',
    duration: 45,
    type: 'Consultation',
    status: 'waiting',
    mode: 'in-person',
    reason: 'Diabetes management review',
    notes: 'HbA1c results pending'
  },
  {
    id: 'APT003',
    patientName: 'Aisha Khan',
    patientId: 'P003',
    date: '2024-03-27',
    time: '11:45 AM',
    duration: 60,
    type: 'Test Review',
    status: 'confirmed',
    mode: 'video',
    reason: 'ECG and Echo results review',
    notes: 'Critical case - needs immediate attention'
  },
  {
    id: 'APT004',
    patientName: 'Ravi Patel',
    patientId: 'P004',
    date: '2024-03-27',
    time: '02:00 PM',
    duration: 30,
    type: 'New Patient',
    status: 'confirmed',
    mode: 'in-person',
    reason: 'First consultation for migraine',
    notes: 'Has history of severe headaches'
  },
  {
    id: 'APT005',
    patientName: 'Sara Ahmed',
    patientId: 'P005',
    date: '2024-03-27',
    time: '03:30 PM',
    duration: 30,
    type: 'Follow-up',
    status: 'cancelled',
    mode: 'phone',
    reason: 'Asthma medication review',
    notes: 'Patient requested reschedule'
  },
  {
    id: 'APT006',
    patientName: 'Arun Mehta',
    patientId: 'P006',
    date: '2024-03-28',
    time: '09:30 AM',
    duration: 45,
    type: 'Consultation',
    status: 'confirmed',
    mode: 'in-person',
    reason: 'Arthritis pain management'
  },
  {
    id: 'APT007',
    patientName: 'Neha Gupta',
    patientId: 'P007',
    date: '2024-03-28',
    time: '11:00 AM',
    duration: 30,
    type: 'Follow-up',
    status: 'pending',
    mode: 'video',
    reason: 'Post-surgery checkup'
  }
];

function StatusBadge({ status }: { status: string }) {
  const config = {
    confirmed: 'bg-emerald-100 text-emerald-700',
    waiting: 'bg-amber-100 text-amber-700',
    pending: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-slate-100 text-slate-700'
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config[status as keyof typeof config]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function AppointmentCard({ appointment, onView, onUpdate }: any) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
            {appointment.patientName.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{appointment.patientName}</h3>
            <p className="text-xs text-slate-500">ID: {appointment.patientId}</p>
          </div>
        </div>
        <StatusBadge status={appointment.status} />
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600">{new Date(appointment.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600">{appointment.time} ({appointment.duration} min)</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <User className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600 capitalize">{appointment.type}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {appointment.mode === 'video' ? <Video className="w-4 h-4 text-blue-500" /> : 
           appointment.mode === 'phone' ? <Phone className="w-4 h-4 text-green-500" /> :
           <MapPin className="w-4 h-4 text-orange-500" />}
          <span className="text-slate-600 capitalize">{appointment.mode}</span>
        </div>
      </div>
      
      <p className="text-sm text-slate-600 mb-3 line-clamp-2">{appointment.reason}</p>
      
      <div className="flex gap-2 pt-2 border-t border-slate-100">
        <button
          onClick={() => onView(appointment)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-600 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          View
        </button>
        <button
          onClick={() => onUpdate(appointment)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-medium text-blue-600 transition-colors"
        >
          <Edit2 className="w-3.5 h-3.5" />
          Update
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-sm font-medium text-emerald-600 transition-colors">
          <MessageSquare className="w-3.5 h-3.5" />
          Message
        </button>
      </div>
    </div>
  );
}

function AppointmentDetailModal({ appointment, onClose, onUpdateStatus }: any) {
  if (!appointment) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Appointment Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
            <XCircle className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
              {appointment.patientName.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{appointment.patientName}</h3>
              <p className="text-sm text-slate-500">Patient ID: {appointment.patientId}</p>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={appointment.status} />
                <span className="text-sm text-slate-500 capitalize">{appointment.mode} consultation</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-2">Date & Time</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-900">{new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-900">{appointment.time} ({appointment.duration} minutes)</span>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-2">Appointment Type</p>
              <p className="text-sm font-medium text-slate-900 capitalize">{appointment.type}</p>
              <p className="text-xs text-slate-500 mt-1">Consultation</p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-2">Reason for Visit</p>
              <p className="text-sm text-slate-900">{appointment.reason}</p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-2">Doctor's Notes</p>
              <p className="text-sm text-slate-900">{appointment.notes || 'No notes added yet'}</p>
            </div>
          </div>
          
          {appointment.vitals && (
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-2">Vital Signs (Last Visit)</p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Blood Pressure</p>
                  <p className="text-sm font-semibold text-slate-900">{appointment.vitals.bp}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Heart Rate</p>
                  <p className="text-sm font-semibold text-slate-900">{appointment.vitals.hr} bpm</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Temperature</p>
                  <p className="text-sm font-semibold text-slate-900">{appointment.vitals.temp}°F</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex gap-3">
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
              Start Consultation
            </button>
            <button className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700">
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Send Reminder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('Today');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const today = new Date().toISOString().split('T')[0];
  
  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          apt.patientId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || apt.status === statusFilter.toLowerCase();
    let matchesDate = true;
    if (dateFilter === 'Today') matchesDate = apt.date === today;
    if (dateFilter === 'Upcoming') matchesDate = apt.date >= today && apt.status !== 'cancelled';
    if (dateFilter === 'Past') matchesDate = apt.date < today;
    return matchesSearch && matchesStatus && matchesDate;
  });
  
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const stats = {
    total: appointments.length,
    today: appointments.filter(a => a.date === today).length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    waiting: appointments.filter(a => a.status === 'waiting').length,
  };
  
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your patient appointments</p>
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
            <Calendar className="w-5 h-5 text-blue-500" />
            <span className="text-2xl font-bold text-slate-900">{stats.total}</span>
          </div>
          <p className="text-sm text-slate-500">Total Appointments</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <ClockIcon className="w-5 h-5 text-emerald-500" />
            <span className="text-2xl font-bold text-slate-900">{stats.today}</span>
          </div>
          <p className="text-sm text-slate-500">Today</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="text-2xl font-bold text-slate-900">{stats.confirmed}</span>
          </div>
          <p className="text-sm text-slate-500">Confirmed</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <span className="text-2xl font-bold text-slate-900">{stats.waiting}</span>
          </div>
          <p className="text-sm text-slate-500">Waiting</p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by patient name or ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <select
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="Today">Today</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Past">Past</option>
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
            <option value="confirmed">Confirmed</option>
            <option value="waiting">Waiting</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      
      {/* Appointments Grid */}
      {paginatedAppointments.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedAppointments.map((apt) => (
              <AppointmentCard
                key={apt.id}
                appointment={apt}
                onView={(a: any) => {
                  setSelectedAppointment(a);
                  setShowDetailModal(true);
                }}
                onUpdate={(a: any) => console.log('Update', a)}
              />
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-xl border border-slate-100 px-4 py-3">
              <p className="text-sm text-slate-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredAppointments.length)} of{' '}
                {filteredAppointments.length} appointments
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
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-lg font-medium">No appointments found</p>
          <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filter criteria</p>
        </div>
      )}
      
      {/* Appointment Detail Modal */}
      <AppointmentDetailModal
        appointment={selectedAppointment}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedAppointment(null);
        }}
        onUpdateStatus={(id: string, status: string) => {
          setAppointments(appointments.map(a => 
            a.id === id ? { ...a, status } : a
          ));
        }}
      />
    </div>
  );
}