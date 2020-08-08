import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { Field, ID, ObjectType } from 'type-graphql';
import { DateMetadata } from './DateMetadata';
import { UserMetadata } from './UserMetadata';
import { User } from './User';

@ObjectType({ implements: [DateMetadata, UserMetadata] })
export class Todo implements DateMetadata, UserMetadata {
  @Field(() => ID)
  id!: string;

  @Field()
  @prop({ required: true })
  name!: string;

  @Field()
  @prop({ required: true })
  completed!: boolean;

  @Field({ nullable: true })
  @prop()
  description?: string;

  @prop({ required: true })
  created!: Date;

  @prop({ required: true })
  updated!: Date;

  @prop({ required: true, ref: 'User' })
  userId!: Ref<User>;
}

export const TodoModel = getModelForClass(Todo);
