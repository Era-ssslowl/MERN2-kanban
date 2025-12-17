import { BoardService } from "../../services/board.service";

export const BoardResolver = {
  Query: {
    boards: (_: any, __: any, ctx: any) =>
      BoardService.list(ctx.user.userId)
  },
  Mutation: {
    createBoard: (_: any, args: any, ctx: any) =>
      BoardService.create(ctx.user.userId, args.title, args.description)
  }
};
