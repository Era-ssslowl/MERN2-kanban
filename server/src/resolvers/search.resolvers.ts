import { Context } from '../middleware/auth';
import { Board, Card, List } from '../models';
import { AuthenticationError } from '../utils/errors';

export const searchResolvers = {
  Query: {
    search: async (_: any, { query }: { query: string }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }

      const searchRegex = new RegExp(query, 'i');

      // Search boards where user is a member
      const boards = await Board.find({
        members: context.user.id,
        $or: [{ title: searchRegex }, { description: searchRegex }],
      })
        .populate('owner')
        .populate('members')
        .limit(20);

      // Get all lists from user's boards
      const userBoards = await Board.find({ members: context.user.id });
      const boardIds = userBoards.map((board) => board._id);

      const lists = await List.find({ board: { $in: boardIds } });
      const listIds = lists.map((list) => list._id);

      // Search cards in user's boards
      const cards = await Card.find({
        list: { $in: listIds },
        $or: [{ title: searchRegex }, { description: searchRegex }, { labels: searchRegex }],
      })
        .populate('list')
        .populate('assignees')
        .limit(50);

      return {
        boards,
        cards,
      };
    },
  },
};
