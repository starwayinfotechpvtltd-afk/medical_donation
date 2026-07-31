'use client';

import { Patient, Doctor, Nurse, Prescription, LabReport, Appointment } from '../types';
import { 
  User, Phone, Mail, MapPin, Calendar, Heart, 
  Stethoscope, ClipboardList, FileText, Activity,
  ArrowLeft
} from 'lucide-react';

interface PatientDetailsTabProps {
  patient: Patient | null;
  doctors: Doctor[];
  nurses: Nurse[];
  prescriptions: Prescription[];
  labReports: LabReport[];
  appointments: Appointment[];
  onBack: () => void;
  getStatusColor: (status: string) => string;
}

export default function PatientDetailsTab({ 
  patient, 
  doctors, 
  nurses, 
  prescriptions, 
  labReports, 
  appointments,
  onBack,
  getStatusColor 
}: PatientDetailsTabProps) {
  
  if (!patient) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900">Patient not found</h3>
        <button onClick={onBack} className="mt-4 text-blue-600 hover:text-blue-700">
          Go back to patient list
        </button>
      </div>
    );
  }

  const patientPrescriptions = prescriptions.filter(p => p.patientId === patient.id);
  const patientLabReports = labReports.filter(l => l.patientId === patient.id);
  const patientAppointments = appointments.filter(a => a.patientId === patient.id);
  const assignedDoctor = doctors.find(d => d.id === patient.assignedDoctorId);
  const assignedNurse = nurses.find(n => n.id === patient.assignedNurseId);

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-gray-900">Patient Details</h2>
      </div>

      {/* Patient Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold">
            {patient.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
                <p className="text-gray-500">Patient ID: {patient.id}</p>
              </div>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(patient.status)}`}>
                {patient.status}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <p className="text-xs text-gray-500">Age / Gender</p>
                <p className="text-sm font-medium text-gray-900">{patient.age} / {patient.gender}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Blood Group</p>
                <p className="text-sm font-medium text-gray-900">{patient.bloodGroup}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Registration Date</p>
                <p className="text-sm font-medium text-gray-900">{patient.registrationDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Last Visit</p>
                <p className="text-sm font-medium text-gray-900">{patient.lastVisit || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact & Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">{patient.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">{patient.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">{patient.address}</span>
            </div>
          </div>
          {patient.emergencyContact.name && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-700">Emergency Contact</p>
              <p className="text-sm text-gray-600">{patient.emergencyContact.name} ({patient.emergencyContact.relationship})</p>
              <p className="text-sm text-gray-600">{patient.emergencyContact.phone}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned Staff</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Assigned Doctor</p>
              {assignedDoctor ? (
                <div className="flex items-center gap-3 mt-1">
                  <Stethoscope className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-gray-900">{assignedDoctor.name}</span>
                  <span className="text-sm text-gray-500">({assignedDoctor.specialty})</span>
                </div>
              ) : (
                <p className="text-sm text-gray-400">Not assigned</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500">Assigned Nurse</p>
              {assignedNurse ? (
                <div className="flex items-center gap-3 mt-1">
                  <Heart className="w-4 h-4 text-red-600" />
                  <span className="font-medium text-gray-900">{assignedNurse.name}</span>
                  <span className="text-sm text-gray-500">({assignedNurse.specialization})</span>
                </div>
              ) : (
                <p className="text-sm text-gray-400">Not assigned</p>
              )}
            </div>
            {patient.roomNumber && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                <p className="text-sm text-gray-500">Room / Bed</p>
                <p className="text-sm font-medium text-gray-900">Room {patient.roomNumber} • Bed {patient.bedNumber}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Medical History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical History</h3>
        {patient.medicalHistory.length > 0 ? (
          <div className="space-y-3">
            {patient.medicalHistory.map((history) => (
              <div key={history.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{history.condition}</p>
                  <p className="text-sm text-gray-500">Diagnosed: {history.diagnosedDate}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  history.status === 'active' ? 'bg-yellow-100 text-yellow-800' :
                  history.status === 'chronic' ? 'bg-orange-100 text-orange-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {history.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No medical history recorded</p>
        )}
        {patient.allergies.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-700">Allergies</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {patient.allergies.map((allergy, idx) => (
                <span key={idx} className="px-2 py-1 bg-red-100 text-red-700 text-sm rounded">
                  {allergy}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Prescriptions, Lab Reports, Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Prescriptions</h3>
          {patientPrescriptions.length > 0 ? (
            <div className="space-y-3">
              {patientPrescriptions.slice(0, 3).map((prescription) => (
                <div key={prescription.id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">{prescription.doctorName}</p>
                  <p className="text-sm text-gray-500">{prescription.date}</p>
                  <p className="text-sm text-gray-600">{prescription.medications.length} medications</p>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(prescription.status)}`}>
                    {prescription.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No prescriptions</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Lab Reports</h3>
          {patientLabReports.length > 0 ? (
            <div className="space-y-3">
              {patientLabReports.slice(0, 3).map((report) => (
                <div key={report.id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">{report.testName}</p>
                  <p className="text-sm text-gray-500">{report.orderedDate}</p>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No lab reports</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Appointments</h3>
          {patientAppointments.length > 0 ? (
            <div className="space-y-3">
              {patientAppointments.slice(0, 3).map((appointment) => (
                <div key={appointment.id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">{appointment.doctorName}</p>
                  <p className="text-sm text-gray-500">{appointment.date} at {appointment.time}</p>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                  {appointment.followUpDate && (
                    <p className="text-xs text-blue-600 mt-1">Follow-up: {appointment.followUpDate}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No appointments</p>
          )}
        </div>
      </div>
    </>
  );
}
