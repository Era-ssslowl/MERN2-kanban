import { ColumnService } from "../../services/column.service";

export const ColumnResolver = {
  Query: {
    columns: (_: any, args: any) => ColumnService.list(args.boardId)
  },
  Mutation: {
    createColumn: (_: any, args: any) =>
      ColumnService.create(args.boardId, args.title, args.order)
  }
};
