"use client";

import { useState } from "react";
import { mockAppointments } from "@/data/appointments";
import { type Appointment } from "@/data/appointments";
import { Eye, Edit2 } from "lucide-react";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const filteredAppointments =
    statusFilter === "All"
      ? appointments
      : appointments.filter((apt) => apt.status === statusFilter);

  const handleStatusChange = (id: string, newStatus: "Pending" | "Approved" | "Cancelled") => {
    setAppointments(
      appointments.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );
    setSelectedAppointment(null);
  };

  return (
    <main className="bg-slate-900 min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900">Appointments</h1>
            <div className="flex gap-2">
              {["All", "Pending", "Approved", "Cancelled"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    statusFilter === status
                      ? "bg-emerald-500 text-white"
                      : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Appointments Table */}
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Patient Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Doctor
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                      {apt.patientName}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{apt.department}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{apt.doctor}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {apt.date} {apt.time}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          apt.status === "Approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : apt.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => setSelectedAppointment(apt)}
                        className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAppointments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">No appointments found.</p>
            </div>
          )}
        </div>

        {/* Modal for updating status */}
        {selectedAppointment && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Update Appointment Status</h2>

              <div className="bg-slate-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-slate-600 mb-1">Patient: {selectedAppointment.patientName}</p>
                <p className="text-sm text-slate-600 mb-1">
                  Doctor: {selectedAppointment.doctor}
                </p>
                <p className="text-sm text-slate-600">
                  Date: {selectedAppointment.date} {selectedAppointment.time}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {["Pending", "Approved", "Cancelled"].map((status) => (
                  <button
                    key={status}
                    onClick={() =>
                      handleStatusChange(
                        selectedAppointment.id,
                        status as "Pending" | "Approved" | "Cancelled"
                      )
                    }
                    className={`w-full px-4 py-3 rounded-lg font-medium text-sm transition-colors ${
                      selectedAppointment.status === status
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setSelectedAppointment(null)}
                className="w-full bg-slate-300 text-slate-700 px-4 py-3 rounded-lg font-medium hover:bg-slate-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
    </main>
  );
}
