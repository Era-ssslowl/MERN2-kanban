import { GraphQLError } from 'graphql';
import mongoose from 'mongoose';
import { List } from '../models/List';
import { Card } from '../models/Card';

export const isBoardOwner = (board: any, userId: string): boolean => {
  return board.owner.toString() === userId;
};

export const isBoardAdmin = (board: any, userId: string): boolean => {
  return (
    board.owner.toString() === userId ||
    board.admins.some((adminId: mongoose.Types.ObjectId) => adminId.toString() === userId)
  );
};

export const isBoardMember = (board: any, userId: string): boolean => {
  return board.members.some(
    (memberId: mongoose.Types.ObjectId) => memberId.toString() === userId
  );
};

export const checkBoardOwner = (board: any, userId: string): void => {
  if (!isBoardOwner(board, userId)) {
    throw new GraphQLError('Only board owner can perform this action', {
      extensions: { code: 'FORBIDDEN' },
    });
  }
};

export const checkBoardAdmin = (board: any, userId: string): void => {
  if (!isBoardAdmin(board, userId)) {
    throw new GraphQLError('Only board admins can perform this action', {
      extensions: { code: 'FORBIDDEN' },
    });
  }
};

export const checkBoardMember = (board: any, userId: string): void => {
  if (!isBoardMember(board, userId)) {
    throw new GraphQLError('You must be a board member to perform this action', {
      extensions: { code: 'FORBIDDEN' },
    });
  }
};

export const getBoardFromList = async (listId: string): Promise<any> => {
  const list = await List.findById(listId).populate('board');
  if (!list) {
    throw new GraphQLError('List not found', {
      extensions: { code: 'NOT_FOUND' },
    });
  }
  return list.board;
};

export const getBoardFromCard = async (cardId: string): Promise<any> => {
  const card = await Card.findById(cardId).populate({
    path: 'list',
    populate: { path: 'board' },
  });
  if (!card) {
    throw new GraphQLError('Card not found', {
      extensions: { code: 'NOT_FOUND' },
    });
  }
  return (card.list as any).board;
};
