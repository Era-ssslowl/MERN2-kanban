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
      members {
        id
        name
        email
        avatar
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

export const NOTIFICATIONS_QUERY = gql`
  query GetNotifications {
    notifications {
      id
      type
      title
      message
      isRead
      createdAt
      sender {
        id
        name
        avatar
      }
      entityType
      entityId
    }
    unreadNotificationsCount
  }
`;

export const ANALYTICS_QUERY = gql`
  query GetAnalytics {
    analytics {
      totalUsers
      totalBoards
      totalCards
      totalComments
      activeUsersToday
      activeUsersThisWeek
      boardsCreatedThisMonth
      cardsCreatedThisMonth
      userGrowth {
        date
        count
      }
      topActiveUsers {
        id
        name
        email
        boardCount
        cardCount
        commentCount
      }
      boardStats {
        totalPublic
        totalPrivate
        averageCardsPerBoard
        averageMembersPerBoard
      }
    }
  }
`;

export const ACTIVITY_LOGS_QUERY = gql`
  query GetActivityLogs($limit: Int, $offset: Int) {
    activityLogs(limit: $limit, offset: $offset) {
      id
      user {
        id
        name
        email
      }
      action
      entityType
      entityId
      details
      createdAt
    }
  }
`;

export const SEARCH_QUERY = gql`
  query Search($query: String!) {
    search(query: $query) {
      boards {
        id
        title
        description
        backgroundColor
      }
      cards {
        id
        title
        description
        labels
        priority
        list {
          id
          title
          board {
            id
            title
          }
        }
      }
    }
  }
`;
