import http from "http";
import { ApolloServer } from "apollo-server-express";
import { app } from "./app";
import { connectMongo } from "./config/mongo";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { verifyToken } from "./utils/auth";
import { env } from "./config/env";
import { pubsub } from "./graphql/pubsub";

async function start() {
  await connectMongo();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization?.replace("Bearer ", "");
      const user = token ? verifyToken(token) : null;
      return { user, pubsub };
    }
  });

  await server.start();
  server.applyMiddleware({ app });

  const httpServer = http.createServer(app);
  httpServer.listen(env.PORT, () =>
    console.log(`🚀 GraphQL http://localhost:${env.PORT}${server.graphqlPath}`)
  );
}

start();
