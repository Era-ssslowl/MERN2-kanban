import { List, Card, Board } from '../models';
import { requireAuth, checkBoardAccess } from '../middleware/auth';
import {
  createNotFoundError,
  createAuthorizationError,
} from '../utils/errors';
import { Context } from '../middleware/auth';
import { checkBoardAdmin } from '../utils/permissions';

export interface CreateListInput {
  title: string;
  boardId: string;
  position?: number;
}

export interface UpdateListInput {
  title?: string;
  position?: number;
  isArchived?: boolean;
}

export interface MoveListInput {
  listId: string;
  position: number;
}

export const listResolvers = {
  Query: {
    lists: async (_: unknown, { boardId }: { boardId: string }, context: Context) => {
      requireAuth(context);

      // Check board access
      const hasAccess = await checkBoardAccess(boardId, context.userId!);
      if (!hasAccess) {
        throw createAuthorizationError('You do not have access to this board');
      }

      const lists = await List.find({ board: boardId }).sort({ position: 1 });
      return lists;
    },
  },

  Mutation: {
    createList: async (
      _: unknown,
      { input }: { input: CreateListInput },
      context: Context
    ) => {
      requireAuth(context);

      const { boardId, title, position } = input;

      // Get board and check admin access
      const board = await Board.findById(boardId);
      if (!board) {
        throw createNotFoundError('Board');
      }

      // Only admins can create lists
      checkBoardAdmin(board, context.userId!);

      // Get max position if not provided
      let listPosition = position;
      if (listPosition === undefined) {
        const maxPositionList = await List.findOne({ board: boardId })
          .sort({ position: -1 })
          .limit(1);
        listPosition = maxPositionList ? maxPositionList.position + 1 : 0;
      }

      const list = await List.create({
        title,
        board: boardId,
        position: listPosition,
      });

      await list.populate('board');

      return list;
    },

    updateList: async (
      _: unknown,
      { id, input }: { id: string; input: UpdateListInput },
      context: Context
    ) => {
      requireAuth(context);

      const list = await List.findById(id).populate('board');

      if (!list) {
        throw createNotFoundError('List');
      }

      // Only admins can update lists
      checkBoardAdmin(list.board, context.userId!);

      Object.assign(list, input);
      await list.save();

      await list.populate('board');

      return list;
    },

    moveList: async (
      _: unknown,
      { input }: { input: MoveListInput },
      context: Context
    ) => {
      requireAuth(context);

      const { listId, position } = input;
      const list = await List.findById(listId);

      if (!list) {
        throw createNotFoundError('List');
      }

      // Check board access
      const hasAccess = await checkBoardAccess(
        list.board.toString(),
        context.userId!
      );
      if (!hasAccess) {
        throw createAuthorizationError('You do not have access to this board');
      }

      list.position = position;
      await list.save();
      await list.populate('board');

      return list;
    },

    deleteList: async (_: unknown, { id }: { id: string }, context: Context) => {
      requireAuth(context);

      const list = await List.findById(id).populate('board');

      if (!list) {
        throw createNotFoundError('List');
      }

      // Only admins can delete lists
      checkBoardAdmin(list.board, context.userId!);

      // Soft delete
      list.isDeleted = true;
      await list.save();

      // Also soft delete all cards in the list
      await Card.updateMany({ list: id }, { isDeleted: true });

      return true;
    },
  },

  List: {
    cards: async (parent: any) => {
      const cards = await Card.find({ list: parent._id }).sort({ position: 1 });
      return cards;
    },
  },
};
