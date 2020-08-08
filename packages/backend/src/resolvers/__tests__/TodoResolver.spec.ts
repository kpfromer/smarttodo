import {
  MockMongooseReturn,
  createMockDatabase,
  createMockUser,
  createMockProject,
  createMockTodo
} from '../../test/utils';
import { User } from '../../model/User';
import supertest from 'supertest';
import { createApp } from '../../server/app';
import { DocumentType } from '@typegoose/typegoose';
import { Project } from '../../model/Project';
import { Todo } from '../../model/Todo';

describe('Todo resolver', () => {
  let request: supertest.SuperTest<supertest.Test>;
  let mockMongoose: MockMongooseReturn;
  let user: DocumentType<User>;
  let todo: DocumentType<Todo>;
  let project: DocumentType<Project>;
  let accessToken: string;

  beforeAll(async () => {
    mockMongoose = await createMockDatabase();
    request = supertest(await createApp());
  });
  beforeEach(async () => {
    user = await createMockUser({
      email: 'example@email.com',
      password: 'password123'
    });
    todo = await createMockTodo(user.id, {
      name: 'Existing todo',
      description: 'WoooW',
      completed: true
    });
    project = await createMockProject(user.id, {
      name: 'New Project',
      color: '#1244ff',
      todoIds: [todo.id]
    });
    // Login
    const res = await request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        query: `mutation { login(email: "example@email.com", password: "password123") }`
      });

    accessToken = res.body.data.login;
  });
  afterEach(async () => {
    await mockMongoose.clear();
  });
  afterAll(async () => {
    await mockMongoose.stop();
  });

  // create multiple users to ensure that todo are for only current user!

  describe('createTodo', () => {
    it('creates a todo', async () => {
      const res = await request
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('authorization', accessToken)
        .send({
          query: `
            mutation {
              createTodo(project: "${project.id}", options: { name: "new todo", description: "Cool stuff", completed: false }) {
                id
                name
                description
                completed
              }
            }
          `
        });

      expect(res.body.data.createTodo).toEqual({
        id: expect.any(String),
        name: 'new todo',
        description: 'Cool stuff',
        completed: false
      });
    });
    it('shows error message if not authenticated', async () => {
      const res = await request
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          query: `
          mutation {
            createTodo(project: "${project.id}", options: { name: "new todo", description: "Cool stuff", completed: false }) {
              id
              name
              description
              completed
            }
          }
        `
        })
        .expect(200);
      expect(res.body.errors).toHaveLength(1);
      expect(res.body.errors[0].message).toMatchInlineSnapshot(
        `"Access denied! You need to be authorized to perform this action!"`
      );
    });
  });

  describe('updateTodo', () => {
    it('partially updates a todo', async () => {
      const res = await request
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('authorization', accessToken)
        .send({
          query: `
            mutation {
              updateTodo(id: "${todo.id}", options: { completed: true }) {
                id
                name
                description
                completed
              }
            }
      `
        })
        .expect(200);

      expect(res.body.data.updateTodo).toEqual({
        id: todo.id,
        name: todo.name,
        description: todo.description,
        completed: true
      });
    });
    it('returns null if no todo is found', async () => {
      const res = await request
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('authorization', accessToken)
        .send({
          query: `
            mutation {
              updateTodo(id: "does not exists", options: { completed: true }) {
                id
                name
                description
                completed
              }
            }
      `
        })
        .expect(200);

      expect(res.body.data.updateTodo).toBeNull();
    });
    it('shows error message if not authenticated', async () => {
      const res = await request
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          query: `
            mutation {
              updateTodo(id: "${todo.id}", options: { completed: true }) {
                id
                name
                description
                completed
              }
            }
      `
        })
        .expect(200);

      expect(res.body.errors).toHaveLength(1);
      expect(res.body.errors[0].message).toMatchInlineSnapshot(
        `"Access denied! You need to be authorized to perform this action!"`
      );
    });
  });
});
