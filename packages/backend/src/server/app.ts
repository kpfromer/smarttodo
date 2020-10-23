import cookieParser from 'cookie-parser';
import { createApolloServer } from './create-server';
import express from 'express';
import { config } from '../config';

export const createApp = async () => {
  const app = express();

  app.use(cookieParser());

  const apolloServer = await createApolloServer();

  apolloServer.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin:
        config.get('environment') === 'production'
          ? 'https://todo.kpfromer.com'
          : 'http://localhost:3000'
    }
  });

  return app;
};
