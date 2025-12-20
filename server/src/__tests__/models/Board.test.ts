import { Board } from '../../models/Board';
import mongoose from 'mongoose';

describe('Board Model', () => {
  const mockUserId = new mongoose.Types.ObjectId();

  describe('Schema Validation', () => {
    it('should create board with valid data', () => {
      const validBoard = new Board({
        title: 'My Board',
        owner: mockUserId,
      });

      expect(validBoard.title).toBe('My Board');
      expect(validBoard.owner).toEqual(mockUserId);
      expect(validBoard.backgroundColor).toBe('#0079BF');
      expect(validBoard.isPrivate).toBe(false);
      expect(validBoard.isDeleted).toBe(false);
    });

    it('should fail without required title', () => {
      const invalidBoard = new Board({
        owner: mockUserId,
      });

      const error = invalidBoard.validateSync();
      expect(error?.errors.title).toBeDefined();
    });

    it('should fail without required owner', () => {
      const invalidBoard = new Board({
        title: 'My Board',
      });

      const error = invalidBoard.validateSync();
      expect(error?.errors.owner).toBeDefined();
    });

    it('should trim title', () => {
      const board = new Board({
        title: '  My Board  ',
        owner: mockUserId,
      });

      expect(board.title).toBe('My Board');
    });

    it('should accept custom backgroundColor', () => {
      const board = new Board({
        title: 'My Board',
        owner: mockUserId,
        backgroundColor: '#FF5733',
      });

      expect(board.backgroundColor).toBe('#FF5733');
    });

    it('should set default members array', () => {
      const board = new Board({
        title: 'My Board',
        owner: mockUserId,
      });

      expect(Array.isArray(board.members)).toBe(true);
    });
  });
});
