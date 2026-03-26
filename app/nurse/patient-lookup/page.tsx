'use client';

import { useState } from 'react';
import { Search, User, Heart, AlertCircle, Phone, MapPin } from 'lucide-react';

const patientDatabase = [
  { id: 'P001', name: 'John Sharma', age: 45, ward: 'Ward A-101', doctor: 'Dr. Rajesh Kumar', bloodType: 'O+', phone: '9876543210', status: 'Admitted' },
  { id: 'P002', name: 'Priya Patel', age: 32, ward: 'Ward B-205', doctor: 'Dr. Anjali Singh', bloodType: 'AB+', phone: '9876543211', status: 'Admitted' },
  { id: 'P003', name: 'Amit Kumar', age: 58, ward: 'Ward C-312', doctor: 'Dr. Rajesh Kumar', bloodType: 'B+', phone: '9876543212', status: 'Critical' },
];

export default function PatientLookupPage() {
  const [searchId, setSearchId] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<typeof patientDatabase[0] | null>(null);

  const handleSearch = (id: string) => {
    const patient = patientDatabase.find(p => p.id.toLowerCase() === id.toLowerCase());
    setSelectedPatient(patient || null);
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-sky-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Patient Lookup</h1>
          <p className="text-slate-600">Search patient by ID to view details and vitals</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3 text-blue-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter Patient ID (e.g., P001)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full pl-12 pr-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <button onClick={() => handleSearch(searchId)} className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors">
              Search
            </button>
          </div>
        </div>

        {/* Patient Details */}
        {selectedPatient ? (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-4 rounded-lg">
                      <User className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900">{selectedPatient.name}</h2>
                      <p className="text-slate-600">ID: {selectedPatient.id}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full font-semibold text-sm ${selectedPatient.status === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {selectedPatient.status}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6 border-t border-blue-100 pt-6">
                  <div>
                    <p className="text-slate-600 text-sm mb-1">Age</p>
                    <p className="text-2xl font-bold text-slate-900">{selectedPatient.age} years</p>
                  </div>
                  <div>
                    <p className="text-slate-600 text-sm mb-1">Blood Type</p>
                    <p className="text-2xl font-bold text-slate-900">{selectedPatient.bloodType}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 text-sm mb-1">Ward</p>
                    <p className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      {selectedPatient.ward}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600 text-sm mb-1">Contact</p>
                    <p className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-blue-500" />
                      {selectedPatient.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vitals */}
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Current Vitals</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { label: 'Heart Rate', value: '78', unit: 'bpm' },
                    { label: 'Blood Pressure', value: '120/80', unit: 'mmHg' },
                    { label: 'Temperature', value: '98.6', unit: '°F' },
                    { label: 'O2 Saturation', value: '98', unit: '%' },
                  ].map((vital, idx) => (
                    <div key={idx} className="bg-blue-50 rounded-lg p-4">
                      <p className="text-slate-600 text-sm mb-2">{vital.label}</p>
                      <p className="text-2xl font-bold text-slate-900">{vital.value}</p>
                      <p className="text-slate-500 text-xs mt-1">{vital.unit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Assigned Doctor */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Assigned Doctor</h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <p className="font-bold text-slate-900">{selectedPatient.doctor}</p>
                <p className="text-slate-600 text-sm mt-1">Cardiology</p>
              </div>
            </div>
          </div>
        ) : searchId ? (
          <div className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-slate-900 font-semibold text-lg">Patient Not Found</p>
            <p className="text-slate-600">Please check the patient ID and try again</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center">
            <Search className="w-12 h-12 text-blue-300 mx-auto mb-4" />
            <p className="text-slate-600">Enter a patient ID to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
