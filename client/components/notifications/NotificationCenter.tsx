'use client';

import { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { formatDistanceToNow } from 'date-fns';

const NOTIFICATIONS_QUERY = gql`
  query GetNotifications {
    notifications {
      id
      type
      title
      message
      isRead
      createdAt
      sender {
        id
        name
        avatar
      }
      entityType
      entityId
    }
    unreadNotificationsCount
  }
`;

const MARK_AS_READ_MUTATION = gql`
  mutation MarkNotificationAsRead($notificationId: ID!) {
    markNotificationAsRead(notificationId: $notificationId) {
      id
      isRead
    }
  }
`;

const MARK_ALL_AS_READ_MUTATION = gql`
  mutation MarkAllNotificationsAsRead {
    markAllNotificationsAsRead
  }
`;

const DELETE_NOTIFICATION_MUTATION = gql`
  mutation DeleteNotification($notificationId: ID!) {
    deleteNotification(notificationId: $notificationId)
  }
`;

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
  entityType?: string;
  entityId?: string;
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const { data, loading, refetch } = useQuery(NOTIFICATIONS_QUERY, {
    pollInterval: 30000, // Poll every 30 seconds
  });
  const [markAsRead] = useMutation(MARK_AS_READ_MUTATION);
  const [markAllAsRead] = useMutation(MARK_ALL_AS_READ_MUTATION);
  const [deleteNotification] = useMutation(DELETE_NOTIFICATION_MUTATION);

  const notifications: Notification[] = data?.notifications || [];
  const unreadCount = data?.unreadNotificationsCount || 0;

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead({ variables: { notificationId } });
      refetch();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      refetch();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await deleteNotification({ variables: { notificationId } });
      refetch();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'COMMENT':
        return '💬';
      case 'ASSIGNMENT':
        return '👤';
      case 'MENTION':
        return '@';
      case 'BOARD_UPDATE':
        return '📋';
      case 'CARD_UPDATE':
        return '📝';
      case 'DUE_DATE':
        return '⏰';
      default:
        return '🔔';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-primary-600 hover:text-primary-800"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          {notification.sender && (
                            <p className="text-xs text-gray-500 mt-1">
                              From: {notification.sender.name}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                        <div className="flex space-x-2 ml-2">
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-primary-600 hover:text-primary-800 text-xs"
                              title="Mark as read"
                            >
                              ✓
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="text-red-600 hover:text-red-800 text-xs"
                            title="Delete"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
