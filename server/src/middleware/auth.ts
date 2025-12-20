import { User, IUser } from '../models';
import { extractTokenFromHeader, verifyToken, JwtPayload } from '../utils/jwt';
import { createAuthenticationError, createAuthorizationError } from '../utils/errors';

export interface Context {
  user?: IUser;
  userId?: string;
}

export const authenticate = async (req: any): Promise<Context> => {
  const context: Context = {};

  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      return context;
    }

    const decoded: JwtPayload = verifyToken(token);

    const user = await User.findById(decoded.userId).select('+password');

    if (!user) {
      return context;
    }

    context.user = user;
    context.userId = user._id.toString();
  } catch (error) {
    // Token invalid or expired - return empty context
    return context;
  }

  return context;
};

export const requireAuth = (context: Context): void => {
  if (!context.user || !context.userId) {
    throw createAuthenticationError('You must be logged in to perform this action');
  }
};

export const requireAdmin = (context: Context): void => {
  requireAuth(context);

  if (context.user?.role !== 'admin') {
    throw createAuthorizationError('Admin privileges required');
  }
};

export const checkBoardAccess = async (
  boardId: string,
  userId: string,
  requireOwner = false
): Promise<boolean> => {
  const { Board } = await import('../models');

  const board = await Board.findById(boardId);

  if (!board) {
    return false;
  }

  const isOwner = board.owner.toString() === userId;
  const isMember = board.members.some((memberId) => memberId.toString() === userId);

  if (requireOwner) {
    return isOwner;
  }

  return isOwner || isMember;
};
