import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBoard extends Document {
  title: string;
  description?: string;
  owner: mongoose.Types.ObjectId;
  admins: mongoose.Types.ObjectId[];
  members: mongoose.Types.ObjectId[];
  backgroundColor: string;
  isPrivate: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const boardSchema = new Schema<IBoard>(
  {
    title: {
      type: String,
      required: [true, 'Board title is required'],
      trim: true,
      minlength: [1, 'Title must be at least 1 character'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Board owner is required'],
    },
    admins: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    backgroundColor: {
      type: String,
      default: '#0079BF',
      validate: {
        validator: (value: string) => /^#[0-9A-F]{6}$/i.test(value),
        message: 'Invalid color format. Use hex color (e.g., #0079BF)',
      },
    },
    isPrivate: {
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
boardSchema.index({ owner: 1, createdAt: -1 });
boardSchema.index({ admins: 1 });
boardSchema.index({ members: 1 });
boardSchema.index({ isDeleted: 1 });

// Virtual for lists
boardSchema.virtual('lists', {
  ref: 'List',
  localField: '_id',
  foreignField: 'board',
});

// Add owner to admins and members automatically
boardSchema.pre('save', function (next) {
  if (this.isNew) {
    if (!this.admins.includes(this.owner)) {
      this.admins.push(this.owner);
    }
    if (!this.members.includes(this.owner)) {
      this.members.push(this.owner);
    }
  }
  next();
});

// Filter out deleted boards
boardSchema.pre(/^find/, function (next) {
  // @ts-ignore
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const Board: Model<IBoard> = mongoose.model<IBoard>('Board', boardSchema);
