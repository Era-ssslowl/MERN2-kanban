import { Board, List } from '../models';
import { requireAuth, checkBoardAccess } from '../middleware/auth';
import {
  createNotFoundError,
  createAuthorizationError,
  createValidationError,
} from '../utils/errors';
import { Context } from '../middleware/auth';
import { pubsub, EVENTS } from '../utils/pubsub';

export interface CreateBoardInput {
  title: string;
  description?: string;
  backgroundColor?: string;
  isPrivate?: boolean;
}

export interface UpdateBoardInput {
  title?: string;
  description?: string;
  backgroundColor?: string;
  isPrivate?: boolean;
}

export const boardResolvers = {
  Query: {
    boards: async (_: unknown, __: unknown, context: Context) => {
      requireAuth(context);

      const boards = await Board.find({
        $or: [{ owner: context.userId }, { members: context.userId }],
      })
        .populate('owner')
        .populate('members')
        .sort({ createdAt: -1 });

      return boards;
    },

    board: async (_: unknown, { id }: { id: string }, context: Context) => {
      requireAuth(context);

      const board = await Board.findById(id)
        .populate('owner')
        .populate('members');

      if (!board) {
        throw createNotFoundError('Board');
      }

      // Check access
      const hasAccess = await checkBoardAccess(id, context.userId!);
      if (!hasAccess) {
        throw createAuthorizationError('You do not have access to this board');
      }

      return board;
    },
  },

  Mutation: {
    createBoard: async (
      _: unknown,
      { input }: { input: CreateBoardInput },
      context: Context
    ) => {
      requireAuth(context);

      const board = await Board.create({
        ...input,
        owner: context.userId,
        members: [context.userId],
      });

      await board.populate('owner');
      await board.populate('members');

      return board;
    },

    updateBoard: async (
      _: unknown,
      { id, input }: { id: string; input: UpdateBoardInput },
      context: Context
    ) => {
      requireAuth(context);

      const board = await Board.findById(id);

      if (!board) {
        throw createNotFoundError('Board');
      }

      // Only owner can update board
      const isOwner = await checkBoardAccess(id, context.userId!, true);
      if (!isOwner) {
        throw createAuthorizationError('Only board owner can update the board');
      }

      Object.assign(board, input);
      await board.save();

      await board.populate('owner');
      await board.populate('members');

      // Publish update event
      pubsub.publish(EVENTS.BOARD_UPDATED, {
        boardUpdated: board,
        boardId: board._id.toString(),
      });

      return board;
    },

    deleteBoard: async (_: unknown, { id }: { id: string }, context: Context) => {
      requireAuth(context);

      const board = await Board.findById(id);

      if (!board) {
        throw createNotFoundError('Board');
      }

      // Only owner can delete board
      const isOwner = await checkBoardAccess(id, context.userId!, true);
      if (!isOwner) {
        throw createAuthorizationError('Only board owner can delete the board');
      }

      // Soft delete
      board.isDeleted = true;
      await board.save();

      // Also soft delete all lists in the board
      await List.updateMany({ board: id }, { isDeleted: true });

      return true;
    },

    addBoardMember: async (
      _: unknown,
      { boardId, userId }: { boardId: string; userId: string },
      context: Context
    ) => {
      requireAuth(context);

      const board = await Board.findById(boardId);

      if (!board) {
        throw createNotFoundError('Board');
      }

      // Only owner can add members
      const isOwner = await checkBoardAccess(boardId, context.userId!, true);
      if (!isOwner) {
        throw createAuthorizationError('Only board owner can add members');
      }

      // Check if user is already a member
      if (board.members.some((memberId) => memberId.toString() === userId)) {
        throw createValidationError('User is already a member of this board');
      }

      board.members.push(userId as any);
      await board.save();

      await board.populate('owner');
      await board.populate('members');

      return board;
    },

    removeBoardMember: async (
      _: unknown,
      { boardId, userId }: { boardId: string; userId: string },
      context: Context
    ) => {
      requireAuth(context);

      const board = await Board.findById(boardId);

      if (!board) {
        throw createNotFoundError('Board');
      }

      // Only owner can remove members (and cannot remove themselves)
      const isOwner = await checkBoardAccess(boardId, context.userId!, true);
      if (!isOwner) {
        throw createAuthorizationError('Only board owner can remove members');
      }

      if (board.owner.toString() === userId) {
        throw createValidationError('Cannot remove board owner');
      }

      board.members = board.members.filter(
        (memberId) => memberId.toString() !== userId
      );
      await board.save();

      await board.populate('owner');
      await board.populate('members');

      return board;
    },
  },

  Board: {
    lists: async (parent: any) => {
      const lists = await List.find({ board: parent._id }).sort({ position: 1 });
      return lists;
    },
  },
};
