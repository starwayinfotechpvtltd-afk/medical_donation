'use client';

import { useState } from 'react';
import { labTests } from '@/data/labTechnicians';
import { Upload, FileText, CheckCircle } from 'lucide-react';

export default function LabUploadPage() {
  const [selectedTest, setSelectedTest] = useState('');
  const [fileName, setFileName] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const inProgressTests = labTests.filter(test => test.status === 'in-progress' || test.status === 'pending');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setSelectedTest('');
    setFileName('');
    setNotes('');
  };

  return (
    <main className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Upload Lab Results</h1>

        {submitted && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-green-700 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Results uploaded successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg border border-slate-700 p-8">
          {/* Test Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-300 mb-3">Select Test</label>
            <select
              value={selectedTest}
              onChange={(e) => setSelectedTest(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Choose a test to upload results for...</option>
              {inProgressTests.map((test) => (
                <option key={test.id} value={test.id}>
                  {test.testName} - {test.patientName}
                </option>
              ))}
            </select>
          </div>

          {/* File Upload */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-300 mb-3">Result File</label>
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 transition-colors">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
              <p className="text-white font-medium mb-1">Drag and drop your file here</p>
              <p className="text-slate-400 text-sm mb-4">or click to browse</p>
              <input
                type="file"
                onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              {fileName && (
                <p className="text-purple-400 font-medium flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  {fileName}
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-300 mb-3">Additional Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any observations or findings..."
              rows={4}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedTest || !fileName}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Upload Results
          </button>
        </form>

        {/* Recently Uploaded */}
        <div className="mt-12 bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recently Uploaded Results</h2>
          <div className="space-y-3">
            {labTests.filter(t => t.status === 'completed' && t.resultFile).map((test) => (
              <div key={test.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-white font-medium">{test.testName}</p>
                    <p className="text-slate-400 text-sm">{test.patientName}</p>
                  </div>
                </div>
                <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
