import DataLoader from 'dataloader';
import { Types } from 'mongoose';
import express from 'express';
import { DocumentType } from '@typegoose/typegoose';
import { User } from './model/User';

export type ContextType = {
  refreshToken?: string;
  res: express.Response;
  me?: { id: string };
  loaders?: {
    user: DataLoader<
      Types.ObjectId | string,
      // todo: better type
      DocumentType<User> | undefined,
      Types.ObjectId
    >;
  };
};
