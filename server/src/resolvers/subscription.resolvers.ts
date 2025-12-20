import { pubsub, EVENTS } from '../utils/pubsub';
import { requireAuth } from '../middleware/auth';
import { Context } from '../middleware/auth';

export const subscriptionResolvers = {
  Subscription: {
    cardCreated: {
      subscribe: (_: unknown, { boardId: _boardId }: { boardId: string }, context: Context) => {
        requireAuth(context);
        return pubsub.asyncIterator([EVENTS.CARD_CREATED]);
      },
      resolve: (payload: any, { boardId: _boardId }: { boardId: string }) => {
        // Filter by boardId
        if (payload.boardId === _boardId) {
          return payload.cardCreated;
        }
        return null;
      },
    },

    cardUpdated: {
      subscribe: (_: unknown, { boardId: _boardId }: { boardId: string }, context: Context) => {
        requireAuth(context);
        return pubsub.asyncIterator([EVENTS.CARD_UPDATED]);
      },
      resolve: (payload: any, { boardId: _boardId }: { boardId: string }) => {
        if (payload.boardId === _boardId) {
          return payload.cardUpdated;
        }
        return null;
      },
    },

    cardMoved: {
      subscribe: (_: unknown, { boardId: _boardId }: { boardId: string }, context: Context) => {
        requireAuth(context);
        return pubsub.asyncIterator([EVENTS.CARD_MOVED]);
      },
      resolve: (payload: any, { boardId: _boardId }: { boardId: string }) => {
        if (payload.boardId === _boardId) {
          return payload.cardMoved;
        }
        return null;
      },
    },

    cardDeleted: {
      subscribe: (_: unknown, { boardId: _boardId }: { boardId: string }, context: Context) => {
        requireAuth(context);
        return pubsub.asyncIterator([EVENTS.CARD_DELETED]);
      },
      resolve: (payload: any, { boardId: _boardId }: { boardId: string }) => {
        if (payload.boardId === _boardId) {
          return payload.cardDeleted;
        }
        return null;
      },
    },

    commentAdded: {
      subscribe: (_: unknown, { cardId: _cardId }: { cardId: string }, context: Context) => {
        requireAuth(context);
        return pubsub.asyncIterator([EVENTS.COMMENT_ADDED]);
      },
      resolve: (payload: any, { cardId: _cardId }: { cardId: string }) => {
        if (payload.cardId === _cardId) {
          return payload.commentAdded;
        }
        return null;
      },
    },

    commentUpdated: {
      subscribe: (_: unknown, { cardId: _cardId }: { cardId: string }, context: Context) => {
        requireAuth(context);
        return pubsub.asyncIterator([EVENTS.COMMENT_UPDATED]);
      },
      resolve: (payload: any, { cardId: _cardId }: { cardId: string }) => {
        if (payload.cardId === _cardId) {
          return payload.commentUpdated;
        }
        return null;
      },
    },

    commentDeleted: {
      subscribe: (_: unknown, { cardId: _cardId }: { cardId: string }, context: Context) => {
        requireAuth(context);
        return pubsub.asyncIterator([EVENTS.COMMENT_DELETED]);
      },
      resolve: (payload: any, { cardId: _cardId }: { cardId: string }) => {
        if (payload.cardId === _cardId) {
          return payload.commentDeleted;
        }
        return null;
      },
    },

    boardUpdated: {
      subscribe: (_: unknown, { boardId: _boardId }: { boardId: string }, context: Context) => {
        requireAuth(context);
        return pubsub.asyncIterator([EVENTS.BOARD_UPDATED]);
      },
      resolve: (payload: any, { boardId: _boardId }: { boardId: string }) => {
        if (payload.boardId === _boardId) {
          return payload.boardUpdated;
        }
        return null;
      },
    },
  },
};
