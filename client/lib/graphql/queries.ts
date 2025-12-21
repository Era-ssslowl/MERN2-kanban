import { gql } from '@apollo/client';

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      name
      avatar
      bio
      role
      createdAt
      updatedAt
    }
  }
`;

export const USERS_QUERY = gql`
  query Users {
    users {
      id
      email
      name
      avatar
      role
      createdAt
    }
  }
`;

export const BOARDS_QUERY = gql`
  query Boards {
    boards {
      id
      title
      description
      backgroundColor
      isPrivate
      owner {
        id
        name
        email
      }
      admins {
        id
        name
        email
      }
      members {
        id
        name
        email
      }
      createdAt
      updatedAt
    }
  }
`;

export const BOARD_QUERY = gql`
  query Board($id: ID!) {
    board(id: $id) {
      id
      title
      description
      backgroundColor
      isPrivate
      owner {
        id
        name
        email
      }
      admins {
        id
        name
        email
        avatar
      }
      members {
        id
        name
        email
        avatar
      }
      statistics {
        totalLists
        totalCards
        completedCards
        pendingCards
        archivedCards
        totalMembers
        cardsByPriority {
          low
          medium
          high
        }
      }
      lists {
        id
        title
        position
        isArchived
        cards {
          id
          title
          description
          position
          priority
          labels
          dueDate
          isArchived
          assignees {
            id
            name
            avatar
          }
          createdAt
        }
        createdAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const CARD_QUERY = gql`
  query Card($id: ID!) {
    card(id: $id) {
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
        title
      }
      assignees {
        id
        name
        email
        avatar
      }
      comments {
        id
        content
        isEdited
        author {
          id
          name
          avatar
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const COMMENTS_QUERY = gql`
  query Comments($cardId: ID!) {
    comments(cardId: $cardId) {
      id
      content
      isEdited
      author {
        id
        name
        avatar
      }
      createdAt
      updatedAt
    }
  }
`;
