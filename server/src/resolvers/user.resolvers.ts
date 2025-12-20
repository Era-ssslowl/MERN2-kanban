import { User } from '../models';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { createNotFoundError } from '../utils/errors';
import { Context } from '../middleware/auth';

export const userResolvers = {
  Query: {
    me: async (_: unknown, __: unknown, context: Context) => {
      requireAuth(context);
      return context.user;
    },

    user: async (_: unknown, { id }: { id: string }, context: Context) => {
      requireAuth(context);

      const user = await User.findById(id);

      if (!user) {
        throw createNotFoundError('User');
      }

      return user;
    },

    users: async (_: unknown, __: unknown, context: Context) => {
      requireAuth(context);

      const users = await User.find();
      return users;
    },
  },

  Mutation: {
    updateUserRole: async (
      _: unknown,
      { userId, role }: { userId: string; role: string },
      context: Context
    ) => {
      requireAdmin(context);

      // Validate role
      if (!['user', 'admin'].includes(role)) {
        throw new Error('Invalid role. Must be either "user" or "admin"');
      }

      const user = await User.findById(userId);

      if (!user) {
        throw createNotFoundError('User');
      }

      user.role = role as 'user' | 'admin';
      await user.save();

      return user;
    },
  },
};
