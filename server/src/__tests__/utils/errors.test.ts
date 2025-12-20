import {
  ErrorCode,
  createAuthenticationError,
  createAuthorizationError,
  createValidationError,
  createNotFoundError,
  createBadRequestError,
} from '../../utils/errors';

describe('Error Utils', () => {
  describe('createAuthenticationError', () => {
    it('should create authentication error with default message', () => {
      const error = createAuthenticationError();
      expect(error.message).toBe('Not authenticated');
      expect(error.extensions?.code).toBe(ErrorCode.UNAUTHENTICATED);
    });

    it('should create authentication error with custom message', () => {
      const error = createAuthenticationError('Custom auth error');
      expect(error.message).toBe('Custom auth error');
    });
  });

  describe('createAuthorizationError', () => {
    it('should create authorization error with default message', () => {
      const error = createAuthorizationError();
      expect(error.message).toBe('Not authorized');
      expect(error.extensions?.code).toBe(ErrorCode.FORBIDDEN);
    });

    it('should create authorization error with custom message', () => {
      const error = createAuthorizationError('Admin only');
      expect(error.message).toBe('Admin only');
    });
  });

  describe('createValidationError', () => {
    it('should create validation error', () => {
      const error = createValidationError('Invalid input');
      expect(error.message).toBe('Invalid input');
      expect(error.extensions?.code).toBe(ErrorCode.VALIDATION_ERROR);
    });

    it('should create validation error with field details', () => {
      const fields = { email: 'Invalid email format' };
      const error = createValidationError('Validation failed', fields);
      expect(error.extensions?.fields).toEqual(fields);
    });
  });

  describe('createNotFoundError', () => {
    it('should create not found error', () => {
      const error = createNotFoundError('User');
      expect(error.message).toBe('User not found');
      expect(error.extensions?.code).toBe(ErrorCode.NOT_FOUND);
    });
  });

  describe('createBadRequestError', () => {
    it('should create bad request error', () => {
      const error = createBadRequestError('Invalid request');
      expect(error.message).toBe('Invalid request');
      expect(error.extensions?.code).toBe(ErrorCode.BAD_REQUEST);
    });
  });
});
