import { AuthResolver } from "./auth.resolver";
import { BoardResolver } from "./board.resolver";
import { ColumnResolver } from "./column.resolver";
import { CardResolver } from "./card.resolver";

export const resolvers = {
  Query: {
    ...BoardResolver.Query,
    ...ColumnResolver.Query
  },
  Mutation: {
    ...AuthResolver.Mutation,
    ...BoardResolver.Mutation,
    ...ColumnResolver.Mutation,
    ...CardResolver.Mutation
  },
  Subscription: CardResolver.Subscription
};
