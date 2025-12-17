import { Schema, model, Types } from "mongoose";

const BoardSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    owner: { type: Types.ObjectId, ref: "User", required: true },
    members: [{ type: Types.ObjectId, ref: "User" }],
    isArchived: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const BoardModel = model("Board", BoardSchema);
