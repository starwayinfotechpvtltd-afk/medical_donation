'use client';

import { Download, Eye, CheckCircle } from 'lucide-react';

const labReports = [
  { id: 1, test: 'Blood Test (CBC)', date: '2024-03-20', tech: 'Priya Patel', status: 'Normal', results: [
    { param: 'Hemoglobin', value: '14.5', unit: 'g/dL', normal: 'Normal' },
    { param: 'RBC', value: '4.8', unit: '10^6/µL', normal: 'Normal' },
  ]},
  { id: 2, test: 'Lipid Profile', date: '2024-02-15', tech: 'Ahmed Hassan', status: 'Abnormal', results: [
    { param: 'Total Cholesterol', value: '240', unit: 'mg/dL', normal: 'High' },
  ]},
  { id: 3, test: 'Thyroid Panel', date: '2024-01-10', tech: 'Rajesh Verma', status: 'Normal', results: [
    { param: 'TSH', value: '2.5', unit: 'mIU/L', normal: 'Normal' },
  ]},
];

export default function LabReportsViewPage() {
  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-sky-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Lab Reports</h1>
          <p className="text-slate-600">View and download your laboratory test results</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <p className="text-slate-600 text-sm mb-2">Total Reports</p>
            <p className="text-3xl font-bold text-slate-900">{labReports.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <p className="text-slate-600 text-sm mb-2">Normal Results</p>
            <p className="text-3xl font-bold text-slate-900">2</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
            <p className="text-slate-600 text-sm mb-2">Needs Review</p>
            <p className="text-3xl font-bold text-slate-900">1</p>
          </div>
        </div>

        {/* Reports */}
        <div className="space-y-6">
          {labReports.map((report) => (
            <div key={report.id} className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-blue-100">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{report.test}</h3>
                  <p className="text-slate-600 mt-2">Lab Technician: {report.tech}</p>
                  <p className="text-slate-600 text-sm">Date: {report.date}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 ${report.status === 'Normal' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    <CheckCircle className="w-4 h-4" />
                    {report.status}
                  </span>
                  <button className="block mt-3 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors font-semibold text-sm flex items-center gap-2 ml-auto">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>

              {/* Results Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-blue-50 border-b border-blue-100">
                      <th className="px-4 py-3 text-left font-semibold text-slate-900">Parameter</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900">Value</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900">Unit</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.results.map((result, idx) => (
                      <tr key={idx} className="border-b border-blue-50">
                        <td className="px-4 py-3 font-semibold text-slate-900">{result.param}</td>
                        <td className="px-4 py-3 text-slate-600">{result.value}</td>
                        <td className="px-4 py-3 text-slate-600">{result.unit}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${result.normal === 'Normal' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                            {result.normal}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
