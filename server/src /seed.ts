import { connectMongo } from "./config/mongo";
import { UserModel } from "./models/User.model";
import bcrypt from "bcrypt";

async function seed() {
  await connectMongo();
  await UserModel.deleteMany();

  await UserModel.create({
    email: "admin@test.com",
    name: "Admin",
    role: "ADMIN",
    passwordHash: await bcrypt.hash("123456", 10)
  });

  console.log("Seed done");
  process.exit(0);
}

seed();
