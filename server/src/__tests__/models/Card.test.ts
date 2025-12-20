import { Card } from '../../models/Card';
import mongoose from 'mongoose';

describe('Card Model', () => {
  const mockListId = new mongoose.Types.ObjectId();

  describe('Schema Validation', () => {
    it('should create card with valid data', () => {
      const validCard = new Card({
        title: 'My Task',
        list: mockListId,
        position: 0,
      });

      expect(validCard.title).toBe('My Task');
      expect(validCard.list).toEqual(mockListId);
      expect(validCard.position).toBe(0);
      expect(validCard.priority).toBe('medium');
      expect(validCard.isArchived).toBe(false);
    });

    it('should fail without required title', () => {
      const invalidCard = new Card({
        list: mockListId,
        position: 0,
      });

      const error = invalidCard.validateSync();
      expect(error?.errors.title).toBeDefined();
    });

    it('should fail without required list', () => {
      const invalidCard = new Card({
        title: 'My Task',
        position: 0,
      });

      const error = invalidCard.validateSync();
      expect(error?.errors.list).toBeDefined();
    });

    it('should set default priority to medium', () => {
      const card = new Card({
        title: 'My Task',
        list: mockListId,
      });

      expect(card.priority).toBe('medium');
    });

    it('should accept valid priority values', () => {
      const cardLow = new Card({
        title: 'Low Priority',
        list: mockListId,
        priority: 'low',
      });

      const cardHigh = new Card({
        title: 'High Priority',
        list: mockListId,
        priority: 'high',
      });

      expect(cardLow.priority).toBe('low');
      expect(cardHigh.priority).toBe('high');
    });

    it('should set default assignees to empty array', () => {
      const card = new Card({
        title: 'My Task',
        list: mockListId,
      });

      expect(Array.isArray(card.assignees)).toBe(true);
      expect(card.assignees.length).toBe(0);
    });

    it('should set default labels to empty array', () => {
      const card = new Card({
        title: 'My Task',
        list: mockListId,
      });

      expect(Array.isArray(card.labels)).toBe(true);
      expect(card.labels.length).toBe(0);
    });
  });
});
