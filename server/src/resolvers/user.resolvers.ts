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
    updateProfile: async (
      _: unknown,
      { input }: { input: { name?: string; bio?: string; avatar?: string } },
      context: Context
    ) => {
      requireAuth(context);

      const user = await User.findById(context.user!.id);

      if (!user) {
        throw createNotFoundError('User');
      }

      if (input.name !== undefined) user.name = input.name;
      if (input.bio !== undefined) user.bio = input.bio;
      if (input.avatar !== undefined) user.avatar = input.avatar;

      await user.save();

      return user;
    },

    changePassword: async (
      _: unknown,
      { input }: { input: { currentPassword: string; newPassword: string } },
      context: Context
    ) => {
      requireAuth(context);

      const user = await User.findById(context.user!.id).select('+password');

      if (!user) {
        throw createNotFoundError('User');
      }

      // Verify current password
      const isMatch = await user.comparePassword(input.currentPassword);
      if (!isMatch) {
        throw new Error('Current password is incorrect');
      }

      // Validate new password
      if (input.newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters');
      }

      user.password = input.newPassword;
      await user.save();

      return true;
    },

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
