export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  id: string;
  title: string;
  description?: string;
  owner: User;
  members: User[];
  backgroundColor: string;
  isPrivate: boolean;
  lists?: List[];
  createdAt: string;
  updatedAt: string;
}

export interface List {
  id: string;
  title: string;
  board: Board;
  position: number;
  cardLimit?: number;
  isArchived: boolean;
  cards?: Card[];
  createdAt: string;
  updatedAt: string;
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  list: List;
  position: number;
  assignees: User[];
  dueDate?: string;
  labels: string[];
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  isArchived: boolean;
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  card: Card;
  author: User;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthPayload {
  token: string;
  user: User;
}
