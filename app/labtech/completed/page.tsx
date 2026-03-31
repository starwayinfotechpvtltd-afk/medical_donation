'use client';

import { useState } from 'react';
import { 
  Download, Eye, CheckCircle, Calendar, User, 
  FileText, Search, Filter, TrendingUp, 
  ChevronDown, ChevronLeft, ChevronRight,
  FileCheck, Printer, Share2, Clock, Award,
  BarChart3, Users, Activity, DownloadCloud,
  X, ExternalLink, FileBarChart,
  AlertTriangle
} from 'lucide-react';

// Enhanced mock data with more details
const completedTests = [
  { 
    id: 'CT001', 
    patient: 'John Doe', 
    patientId: 'P1001',
    test: 'Complete Blood Count (CBC)', 
    completedDate: '2024-03-23', 
    completedTime: '10:30 AM',
    technician: 'Dr. Priya Patel',
    status: 'verified',
    reportUrl: '#',
    parameters: ['Hemoglobin', 'WBC', 'Platelets'],
    abnormal: false
  },
  { 
    id: 'CT002', 
    patient: 'Jane Smith', 
    patientId: 'P1002',
    test: 'Lipid Profile', 
    completedDate: '2024-03-22', 
    completedTime: '02:15 PM',
    technician: 'Dr. Priya Patel',
    status: 'verified',
    reportUrl: '#',
    parameters: ['Cholesterol', 'HDL', 'LDL', 'Triglycerides'],
    abnormal: true
  },
  { 
    id: 'CT003', 
    patient: 'Mike Johnson', 
    patientId: 'P1003',
    test: 'Thyroid Panel', 
    completedDate: '2024-03-22', 
    completedTime: '11:45 AM',
    technician: 'Dr. Ahmed Hassan',
    status: 'pending',
    reportUrl: '#',
    parameters: ['TSH', 'T3', 'T4'],
    abnormal: false
  },
  { 
    id: 'CT004', 
    patient: 'Sarah Lee', 
    patientId: 'P1004',
    test: 'Glucose Tolerance Test', 
    completedDate: '2024-03-21', 
    completedTime: '09:00 AM',
    technician: 'Dr. Rajesh Verma',
    status: 'verified',
    reportUrl: '#',
    parameters: ['Fasting Glucose', 'Postprandial'],
    abnormal: true
  },
  { 
    id: 'CT005', 
    patient: 'Robert Chen', 
    patientId: 'P1005',
    test: 'Liver Function Test', 
    completedDate: '2024-03-23', 
    completedTime: '03:20 PM',
    technician: 'Dr. Sarah Johnson',
    status: 'verified',
    reportUrl: '#',
    parameters: ['ALT', 'AST', 'ALP', 'Bilirubin'],
    abnormal: false
  },
  { 
    id: 'CT006', 
    patient: 'Emma Wilson', 
    patientId: 'P1006',
    test: 'Urinalysis', 
    completedDate: '2024-03-23', 
    completedTime: '08:45 AM',
    technician: 'Dr. Priya Patel',
    status: 'pending',
    reportUrl: '#',
    parameters: ['pH', 'Protein', 'Glucose', 'Ketones'],
    abnormal: false
  },
];

// Statistics data
const statistics = {
  total: 156,
  thisMonth: 24,
  thisWeek: 8,
  today: 2,
  abnormal: 12,
  pending: 3
};

