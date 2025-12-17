import { BoardModel } from "../models/Board.model";

export class BoardService {
  static async create(userId: string, title: string, description?: string) {
    return BoardModel.create({ title, description, owner: userId });
  }

  static async list(userId: string) {
    return BoardModel.find({ owner: userId, isArchived: false });
  }
}
import { ColumnModel } from "../models/Column.model";

export class ColumnService {
  static async create(boardId: string, title: string, order: number) {
    return ColumnModel.create({ board: boardId, title, order });
  }

  static async list(boardId: string) {
    return ColumnModel.find({ board: boardId }).sort({ order: 1 });
  }
}
