'use client';

import { labTestResults } from '@/data/labTechnicians';
import { CheckCircle, Download, Eye } from 'lucide-react';

export default function LabCompletedPage() {
  return (
    <main className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Completed Tests</h1>

        <div className="space-y-4">
          {labTestResults.map((result) => (
            <div
              key={result.id}
              className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-purple-500 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    {result.testName}
                  </h3>
                  <p className="text-slate-400">Patient: <span className="text-white font-medium">{result.patientName}</span></p>
                  <p className="text-slate-400 text-sm">Uploaded by: {result.uploadedBy} on {result.uploadedDate}</p>
                </div>
              </div>

              {/* Test Parameters */}
              <div className="mb-6 bg-slate-700 rounded-lg p-4">
                <p className="text-slate-300 font-medium mb-3">Test Results:</p>
                <div className="space-y-2">
                  {result.parameters.map((param, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex-1">
                        <p className="text-white font-medium">{param.name}</p>
                        <p className="text-slate-400">Normal Range: {param.normalRange}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">{param.value} {param.unit}</p>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          param.status === 'normal'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {param.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm">
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors font-medium text-sm">
                  <Download className="w-4 h-4" />
                  Download Report
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
