import { ApolloCache } from '@apollo/client';
import { readActionLog } from './readActionLog';

import { find } from 'lodash';

export const readUserAction = (id: string, cache: ApolloCache<object>) => {
  const actions = readActionLog(cache) || [];
  return find(actions, { id: id });
};
