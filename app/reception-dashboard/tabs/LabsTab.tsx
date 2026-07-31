'use client';

import { Lab } from '../types';
import { Search, FlaskRound } from 'lucide-react';

interface LabsTabProps {
  labs: Lab[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  getStatusColor: (status: string) => string;
}

export default function LabsTab({ labs, searchTerm, setSearchTerm, getStatusColor }: LabsTabProps) {
  
  const filteredLabs = labs.filter(l =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Laboratories</h2>
          <p className="text-gray-600">View all labs and their status</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search labs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredLabs.map((lab) => (
          <div key={lab.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FlaskRound className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{lab.name}</h3>
                <p className="text-sm text-gray-500">{lab.type}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(lab.status)}`}>
                  {lab.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Current Tests</span>
                <span className="text-gray-900">{lab.currentTests} / {lab.capacity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Technician</span>
                <span className="text-gray-900">{lab.technician}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}