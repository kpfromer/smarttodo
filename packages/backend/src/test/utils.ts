import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect } from 'mongoose';

import { UserModel, User } from '../model/User';
import bcrypt from 'bcryptjs';
import { mongoose } from '@typegoose/typegoose';
import { ProjectModel, Project } from '../model/Project';
import { Todo, TodoModel } from '../model/Todo';

export type MockMongooseReturn = {
  clear: () => Promise<void>;
  stop: () => Promise<void>;
};

/**
 * @returns a stop function to close mongoose connections and stop mock mongoose
 * server
 */
export const createMockDatabase = async (): Promise<MockMongooseReturn> => {
  const mongod = new MongoMemoryServer();
  const uri = await mongod.getUri();
  await connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'test'
  });
  // Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
  // by default, you need to set it to false.
  mongoose.set('useFindAndModify', false);

  return {
    clear: async () => {
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
      }
    },
    stop: async () => {
      await mongoose.disconnect();
      await mongod.stop();
    }
  };
};

export const createMockUser = async ({
  password,
  ...rest
}: Pick<User, 'email' | 'password'>) => {
  return await UserModel.create({
    ...rest,
    password: await bcrypt.hash(password, 10)
  });
};

export const createMockProject = async (
  userId: string,
  project: Pick<Project, 'name' | 'color'>,
  todos: Pick<Todo, 'name' | 'description' | 'completed'>[] = []
) => {
  const projectItem = await ProjectModel.create({
    ...project,
    userId,
    todoIds: [],
    created: new Date(),
    updated: new Date()
  });

  const todoItems = await Promise.all(
    todos.map(
      async (todo) => await createMockTodo(userId, projectItem.id, todo)
    )
  );

  return { project: projectItem, todos: todoItems };
};

export const createMockTodo = async (
  userId: string,
  projectId: string,
  todo: Pick<Todo, 'name' | 'description' | 'completed'>
) => {
  return await TodoModel.create({
    ...todo,
    userId,
    projectId,
    created: new Date(),
    updated: new Date()
  });
};

// export const createMockApolloServer = async ({ context }: any) => {
//   const server = new ApolloServer({
//     schema: await buildSchema({
//       resolvers: [UserResolver, ProjectResolver, TodoResolver],
//       authChecker
//     }),
//     context
//   });
//   return server;
// };
