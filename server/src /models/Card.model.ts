import { Schema, model, Types } from "mongoose";

const CardSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    board: { type: Types.ObjectId, ref: "Board", required: true },
    column: { type: Types.ObjectId, ref: "Column", required: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const CardModel = model("Card", CardSchema);
