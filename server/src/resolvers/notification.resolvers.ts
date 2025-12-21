import { Context } from '../middleware/auth';
import { Notification } from '../models';
import { AuthenticationError } from '../utils/errors';
import { pubsub } from '../utils/pubsub';

const NOTIFICATION_RECEIVED = 'NOTIFICATION_RECEIVED';

export const notificationResolvers = {
  Query: {
    notifications: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }

      return await Notification.find({ recipient: context.user.id })
        .sort({ createdAt: -1 })
        .populate('sender')
        .populate('recipient');
    },

    unreadNotificationsCount: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }

      return await Notification.countDocuments({
        recipient: context.user.id,
        isRead: false,
      });
    },
  },

  Mutation: {
    markNotificationAsRead: async (
      _: any,
      { notificationId }: { notificationId: string },
      context: Context
    ) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }

      const notification = await Notification.findOne({
        _id: notificationId,
        recipient: context.user.id,
      });

      if (!notification) {
        throw new Error('Notification not found');
      }

      notification.isRead = true;
      await notification.save();

      return await notification.populate(['sender', 'recipient']);
    },

    markAllNotificationsAsRead: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }

      await Notification.updateMany(
        { recipient: context.user.id, isRead: false },
        { isRead: true }
      );

      return true;
    },

    deleteNotification: async (
      _: any,
      { notificationId }: { notificationId: string },
      context: Context
    ) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }

      const result = await Notification.deleteOne({
        _id: notificationId,
        recipient: context.user.id,
      });

      return result.deletedCount > 0;
    },
  },

  Subscription: {
    notificationReceived: {
      subscribe: (_: any, __: any, context: Context) => {
        if (!context.user) {
          throw new AuthenticationError('Not authenticated');
        }

        return pubsub.asyncIterator([`${NOTIFICATION_RECEIVED}_${context.user.id}`]);
      },
    },
  },
};

// Helper function to create and publish notifications
export async function createNotification(data: {
  recipient: string;
  sender?: string;
  type: 'comment' | 'assignment' | 'mention' | 'board_update' | 'card_update' | 'due_date';
  title: string;
  message: string;
  entityType?: 'board' | 'card' | 'comment';
  entityId?: string;
}) {
  const notification = await Notification.create(data);
  await notification.populate(['sender', 'recipient']);

  pubsub.publish(`${NOTIFICATION_RECEIVED}_${data.recipient}`, {
    notificationReceived: notification,
  });

  return notification;
}
