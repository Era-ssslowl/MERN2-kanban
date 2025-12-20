import { User } from '../models';
import { generateToken } from '../utils/jwt';
import { createValidationError, createAuthenticationError } from '../utils/errors';

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export const authResolvers = {
  Mutation: {
    register: async (_: unknown, { input }: { input: RegisterInput }) => {
      const { email, password, name } = input;

      // Check if user already exists
      const existingUser = await User.findOne({ email }).select('+isDeleted');
      if (existingUser && !existingUser.isDeleted) {
        throw createValidationError('User with this email already exists', {
          email: 'Email already in use',
        });
      }

      // Create new user
      const user = await User.create({
        email,
        password,
        name,
      });

      // Generate token
      const token = generateToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      return {
        token,
        user,
      };
    },

    login: async (_: unknown, { input }: { input: LoginInput }) => {
      const { email, password } = input;

      // Find user with password field
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        throw createAuthenticationError('Invalid email or password');
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        throw createAuthenticationError('Invalid email or password');
      }

      // Generate token
      const token = generateToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      return {
        token,
        user,
      };
    },
  },
};
