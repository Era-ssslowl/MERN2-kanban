import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const UserModel = model("User", UserSchema);
