import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { Project } from './Project';

export class User {
  @prop({ required: true })
  email!: string;

  @prop({ required: true })
  password!: string;

  @prop({ ref: 'Project' })
  defaultProject?: Ref<Project>;
}

export const UserModel = getModelForClass(User);
