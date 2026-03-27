// admin/appointments/page.tsx
'use client';

import { useState } from "react";
import { mockAppointments } from "@/data/appointments";
import { type Appointment } from "@/data/appointments";
import { 
  Eye, Edit2, Calendar, Clock, Search, Filter, 
  ChevronDown, ChevronLeft, ChevronRight, X,
  CheckCircle2, Clock as ClockIcon, XCircle,
  User, Stethoscope, Activity, Download, Printer,
  MoreHorizontal, CalendarDays, RefreshCw
} from "lucide-react";

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const config = {
    Approved: { icon: CheckCircle2, color: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Approved" },
    Pending: { icon: ClockIcon, color: "bg-amber-50 text-amber-700 border-amber-200", label: "Pending" },
    Cancelled: { icon: XCircle, color: "bg-red-50 text-red-700 border-red-200", label: "Cancelled" }
  };
  const { icon: Icon, color, label } = config[status as keyof typeof config] || config.Pending;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

// Appointment Card Component for Mobile View
function AppointmentCard({ 
  appointment, 
  onUpdate 
}: { 
  appointment: Appointment; 
  onUpdate: (apt: Appointment) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
            {appointment.patientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{appointment.patientName}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-slate-500">{appointment.doctor}</span>
              <span className="text-xs text-slate-300">•</span>
              <span className="text-xs text-slate-500">{appointment.department}</span>
            </div>
          </div>
        </div>
        <StatusBadge status={appointment.status} />
      </div>
      
      <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>{appointment.date}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>{appointment.time}</span>
        </div>
      </div>
      
      <button
        onClick={() => onUpdate(appointment)}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-700 transition-colors"
      >
        <Edit2 className="w-3.5 h-3.5" />
        Update Status
      </button>
    </div>
  );
}

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter appointments
  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus = statusFilter === "All" || apt.status === statusFilter;
    const matchesSearch = searchQuery === "" || 
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAppointments = filteredAppointments.slice(startIndex, startIndex + itemsPerPage);

  const handleStatusChange = (id: string, newStatus: "Pending" | "Approved" | "Cancelled") => {
    setAppointments(
      appointments.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );
    setSelectedAppointment(null);
  };

  const stats = {
    total: appointments.length,
    approved: appointments.filter(a => a.status === "Approved").length,
    pending: appointments.filter(a => a.status === "Pending").length,
    cancelled: appointments.filter(a => a.status === "Cancelled").length,
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
            <p className="text-sm text-slate-500 mt-1">Manage and track patient appointments</p>
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
            <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
              <CalendarDays className="w-4 h-4" />
              New Appointment
            </button>
          </div>
        </div>

        {/* Stats Cards */}
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
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="text-2xl font-bold text-slate-900">{stats.approved}</span>
            </div>
            <p className="text-sm text-slate-500">Approved</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <ClockIcon className="w-5 h-5 text-amber-500" />
              <span className="text-2xl font-bold text-slate-900">{stats.pending}</span>
            </div>
            <p className="text-sm text-slate-500">Pending</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-2xl font-bold text-slate-900">{stats.cancelled}</span>
            </div>
            <p className="text-sm text-slate-500">Cancelled</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by patient, doctor, or department..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
              {["All", "Pending", "Approved", "Cancelled"].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                    statusFilter === status
                      ? status === "Approved"
                        ? "bg-emerald-500 text-white"
                        : status === "Pending"
                        ? "bg-amber-500 text-white"
                        : status === "Cancelled"
                        ? "bg-red-500 text-white"
                        : "bg-blue-500 text-white"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedAppointments.map((apt) => (
                  <tr key={apt.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                          {apt.patientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="text-sm font-medium text-slate-900">{apt.patientName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{apt.department}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{apt.doctor}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{apt.date}</span>
                        <Clock className="w-3.5 h-3.5 text-slate-400 ml-1" />
                        <span>{apt.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={apt.status} />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedAppointment(apt)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-3">
          {paginatedAppointments.map((apt) => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              onUpdate={setSelectedAppointment}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredAppointments.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-lg font-medium">No appointments found</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Pagination */}
        {filteredAppointments.length > 0 && (
          <div className="flex items-center justify-between bg-white rounded-xl border border-slate-100 px-4 py-3">
            <p className="text-sm text-slate-500">
              Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(startIndex + itemsPerPage, filteredAppointments.length)}
              </span>{" "}
              of <span className="font-medium">{filteredAppointments.length}</span> results
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
      </div>

      {/* Modal for updating status */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedAppointment(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Update Appointment Status</h2>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                  {selectedAppointment.patientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{selectedAppointment.patientName}</p>
                  <p className="text-sm text-slate-500">{selectedAppointment.doctor}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{selectedAppointment.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{selectedAppointment.time}</span>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-sm text-slate-500">Department:</span>
                <span className="text-sm text-slate-700 ml-2">{selectedAppointment.department}</span>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <p className="text-sm font-medium text-slate-700 mb-2">Select new status:</p>
              {["Pending", "Approved", "Cancelled"].map((status) => (
                <button
                  key={status}
                  onClick={() =>
                    handleStatusChange(
                      selectedAppointment.id,
                      status as "Pending" | "Approved" | "Cancelled"
                    )
                  }
                  className={`w-full px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                    selectedAppointment.status === status
                      ? status === "Approved"
                        ? "bg-emerald-500 text-white"
                        : status === "Pending"
                        ? "bg-amber-500 text-white"
                        : "bg-red-500 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <button
              onClick={() => setSelectedAppointment(null)}
              className="w-full bg-slate-100 text-slate-700 px-4 py-3 rounded-lg font-medium hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}