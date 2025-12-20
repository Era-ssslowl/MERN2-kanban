import { GraphQLDateTime } from 'graphql-scalars';
import { authResolvers } from './auth.resolvers';
import { userResolvers } from './user.resolvers';
import { boardResolvers } from './board.resolvers';
import { listResolvers } from './list.resolvers';
import { cardResolvers } from './card.resolvers';
import { commentResolvers } from './comment.resolvers';
import { subscriptionResolvers } from './subscription.resolvers';

export const resolvers = {
  DateTime: GraphQLDateTime,

  Query: {
    ...userResolvers.Query,
    ...boardResolvers.Query,
    ...listResolvers.Query,
    ...cardResolvers.Query,
    ...commentResolvers.Query,
  },

  Mutation: {
    ...authResolvers.Mutation,
    ...boardResolvers.Mutation,
    ...listResolvers.Mutation,
    ...cardResolvers.Mutation,
    ...commentResolvers.Mutation,
  },

  Subscription: {
    ...subscriptionResolvers.Subscription,
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
