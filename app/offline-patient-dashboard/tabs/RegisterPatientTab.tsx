'use client';

import { useState } from 'react';
import { Patient, Department, Doctor, Token, Appointment } from '../types';
import { Save, X, UserPlus } from 'lucide-react';
import type { OfflineIntakePayload } from '@/lib/offline-patient-api';

interface RegisterPatientTabProps {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  departments: Department[];
  doctors: Doctor[];
  tokens: Token[];
  setTokens: React.Dispatch<React.SetStateAction<Token[]>>;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  onRegister: (payload: OfflineIntakePayload) => Promise<{ token_number: string }>;
}

export default function RegisterPatientTab({ 
  patients, 
  setPatients,
  departments,
  doctors,
  tokens,
  setTokens,
  appointments,
  setAppointments,
  onRegister
}: RegisterPatientTabProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'M' as 'M' | 'F' | 'O',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    medicalHistory: '',
    allergies: '',
    department: '',
    doctorId: '',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: new Date().toTimeString().slice(0, 5),
    symptoms: '',
    purpose: '',
    priority: 'normal' as 'normal' | 'urgent' | 'emergency'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await onRegister({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email || undefined,
        phone: formData.phone,
        date_of_birth: formData.dateOfBirth || undefined,
        gender: formData.gender,
        address: formData.address || undefined,
        emergency_contact: formData.emergencyContactName || undefined,
        emergency_phone: formData.emergencyContactPhone || undefined,
        chronic_conditions: formData.medicalHistory || undefined,
        allergies: formData.allergies || undefined,
        department_id: Number(formData.department),
        doctor_profile_id: Number(formData.doctorId),
        scheduled_date: formData.scheduledDate,
        scheduled_time: formData.scheduledTime,
        purpose: formData.purpose,
        symptoms: formData.symptoms || undefined,
        priority: formData.priority,
      });

      setSuccessMessage(`Patient registered successfully. Token: ${result.token_number}`);
    } finally {
      setIsSubmitting(false);
    }

    // Reset form
    setTimeout(() => {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: 'M',
        address: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelationship: '',
        medicalHistory: '',
        allergies: '',
        department: '',
        doctorId: '',
        scheduledDate: new Date().toISOString().split('T')[0],
        scheduledTime: new Date().toTimeString().slice(0, 5),
        symptoms: '',
        purpose: '',
        priority: 'normal'
      });
      setSuccessMessage('');
    }, 3000);
  };

  const filteredDoctors = formData.department 
    ? doctors.filter(d => d.availability === 'available' && (!d.departmentIds?.length || d.departmentIds.includes(formData.department)))
    : [];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Register New Patient</h2>
          <p className="text-gray-600">Register a walk-in patient and generate token</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="p-6">
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {successMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="First name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Last name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
              <select
                required
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value as 'M' | 'F' | 'O'})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter address"
              />
            </div>

            {/* Emergency Contact */}
            <div className="col-span-2 mt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
              <input
                type="text"
                value={formData.emergencyContactName}
                onChange={(e) => setFormData({...formData, emergencyContactName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Emergency contact name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
              <input
                type="text"
                value={formData.emergencyContactPhone}
                onChange={(e) => setFormData({...formData, emergencyContactPhone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Emergency contact phone"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
              <input
                type="text"
                value={formData.emergencyContactRelationship}
                onChange={(e) => setFormData({...formData, emergencyContactRelationship: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Relationship"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medical History (comma separated)</label>
              <input
                type="text"
                value={formData.medicalHistory}
                onChange={(e) => setFormData({...formData, medicalHistory: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Diabetes, Hypertension"
              />
            </div>

            {/* Appointment Details */}
            <div className="col-span-2 mt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
              <select
                required
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value, doctorId: ''})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Doctor *</label>
              <select
                required
                value={formData.doctorId}
                onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={!formData.department}
              >
                <option value="">Select Doctor</option>
                {filteredDoctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>{doctor.name} - {doctor.specialty}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Date *</label>
              <input
                type="date"
                required
                value={formData.scheduledDate}
                onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Time *</label>
              <input
                type="time"
                required
                value={formData.scheduledTime}
                onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Purpose of Visit *</label>
              <input
                type="text"
                required
                value={formData.purpose}
                onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Reason for visit"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms</label>
              <textarea
                rows={3}
                value={formData.symptoms}
                onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Describe symptoms..."
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  firstName: '',
                  lastName: '',
                  email: '',
                  phone: '',
                  dateOfBirth: '',
                  gender: 'M',
                  address: '',
                  emergencyContactName: '',
                  emergencyContactPhone: '',
                  emergencyContactRelationship: '',
                  medicalHistory: '',
                  allergies: '',
                  department: '',
                  doctorId: '',
                  scheduledDate: new Date().toISOString().split('T')[0],
                  scheduledTime: new Date().toTimeString().slice(0, 5),
                  symptoms: '',
                  purpose: '',
                  priority: 'normal'
                });
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              {isSubmitting ? 'Registering...' : 'Register Patient & Generate Token'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
