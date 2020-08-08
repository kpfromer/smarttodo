import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { UserResolver } from '../resolvers/UserResolver';
import { ProjectResolver } from '../resolvers/ProjectResolver';
import { TodoResolver } from '../resolvers/TodoResolver';
import DataLoader from 'dataloader';
import { mongoose } from '@typegoose/typegoose';
import { batchUsers } from '../loaders/user';
import { authChecker } from '../resolvers/authorization';
import { ContextType } from '../types';
import { getMe } from './get-me';

export const createApolloServer = async () => {
  return new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, ProjectResolver, TodoResolver],
      authChecker,
      validate: false
    }),
    context: async ({ req, res }) => {
      const me = await getMe(req);

      return {
        me,
        refreshToken: req.cookies['refresh-token'] as string | undefined,
        res,
        loaders: {
          user: new DataLoader((keys: readonly mongoose.Types.ObjectId[]) =>
            batchUsers(keys)
          )
        }
      } as ContextType;
    }
  });
};
