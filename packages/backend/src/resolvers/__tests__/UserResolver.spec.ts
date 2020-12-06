import { DocumentType } from '@typegoose/typegoose';
import jwt from 'jsonwebtoken';
import setCookie from 'set-cookie-parser';
import supertest from 'supertest';
import { config } from '../../config';
import { Project, ProjectModel } from '../../model/Project';
import { Todo, TodoModel } from '../../model/Todo';
import { User, UserModel } from '../../model/User';
import { createApp } from '../../server/app';
import {
  createMockDatabase,
  createMockProject,
  createMockUser,
  MockMongooseReturn,
} from '../../test/utils';

describe('User resolvers', () => {
  let mockMongoose: MockMongooseReturn;
  let user: DocumentType<User>;
  let request: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    mockMongoose = await createMockDatabase();
    request = supertest(await createApp());
  });
  beforeEach(async () => {
    user = await createMockUser({
      email: 'example@email.com',
      password: 'password123',
    });
  });
  afterEach(async () => {
    await mockMongoose.clear();
  });
  afterAll(async () => {
    await mockMongoose.stop();
  });

  describe('createUser', () => {
    it('creates a user', async () => {
      const res = await request
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          query: `mutation { createUser(email: "new@email.com", password: "newPassword") }`,
        })
        .expect('Content-Type', /json/)
        .expect(200);

      const accessToken = res.body.data.createUser;
      expect(accessToken).toBeTruthy();
      expect(jwt.verify(accessToken, config.get('jwt.access.secret'))).toEqual({
        exp: expect.any(Number),
        iat: expect.any(Number),
        id: expect.any(String),
      });

      const cookies = setCookie.parse(res.header['set-cookie']);

      expect(cookies).toHaveLength(1);
      const refreshToken = cookies[0];
      expect(refreshToken).toEqual({
        name: 'refresh-token',
        path: '/',
        httpOnly: true,
        value: expect.any(String),
        maxAge: expect.any(Number),
        expires: expect.any(Date),
      });
    });

    it('show error message if email is already found', async () => {
      const res = await request
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          query: `mutation { createUser(email: "example@email.com", password: "doesnotmatter") }`,
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body.errors).toHaveLength(1);
      expect(res.body.errors[0].message).toMatchInlineSnapshot(
        `"User with that email already exists!"`,
      );
    });
  });

  describe('login', () => {
    it('logins in a user and returns an access token', async () => {
      const res = await request
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          query: `mutation { login(email: "example@email.com", password: "password123") }`,
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toBeInstanceOf(Object);
      const accessToken = res.body.data.login;
      expect(accessToken).toBeTruthy();
      expect(jwt.verify(accessToken, config.get('jwt.access.secret'))).toEqual({
        exp: expect.any(Number),
        iat: expect.any(Number),
        id: user.id,
      });
    });

    it('shows error message if email is not found', async () => {
      const res = await request
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          query: `
            mutation {
              login(email: "does_not_exist@email.com", password: "nothing")
            }
        `,
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body.errors).toHaveLength(1);
      expect(res.body.errors[0].message).toMatchInlineSnapshot(`"Invalid login or password."`);
    });

    it('shows error message if email password does not match', async () => {
      const res = await request
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          query: `
            mutation {
              login(email: "example@email.com", password: "badPassword")
            }
        `,
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body.errors).toHaveLength(1);
      expect(res.body.errors[0].message).toMatchInlineSnapshot(`"Invalid login or password."`);
    });
    it('logins in a user and returns refresh token as cookie', async () => {
      const res = await request
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          query: `
            mutation {
              login(email: "example@email.com", password: "password123", rememberMe: true)
            }
        `,
        })
        .expect('Content-Type', /json/)
        .expect(200);

      const cookies = setCookie.parse(res.header['set-cookie']);

      expect(cookies).toHaveLength(1);
      const refreshToken = cookies[0];
      expect(refreshToken).toEqual({
        name: 'refresh-token',
        path: '/',
        httpOnly: true,
        value: expect.any(String),
        maxAge: expect.any(Number),
        expires: expect.any(Date),
      });
    });
  });

  describe('deleteUser', () => {
    let accessToken: string;
    let todo: DocumentType<Todo>;
    let project: DocumentType<Project>;

    beforeEach(async () => {
      ({
        project,
        todos: [todo],
      } = await createMockProject(
        user.id,
        {
          name: 'New Project',
          color: '#1244ff',
        },
        [
          {
            name: 'Existing todo',
            description: 'WoooW',
            completed: true,
          },
        ],
      ));

      // Login
      const res = await request
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          query: `mutation { login(email: "example@email.com", password: "password123") }`,
        });

      accessToken = res.body.data.login;
    });

    it('deletes all user data', async () => {
      expect.assertions(4);

      const res = await request
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('authorization', accessToken)
        .send({
          query: `
          mutation {
            deleteUser
          }
      `,
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body.data.deleteUser).toBe(true);
      // Deletes user data in database
      expect(await UserModel.findById(user._id)).toBeNull();
      expect(await ProjectModel.findById(project._id)).toBeNull();
      expect(await TodoModel.findById(todo._id)).toBeNull();
    });
  });

  describe('logout', () => {
    it.todo('logouts user by deleting refresh token');
  });

  describe('me', () => {
    it.todo('return my account details');
  });
});
