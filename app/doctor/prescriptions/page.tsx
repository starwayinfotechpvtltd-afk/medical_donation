'use client';

import { useState } from 'react';
import { doctorPatients } from '@/data/doctorProfiles';
import { FileText, Save } from 'lucide-react';

export default function DoctorPrescriptionsPage() {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [prescription, setPrescription] = useState('');
  const [medicines, setMedicines] = useState<Array<{ name: string; dosage: string; duration: string }>>([
    { name: '', dosage: '', duration: '' }
  ]);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const addMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', duration: '' }]);
  };

  const removeMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const updateMedicine = (index: number, field: string, value: string) => {
    const updated = [...medicines];
    updated[index] = { ...updated[index], [field]: value };
    setMedicines(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setSelectedPatient('');
    setMedicines([{ name: '', dosage: '', duration: '' }]);
    setNotes('');
  };

  return (
    <main className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Create Prescription</h1>

        {submitted && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-green-700">
            Prescription created successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg border border-slate-700 p-8">
          {/* Patient Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-300 mb-3">Select Patient</label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a patient...</option>
              {doctorPatients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} - {patient.condition}
                </option>
              ))}
            </select>
          </div>

          {/* Medicines */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-300 mb-3">Medicines</label>
            <div className="space-y-4">
              {medicines.map((medicine, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                  <input
                    type="text"
                    placeholder="Medicine name"
                    value={medicine.name}
                    onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                    className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Dosage (e.g., 500mg, 2x daily)"
                    value={medicine.dosage}
                    onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                    className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g., 7 days)"
                    value={medicine.duration}
                    onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                    className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {medicines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedicine(index)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addMedicine}
              className="mt-4 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm"
            >
              + Add Medicine
            </button>
          </div>

          {/* Additional Notes */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-300 mb-3">Additional Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions or observations..."
              rows={4}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedPatient}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Create & Send Prescription
          </button>
        </form>
      </div>
    </main>
  );
}
