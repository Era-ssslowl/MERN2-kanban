import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICard extends Document {
  title: string;
  description?: string;
  list: mongoose.Types.ObjectId;
  position: number;
  assignees: mongoose.Types.ObjectId[];
  dueDate?: Date;
  labels: string[];
  priority: 'low' | 'medium' | 'high';
  isArchived: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const cardSchema = new Schema<ICard>(
  {
    title: {
      type: String,
      required: [true, 'Card title is required'],
      trim: true,
      minlength: [1, 'Title must be at least 1 character'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
      default: '',
    },
    list: {
      type: Schema.Types.ObjectId,
      ref: 'List',
      required: [true, 'List reference is required'],
    },
    position: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Position cannot be negative'],
    },
    assignees: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    dueDate: {
      type: Date,
      default: null,
    },
    labels: [
      {
        type: String,
        trim: true,
        maxlength: [30, 'Label cannot exceed 30 characters'],
      },
    ],
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
cardSchema.index({ list: 1, position: 1 });
cardSchema.index({ assignees: 1 });
cardSchema.index({ dueDate: 1 });
cardSchema.index({ isDeleted: 1 });

// Virtual for comments
cardSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'card',
});

// Filter out deleted cards
cardSchema.pre(/^find/, function (next) {
  // @ts-ignore
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const Card: Model<ICard> = mongoose.model<ICard>('Card', cardSchema);
