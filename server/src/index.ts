import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { graphqlHTTP } from 'express-graphql';
import cors from 'cors';
import { env } from './config/environment';
import { connectDatabase } from './config/database';
import { typeDefs } from './schema/typeDefs';
import { resolvers } from './resolvers';
import { authenticate } from './middleware/auth';

const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Create Express app
    const app = express();

    // Middleware
    app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Health check endpoint
    app.get('/health', (_req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // Create GraphQL schema
    const schema = makeExecutableSchema({
      typeDefs,
      resolvers,
    });

    // GraphQL HTTP endpoint
    app.use(
      env.GRAPHQL_PATH,
      graphqlHTTP(async (req) => {
        const context = await authenticate(req);
        return {
          schema,
          context,
          graphiql: env.NODE_ENV === 'development',
          customFormatErrorFn: (error) => {
            console.error('GraphQL Error:', error);
            return error;
          },
        };
      })
    );

    // Create HTTP server
    const httpServer = createServer(app);

    // Create WebSocket server for subscriptions
    const wsServer = new WebSocketServer({
      server: httpServer,
      path: env.GRAPHQL_SUBSCRIPTIONS_PATH,
    });

    // Setup GraphQL subscriptions
    useServer(
      {
        schema,
        context: async (ctx) => {
          // Extract token from connection params
          const token = ctx.connectionParams?.authorization || ctx.connectionParams?.Authorization;

          if (token) {
            const mockReq = {
              headers: {
                authorization: typeof token === 'string' ? token : `Bearer ${token}`,
              },
            };
            return await authenticate(mockReq);
          }

          return {};
        },
        onConnect: async (_ctx) => {
          console.log('WebSocket client connected');
        },
        onDisconnect: () => {
          console.log('WebSocket client disconnected');
        },
      },
      wsServer
    );

    // Start server
    httpServer.listen(env.PORT, env.HOST, () => {
      console.log(`🚀 Server ready at http://${env.HOST}:${env.PORT}${env.GRAPHQL_PATH}`);
      console.log(`🔌 Subscriptions ready at ws://${env.HOST}:${env.PORT}${env.GRAPHQL_SUBSCRIPTIONS_PATH}`);
      console.log(`📊 Environment: ${env.NODE_ENV}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      httpServer.close(() => {
        console.log('HTTP server closed');
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
