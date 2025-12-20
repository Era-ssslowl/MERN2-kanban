import { Comment, Card, List } from '../models';
import { requireAuth, checkBoardAccess } from '../middleware/auth';
import {
  createNotFoundError,
  createAuthorizationError,
} from '../utils/errors';
import { Context } from '../middleware/auth';
import { pubsub, EVENTS } from '../utils/pubsub';

export interface CreateCommentInput {
  cardId: string;
  content: string;
}

export interface UpdateCommentInput {
  content: string;
}

export const commentResolvers = {
  Query: {
    comments: async (
      _: unknown,
      { cardId }: { cardId: string },
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

      const comments = await Comment.find({ card: cardId })
        .populate('author')
        .sort({ createdAt: 1 });

      return comments;
    },
  },

  Mutation: {
    createComment: async (
      _: unknown,
      { input }: { input: CreateCommentInput },
      context: Context
    ) => {
      requireAuth(context);

      const { cardId, content } = input;

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

      const comment = await Comment.create({
        card: cardId,
        content,
        author: context.userId,
      });

      await comment.populate('card');
      await comment.populate('author');

      // Publish event
      pubsub.publish(EVENTS.COMMENT_ADDED, {
        commentAdded: comment,
        cardId: cardId,
      });

      return comment;
    },

    updateComment: async (
      _: unknown,
      { id, input }: { id: string; input: UpdateCommentInput },
      context: Context
    ) => {
      requireAuth(context);

      const comment = await Comment.findById(id);

      if (!comment) {
        throw createNotFoundError('Comment');
      }

      // Only author can update comment
      if (comment.author.toString() !== context.userId) {
        throw createAuthorizationError('Only comment author can update the comment');
      }

      comment.content = input.content;
      await comment.save();

      await comment.populate('card');
      await comment.populate('author');

      // Publish event
      pubsub.publish(EVENTS.COMMENT_UPDATED, {
        commentUpdated: comment,
        cardId: comment.card.toString(),
      });

      return comment;
    },

    deleteComment: async (
      _: unknown,
      { id }: { id: string },
      context: Context
    ) => {
      requireAuth(context);

      const comment = await Comment.findById(id);

      if (!comment) {
        throw createNotFoundError('Comment');
      }

      // Only author can delete comment
      if (comment.author.toString() !== context.userId) {
        throw createAuthorizationError('Only comment author can delete the comment');
      }

      const cardId = comment.card.toString();

      // Soft delete
      comment.isDeleted = true;
      await comment.save();

      // Publish event
      pubsub.publish(EVENTS.COMMENT_DELETED, {
        commentDeleted: id,
        cardId: cardId,
      });

      return true;
    },
  },
};
