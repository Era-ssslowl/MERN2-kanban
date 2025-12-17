import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type User { id: ID!, email: String!, name: String!, role: String! }
  type Board { id: ID!, title: String!, description: String }
  type Column { id: ID!, title: String!, order: Int! }
  type Card { id: ID!, title: String!, description: String }

  type Query {
    me: User
    boards: [Board!]!
    columns(boardId: ID!): [Column!]!
    cards(boardId: ID!): [Card!]!
  }

  type Mutation {
    register(email: String!, password: String!, name: String!): String!
    login(email: String!, password: String!): String!
    createBoard(title: String!, description: String): Board!
    createColumn(boardId: ID!, title: String!, order: Int!): Column!
    createCard(boardId: ID!, columnId: ID!, title: String!): Card!
    moveCard(cardId: ID!, columnId: ID!): Card!
  }

  type Subscription {
    cardUpdated: Card!
  }
`;
