import { Context } from '../middleware/auth';
import { User, Board, Card, Comment, ActivityLog } from '../models';
import { AuthenticationError, ForbiddenError } from '../utils/errors';

export const analyticsResolvers = {
  Query: {
    analytics: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }

      // Check if user is admin
      const user = await User.findById(context.user.id);
      if (user?.role !== 'admin') {
        throw new ForbiddenError('Only admins can access analytics');
      }

      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Total counts
      const totalUsers = await User.countDocuments();
      const totalBoards = await Board.countDocuments();
      const totalCards = await Card.countDocuments();
      const totalComments = await Comment.countDocuments();

      // Active users (users who have activity logs)
      const activeUserIdsToday = await ActivityLog.distinct('user', {
        createdAt: { $gte: startOfToday },
      });
      const activeUserIdsWeek = await ActivityLog.distinct('user', {
        createdAt: { $gte: startOfWeek },
      });

      // Created this month
      const boardsCreatedThisMonth = await Board.countDocuments({
        createdAt: { $gte: startOfMonth },
      });
      const cardsCreatedThisMonth = await Card.countDocuments({
        createdAt: { $gte: startOfMonth },
      });

      // User growth (last 7 days)
      const userGrowth = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

        const count = await User.countDocuments({
          createdAt: { $gte: startOfDay, $lt: endOfDay },
        });

        userGrowth.push({
          date: startOfDay.toISOString().split('T')[0],
          count,
        });
      }

      // Top active users
      const userActivity = await ActivityLog.aggregate([
        {
          $group: {
            _id: '$user',
            activityCount: { $sum: 1 },
          },
        },
        {
          $sort: { activityCount: -1 },
        },
        {
          $limit: 10,
        },
      ]);

      const topActiveUsers = await Promise.all(
        userActivity.map(async (activity) => {
          const user = await User.findById(activity._id);
          const boardCount = await Board.countDocuments({ owner: activity._id });
          const cardCount = await Card.countDocuments({
            list: {
              $in: await Card.distinct('list', {
                assignees: activity._id,
              }),
            },
          });
          const commentCount = await Comment.countDocuments({ author: activity._id });

          return {
            id: user?.id,
            name: user?.name || 'Unknown',
            email: user?.email || '',
            boardCount,
            cardCount,
            commentCount,
          };
        })
      );

      // Board stats
      const totalPublic = await Board.countDocuments({ isPrivate: false });
      const totalPrivate = await Board.countDocuments({ isPrivate: true });

      const boardsWithCards = await Board.aggregate([
        {
          $lookup: {
            from: 'lists',
            localField: '_id',
            foreignField: 'board',
            as: 'lists',
          },
        },
        {
          $lookup: {
            from: 'cards',
            localField: 'lists._id',
            foreignField: 'list',
            as: 'cards',
          },
        },
        {
          $project: {
            cardCount: { $size: '$cards' },
            memberCount: { $size: '$members' },
          },
        },
      ]);

      const averageCardsPerBoard =
        boardsWithCards.length > 0
          ? boardsWithCards.reduce((sum, b) => sum + b.cardCount, 0) / boardsWithCards.length
          : 0;

      const averageMembersPerBoard =
        boardsWithCards.length > 0
          ? boardsWithCards.reduce((sum, b) => sum + b.memberCount, 0) / boardsWithCards.length
          : 0;

      return {
        totalUsers,
        totalBoards,
        totalCards,
        totalComments,
        activeUsersToday: activeUserIdsToday.length,
        activeUsersThisWeek: activeUserIdsWeek.length,
        boardsCreatedThisMonth,
        cardsCreatedThisMonth,
        userGrowth,
        topActiveUsers,
        boardStats: {
          totalPublic,
          totalPrivate,
          averageCardsPerBoard,
          averageMembersPerBoard,
        },
      };
    },

    activityLogs: async (
      _: any,
      { limit = 50, offset = 0 }: { limit?: number; offset?: number },
      context: Context
    ) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }

      const user = await User.findById(context.user.id);
      if (user?.role !== 'admin') {
        throw new ForbiddenError('Only admins can access activity logs');
      }

      return await ActivityLog.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset)
        .populate('user');
    },

    userActivityLogs: async (
      _: any,
      { userId, limit = 20 }: { userId: string; limit?: number },
      context: Context
    ) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }

      const user = await User.findById(context.user.id);
      if (user?.role !== 'admin' && context.user.id !== userId) {
        throw new ForbiddenError('You can only view your own activity logs');
      }

      return await ActivityLog.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('user');
    },
  },
};
