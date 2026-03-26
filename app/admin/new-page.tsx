'use client';

import { useState } from 'react';
import { LightSidebar } from '@/components/LightSidebar';
import { LightStatsCard } from '@/components/LightStatsCard';
import { LightInfoCard } from '@/components/LightInfoCard';
import { Users, Plus, Users2, Activity, BarChart3, Settings } from 'lucide-react';
import { doctors } from '@/data/doctors';
import { nurses } from '@/data/nursesData';
import { labTests } from '@/data/labTechnicians';
import { mockAppointments } from '@/data/appointments';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'roles' | 'users' | 'activity'>('roles');
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');

  const sidebarItems = [
    { label: 'Dashboard', href: '/admin', icon: <BarChart3 className="w-5 h-5" /> },
    { label: 'Roles & Users', href: '/admin', icon: <Users className="w-5 h-5" /> },
    { label: 'Appointments', href: '/admin/appointments', icon: <Activity className="w-5 h-5" />, badge: mockAppointments.length },
    { label: 'Staff', href: '/admin/doctors', icon: <Users2 className="w-5 h-5" />, badge: doctors.length + nurses.length },
    { label: 'Settings', href: '/admin', icon: <Settings className="w-5 h-5" /> }
  ];

  const roles = [
    { id: 'doctor', name: 'Doctor', color: 'blue', count: doctors.length, description: 'Healthcare professionals' },
    { id: 'lab_technician', name: 'Lab Technician', color: 'cyan', count: labTests.length, description: 'Laboratory staff' },
    { id: 'nurse', name: 'Nurse', color: 'sky', count: nurses.length, description: 'Nursing staff' },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50">
      {/* Sidebar */}
      <LightSidebar title="Admin Panel" items={sidebarItems} userRole="Administrator" />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
            <p className="text-slate-600">Manage roles, users, and monitor hospital operations</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mb-12">
            <LightStatsCard
              title="Total Doctors"
              value={doctors.length}
              icon={<Users className="w-6 h-6" />}
              color="blue"
            />
            <LightStatsCard
              title="Total Nurses"
              value={nurses.length}
              icon={<Users className="w-6 h-6" />}
              color="sky"
            />
            <LightStatsCard
              title="Lab Tests"
              value={labTests.length}
              icon={<Activity className="w-6 h-6" />}
              color="cyan"
            />
            <LightStatsCard
              title="Appointments"
              value={mockAppointments.length}
              icon={<Activity className="w-6 h-6" />}
              color="purple"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 bg-white rounded-xl p-1 w-fit shadow-sm border-2 border-blue-200">
            {['roles', 'users', 'activity'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'roles' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Role Management</h2>
                <button
                  onClick={() => setShowCreateRoleModal(true)}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-md"
                >
                  <Plus className="w-5 h-5" />
                  Create Role
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {roles.map((role) => (
                  <LightInfoCard
                    key={role.id}
                    title={role.name}
                    color={role.color as any}
                    icon={<Users2 className="w-5 h-5" />}
                  >
                    <div className="space-y-4">
                      <p className="text-sm text-slate-600">{role.description}</p>
                      <div className="bg-white rounded-lg p-4 border-2 border-gray-100">
                        <p className="text-xs text-slate-600 mb-1">Active Users</p>
                        <p className="text-2xl font-bold text-slate-900">{role.count}</p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedRole(role.id);
                          setShowCreateUserModal(true);
                        }}
                        className="w-full bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200 transition-colors"
                      >
                        + Add User
                      </button>
                    </div>
                  </LightInfoCard>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">User Management</h2>
              <div className="bg-white rounded-xl border-2 border-blue-200 shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-50 to-sky-50 border-b-2 border-blue-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Role</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Department</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.slice(0, 3).map((doc) => (
                      <tr key={doc.id} className="border-b border-blue-100 hover:bg-blue-50">
                        <td className="px-6 py-4 font-semibold text-slate-900">{doc.name}</td>
                        <td className="px-6 py-4 text-slate-600">{doc.email}</td>
                        <td className="px-6 py-4"><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">Doctor</span></td>
                        <td className="px-6 py-4 text-slate-600">{doc.department}</td>
                        <td className="px-6 py-4">
                          <button className="text-red-500 hover:text-red-700 font-semibold">Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <LightInfoCard
              title="System Activity"
              color="blue"
              icon={<Activity className="w-5 h-5" />}
              fullHeight
            >
              <div className="text-center py-12 text-slate-600">
                <p>Recent system activity and logs will appear here</p>
              </div>
            </LightInfoCard>
          )}
        </div>
      </main>

      {/* Create Role Modal */}
      {showCreateRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border-2 border-blue-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Create New Role</h3>
            <div className="space-y-4 mb-6">
              <input type="text" placeholder="Role Name" className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 outline-none" />
              <textarea placeholder="Role Description" rows={3} className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 outline-none resize-none" />
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowCreateRoleModal(false)}
                className="flex-1 px-4 py-3 border-2 border-blue-200 rounded-lg font-semibold text-blue-700 hover:bg-blue-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateRoleModal(false)}
                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border-2 border-blue-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Add User to {selectedRole}</h3>
            <div className="space-y-4 mb-6">
              <input type="text" placeholder="Full Name" className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 outline-none" />
              <input type="email" placeholder="Email" className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 outline-none" />
              <input type="password" placeholder="Password" className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 outline-none" />
              <input type="text" placeholder="Department" className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 outline-none" />
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowCreateUserModal(false)}
                className="flex-1 px-4 py-3 border-2 border-blue-200 rounded-lg font-semibold text-blue-700 hover:bg-blue-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateUserModal(false)}
                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
