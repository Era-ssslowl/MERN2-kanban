import { CardModel } from "../models/Card.model";
import { pubsub, CARD_UPDATED } from "../graphql/pubsub";

export class CardService {
  static async create(boardId: string, columnId: string, title: string) {
    const card = await CardModel.create({
      board: boardId,
      column: columnId,
      title
    });

    pubsub.publish(CARD_UPDATED, { cardUpdated: card });
    return card;
  }

  static async move(cardId: string, columnId: string) {
    const card = await CardModel.findByIdAndUpdate(
      cardId,
      { column: columnId },
      { new: true }
    );

    if (card) {
      pubsub.publish(CARD_UPDATED, { cardUpdated: card });
    }

    return card;
  }
}
