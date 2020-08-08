import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { Field, ID, ObjectType } from 'type-graphql';
import { DateMetadata } from './DateMetadata';
import { Todo } from './Todo';
import { UserMetadata } from './UserMetadata';
import { User } from './User';

@ObjectType({ implements: [DateMetadata, UserMetadata] })
export class Project implements DateMetadata, UserMetadata {
  @Field(() => ID)
  id!: string;

  @Field()
  @prop({ required: true })
  name!: string;

  @Field()
  @prop({ required: true })
  color!: string;

  @prop({ required: true, ref: Todo })
  todoIds!: Ref<Todo>[];

  @prop({ required: true })
  created!: Date;

  @prop({ required: true })
  updated!: Date;

  @prop({ required: true, ref: 'User' })
  userId!: Ref<User>;
}

export const ProjectModel = getModelForClass(Project);
