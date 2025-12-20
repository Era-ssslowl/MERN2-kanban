import { Card, List, Comment } from '../models';
import { requireAuth, checkBoardAccess } from '../middleware/auth';
import {
  createNotFoundError,
  createAuthorizationError,
} from '../utils/errors';
import { Context } from '../middleware/auth';
import { pubsub, EVENTS } from '../utils/pubsub';

export interface CreateCardInput {
  title: string;
  listId: string;
  description?: string;
  position?: number;
  dueDate?: Date;
  labels?: string[];
  priority?: 'low' | 'medium' | 'high';
}

export interface UpdateCardInput {
  title?: string;
  description?: string;
  dueDate?: Date;
  labels?: string[];
  priority?: 'low' | 'medium' | 'high';
  isArchived?: boolean;
}

export interface MoveCardInput {
  cardId: string;
  targetListId: string;
  position: number;
}

export const cardResolvers = {
  Query: {
    card: async (_: unknown, { id }: { id: string }, context: Context) => {
      requireAuth(context);

      const card = await Card.findById(id)
        .populate('list')
        .populate('assignees');

      if (!card) {
        throw createNotFoundError('Card');
      }

      // Check board access through list
      const list = await List.findById(card.list);
      if (list) {
        const hasAccess = await checkBoardAccess(
          list.board.toString(),
          context.userId!
        );
        if (!hasAccess) {
          throw createAuthorizationError('You do not have access to this board');
        }
      }

      return card;
    },

    cards: async (_: unknown, { listId }: { listId: string }, context: Context) => {
      requireAuth(context);

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

      const cards = await Card.find({ list: listId })
        .populate('assignees')
        .sort({ position: 1 });

      return cards;
    },
  },

  Mutation: {
    createCard: async (
      _: unknown,
      { input }: { input: CreateCardInput },
      context: Context
    ) => {
      requireAuth(context);

      const { listId, title, position, ...rest } = input;

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

      // Get max position if not provided
      let cardPosition = position;
      if (cardPosition === undefined) {
        const maxPositionCard = await Card.findOne({ list: listId })
          .sort({ position: -1 })
          .limit(1);
        cardPosition = maxPositionCard ? maxPositionCard.position + 1 : 0;
      }

      const card = await Card.create({
        title,
        list: listId,
        position: cardPosition,
        ...rest,
      });

      await card.populate('list');
      await card.populate('assignees');

      // Publish event
      pubsub.publish(EVENTS.CARD_CREATED, {
        cardCreated: card,
        boardId: list.board.toString(),
      });

      return card;
    },

    updateCard: async (
      _: unknown,
      { id, input }: { id: string; input: UpdateCardInput },
      context: Context
    ) => {
      requireAuth(context);

      const card = await Card.findById(id);

      if (!card) {
        throw createNotFoundError('Card');
      }

      // Check board access
      const list = await List.findById(card.list);
      if (list) {
        const hasAccess = await checkBoardAccess(
          list.board.toString(),
          context.userId!
        );
        if (!hasAccess) {
          throw createAuthorizationError('You do not have access to this board');
        }
      }

      Object.assign(card, input);
      await card.save();

      await card.populate('list');
      await card.populate('assignees');

      // Publish event
      if (list) {
        pubsub.publish(EVENTS.CARD_UPDATED, {
          cardUpdated: card,
          boardId: list.board.toString(),
        });
      }

      return card;
    },

    moveCard: async (
      _: unknown,
      { input }: { input: MoveCardInput },
      context: Context
    ) => {
      requireAuth(context);

      const { cardId, targetListId, position } = input;

      const card = await Card.findById(cardId);

      if (!card) {
        throw createNotFoundError('Card');
      }

      const targetList = await List.findById(targetListId);

      if (!targetList) {
        throw createNotFoundError('Target List');
      }

      // Check board access
      const hasAccess = await checkBoardAccess(
        targetList.board.toString(),
        context.userId!
      );
      if (!hasAccess) {
        throw createAuthorizationError('You do not have access to this board');
      }

      card.list = targetListId as any;
      card.position = position;
      await card.save();

      await card.populate('list');
      await card.populate('assignees');

      // Publish event
      pubsub.publish(EVENTS.CARD_MOVED, {
        cardMoved: card,
        boardId: targetList.board.toString(),
      });

      return card;
    },

    deleteCard: async (_: unknown, { id }: { id: string }, context: Context) => {
      requireAuth(context);

      const card = await Card.findById(id);

      if (!card) {
        throw createNotFoundError('Card');
      }

      // Check board access
      const list = await List.findById(card.list);
      if (list) {
        const hasAccess = await checkBoardAccess(
          list.board.toString(),
          context.userId!
        );
        if (!hasAccess) {
          throw createAuthorizationError('You do not have access to this board');
        }

        // Soft delete
        card.isDeleted = true;
        await card.save();

        // Also soft delete all comments
        await Comment.updateMany({ card: id }, { isDeleted: true });

        // Publish event
        pubsub.publish(EVENTS.CARD_DELETED, {
          cardDeleted: id,
          boardId: list.board.toString(),
        });
      }

      return true;
    },

    assignCard: async (
      _: unknown,
      { cardId, userId }: { cardId: string; userId: string },
      context: Context
    ) => {
      requireAuth(context);

      const card = await Card.findById(cardId);

      if (!card) {
        throw createNotFoundError('Card');
      }

      // Check board access
      const list = await List.findById(card.list);
      if (list) {
        const hasAccess = await checkBoardAccess(
          list.board.toString(),
          context.userId!
        );
        if (!hasAccess) {
          throw createAuthorizationError('You do not have access to this board');
        }
      }

      // Check if user is already assigned
      if (!card.assignees.some((assigneeId) => assigneeId.toString() === userId)) {
        card.assignees.push(userId as any);
        await card.save();
      }

      await card.populate('list');
      await card.populate('assignees');

      return card;
    },

    unassignCard: async (
      _: unknown,
      { cardId, userId }: { cardId: string; userId: string },
      context: Context
    ) => {
      requireAuth(context);

      const card = await Card.findById(cardId);

      if (!card) {
        throw createNotFoundError('Card');
      }

      // Check board access
      const list = await List.findById(card.list);
      if (list) {
        const hasAccess = await checkBoardAccess(
          list.board.toString(),
          context.userId!
        );
        if (!hasAccess) {
          throw createAuthorizationError('You do not have access to this board');
        }
      }

      card.assignees = card.assignees.filter(
        (assigneeId) => assigneeId.toString() !== userId
      );
      await card.save();

      await card.populate('list');
      await card.populate('assignees');

      return card;
    },
  },

  Card: {
    comments: async (parent: any) => {
      const comments = await Comment.find({ card: parent._id })
        .populate('author')
        .sort({ createdAt: 1 });
      return comments;
    },
    priority: (parent: any) => parent.priority.toUpperCase(),
  },
};
