export const typeDefs = `#graphql
  scalar DateTime

  type User {
    id: ID!
    email: String!
    name: String!
    avatar: String
    bio: String
    role: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Board {
    id: ID!
    title: String!
    description: String
    owner: User!
    members: [User!]!
    backgroundColor: String!
    isPrivate: Boolean!
    lists: [List!]
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type List {
    id: ID!
    title: String!
    board: Board!
    position: Int!
    cardLimit: Int
    isArchived: Boolean!
    cards: [Card!]
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Card {
    id: ID!
    title: String!
    description: String
    list: List!
    position: Int!
    assignees: [User!]!
    dueDate: DateTime
    labels: [String!]!
    priority: Priority!
    isArchived: Boolean!
    comments: [Comment!]
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Comment {
    id: ID!
    content: String!
    card: Card!
    author: User!
    isEdited: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  enum Priority {
    LOW
    MEDIUM
    HIGH
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User!
    user(id: ID!): User
    users: [User!]!

    boards: [Board!]!
    board(id: ID!): Board

    lists(boardId: ID!): [List!]!

    card(id: ID!): Card
    cards(listId: ID!): [Card!]!

    comments(cardId: ID!): [Comment!]!
  }

  input RegisterInput {
    email: String!
    password: String!
    name: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input CreateBoardInput {
    title: String!
    description: String
    backgroundColor: String
    isPrivate: Boolean
  }

  input UpdateBoardInput {
    title: String
    description: String
    backgroundColor: String
    isPrivate: Boolean
  }

  input CreateListInput {
    title: String!
    boardId: ID!
    position: Int
  }

  input UpdateListInput {
    title: String
    position: Int
    isArchived: Boolean
  }

  input MoveListInput {
    listId: ID!
    position: Int!
  }

  input CreateCardInput {
    title: String!
    listId: ID!
    description: String
    position: Int
    dueDate: DateTime
    labels: [String!]
    priority: Priority
  }

  input UpdateCardInput {
    title: String
    description: String
    dueDate: DateTime
    labels: [String!]
    priority: Priority
    isArchived: Boolean
  }

  input MoveCardInput {
    cardId: ID!
    targetListId: ID!
    position: Int!
  }

  input CreateCommentInput {
    cardId: ID!
    content: String!
  }

  input UpdateCommentInput {
    content: String!
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!

    createBoard(input: CreateBoardInput!): Board!
    updateBoard(id: ID!, input: UpdateBoardInput!): Board!
    deleteBoard(id: ID!): Boolean!
    addBoardMember(boardId: ID!, userId: ID!): Board!
    removeBoardMember(boardId: ID!, userId: ID!): Board!

    createList(input: CreateListInput!): List!
    updateList(id: ID!, input: UpdateListInput!): List!
    moveList(input: MoveListInput!): List!
    deleteList(id: ID!): Boolean!

    createCard(input: CreateCardInput!): Card!
    updateCard(id: ID!, input: UpdateCardInput!): Card!
    moveCard(input: MoveCardInput!): Card!
    deleteCard(id: ID!): Boolean!
    assignCard(cardId: ID!, userId: ID!): Card!
    unassignCard(cardId: ID!, userId: ID!): Card!

    createComment(input: CreateCommentInput!): Comment!
    updateComment(id: ID!, input: UpdateCommentInput!): Comment!
    deleteComment(id: ID!): Boolean!

    updateUserRole(userId: ID!, role: String!): User!
  }

  type Subscription {
    cardCreated(boardId: ID!): Card!
    cardUpdated(boardId: ID!): Card!
    cardMoved(boardId: ID!): Card!
    cardDeleted(boardId: ID!): ID!

    commentAdded(cardId: ID!): Comment!
    commentUpdated(cardId: ID!): Comment!
    commentDeleted(cardId: ID!): ID!

    boardUpdated(boardId: ID!): Board!
  }
`;
