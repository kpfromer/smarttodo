import { createMockDatabase, createMockUser, MockMongooseReturn } from '../../test/utils';
import jwt from 'jsonwebtoken';
import { DocumentType } from '@typegoose/typegoose';
import { User } from '../../model/User';
import { config } from '../../config';
import supertest from 'supertest';
import { createApp } from '../../server/app';
import setCookie from 'set-cookie-parser';

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

  describe('logout', () => {
    it.todo('logouts user by deleting refresh token');
  });

  describe('me', () => {
    it.todo('return my account details');
  });
});
