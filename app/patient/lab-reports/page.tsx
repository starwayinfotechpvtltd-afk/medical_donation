'use client';

import { useState } from 'react';
import { mockLabReports } from '@/data/labReports';
import { FileText, Download, ChevronDown, ChevronUp, AlertCircle, CheckCircle } from 'lucide-react';

export default function LabReportsPage() {
  const patientId = 'P001';
  const labReports = mockLabReports.filter(r => r.patientId === patientId);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDownload = (id: string) => {
    alert(`Downloading lab report ${id}...`);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-600" />
          Lab Reports
        </h1>
        <p className="text-gray-600 mt-2">View and download your laboratory test results</p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2">
        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium">All Reports</button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300">Normal</button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300">Abnormal</button>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {labReports.length > 0 ? (
          labReports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Header */}
              <button
                onClick={() => toggleExpand(report.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{report.testName}</h3>
                    <span className="text-xs bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                      {report.category}
                    </span>
                    {report.status === 'Normal' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Tested: {report.dateOfTest} • Reported: {report.dateOfReport}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    report.status === 'Normal'
                      ? 'bg-green-100 text-green-800'
                      : report.status === 'Abnormal'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {report.status}
                  </span>
                  {expandedId === report.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Details */}
              {expandedId === report.id && (
                <div className="border-t border-gray-200 bg-gray-50">
                  <div className="p-6">
                    {/* Test Results Table */}
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Test Results:</h4>
                    <div className="overflow-x-auto mb-6">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="px-4 py-2 text-left font-semibold text-gray-900">Parameter</th>
                            <th className="px-4 py-2 text-left font-semibold text-gray-900">Value</th>
                            <th className="px-4 py-2 text-left font-semibold text-gray-900">Unit</th>
                            <th className="px-4 py-2 text-left font-semibold text-gray-900">Reference Range</th>
                            <th className="px-4 py-2 text-left font-semibold text-gray-900">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {report.results.map((result) => (
                            <tr key={result.parameter} className="border-b border-gray-200">
                              <td className="px-4 py-3 text-gray-900">{result.parameter}</td>
                              <td className="px-4 py-3 font-semibold text-gray-900">{result.value}</td>
                              <td className="px-4 py-3 text-gray-600">{result.unit}</td>
                              <td className="px-4 py-3 text-gray-600">{result.referenceRange}</td>
                              <td className="px-4 py-3">
                                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                                  result.status === 'Normal'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {result.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pathologist Info */}
                    <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg">
                      <p className="text-sm font-semibold text-gray-900">Pathologist:</p>
                      <p className="text-sm text-gray-600">{report.pathologist}</p>
                    </div>

                    {/* Notes */}
                    {report.notes && (
                      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-semibold text-blue-900 mb-1">Pathologist's Notes:</p>
                        <p className="text-sm text-blue-800">{report.notes}</p>
                      </div>
                    )}

                    <button
                      onClick={() => handleDownload(report.id)}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
                    >
                      <Download className="w-4 h-4" />
                      Download Lab Report PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No lab reports available</p>
          </div>
        )}
      </div>
    </div>
  );
}
