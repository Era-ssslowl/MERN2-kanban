import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        name
        avatar
        bio
        role
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        email
        name
        avatar
        bio
        role
      }
    }
  }
`;

export const CREATE_BOARD_MUTATION = gql`
  mutation CreateBoard($input: CreateBoardInput!) {
    createBoard(input: $input) {
      id
      title
      description
      backgroundColor
      isPrivate
      owner {
        id
        name
      }
      members {
        id
        name
      }
      createdAt
    }
  }
`;

export const UPDATE_BOARD_MUTATION = gql`
  mutation UpdateBoard($id: ID!, $input: UpdateBoardInput!) {
    updateBoard(id: $id, input: $input) {
      id
      title
      description
      backgroundColor
      isPrivate
      updatedAt
    }
  }
`;

export const DELETE_BOARD_MUTATION = gql`
  mutation DeleteBoard($id: ID!) {
    deleteBoard(id: $id)
  }
`;

export const CREATE_LIST_MUTATION = gql`
  mutation CreateList($input: CreateListInput!) {
    createList(input: $input) {
      id
      title
      position
      board {
        id
      }
      createdAt
    }
  }
`;

export const UPDATE_LIST_MUTATION = gql`
  mutation UpdateList($id: ID!, $input: UpdateListInput!) {
    updateList(id: $id, input: $input) {
      id
      title
      position
      isArchived
      updatedAt
    }
  }
`;

export const DELETE_LIST_MUTATION = gql`
  mutation DeleteList($id: ID!) {
    deleteList(id: $id)
  }
`;

export const CREATE_CARD_MUTATION = gql`
  mutation CreateCard($input: CreateCardInput!) {
    createCard(input: $input) {
      id
      title
      description
      position
      priority
      labels
      dueDate
      list {
        id
      }
      createdAt
    }
  }
`;

export const UPDATE_CARD_MUTATION = gql`
  mutation UpdateCard($id: ID!, $input: UpdateCardInput!) {
    updateCard(id: $id, input: $input) {
      id
      title
      description
      priority
      labels
      dueDate
      isArchived
      updatedAt
    }
  }
`;

export const MOVE_CARD_MUTATION = gql`
  mutation MoveCard($input: MoveCardInput!) {
    moveCard(input: $input) {
      id
      position
      list {
        id
        title
      }
    }
  }
`;

export const DELETE_CARD_MUTATION = gql`
  mutation DeleteCard($id: ID!) {
    deleteCard(id: $id)
  }
`;

export const CREATE_COMMENT_MUTATION = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
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

export const UPDATE_COMMENT_MUTATION = gql`
  mutation UpdateComment($id: ID!, $input: UpdateCommentInput!) {
    updateComment(id: $id, input: $input) {
      id
      content
      isEdited
      updatedAt
    }
  }
`;

export const DELETE_COMMENT_MUTATION = gql`
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id)
  }
`;

export const MOVE_LIST_MUTATION = gql`
  mutation MoveList($input: MoveListInput!) {
    moveList(input: $input) {
      id
      position
      board {
        id
      }
    }
  }
`;

export const UPDATE_USER_ROLE_MUTATION = gql`
  mutation UpdateUserRole($userId: ID!, $role: String!) {
    updateUserRole(userId: $userId, role: $role) {
      id
      email
      name
      role
    }
  }
`;

export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      name
      avatar
      bio
    }
  }
`;

export const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input)
  }
`;

export const MARK_NOTIFICATION_AS_READ_MUTATION = gql`
  mutation MarkNotificationAsRead($notificationId: ID!) {
    markNotificationAsRead(notificationId: $notificationId) {
      id
      isRead
    }
  }
`;

export const MARK_ALL_NOTIFICATIONS_AS_READ_MUTATION = gql`
  mutation MarkAllNotificationsAsRead {
    markAllNotificationsAsRead
  }
`;

export const DELETE_NOTIFICATION_MUTATION = gql`
  mutation DeleteNotification($notificationId: ID!) {
    deleteNotification(notificationId: $notificationId)
  }
`;
