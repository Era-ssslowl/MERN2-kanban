import { Schema, model, Types } from "mongoose";

const ColumnSchema = new Schema(
  {
    title: { type: String, required: true },
    order: { type: Number, required: true },
    board: { type: Types.ObjectId, ref: "Board", required: true }
  },
  { timestamps: true }
);

export const ColumnModel = model("Column", ColumnSchema);
