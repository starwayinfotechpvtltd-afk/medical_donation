'use client';

import { useState } from 'react';
import { roles, createdUsers } from '@/data/rolesAndUsers';
import { Plus, Edit2, Trash2, Users, Shield, Activity, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'roles' | 'users' | 'activity'>('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    setFormData({ name: '', email: '', phone: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600">Manage roles, users, and system activity</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <Shield className="w-10 h-10 text-blue-500" />
              <span className="text-sm font-semibold text-blue-600">Roles</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{roles.length}</p>
            <p className="text-sm text-slate-500 mt-1">Available roles</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-10 h-10 text-cyan-500" />
              <span className="text-sm font-semibold text-cyan-600">Users</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{createdUsers.length}</p>
            <p className="text-sm text-slate-500 mt-1">Total users</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-10 h-10 text-purple-500" />
              <span className="text-sm font-semibold text-purple-600">Activity</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">24</p>
            <p className="text-sm text-slate-500 mt-1">Today's actions</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-10 h-10 text-green-500" />
              <span className="text-sm font-semibold text-green-600">System</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">100%</p>
            <p className="text-sm text-slate-500 mt-1">Uptime status</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 mb-8">
          <div className="flex border-b border-blue-100">
            {(['overview', 'roles', 'users', 'activity'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">System Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg p-6 border border-blue-200">
                    <h3 className="font-bold text-slate-900 mb-4">Available Roles</h3>
                    <ul className="space-y-3">
                      {roles.map((role) => (
                        <li key={role.id} className="flex items-center justify-between">
                          <span className="text-slate-700">{role.name}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${role.color}`}>
                            {role.permissions.length} perms
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-6 border border-cyan-200">
                    <h3 className="font-bold text-slate-900 mb-4">Quick Stats</h3>
                    <div className="space-y-3 text-slate-700">
                      <p>Total Doctors: 2</p>
                      <p>Total Lab Technicians: 2</p>
                      <p>Total Nurses: 2</p>
                      <p>Active Patients: 150</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'roles' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Manage Roles</h2>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create Role
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {roles.map((role) => (
                    <div key={role.id} className={`rounded-lg p-6 border-2 ${role.color}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg">{role.name}</h3>
                          <p className="text-sm text-slate-600">{role.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4 text-blue-600" />
                          </button>
                          <button className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {role.permissions.slice(0, 3).map((perm) => (
                          <span key={perm} className="text-xs bg-white px-2 py-1 rounded">
                            {perm}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Manage Users</h2>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create User
                  </button>
                </div>

                <div className="bg-white rounded-lg border border-blue-100 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-blue-50 border-b border-blue-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Name</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Role</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {createdUsers.map((user) => (
                        <tr key={user.id} className="border-b border-blue-50 hover:bg-blue-50 transition-colors">
                          <td className="px-6 py-4 text-slate-900 font-medium">{user.name}</td>
                          <td className="px-6 py-4 text-slate-600 text-sm">{user.email}</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 flex gap-2">
                            <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
                              <Edit2 className="w-4 h-4 text-blue-600" />
                            </button>
                            <button className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {[
                    { user: 'Dr. Rajesh Kumar', action: 'Viewed patient records', time: '10 mins ago' },
                    { user: 'Arun Patel', action: 'Uploaded lab results', time: '25 mins ago' },
                    { user: 'Aisha Khan', action: 'Marked attendance', time: '1 hour ago' },
                    { user: 'Admin', action: 'Created new role', time: '2 hours ago' },
                  ].map((activity, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{activity.user}</p>
                        <p className="text-sm text-slate-600">{activity.action}</p>
                      </div>
                      <p className="text-sm text-slate-500">{activity.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Create New User</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Select Role</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose a role...</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter name"
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email"
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone"
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors font-medium text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    Create User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
