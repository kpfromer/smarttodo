import { mongoose } from '@typegoose/typegoose';
import bcrypt from 'bcryptjs';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect } from 'mongoose';
import { config } from '../config';
import { ProjectModel } from './Project';
import { TodoModel } from './Todo';
import { UserModel } from './User';

export async function createConnection(): Promise<void> {
  switch (config.get('environment')) {
    case 'production':
      await connect(config.get('db.uri'), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'smarttodo',
      });
      break;
    default: {
      const mongod = new MongoMemoryServer();

      const uri = await mongod.getUri();
      await connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'test',
      });

      const user = await UserModel.create({
        email: 'email@example.com',
        password: await bcrypt.hash('password', 8),
      });

      const defaultProject = await ProjectModel.create({
        name: 'Default',
        color: '#189e33',
        updated: new Date(),
        created: new Date(),
        todoIds: [],
        userId: user.id,
      });

      await user.updateOne({
        $set: { defaultProject: mongoose.Types.ObjectId(defaultProject.id) },
      });

      const project = await ProjectModel.create({
        name: 'Stuff',
        color: '#189e33',
        updated: new Date(),
        created: new Date(),
        todoIds: [],
        userId: user.id,
      });

      const todo1 = await TodoModel.create({
        name: 'School',
        completed: false,
        description: 'Homework',
        updated: new Date(),
        created: new Date(),
        projectId: project.id,
        userId: user.id,
      });

      const todo2 = await TodoModel.create({
        name: 'Life',
        completed: true,
        updated: new Date(),
        created: new Date(),
        projectId: project.id,
        userId: user.id,
      });

      await project.updateOne({
        $set: {
          todoIds: [mongoose.Types.ObjectId(todo1.id), mongoose.Types.ObjectId(todo2.id)],
        },
      });
    }
  }
}
