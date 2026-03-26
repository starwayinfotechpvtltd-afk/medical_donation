'use client';

import { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';

export default function WritePrescriptionPage() {
  const [medicines, setMedicines] = useState([
    { id: 1, name: 'Aspirin', dosage: '500mg', frequency: 'Twice daily', duration: '7 days' },
  ]);

  const addMedicine = () => {
    setMedicines([...medicines, { id: Date.now(), name: '', dosage: '', frequency: '', duration: '' }]);
  };

  const removeMedicine = (id: number) => {
    setMedicines(medicines.filter(m => m.id !== id));
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-sky-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Write Prescription</h1>
          <p className="text-slate-600">Create a new prescription for your patient</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Patient Name</label>
              <input type="text" placeholder="Select patient" className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Patient ID</label>
              <input type="text" placeholder="P001" className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-4">Prescribed Medicines</label>
            <div className="space-y-4 mb-6">
              {medicines.map((medicine) => (
                <div key={medicine.id} className="bg-blue-50 rounded-lg p-4 flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="text-xs text-slate-600 block mb-1">Medicine Name</label>
                    <input type="text" defaultValue={medicine.name} className="w-full px-3 py-2 border border-blue-200 rounded text-sm" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-slate-600 block mb-1">Dosage</label>
                    <input type="text" defaultValue={medicine.dosage} className="w-full px-3 py-2 border border-blue-200 rounded text-sm" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-slate-600 block mb-1">Frequency</label>
                    <input type="text" defaultValue={medicine.frequency} className="w-full px-3 py-2 border border-blue-200 rounded text-sm" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-slate-600 block mb-1">Duration</label>
                    <input type="text" defaultValue={medicine.duration} className="w-full px-3 py-2 border border-blue-200 rounded text-sm" />
                  </div>
                  <button onClick={() => removeMedicine(medicine.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <button onClick={addMedicine} className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg font-semibold hover:bg-blue-200 transition-colors mb-6">
              <Plus className="w-5 h-5" />
              Add Medicine
            </button>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Additional Notes</label>
            <textarea placeholder="Add any special instructions or notes" rows={4} className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"></textarea>
          </div>

          <div className="flex gap-3 mt-6">
            <button className="flex-1 px-6 py-3 bg-slate-200 text-slate-900 rounded-lg font-semibold hover:bg-slate-300 transition-colors">Cancel</button>
            <button className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
              <Save className="w-5 h-5" />
              Save Prescription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
