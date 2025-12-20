import { GraphQLError } from 'graphql';

export enum ErrorCode {
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  FORBIDDEN = 'FORBIDDEN',
  BAD_REQUEST = 'BAD_REQUEST',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

export class AppError extends GraphQLError {
  constructor(message: string, code: ErrorCode, extensions?: Record<string, unknown>) {
    super(message, {
      extensions: {
        code,
        ...extensions,
      },
    });
  }
}

export const createAuthenticationError = (message = 'Not authenticated'): AppError => {
  return new AppError(message, ErrorCode.UNAUTHENTICATED);
};

export const createAuthorizationError = (message = 'Not authorized'): AppError => {
  return new AppError(message, ErrorCode.FORBIDDEN);
};

export const createValidationError = (message: string, fields?: Record<string, string>): AppError => {
  return new AppError(message, ErrorCode.VALIDATION_ERROR, { fields });
};

export const createNotFoundError = (resource: string): AppError => {
  return new AppError(`${resource} not found`, ErrorCode.NOT_FOUND);
};

export const createBadRequestError = (message: string): AppError => {
  return new AppError(message, ErrorCode.BAD_REQUEST);
};
