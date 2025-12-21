import { ActivityLog } from '../models';
import mongoose from 'mongoose';

interface LogActivityParams {
  userId: string | mongoose.Types.ObjectId;
  action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'register' | 'assign' | 'unassign' | 'move' | 'archive' | 'comment';
  entityType: 'board' | 'card' | 'list' | 'comment' | 'user';
  entityId?: string | mongoose.Types.ObjectId;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Log user activity
 * @param params Activity log parameters
 * @returns Created activity log document
 */
export async function logActivity(params: LogActivityParams) {
  try {
    const activityLog = await ActivityLog.create({
      user: params.userId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId || null,
      details: params.details || '',
      ipAddress: params.ipAddress || null,
      userAgent: params.userAgent || null,
    });

    return activityLog;
  } catch (error) {
    console.error('Error logging activity:', error);
    // Don't throw error to prevent breaking the main operation
    return null;
  }
}

/**
 * Helper to extract IP address and user agent from context
 * @param context GraphQL context
 * @returns Object with ipAddress and userAgent
 */
export function getClientInfo(context: any): { ipAddress?: string; userAgent?: string } {
  const req = context.req;

  if (!req) {
    return {};
  }

  const ipAddress =
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    undefined;

  const userAgent = req.headers['user-agent'] || undefined;

  return { ipAddress, userAgent };
}

/**
 * Convenience function to log activity with context
 * @param context GraphQL context
 * @param params Activity parameters (without client info)
 */
export async function logActivityWithContext(
  context: any,
  params: Omit<LogActivityParams, 'ipAddress' | 'userAgent'>
) {
  const clientInfo = getClientInfo(context);

  return logActivity({
    ...params,
    ...clientInfo,
  });
}
