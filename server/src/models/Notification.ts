import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  sender?: mongoose.Types.ObjectId;
  type: 'comment' | 'assignment' | 'mention' | 'board_update' | 'card_update' | 'due_date';
  title: string;
  message: string;
  entityType?: 'board' | 'card' | 'comment';
  entityId?: mongoose.Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    type: {
      type: String,
      required: true,
      enum: ['comment', 'assignment', 'mention', 'board_update', 'card_update', 'due_date'],
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      maxlength: 500,
    },
    entityType: {
      type: String,
      enum: ['board', 'card', 'comment'],
      default: null,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ createdAt: -1 });

export const Notification: Model<INotification> = mongoose.model<INotification>(
  'Notification',
  notificationSchema
);
