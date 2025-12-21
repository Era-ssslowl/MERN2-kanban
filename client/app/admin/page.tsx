'use client';

import { useState } from 'react';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { UserManagementPanel } from '@/components/admin/UserManagementPanel';
import { ActivityLog } from '@/components/admin/ActivityLog';
import TaskManager from '@/components/admin/TaskManager';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'activity' | 'tasks'>(
    'analytics'
  );

  return (
    <ProtectedRoute requireAdmin={true}>
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your application and monitor activity</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'analytics'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'users'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                User Management
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'activity'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Activity Log
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'tasks'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Task Manager
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'analytics' && <AnalyticsDashboard />}
          {activeTab === 'users' && <UserManagementPanel />}
          {activeTab === 'activity' && <ActivityLog />}
          {activeTab === 'tasks' && <TaskManager />}
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
