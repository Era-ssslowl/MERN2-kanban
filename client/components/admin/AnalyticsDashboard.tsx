'use client';

import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { format } from 'date-fns';
import { useState } from 'react';

const ANALYTICS_QUERY = gql`
  query GetAnalytics {
    analytics {
      totalUsers
      totalBoards
      totalCards
      totalComments
      activeUsersToday
      activeUsersThisWeek
      boardsCreatedThisMonth
      cardsCreatedThisMonth
      userGrowth {
        date
        count
      }
      topActiveUsers {
        id
        name
        email
        boardCount
        cardCount
        commentCount
      }
      boardStats {
        totalPublic
        totalPrivate
        averageCardsPerBoard
        averageMembersPerBoard
      }
    }
  }
`;

interface UserStats {
  id: string;
  name: string;
  email: string;
  boardCount: number;
  cardCount: number;
  commentCount: number;
}

interface AnalyticsData {
  totalUsers: number;
  totalBoards: number;
  totalCards: number;
  totalComments: number;
  activeUsersToday: number;
  activeUsersThisWeek: number;
  boardsCreatedThisMonth: number;
  cardsCreatedThisMonth: number;
  userGrowth: Array<{ date: string; count: number }>;
  topActiveUsers: UserStats[];
  boardStats: {
    totalPublic: number;
    totalPrivate: number;
    averageCardsPerBoard: number;
    averageMembersPerBoard: number;
  };
}

export function AnalyticsDashboard() {
  const { data, loading, error } = useQuery<{ analytics: AnalyticsData }>(ANALYTICS_QUERY);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'boards'>('overview');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading analytics: {error.message}</p>
      </div>
    );
  }

  const analytics = data?.analytics;

  if (!analytics) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-sm text-gray-600 mt-1">
            System-wide statistics and insights
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-3 border-b border-gray-200">
          <div className="flex space-x-4">
            <button
              onClick={() => setSelectedTab('overview')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                selectedTab === 'overview'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedTab('users')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                selectedTab === 'users'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setSelectedTab('boards')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                selectedTab === 'boards'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Boards
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Total Users"
                  value={analytics.totalUsers}
                  icon="👥"
                  color="blue"
                />
                <MetricCard
                  title="Total Boards"
                  value={analytics.totalBoards}
                  icon="📋"
                  color="purple"
                />
                <MetricCard
                  title="Total Cards"
                  value={analytics.totalCards}
                  icon="📝"
                  color="green"
                />
                <MetricCard
                  title="Total Comments"
                  value={analytics.totalComments}
                  icon="💬"
                  color="orange"
                />
              </div>

              {/* Activity Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Activity</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700">Active today</span>
                      <span className="text-2xl font-bold text-blue-900">
                        {analytics.activeUsersToday}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700">Active this week</span>
                      <span className="text-2xl font-bold text-blue-900">
                        {analytics.activeUsersThisWeek}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-purple-900 mb-4">This Month</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-purple-700">Boards created</span>
                      <span className="text-2xl font-bold text-purple-900">
                        {analytics.boardsCreatedThisMonth}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-700">Cards created</span>
                      <span className="text-2xl font-bold text-purple-900">
                        {analytics.cardsCreatedThisMonth}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {selectedTab === 'users' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Top Active Users</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Boards
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Cards
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Comments
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analytics.topActiveUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.boardCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.cardCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.commentCount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Boards Tab */}
          {selectedTab === 'boards' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-4">Board Types</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-green-700">Public boards</span>
                      <span className="text-2xl font-bold text-green-900">
                        {analytics.boardStats.totalPublic}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-700">Private boards</span>
                      <span className="text-2xl font-bold text-green-900">
                        {analytics.boardStats.totalPrivate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-indigo-900 mb-4">Averages</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-indigo-700">Cards per board</span>
                      <span className="text-2xl font-bold text-indigo-900">
                        {analytics.boardStats.averageCardsPerBoard.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-indigo-700">Members per board</span>
                      <span className="text-2xl font-bold text-indigo-900">
                        {analytics.boardStats.averageMembersPerBoard.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: number;
  icon: string;
  color: 'blue' | 'purple' | 'green' | 'orange';
}

function MetricCard({ title, value, icon, color }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
  };

  return (
    <div className={`rounded-lg border-2 p-6 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}
