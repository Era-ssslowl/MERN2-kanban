import bcrypt from "bcrypt";
import { UserModel } from "../models/User.model";
import { signToken } from "../utils/auth";
import { AppError } from "../utils/errors";

export class AuthService {
  static async register(email: string, password: string, name: string) {
    const exists = await UserModel.findOne({ email });
    if (exists) throw new AppError("User exists", "USER_EXISTS");

    const hash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ email, name, passwordHash: hash });

    return signToken(user.id);
  }

  static async login(email: string, password: string) {
    const user = await UserModel.findOne({ email });
    if (!user) throw new AppError("User not found", "NOT_FOUND");

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new AppError("Invalid password", "BAD_CREDENTIALS");

    return signToken(user.id);
  }
}
