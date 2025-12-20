import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IList extends Document {
  title: string;
  board: mongoose.Types.ObjectId;
  position: number;
  cardLimit?: number;
  isArchived: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const listSchema = new Schema<IList>(
  {
    title: {
      type: String,
      required: [true, 'List title is required'],
      trim: true,
      minlength: [1, 'Title must be at least 1 character'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    board: {
      type: Schema.Types.ObjectId,
      ref: 'Board',
      required: [true, 'Board reference is required'],
    },
    position: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Position cannot be negative'],
    },
    cardLimit: {
      type: Number,
      default: null,
      min: [1, 'Card limit must be at least 1'],
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
listSchema.index({ board: 1, position: 1 });
listSchema.index({ isDeleted: 1 });

// Virtual for cards
listSchema.virtual('cards', {
  ref: 'Card',
  localField: '_id',
  foreignField: 'list',
});

// Filter out deleted lists
listSchema.pre(/^find/, function (next) {
  // @ts-ignore
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const List: Model<IList> = mongoose.model<IList>('List', listSchema);
