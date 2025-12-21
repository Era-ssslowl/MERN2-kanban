'use client';

import { useQuery, gql } from '@apollo/client';
import { format } from 'date-fns';
import { useState } from 'react';

const ACTIVITY_LOGS_QUERY = gql`
  query GetActivityLogs($limit: Int, $offset: Int) {
    activityLogs(limit: $limit, offset: $offset) {
      id
      user {
        id
        name
        email
      }
      action
      entityType
      entityId
      details
      createdAt
    }
  }
`;

interface ActivityLog {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  action: string;
  entityType: string;
  entityId?: string;
  details?: string;
  createdAt: string;
}

export function ActivityLog() {
  const [limit, setLimit] = useState(50);
  const { data, loading, error, fetchMore } = useQuery<{ activityLogs: ActivityLog[] }>(
    ACTIVITY_LOGS_QUERY,
    {
      variables: { limit, offset: 0 },
    }
  );

  const logs = data?.activityLogs || [];

  const loadMore = () => {
    fetchMore({
      variables: {
        offset: logs.length,
        limit: 50,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          activityLogs: [...prev.activityLogs, ...fetchMoreResult.activityLogs],
        };
      },
    });
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create':
        return '➕';
      case 'update':
        return '✏️';
      case 'delete':
        return '🗑️';
      case 'login':
        return '🔑';
      case 'logout':
        return '🚪';
      case 'register':
        return '👤';
      case 'assign':
        return '👥';
      case 'unassign':
        return '➖';
      case 'move':
        return '↔️';
      case 'archive':
        return '📦';
      case 'comment':
        return '💬';
      default:
        return '📝';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'bg-green-100 text-green-800';
      case 'update':
        return 'bg-blue-100 text-blue-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      case 'login':
      case 'register':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEntityTypeColor = (entityType: string) => {
    switch (entityType) {
      case 'board':
        return 'bg-indigo-100 text-indigo-800';
      case 'card':
        return 'bg-orange-100 text-orange-800';
      case 'list':
        return 'bg-yellow-100 text-yellow-800';
      case 'comment':
        return 'bg-pink-100 text-pink-800';
      case 'user':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && logs.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading activity logs: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Activity Log</h2>
        <p className="text-sm text-gray-600 mt-1">Track all user actions across the system</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>
                    <div>{format(new Date(log.createdAt), 'MMM d, yyyy')}</div>
                    <div className="text-xs text-gray-400">
                      {format(new Date(log.createdAt), 'HH:mm:ss')}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{log.user.name}</div>
                    <div className="text-xs text-gray-500">{log.user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(
                      log.action
                    )}`}
                  >
                    <span className="mr-1">{getActionIcon(log.action)}</span>
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEntityTypeColor(
                      log.entityType
                    )}`}
                  >
                    {log.entityType}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="max-w-xs truncate">{log.details || '-'}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {logs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No activity logs found</p>
        </div>
      )}

      {logs.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <p className="text-sm text-gray-600">Showing {logs.length} activities</p>
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 disabled:opacity-50 transition"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
