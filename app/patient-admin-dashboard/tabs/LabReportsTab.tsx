'use client';

import { LabReport, Patient } from '../types';
import { Search } from 'lucide-react';

interface LabReportsTabProps {
  labReports: LabReport[];
  patients: Patient[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  getStatusColor: (status: string) => string;
}

export default function LabReportsTab({ 
  labReports, 
  patients, 
  searchTerm, 
  setSearchTerm,
  getStatusColor 
}: LabReportsTabProps) {
  
  const filteredReports = labReports.filter(r =>
    r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.testType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Lab Reports</h2>
          <p className="text-gray-600">Manage patient lab reports</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search lab reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{report.testName}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Patient: {report.patientName}</p>
                <p className="text-sm text-gray-600">Type: {report.testType}</p>
                <p className="text-sm text-gray-600">Ordered by: {report.orderedBy}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Ordered: {report.orderedDate}</p>
                {report.resultDate && (
                  <p className="text-xs text-gray-500">Result: {report.resultDate}</p>
                )}
              </div>
            </div>

            {report.result && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Result</h4>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{report.result}</p>
                  <p className="text-xs text-gray-500 mt-1">Normal Range: {report.normalRange}</p>
                </div>
                {report.notes && (
                  <p className="text-xs text-gray-500 mt-2">Notes: {report.notes}</p>
                )}
              </div>
            )}

            <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
              <span>Technician: {report.technician}</span>
              {report.fileUrl && (
                <span className="text-blue-600 hover:text-blue-700 cursor-pointer">View Attached File</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
