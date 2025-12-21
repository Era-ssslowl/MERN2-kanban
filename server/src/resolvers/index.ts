import { GraphQLDateTime } from 'graphql-scalars';
import { authResolvers } from './auth.resolvers';
import { userResolvers } from './user.resolvers';
import { boardResolvers } from './board.resolvers';
import { listResolvers } from './list.resolvers';
import { cardResolvers } from './card.resolvers';
import { commentResolvers } from './comment.resolvers';
import { subscriptionResolvers } from './subscription.resolvers';
import { analyticsResolvers } from './analytics.resolvers';
import { notificationResolvers } from './notification.resolvers';
import { searchResolvers } from './search.resolvers';

export const resolvers = {
  DateTime: GraphQLDateTime,

  Query: {
    ...userResolvers.Query,
    ...boardResolvers.Query,
    ...listResolvers.Query,
    ...cardResolvers.Query,
    ...commentResolvers.Query,
    ...analyticsResolvers.Query,
    ...notificationResolvers.Query,
    ...searchResolvers.Query,
  },

  Mutation: {
    ...authResolvers.Mutation,
    ...userResolvers.Mutation,
    ...boardResolvers.Mutation,
    ...listResolvers.Mutation,
    ...cardResolvers.Mutation,
    ...commentResolvers.Mutation,
    ...notificationResolvers.Mutation,
  },

  Subscription: {
    ...subscriptionResolvers.Subscription,
    ...notificationResolvers.Subscription,
  },

  Board: {
    ...boardResolvers.Board,
  },

  List: {
    ...listResolvers.List,
  },

  Card: {
    ...cardResolvers.Card,
  },
};
