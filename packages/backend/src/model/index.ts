import { connect } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { UserModel } from './User';
import { config } from '../config';
import bcrypt from 'bcryptjs';
import { ProjectModel } from './Project';
import { TodoModel } from './Todo';

export async function createConnection(): Promise<void> {
  const mongod = new MongoMemoryServer();

  switch (config.get('environment')) {
    case 'production':
      break;
    default: {
      const uri = await mongod.getUri();
      await connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'test'
      });

      const user = await UserModel.create({
        email: 'email@example.com',
        password: await bcrypt.hash('password', 8)
      });

      const defaultProject = await ProjectModel.create({
        name: 'Default',
        color: '#189e33',
        updated: new Date(),
        created: new Date(),
        todoIds: [],
        userId: user.id
      });

      await user.updateOne({ $set: { defaultProject: defaultProject.id } });

      const todo1 = await TodoModel.create({
        name: 'School',
        completed: false,
        description: 'Homework',
        updated: new Date(),
        created: new Date(),
        userId: user.id
      });

      const todo2 = await TodoModel.create({
        name: 'Life',
        completed: true,
        updated: new Date(),
        created: new Date(),
        userId: user.id
      });

      await ProjectModel.create({
        name: 'Stuff',
        color: '#189e33',
        updated: new Date(),
        created: new Date(),
        todoIds: [todo1.id, todo2.id],
        userId: user.id
      });
    }
  }
}
