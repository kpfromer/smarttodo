import express from 'express';
import { config } from '../config';
import { AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';

export async function getMe(req: express.Request): Promise<{ id: string } | undefined> {
  const accessToken = req.headers['authorization'];
  const refreshToken = req.cookies['refresh-token'];

  if (!accessToken && !refreshToken) return;

  try {
    if (accessToken) {
      const data = await jwt.verify(accessToken, config.get('jwt.access.secret'));
      return data as { id: string };
    }
  } catch {
    if (!refreshToken) throw new AuthenticationError('Your session expired. Sign in again.');
  }
  // invalid access token (tell user to try and get access token again with
  // refresh token)
  // throw new AuthenticationError('Your session expired. Sign in again.');
}
