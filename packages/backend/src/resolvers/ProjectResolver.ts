import {
  Resolver,
  Mutation,
  Arg,
  Field,
  Query,
  FieldResolver,
  Root,
  InputType,
  Authorized,
  Ctx,
} from 'type-graphql';
import { ProjectModel, Project } from '../model/Project';
import { Todo, TodoModel } from '../model/Todo';
import { ContextType } from '../types';

@InputType()
class ProjectCreateInput {
  @Field()
  name!: string;

  @Field()
  color!: string;
}

@Resolver(() => Project)
export class ProjectResolver {
  @Authorized()
  @FieldResolver(() => [Todo])
  async todos(@Root() project: Project): Promise<Todo[]> {
    console.log({ project, test: project.name });
    return await TodoModel.find({ _id: { $in: project.todoIds } });
  }

  @Authorized()
  @Mutation(() => Project)
  async createProject(
    @Ctx('me') me: { id: string },
    @Arg('options', () => ProjectCreateInput) options: ProjectCreateInput,
  ) {
    const project = await ProjectModel.create({
      ...options,
      updated: new Date(),
      created: new Date(),
      todoIds: [],
      userId: me.id,
    });
    return project;
  }

  @Authorized()
  @Query(() => [Project])
  async projects(@Ctx('me') me: { id: string }) {
    return (
      await ProjectModel.find({
        userId: me.id,
      })
    ).map((project) => project.toJSON({ virtuals: true }));
  }

  @Authorized()
  @Query(() => Project)
  async defaultProject(@Ctx() ctx: ContextType) {
    const user = await ctx.loaders!.user.load(ctx.me!.id);

    return await ProjectModel.findOne({
      _id: user!.defaultProject,
    });
  }

  // @Query(() => CleanUser, { nullable: true })
  // async getUser(@Arg('email') email: string) {
  //   return await UserModel.findOne({ email });
  // }

  // @Query(() => CleanUser)
}
