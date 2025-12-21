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

export interface BoardStatistics {
  totalLists: number;
  totalCards: number;
  completedCards: number;
  pendingCards: number;
  archivedCards: number;
  totalMembers: number;
  cardsByPriority: {
    low: number;
    medium: number;
    high: number;
  };
}

export interface Board {
  id: string;
  title: string;
  description?: string;
  owner: User;
  admins: User[];
  members: User[];
  backgroundColor: string;
  isPrivate: boolean;
  lists?: List[];
  statistics?: BoardStatistics;
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
