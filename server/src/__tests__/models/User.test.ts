import { User } from '../../models/User';

describe('User Model', () => {
  describe('Schema Validation', () => {
    it('should create user with valid data', () => {
      const validUser = new User({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

      expect(validUser.email).toBe('test@example.com');
      expect(validUser.name).toBe('Test User');
      expect(validUser.role).toBe('user');
      expect(validUser.isDeleted).toBe(false);
    });

    it('should fail without required email', () => {
      const invalidUser = new User({
        password: 'password123',
        name: 'Test User',
      });

      const error = invalidUser.validateSync();
      expect(error?.errors.email).toBeDefined();
    });

    it('should fail without required password', () => {
      const invalidUser = new User({
        email: 'test@example.com',
        name: 'Test User',
      });

      const error = invalidUser.validateSync();
      expect(error?.errors.password).toBeDefined();
    });

    it('should fail without required name', () => {
      const invalidUser = new User({
        email: 'test@example.com',
        password: 'password123',
      });

      const error = invalidUser.validateSync();
      expect(error?.errors.name).toBeDefined();
    });

    it('should lowercase email', () => {
      const user = new User({
        email: 'TEST@EXAMPLE.COM',
        password: 'password123',
        name: 'Test User',
      });

      expect(user.email).toBe('test@example.com');
    });

    it('should trim name', () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password123',
        name: '  Test User  ',
      });

      expect(user.name).toBe('Test User');
    });

    it('should set default role to user', () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

      expect(user.role).toBe('user');
    });

    it('should allow admin role', () => {
      const user = new User({
        email: 'admin@example.com',
        password: 'password123',
        name: 'Admin User',
        role: 'admin',
      });

      expect(user.role).toBe('admin');
    });
  });
});