function StatusBadge({ status }: { status: string }) {
  const config = {
    verified: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700'
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${config[status as keyof typeof config]}`}>
      {status === 'verified' && <CheckCircle className="w-3 h-3" />}
      {status === 'pending' && <Clock className="w-3 h-3" />}
      {status === 'verified' ? 'Verified' : 'Pending Review'}
    </span>
  );
}

function TestDetailsModal({ test, isOpen, onClose }: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Test Results Details</h2>
            <p className="text-sm text-slate-500 mt-1">{test.test} - {test.patient}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Patient Information */}
          <div className="bg-slate-50 rounded-xl p-4">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Patient Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">Patient Name</p>
                <p className="text-sm font-medium text-slate-900">{test.patient}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Patient ID</p>
                <p className="text-sm font-medium text-slate-900">{test.patientId}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Test Date</p>
                <p className="text-sm font-medium text-slate-900">{test.completedDate} at {test.completedTime}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Technician</p>
                <p className="text-sm font-medium text-slate-900">{test.technician}</p>
              </div>
            </div>
          </div>
          
          {/* Test Parameters */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Test Parameters</h3>
            <div className="border border-slate-100 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Parameter</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Value</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Reference Range</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {test.parameters.map((param: string, idx: number) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 text-sm text-slate-900">{param}</td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">
                        {idx === 0 ? '14.2' : idx === 1 ? '7.5' : idx === 2 ? '250' : '4.8'}
                        {param.includes('Glucose') ? ' mg/dL' : param.includes('Cholesterol') ? ' mg/dL' : ' g/dL'}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {param === 'Hemoglobin' ? '13.5-17.5' : 
                         param === 'WBC' ? '4.5-11.0' : 
                         param === 'Platelets' ? '150-450' : '4.5-5.9'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          idx === 1 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {idx === 1 ? 'High' : 'Normal'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Interpretation */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-semibold text-slate-900 mb-2">Clinical Interpretation</h3>
            <p className="text-sm text-slate-700">
              {test.abnormal 
                ? "Results show some values outside reference ranges. Clinical correlation recommended. Patient should follow up with physician for detailed analysis."
                : "All parameters are within normal reference ranges. No significant abnormalities detected."}
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Download Full Report
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CompletedTestsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortBy, setSortBy] = useState('date');
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter and search logic
  const filteredTests = completedTests.filter(test => {
    const matchesSearch = test.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         test.test.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         test.patientId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || test.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Sort logic
  const sortedTests = [...filteredTests].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.completedDate).getTime() - new Date(a.completedDate).getTime();
    }
    if (sortBy === 'patient') {
      return a.patient.localeCompare(b.patient);
    }
    if (sortBy === 'test') {
      return a.test.localeCompare(b.test);
    }
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTests = sortedTests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedTests.length / itemsPerPage);

  const handleViewDetails = (test: any) => {
    setSelectedTest(test);
  };

  const handleDownload = (test: any) => {
    console.log('Downloading report for:', test.id);
    // Implement download logic
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-600 rounded-xl shadow-lg">
                  <FileCheck className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                  Completed Tests
                </h1>
              </div>
              <p className="text-slate-600 ml-12">View, download, and manage completed laboratory test results</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
                <Printer className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-600">Print Summary</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm">
                <DownloadCloud className="w-4 h-4" />
                <span className="text-sm font-medium">Export All</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-50 rounded-xl">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{statistics.total}</p>
            <p className="text-sm text-slate-600 mt-1">Total Tests Completed</p>
            <div className="mt-2 text-xs text-emerald-600">+12% this month</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-purple-50 rounded-xl">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{statistics.thisMonth}</p>
            <p className="text-sm text-slate-600 mt-1">This Month</p>
            <div className="mt-2 text-xs text-slate-500">↑ 8 from last month</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-amber-50 rounded-xl">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{statistics.thisWeek}</p>
            <p className="text-sm text-slate-600 mt-1">This Week</p>
            <div className="mt-2 text-xs text-slate-500">4 tests pending</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-emerald-50 rounded-xl">
                <Activity className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{statistics.today}</p>
            <p className="text-sm text-slate-600 mt-1">Today's Tests</p>
            <div className="mt-2 text-xs text-emerald-600">Completed on time</div>
          </div>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 font-medium">Abnormal Results</p>
                <p className="text-2xl font-bold text-red-900 mt-1">{statistics.abnormal}</p>
              </div>
              <div className="p-2 bg-red-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-700" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-700 font-medium">Pending Review</p>
                <p className="text-2xl font-bold text-amber-900 mt-1">{statistics.pending}</p>
              </div>
              <div className="p-2 bg-amber-200 rounded-lg">
                <Clock className="w-5 h-5 text-amber-700" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Average Turnaround</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">2.4 hrs</p>
              </div>
              <div className="p-2 bg-blue-200 rounded-lg">
                <Award className="w-5 h-5 text-blue-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by patient name, test type, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending Review</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="date">Sort by Date</option>
                <option value="patient">Sort by Patient</option>
                <option value="test">Sort by Test</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tests Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Test ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Patient Info</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Test Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Completed Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Technician</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTests.map((test, index) => (
                  <tr 
                    key={test.id} 
                    className={`border-b border-slate-100 hover:bg-slate-50 transition-all ${
                      index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono font-semibold text-blue-600">{test.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{test.patient}</p>
                        <p className="text-xs text-slate-500">ID: {test.patientId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileBarChart className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-700">{test.test}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-slate-700">{test.completedDate}</p>
                        <p className="text-xs text-slate-400">{test.completedTime}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3 text-slate-400" />
                        <span className="text-sm text-slate-600">{test.technician}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={test.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(test)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={() => handleDownload(test)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors group"
                          title="Download Report"
                        >
                          <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors group"
                          title="Share"
                        >
                          <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedTests.length)} of {sortedTests.length} results
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      currentPage === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Export Options */}
        <div className="mt-6 flex justify-end gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-sm font-medium text-slate-700">
            <Download className="w-4 h-4" />
            Export as CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-sm font-medium text-slate-700">
            <FileText className="w-4 h-4" />
            Export as PDF
          </button>
        </div>
      </div>

      {/* Test Details Modal */}
      <TestDetailsModal
        test={selectedTest}
        isOpen={selectedTest !== null}
        onClose={() => setSelectedTest(null)}
      />
    </div>
  );
}