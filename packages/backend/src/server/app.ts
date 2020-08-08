import { createConnection } from 'mongoose';
import cookieParser from 'cookie-parser';
import { createApolloServer } from './create-server';
import express from 'express';

export const createApp = async () => {
  const app = express();

  app.use(cookieParser());

  const apolloServer = await createApolloServer();

  apolloServer.applyMiddleware({
    app,
    cors: { credentials: true, origin: 'http://localhost:8000' }
  });

  return app;
};
