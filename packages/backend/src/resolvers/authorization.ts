import { AuthChecker } from 'type-graphql';
import { ContextType } from '../types';

export const authChecker: AuthChecker<ContextType> = (
  { root, args, context, info },
  roles
) => {
  return !!context.me?.id;
  // here we can read the user from context
  // and check his permission in the db against the `roles` argument
  // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]

  // return true; // or false if access is denied
};
