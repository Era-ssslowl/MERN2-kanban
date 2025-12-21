import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IActivityLog extends Document {
  user: mongoose.Types.ObjectId;
  action: string;
  entityType: 'board' | 'card' | 'list' | 'comment' | 'user';
  entityId?: mongoose.Types.ObjectId;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'create',
        'update',
        'delete',
        'login',
        'logout',
        'register',
        'assign',
        'unassign',
        'move',
        'archive',
        'comment',
      ],
    },
    entityType: {
      type: String,
      required: true,
      enum: ['board', 'card', 'list', 'comment', 'user'],
    },
    entityId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    details: {
      type: String,
      maxlength: 500,
      default: '',
    },
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Indexes for faster queries
activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ entityType: 1, entityId: 1 });
activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ action: 1 });

export const ActivityLog: Model<IActivityLog> = mongoose.model<IActivityLog>(
  'ActivityLog',
  activityLogSchema
);
