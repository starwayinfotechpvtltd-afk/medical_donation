'use client';

import { useState } from 'react';
import { LightSidebar } from '@/components/LightSidebar';
import { LightStatsCard } from '@/components/LightStatsCard';
import { LightInfoCard } from '@/components/LightInfoCard';
import { Beaker, Upload, CheckCircle2, Clock, Download, Plus } from 'lucide-react';
import { labTests } from '@/data/labTechnicians';

export default function LabTechDashboard() {
  const [showUploadModal, setShowUploadModal] = useState(false);

  const sidebarItems = [
    { label: 'Dashboard', href: '/labtech', icon: <Beaker className="w-5 h-5" /> },
    { label: 'Lab Tests', href: '/labtech/tests', icon: <Clock className="w-5 h-5" />, badge: labTests.length },
    { label: 'Upload Results', href: '/labtech/upload', icon: <Upload className="w-5 h-5" /> },
    { label: 'Completed Tests', href: '/labtech/completed', icon: <CheckCircle2 className="w-5 h-5" />, badge: '8' }
  ];

  const labStats = {
    pendingTests: 12,
    completedToday: 8,
    resultsUploaded: 45,
    averageTurnaround: '24 hrs'
  };

  const recentTests = labTests.slice(0, 5);

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50">
      {/* Sidebar */}
      <LightSidebar
        title="Lab Portal"
        items={sidebarItems}
        userRole="Priya Patel - Lab Technician"
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Lab Dashboard</h1>
            <p className="text-slate-600">Manage tests and upload results</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-6 mb-12">
            <LightStatsCard
              title="Pending Tests"
              value={labStats.pendingTests}
              icon={<Clock className="w-6 h-6" />}
              color="blue"
              trend={{ direction: 'down', percentage: 5 }}
            />
            <LightStatsCard
              title="Completed Today"
              value={labStats.completedToday}
              icon={<CheckCircle2 className="w-6 h-6" />}
              color="sky"
              trend={{ direction: 'up', percentage: 15 }}
            />
            <LightStatsCard
              title="Results Uploaded"
              value={labStats.resultsUploaded}
              icon={<Upload className="w-6 h-6" />}
              color="cyan"
            />
            <LightStatsCard
              title="Avg Turnaround"
              value={labStats.averageTurnaround}
              icon={<Beaker className="w-6 h-6" />}
              color="purple"
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-3 gap-8">
            {/* Pending Tests List */}
            <div className="col-span-2">
              <LightInfoCard
                title="Pending Tests"
                color="blue"
                icon={<Clock className="w-5 h-5" />}
                fullHeight
              >
                <div className="space-y-3">
                  {recentTests.map((test) => (
                    <div key={test.id} className="bg-white rounded-lg p-4 border-2 border-blue-100 hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-bold text-slate-900">{test.testName}</p>
                          <p className="text-sm text-slate-600">Patient ID: {test.patientId}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                          {test.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-3">Ordered: {test.orderDate}</p>
                      <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm">
                        Start Testing →
                      </button>
                    </div>
                  ))}
                </div>
              </LightInfoCard>
            </div>

            {/* Quick Actions */}
            <div>
              <LightInfoCard
                title="Lab Actions"
                color="cyan"
                icon={<Plus className="w-5 h-5" />}
                fullHeight
              >
                <div className="space-y-3">
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="w-full bg-cyan-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-cyan-600 transition-colors"
                  >
                    + Upload Results
                  </button>
                  <button className="w-full bg-blue-100 text-blue-700 px-4 py-3 rounded-lg font-semibold hover:bg-blue-200 transition-colors">
                    + New Test Request
                  </button>
                  <button className="w-full bg-sky-100 text-sky-700 px-4 py-3 rounded-lg font-semibold hover:bg-sky-200 transition-colors">
                    + View Templates
                  </button>
                </div>
              </LightInfoCard>
            </div>
          </div>

          {/* Test Categories */}
          <div className="mt-8 grid grid-cols-4 gap-6">
            {[
              { name: 'Blood Tests', count: 5, color: 'blue' },
              { name: 'Pathology', count: 3, color: 'sky' },
              { name: 'Imaging', count: 2, color: 'cyan' },
              { name: 'Others', count: 2, color: 'purple' }
            ].map((cat) => (
              <LightInfoCard
                key={cat.name}
                title={cat.name}
                color={cat.color as any}
              >
                <p className="text-3xl font-bold text-slate-900">{cat.count}</p>
                <p className="text-xs text-slate-600 mt-2">Pending tests</p>
              </LightInfoCard>
            ))}
          </div>
        </div>
      </main>

      {/* Upload Results Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl border-2 border-cyan-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Upload Lab Results</h3>
            <div className="space-y-4 mb-6">
              <input type="text" placeholder="Patient ID" className="w-full px-4 py-3 border-2 border-cyan-200 rounded-lg focus:border-cyan-500 outline-none" />
              <input type="text" placeholder="Test Name" className="w-full px-4 py-3 border-2 border-cyan-200 rounded-lg focus:border-cyan-500 outline-none" />
              <div className="border-2 border-dashed border-cyan-300 rounded-lg p-6 text-center">
                <Download className="w-8 h-8 text-cyan-600 mx-auto mb-2" />
                <p className="text-slate-600">Drag and drop your test results</p>
                <p className="text-xs text-slate-500">PDF, Images supported</p>
              </div>
              <textarea placeholder="Test Parameters & Values" rows={4} className="w-full px-4 py-3 border-2 border-cyan-200 rounded-lg focus:border-cyan-500 outline-none resize-none" />
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-3 border-2 border-cyan-200 rounded-lg font-semibold text-cyan-700 hover:bg-cyan-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-3 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600"
              >
                Upload Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
