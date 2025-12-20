# TaskFlow - MERN Task Management System

A modern, real-time task management application built with the MERN stack (MongoDB, Express.js, React/Next.js, Node.js), featuring GraphQL API, WebSocket subscriptions, and a beautiful Trello-like interface.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Architecture](#architecture)
- [Data Models](#data-models)
- [Quick Start (Docker)](#quick-start-docker)
- [Local Development Setup](#local-development-setup)
- [Testing Realtime Functionality](#testing-realtime-functionality)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Team & Contributions](#team--contributions)

## Overview

TaskFlow is a collaborative task management platform that allows teams to organize work using boards, lists, and cards. It features real-time updates across multiple clients using GraphQL Subscriptions, ensuring everyone stays in sync.

### Key Highlights

- **Real-time Collaboration**: See changes instantly across all connected clients
- **GraphQL API**: Efficient data fetching with subscriptions support
- **Type-Safe**: Full TypeScript implementation on both frontend and backend
- **Modern UI**: Clean, responsive design with TailwindCSS
- **Containerized**: One-command deployment with Docker Compose

## Tech Stack

### Backend
- **Node.js** (v20) - Runtime environment
- **Express.js** - Web framework
- **GraphQL** - API query language with subscriptions
- **MongoDB** (v7) - NoSQL database
- **Mongoose** - ODM for MongoDB
- **TypeScript** - Type-safe development
- **JWT** - Authentication
- **Jest** - Testing framework

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **Apollo Client** - GraphQL client with subscription support
- **Zustand** - State management
- **TailwindCSS** - Utility-first CSS framework
- **TypeScript** - Type-safe development

### DevOps
- **Docker** & **Docker Compose** - Containerization
- **ESLint** & **Prettier** - Code quality tools

## Features

### Core Functionality
- ✅ User registration and authentication (JWT)
- ✅ Create, read, update, delete boards
- ✅ Organize tasks with lists and cards
- ✅ Real-time updates using GraphQL Subscriptions
- ✅ Drag-and-drop card positioning (planned)
- ✅ Card assignments and labels
- ✅ Comments on cards
- ✅ Due dates and priorities

### Real-time Features
- **Card Created**: Instantly see new cards added by other users
- **Card Updated**: Real-time updates to card content
- **Card Moved**: See cards being moved between lists live
- **Comments**: New comments appear immediately
- **Board Updates**: Title and description changes sync across clients

## Architecture

```
taskflow-mern/
├── client/               # Next.js frontend
│   ├── app/             # App Router pages
│   ├── components/      # React components
│   ├── lib/             # Apollo Client, GraphQL operations
│   ├── store/           # Zustand state management
│   └── types/           # TypeScript types
├── server/              # Node.js backend
│   ├── src/
│   │   ├── models/      # Mongoose models
│   │   ├── resolvers/   # GraphQL resolvers
│   │   ├── schema/      # GraphQL schema
│   │   ├── middleware/  # Auth middleware
│   │   ├── utils/       # Helper functions
│   │   ├── config/      # Configuration
│   │   └── __tests__/   # Jest tests
│   └── Dockerfile
└── docker-compose.yml   # Orchestration
```

## Data Models

### 1. User
- **Fields**: email, password (hashed), name, avatar, bio, role
- **Indexes**: email, isDeleted
- **Relations**: Owns/member of boards, assigned to cards, author of comments

### 2. Board
- **Fields**: title, description, owner, members, backgroundColor, isPrivate
- **Indexes**: owner, members, isDeleted
- **Relations**: Has many lists, belongs to user (owner)

### 3. List
- **Fields**: title, board, position, cardLimit, isArchived
- **Indexes**: board + position, isDeleted
- **Relations**: Belongs to board, has many cards

### 4. Card
- **Fields**: title, description, list, position, assignees, dueDate, labels, priority
- **Indexes**: list + position, assignees, dueDate, isDeleted
- **Relations**: Belongs to list, has many comments, assigned to users

### 5. Comment
- **Fields**: content, card, author, isEdited
- **Indexes**: card + createdAt, author, isDeleted
- **Relations**: Belongs to card, authored by user

## Quick Start (Docker)

### Prerequisites
- Docker Engine 20.10+
- Docker Compose v2.0+

### One-Command Startup

```bash
# Clone repository
git clone <your-repo-url>
cd mern-final

# Start all services
docker-compose up --build

# The application will be available at:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:4000/graphql
# - Mongo Express: http://localhost:8081
```

### Seed Database (Optional)

```bash
# After containers are running, seed the database
docker-compose exec api npm run seed

# Test credentials will be displayed in the output
# Email: john@example.com
# Password: password123
```

### Stop Services

```bash
docker-compose down

# To remove volumes as well (deletes database):
docker-compose down -v
```

## Local Development Setup

### Prerequisites
- Node.js v20+
- MongoDB v7+ (running locally or via Docker)
- npm or yarn

### Backend Setup

```bash
cd server

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your configuration
# Ensure MONGO_URI points to your MongoDB instance

# Run in development mode
npm run dev

# Or build and run production
npm run build
npm start
```

### Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Update .env.local with API endpoints
# NEXT_PUBLIC_GRAPHQL_HTTP=http://localhost:4000/graphql
# NEXT_PUBLIC_GRAPHQL_WS=ws://localhost:4000/graphql

# Run in development mode
npm run dev

# Or build and run production
npm run build
npm start
```

### Seed Database

```bash
cd server
npm run seed
```

## Testing Realtime Functionality

Follow these steps to verify that GraphQL Subscriptions are working correctly:

### Test 1: Real-time Card Creation

1. Open **Browser Window A**: Navigate to http://localhost:3000
2. Login with demo credentials: `john@example.com` / `password123`
3. Click on the "Product Development" board
4. Open **Browser Window B** (incognito/different browser)
5. Login with different credentials: `jane@example.com` / `password123`
6. Navigate to the same "Product Development" board
7. **Action**: In Window A, click "+ Add a card" in any list and create a new card
8. **Expected Result**: The new card appears **immediately** in Window B without refreshing

### Test 2: Real-time Card Updates

1. Using the same setup from Test 1
2. **Action**: In Window A, click on any existing card to open it
3. Change the title or description
4. **Expected Result**: Changes appear **instantly** in Window B

### Test 3: Real-time Comments

1. Both windows viewing the same board
2. **Action**: In Window A, open a card and add a comment
3. **Expected Result**: Comment appears **immediately** in Window B if they have the same card open

### Test 4: WebSocket Connection

1. Open Browser DevTools → Network tab
2. Filter by "WS" (WebSocket)
3. Navigate to any board
4. **Expected Result**: You should see an active WebSocket connection to `ws://localhost:4000/graphql`
5. Any card creation/update will show messages in the WS connection

## API Documentation

### GraphQL Endpoint
- **HTTP**: `http://localhost:4000/graphql`
- **WebSocket** (Subscriptions): `ws://localhost:4000/graphql`
- **GraphiQL Playground**: Available in development mode

### Key Queries (6+)
```graphql
me                     # Current user
user(id: ID!)         # User by ID
users                 # All users
boards                # User's boards
board(id: ID!)        # Board by ID
card(id: ID!)         # Card by ID
comments(cardId: ID!) # Card comments
```

### Key Mutations (15+)
```graphql
# Auth
register(input: RegisterInput!)
login(input: LoginInput!)

# Boards
createBoard(input: CreateBoardInput!)
updateBoard(id: ID!, input: UpdateBoardInput!)
deleteBoard(id: ID!)

# Lists
createList(input: CreateListInput!)
updateList(id: ID!, input: UpdateListInput!)
deleteList(id: ID!)

# Cards
createCard(input: CreateCardInput!)
updateCard(id: ID!, input: UpdateCardInput!)
moveCard(input: MoveCardInput!)
deleteCard(id: ID!)

# Comments
createComment(input: CreateCommentInput!)
updateComment(id: ID!, input: UpdateCommentInput!)
deleteComment(id: ID!)
```

### Subscriptions (8)
```graphql
cardCreated(boardId: ID!)
cardUpdated(boardId: ID!)
cardMoved(boardId: ID!)
cardDeleted(boardId: ID!)
commentAdded(cardId: ID!)
commentUpdated(cardId: ID!)
commentDeleted(cardId: ID!)
boardUpdated(boardId: ID!)
```

## Testing

### Run Backend Tests

```bash
cd server

# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm run test:watch
```

### Test Coverage
- **11+ Unit Tests**: JWT utils, error handlers, model validations
- **1 Integration Test**: Auth flow with in-memory MongoDB
- **Target Coverage**: 70% (branches, functions, lines, statements)

### Test Files
- `__tests__/utils/jwt.test.ts` - JWT generation and verification
- `__tests__/utils/errors.test.ts` - Error handling
- `__tests__/models/*.test.ts` - Model validations
- `__tests__/integration/auth.integration.test.ts` - Full auth flow

## Environment Variables

### Backend (server/.env)
```bash
NODE_ENV=development
PORT=4000
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
GRAPHQL_PATH=/graphql
GRAPHQL_SUBSCRIPTIONS_PATH=/graphql
```

### Frontend (client/.env.local)
```bash
NEXT_PUBLIC_GRAPHQL_HTTP=http://localhost:4000/graphql
NEXT_PUBLIC_GRAPHQL_WS=ws://localhost:4000/graphql
```

## Scripts Reference

### Root
```bash
npm run dev         # Run both client and server
npm run build       # Build both packages
npm test            # Run server tests
npm run seed        # Seed database
```

### Server
```bash
npm run dev         # Development mode with hot reload
npm run build       # Build TypeScript
npm start           # Production mode
npm test            # Run Jest tests
npm run lint        # ESLint check
npm run seed        # Seed sample data
```

### Client
```bash
npm run dev         # Development mode
npm run build       # Production build
npm start           # Production server
npm run lint        # ESLint check
```

## Team & Contributions

This is a **2-person team project** for the MERN Stack Final Assessment.

### Team Members
- **Developer 1**: Backend architecture, GraphQL API, database design
- **Developer 2**: Frontend development, UI/UX, real-time features

### Individual Contributions

#### Developer 1 (Backend)
- Designed and implemented MongoDB schemas with Mongoose
- Created GraphQL schema with 6+ queries, 15+ mutations, 8 subscriptions
- Implemented JWT authentication and authorization middleware
- Set up GraphQL Subscriptions with PubSub
- Wrote Jest tests (11+ tests with integration coverage)
- Created database seeding script
- Configured Docker for backend service

#### Developer 2 (Frontend)
- Implemented Next.js App Router architecture
- Set up Apollo Client with subscription support
- Created Zustand stores for state management
- Designed UI components with TailwindCSS
- Integrated real-time subscriptions on board view
- Implemented authentication flows
- Configured Docker for frontend service

### Project Structure
Both team members collaborated on:
- Docker Compose orchestration
- Environment configuration
- README documentation
- Testing strategies

---

## License

MIT

## Support

For issues or questions, please open an issue in the repository.

---

**Built with ❤️ using the MERN stack**
