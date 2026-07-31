'use client';

import { Staff } from '../types';
import { Search, Phone, Mail } from 'lucide-react';

interface StaffTabProps {
  staff: Staff[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  getStatusColor: (status: string) => string;
}

export default function StaffTab({ staff, searchTerm, setSearchTerm, getStatusColor }: StaffTabProps) {
  
  const filteredStaff = staff.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Staff</h2>
          <p className="text-gray-600">View all staff members</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((member) => (
          <div key={member.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <img src={member.avatar} alt={member.name} className="w-14 h-14 rounded-full" />
              <div>
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Department</span>
                <span className="text-gray-900">{member.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shift</span>
                <span className="text-gray-900 capitalize">{member.shift}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(member.status)}`}>
                  {member.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 text-xs">{member.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 text-xs truncate">{member.email}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}