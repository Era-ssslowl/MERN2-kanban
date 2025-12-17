import { AuthService } from "../../services/auth.service";

export const AuthResolver = {
  Mutation: {
    register: (_: any, args: any) =>
      AuthService.register(args.email, args.password, args.name),
    login: (_: any, args: any) =>
      AuthService.login(args.email, args.password)
  }
};
