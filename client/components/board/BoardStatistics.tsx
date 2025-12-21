'use client';

import { BoardStatistics as BoardStatsType } from '@/types';

interface BoardStatisticsProps {
  statistics: BoardStatsType;
  onClose: () => void;
}

export function BoardStatistics({ statistics, onClose }: BoardStatisticsProps) {
  const completionRate =
    statistics.totalCards > 0
      ? Math.round((statistics.completedCards / statistics.totalCards) * 100)
      : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Board Statistics</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Overview Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium mb-1">Total Lists</p>
              <p className="text-3xl font-bold text-blue-900">{statistics.totalLists}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium mb-1">Total Cards</p>
              <p className="text-3xl font-bold text-purple-900">{statistics.totalCards}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-900">
                {statistics.completedCards}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-orange-600 font-medium mb-1">Pending</p>
              <p className="text-3xl font-bold text-orange-900">
                {statistics.pendingCards}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-900">Completion Rate</h3>
              <span className="text-2xl font-bold text-gray-900">{completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-green-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>{statistics.completedCards} completed</span>
              <span>{statistics.pendingCards} remaining</span>
            </div>
          </div>

          {/* Priority Breakdown */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Cards by Priority</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-gray-700">High Priority</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {statistics.cardsByPriority.high}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span className="text-gray-700">Medium Priority</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {statistics.cardsByPriority.medium}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-gray-700">Low Priority</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {statistics.cardsByPriority.low}
                </span>
              </div>
            </div>
          </div>

          {/* Team Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="text-gray-700 font-medium">Team Members</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                {statistics.totalMembers}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button onClick={onClose} className="btn btn-secondary px-6 py-2">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
