import { mongoose } from '@typegoose/typegoose';
import { UserInputError } from 'apollo-server-express';
import { Arg, Authorized, Ctx, Field, ID, InputType, Mutation, Resolver } from 'type-graphql';
import { ProjectModel } from '../model/Project';
import { Todo, TodoModel } from '../model/Todo';
import { ContextType } from '../types';

// const wait = async (time: number) =>
//   new Promise((resolve) => setTimeout(() => resolve(), time));

@InputType()
class TodoCreateInput {
  @Field()
  name!: string;

  @Field()
  completed!: boolean;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
class TodoUpdateInput {
  @Field({ nullable: true })
  name!: string;

  @Field({ nullable: true })
  completed!: boolean;

  @Field({ nullable: true })
  description?: string;
}

@Resolver(() => Todo)
export class TodoResolver {
  @Authorized()
  @Mutation(() => Todo)
  async createTodo(
    @Ctx('me') me: ContextType['me'],
    @Arg('project', () => ID) projectId: string,
    @Arg('options', () => TodoCreateInput) options: TodoCreateInput,
  ) {
    const project = await ProjectModel.findById(projectId);

    if (!project) {
      throw new UserInputError('No project found!');
    }

    const todo = await TodoModel.create({
      ...options,
      updated: new Date(),
      created: new Date(),
      projectId: project.id,
      userId: me!.id,
    });

    await project.updateOne({
      $push: { todoIds: todo._id },
    });
    return todo;
  }

  @Authorized()
  @Mutation(() => Todo, { nullable: true })
  async updateTodo(
    @Ctx('me') me: { id: string },
    @Arg('id', () => ID) todoId: string,
    @Arg('options', () => TodoUpdateInput) options: TodoUpdateInput,
  ) {
    try {
      const todo = await TodoModel.findOneAndUpdate(
        { _id: todoId, userId: me.id },
        { $set: options },
        { new: true },
      );
      if (todo) {
        return todo.toJSON({ virtuals: true });
      }
      return null;
    } catch {
      return null;
    }
  }

  @Authorized()
  @Mutation(() => Todo, { nullable: true })
  async deleteTodo(@Ctx('me') me: { id: string }, @Arg('id', () => ID) todoId: string) {
    try {
      const todo = await TodoModel.findOneAndDelete({
        _id: todoId,
        userId: me.id,
      });

      // remove todo from projects that have it
      await ProjectModel.updateMany(
        {
          todoIds: { $in: [mongoose.Types.ObjectId(todo?.id)] },
        },
        {
          $pull: { todoIds: mongoose.Types.ObjectId(todo?.id) },
        },
      );

      if (todo) {
        return todo.toJSON({ virtuals: true });
      }
      return null;
    } catch {
      return null;
    }
  }
}
