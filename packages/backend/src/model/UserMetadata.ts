import { InterfaceType, Field, ID } from 'type-graphql';
import { prop, Ref } from '@typegoose/typegoose';
import { User } from './User';

@InterfaceType()
export abstract class UserMetadata {
  @Field(() => ID)
  @prop({ required: true, ref: User })
  userId!: Ref<User>;
}
