import { CardService } from "../../services/card.service";

export const CardResolver = {
  Mutation: {
    createCard: (_: any, args: any) =>
      CardService.create(args.boardId, args.columnId, args.title),
    moveCard: (_: any, args: any) =>
      CardService.move(args.cardId, args.columnId)
  },
  Subscription: {
    cardUpdated: {
      subscribe: (_: any, __: any, { pubsub }: any) =>
        pubsub.asyncIterator(["CARD_UPDATED"])
    }
  }
};
