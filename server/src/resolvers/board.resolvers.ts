import { Board, List, Card } from '../models';
import { requireAuth, checkBoardAccess } from '../middleware/auth';
import {
  createNotFoundError,
  createAuthorizationError,
  createValidationError,
} from '../utils/errors';
import { Context } from '../middleware/auth';
import { pubsub, EVENTS } from '../utils/pubsub';
import { checkBoardAdmin } from '../utils/permissions';

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
        .populate('admins')
        .populate('members')
        .sort({ createdAt: -1 });

      return boards;
    },

    board: async (_: unknown, { id }: { id: string }, context: Context) => {
      requireAuth(context);

      const board = await Board.findById(id)
        .populate('owner')
        .populate('admins')
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

    boardStatistics: async (
      _: unknown,
      { boardId }: { boardId: string },
      context: Context
    ) => {
      requireAuth(context);

      const board = await Board.findById(boardId);

      if (!board) {
        throw createNotFoundError('Board');
      }

      // Check access
      const hasAccess = await checkBoardAccess(boardId, context.userId!);
      if (!hasAccess) {
        throw createAuthorizationError('You do not have access to this board');
      }

      // Get all lists for this board
      const lists = await List.find({ board: boardId });
      const listIds = lists.map((list) => list._id);

      // Get all cards for these lists
      const allCards = await Card.find({ list: { $in: listIds } });

      // Calculate statistics
      const completedCards = allCards.filter((card) => card.isArchived).length;
      const pendingCards = allCards.filter((card) => !card.isArchived).length;
      const archivedCards = completedCards;

      const cardsByPriority = {
        low: allCards.filter((card) => card.priority === 'low').length,
        medium: allCards.filter((card) => card.priority === 'medium').length,
        high: allCards.filter((card) => card.priority === 'high').length,
      };

      return {
        totalLists: lists.length,
        totalCards: allCards.length,
        completedCards,
        pendingCards,
        archivedCards,
        totalMembers: board.members.length,
        cardsByPriority,
      };
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
        admins: [context.userId],
        members: [context.userId],
      });

      await board.populate('owner');
      await board.populate('admins');
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
      if (board.owner.toString() !== context.userId) {
        throw createAuthorizationError('Only board owner can update the board');
      }

      Object.assign(board, input);
      await board.save();

      await board.populate('owner');
      await board.populate('admins');
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

      // Only owner can delete board (not admins)
      if (board.owner.toString() !== context.userId) {
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

      // Only admins can add members
      checkBoardAdmin(board, context.userId!);

      // Check if user is already a member
      if (board.members.some((memberId) => memberId.toString() === userId)) {
        throw createValidationError('User is already a member of this board');
      }

      board.members.push(userId as any);
      await board.save();

      await board.populate('owner');
      await board.populate('admins');
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

      // Only admins can remove members (and cannot remove owner)
      checkBoardAdmin(board, context.userId!);

      if (board.owner.toString() === userId) {
        throw createValidationError('Cannot remove board owner');
      }

      board.members = board.members.filter(
        (memberId) => memberId.toString() !== userId
      );

      // Also remove from admins if they were an admin
      board.admins = board.admins.filter(
        (adminId) => adminId.toString() !== userId
      );

      await board.save();

      await board.populate('owner');
      await board.populate('admins');
      await board.populate('members');

      return board;
    },

    addBoardAdmin: async (
      _: unknown,
      { boardId, userId }: { boardId: string; userId: string },
      context: Context
    ) => {
      requireAuth(context);

      const board = await Board.findById(boardId);

      if (!board) {
        throw createNotFoundError('Board');
      }

      // Only owner and existing admins can add new admins
      checkBoardAdmin(board, context.userId!);

      // Check if user is a member
      if (!board.members.some((memberId) => memberId.toString() === userId)) {
        throw createValidationError('User must be a board member first');
      }

      // Check if user is already an admin
      if (board.admins.some((adminId) => adminId.toString() === userId)) {
        throw createValidationError('User is already a board admin');
      }

      board.admins.push(userId as any);
      await board.save();

      await board.populate('owner');
      await board.populate('admins');
      await board.populate('members');

      return board;
    },

    removeBoardAdmin: async (
      _: unknown,
      { boardId, userId }: { boardId: string; userId: string },
      context: Context
    ) => {
      requireAuth(context);

      const board = await Board.findById(boardId);

      if (!board) {
        throw createNotFoundError('Board');
      }

      // Only owner and existing admins can remove admins
      checkBoardAdmin(board, context.userId!);

      if (board.owner.toString() === userId) {
        throw createValidationError('Cannot remove board owner from admins');
      }

      board.admins = board.admins.filter(
        (adminId) => adminId.toString() !== userId
      );
      await board.save();

      await board.populate('owner');
      await board.populate('admins');
      await board.populate('members');

      return board;
    },
  },

  Board: {
    lists: async (parent: any) => {
      const lists = await List.find({ board: parent._id }).sort({ position: 1 });
      return lists;
    },
    statistics: async (parent: any) => {
      // Get all lists for this board
      const lists = await List.find({ board: parent._id });
      const listIds = lists.map((list) => list._id);

      // Get all cards for these lists
      const allCards = await Card.find({ list: { $in: listIds } });

      // Calculate statistics
      const completedCards = allCards.filter((card) => card.isArchived).length;
      const pendingCards = allCards.filter((card) => !card.isArchived).length;
      const archivedCards = completedCards;

      const cardsByPriority = {
        low: allCards.filter((card) => card.priority === 'low').length,
        medium: allCards.filter((card) => card.priority === 'medium').length,
        high: allCards.filter((card) => card.priority === 'high').length,
      };

      return {
        totalLists: lists.length,
        totalCards: allCards.length,
        completedCards,
        pendingCards,
        archivedCards,
        totalMembers: parent.members.length,
        cardsByPriority,
      };
    },
  },
};
