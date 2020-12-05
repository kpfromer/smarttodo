import { mongoose } from '@typegoose/typegoose';
import {
  AuthenticationError,
  ForbiddenError,
  UserInputError
} from 'apollo-server-express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import {
  Arg,
  Authorized,
  Ctx,
  Field,
  ID,
  Mutation,
  ObjectType,
  Query,
  Resolver
} from 'type-graphql';
import { config } from '../config';
import { ProjectModel } from '../model/Project';
import { UserModel } from '../model/User';
import { ContextType } from '../types';

const createToken = async (
  userId: string,
  secret: string,
  expiresIn: string
): Promise<string> => {
  return await jwt.sign({ id: userId }, secret, { expiresIn });
};

const isCorrectPassword = async (
  unencrypted: string,
  encrypted: string
): Promise<boolean> => {
  return await bcrypt.compare(unencrypted, encrypted);
};

@ObjectType()
class CleanUser {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;
}

// TODO: validate password for bcrypt
@Resolver()
export class UserResolver {
  @Mutation(() => String)
  async createUser(
    @Arg('email') email: string,
    @Arg('password') unencryptedPassword: string,
    @Ctx() ctx: ContextType
  ) {
    const alreadyExists = await UserModel.findOne({ email });

    if (alreadyExists) {
      throw new UserInputError('User with that email already exists!');
    }

    const user = await UserModel.create({
      email,
      password: await bcrypt.hash(unencryptedPassword, 8)
    });

    const defaultProject = await ProjectModel.create({
      name: 'Default',
      color: '#189e33',
      updated: new Date(),
      created: new Date(),
      todoIds: [],
      userId: user.id
    });

    await user.updateOne({
      $set: { defaultProject: mongoose.Types.ObjectId(defaultProject.id) }
    });

    const refreshToken = await createToken(
      user.id,
      config.get('jwt.access.secret'),
      config.get('jwt.refresh.duration')
    );
    const accessToken = await createToken(
      user.id,
      config.get('jwt.access.secret'),
      config.get('jwt.refresh.duration')
    );

    ctx.res.cookie('refresh-token', refreshToken, {
      maxAge: ms(config.get('jwt.refresh.duration') as string),
      httpOnly: true
    });

    return accessToken;
  }

  @Mutation(() => String)
  async refresh(@Ctx() ctx: ContextType) {
    console.log({ refresh: ctx });
    if (ctx.refreshToken) {
      try {
        // TODO: check in redis database if this refreshtoken is still valid
        // (maybe by some id in the refresh token)
        const data = jwt.verify(
          ctx.refreshToken,
          config.get('jwt.refresh.secret')
        ) as { id: string };

        const accessToken = await createToken(
          data.id,
          config.get('jwt.access.secret'),
          config.get('jwt.access.duration')
        );

        return accessToken;
      } catch {
        // TODO: report
        throw new ForbiddenError('Invalid refresh token!');
      }
    }

    // TODO: report
    throw new ForbiddenError('No refresh token!');
  }

  @Mutation(() => String)
  async login(
    @Arg('rememberMe', { defaultValue: false }) rememberMe: boolean,
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() ctx: ContextType
  ) {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new AuthenticationError('Invalid login or password.');
    }
    const valid = await isCorrectPassword(password, user.password);
    if (!valid) {
      throw new AuthenticationError('Invalid login or password.');
    }

    const accessToken = await createToken(
      user.id,
      config.get('jwt.access.secret'),
      config.get('jwt.access.duration')
    );

    if (rememberMe) {
      const refreshToken = await createToken(
        user.id,
        config.get('jwt.refresh.secret'),
        config.get('jwt.refresh.duration')
      );
      ctx.res.cookie('refresh-token', refreshToken, {
        maxAge: ms(config.get('jwt.refresh.duration') as string),
        httpOnly: true
      });
    }

    return accessToken;
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: ContextType) {
    const refreshToken = ctx.refreshToken;
    if (refreshToken) {
      // TODO: invalid redis cache
      ctx.res.clearCookie('refresh-token');
      return true;
    }
    return false;
  }

  @Authorized()
  @Query(() => CleanUser)
  async me(@Ctx() ctx: ContextType) {
    return await ctx.loaders!.user.load(ctx.me!.id);
  }
}
