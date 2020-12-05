import { UserModel } from '../model/User';
import { mongoose } from '@typegoose/typegoose';

export const batchUsers = async (keys: readonly (mongoose.Types.ObjectId | string)[]) => {
  const keyIds = keys.map((key) => (typeof key === 'string' ? mongoose.Types.ObjectId(key) : key));
  const users = await UserModel.find({
    _id: {
      $in: keyIds,
    },
  });

  return keys.map((key) =>
    users.find((user) => {
      // key is a mongoose _id object
      return user.id === key.toString();
    }),
  );
};
