import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IComment extends Document {
  content: string;
  card: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
      minlength: [1, 'Content must be at least 1 character'],
      maxlength: [2000, 'Content cannot exceed 2000 characters'],
    },
    card: {
      type: Schema.Types.ObjectId,
      ref: 'Card',
      required: [true, 'Card reference is required'],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    isEdited: {
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
commentSchema.index({ card: 1, createdAt: -1 });
commentSchema.index({ author: 1 });
commentSchema.index({ isDeleted: 1 });

// Mark as edited when content is modified
commentSchema.pre('save', function (next) {
  if (this.isModified('content') && !this.isNew) {
    this.isEdited = true;
  }
  next();
});

// Filter out deleted comments
commentSchema.pre(/^find/, function (next) {
  // @ts-ignore
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const Comment: Model<IComment> = mongoose.model<IComment>('Comment', commentSchema);
