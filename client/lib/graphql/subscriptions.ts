import { gql } from '@apollo/client';

export const CARD_CREATED_SUBSCRIPTION = gql`
  subscription CardCreated($boardId: ID!) {
    cardCreated(boardId: $boardId) {
      id
      title
      description
      position
      priority
      labels
      list {
        id
      }
      assignees {
        id
        name
        avatar
      }
      createdAt
    }
  }
`;

export const CARD_UPDATED_SUBSCRIPTION = gql`
  subscription CardUpdated($boardId: ID!) {
    cardUpdated(boardId: $boardId) {
      id
      title
      description
      position
      priority
      labels
      dueDate
      isArchived
      list {
        id
      }
      assignees {
        id
        name
        avatar
      }
      updatedAt
    }
  }
`;

export const CARD_MOVED_SUBSCRIPTION = gql`
  subscription CardMoved($boardId: ID!) {
    cardMoved(boardId: $boardId) {
      id
      position
      list {
        id
        title
      }
    }
  }
`;

export const CARD_DELETED_SUBSCRIPTION = gql`
  subscription CardDeleted($boardId: ID!) {
    cardDeleted(boardId: $boardId)
  }
`;

export const COMMENT_ADDED_SUBSCRIPTION = gql`
  subscription CommentAdded($cardId: ID!) {
    commentAdded(cardId: $cardId) {
      id
      content
      author {
        id
        name
        avatar
      }
      createdAt
    }
  }
`;

export const BOARD_UPDATED_SUBSCRIPTION = gql`
  subscription BoardUpdated($boardId: ID!) {
    boardUpdated(boardId: $boardId) {
      id
      title
      description
      backgroundColor
      isPrivate
      updatedAt
    }
  }
`;
