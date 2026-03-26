'use client';

import { useState } from 'react';
import { patientLabReports } from '@/data/patientAppointmentDetails';
import { TestTube, Upload, CheckCircle, Plus } from 'lucide-react';

export default function LabTechDashboard() {
  const [showUploadModal, setShowUploadModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Lab Technician Dashboard</h1>
        <p className="text-slate-600 mb-8">Priya Patel - Laboratory</p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-cyan-100">
            <div className="flex items-center gap-4">
              <TestTube className="w-10 h-10 text-cyan-500" />
              <div>
                <p className="text-sm text-slate-600">Pending Tests</p>
                <p className="text-3xl font-bold text-slate-900">15</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-cyan-100">
            <div className="flex items-center gap-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
              <div>
                <p className="text-sm text-slate-600">Completed Today</p>
                <p className="text-3xl font-bold text-slate-900">8</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-cyan-100">
            <div className="flex items-center gap-4">
              <Upload className="w-10 h-10 text-purple-500" />
              <div>
                <p className="text-sm text-slate-600">To Upload</p>
                <p className="text-3xl font-bold text-slate-900">5</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lab Tests */}
        <div className="bg-white rounded-xl shadow-sm border border-cyan-100">
          <div className="p-8 border-b border-cyan-100 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-900">Test Results</h2>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload Results
            </button>
          </div>
          <div className="p-8">
            <div className="space-y-4">
              {patientLabReports.map((report) => (
                <div key={report.id} className="p-4 bg-cyan-50 rounded-lg border border-cyan-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-slate-900">{report.testName}</p>
                      <p className="text-sm text-slate-600">Test Date: {report.testDate}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      report.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {report.results.slice(0, 3).map((result, idx) => (
                      <div key={idx} className="bg-white p-3 rounded border border-cyan-200">
                        <p className="text-xs text-slate-600">{result.parameter}</p>
                        <p className="font-semibold text-slate-900">{result.value} {result.unit}</p>
                        <p className={`text-xs mt-1 ${result.status === 'normal' ? 'text-green-600' : 'text-red-600'}`}>
                          {result.status}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Upload Lab Results</h2>
            <div className="border-2 border-dashed border-cyan-300 rounded-lg p-8 text-center mb-6">
              <Upload className="w-12 h-12 text-cyan-500 mx-auto mb-3" />
              <p className="text-slate-900 font-semibold mb-1">Drag files here or click</p>
              <p className="text-sm text-slate-600">Supported: PDF, JPG, PNG</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2 border border-cyan-200 rounded-lg hover:bg-cyan-50 transition-colors font-medium text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
