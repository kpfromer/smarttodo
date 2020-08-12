import { makeVar } from '@apollo/client';

export const token = makeVar<undefined | string>(undefined);
