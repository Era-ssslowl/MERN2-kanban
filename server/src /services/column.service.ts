import { ColumnModel } from "../models/Column.model";

export class ColumnService {
  static async create(boardId: string, title: string, order: number) {
    return ColumnModel.create({ board: boardId, title, order });
  }

  static async list(boardId: string) {
    return ColumnModel.find({ board: boardId }).sort({ order: 1 });
  }
}
