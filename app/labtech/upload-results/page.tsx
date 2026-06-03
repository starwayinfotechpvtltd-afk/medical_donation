'use client';

import { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, FileText } from 'lucide-react';

export default function UploadResultsPage() {
  const [selectedTest, setSelectedTest] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [testParameters, setTestParameters] = useState([
    { name: 'Hemoglobin', value: '14.5', unit: 'g/dL', normalRange: '13.5-17.5', status: 'Normal' },
    { name: 'RBC', value: '4.8', unit: '10^6/µL', normalRange: '4.5-5.5', status: 'Normal' },
  ]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setUploadedFile('CBC_Report_2024-03-24.pdf');
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-sky-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Upload Test Results</h1>
          <p className="text-slate-600">Submit completed laboratory test results</p>
        </div>
        <div>
          <h1 className="text-4xl font-medium">Upload Testing formet</h1>
          <p className='text-accent font'></p>
        </div>

        {/* Test Selection */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <label className="block text-sm font-semibold text-slate-900 mb-3">Select Test</label>
          <select
            value={selectedTest}
            onChange={(e) => setSelectedTest(e.target.value)}
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Choose a test...</option>
            <option value="LT001">LT001 - John Sharma (Blood Test)</option>
            <option value="LT002">LT002 - Priya Patel (Lipid Profile)</option>
            <option value="LT003">LT003 - Amit Kumar (Thyroid Function)</option>
          </select>
        </div>

        {selectedTest && (
          <>
            {/* File Upload */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center mb-6 transition-colors ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-blue-300 bg-white'
              }`}
            >
              {uploadedFile ? (
                <div className="flex flex-col items-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-slate-900 font-semibold">{uploadedFile}</p>
                  <p className="text-slate-600 text-sm mt-1">File uploaded successfully</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                  <p className="text-slate-900 font-semibold">Drag and drop your file here</p>
                  <p className="text-slate-600 text-sm mt-1">or click to browse</p>
                </div>
              )}
            </div>

            {/* Test Parameters */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Test Parameters</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-blue-50 border-b border-blue-100">
                      <th className="px-4 py-3 text-left font-semibold text-slate-900">Parameter</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900">Value</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900">Unit</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900">Normal Range</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testParameters.map((param, idx) => (
                      <tr key={idx} className="border-b border-blue-50">
                        <td className="px-4 py-3 text-slate-900 font-semibold">{param.name}</td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            defaultValue={param.value}
                            className="w-20 px-2 py-1 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                          />
                        </td>
                        <td className="px-4 py-3 text-slate-600">{param.unit}</td>
                        <td className="px-4 py-3 text-slate-600">{param.normalRange}</td>
                        <td className="px-4 py-3">
                          <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">{param.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <button className="flex-1 px-6 py-3 bg-slate-200 text-slate-900 rounded-lg font-semibold hover:bg-slate-300 transition-colors">
                Cancel
              </button>
              <button className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                Submit Results
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
