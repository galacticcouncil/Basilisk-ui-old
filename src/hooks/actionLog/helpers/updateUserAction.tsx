import { ApolloCache } from '@apollo/client';
import { Status } from '../../../generated/graphql';
import { __typename } from '../resolvers/useGetActionLogQueryResolver';
import { readUserAction } from './readUserAction';
import { addAction } from './addAction';
import log from 'loglevel';

export const updateUserAction = (
  cache: ApolloCache<object>,
  id: string,
  status?: Status,
  inBlockHash?: string
) => {
  cache.modify({
    id: cache.identify({ id: id, __typename }),
    fields: {
      status(s) {
        if (status) {
          log.debug(`UserAction: updating action status ${status} (${id})`);
          return status;
        }
        return s;
      },
      clientDetails(details) {
        if (inBlockHash) {
          log.debug(
            `UserAction: updating action in block hash ${inBlockHash} (${id})`
          );
          return { ...details, inBlockHash: inBlockHash };
        }
        return details;
      },
    },
  });
};

export const updateUserActionId = (
  cache: ApolloCache<object>,
  id: string,
  newId: string
) => {
  // Note: just modifying ID was not good enough - for some reason, it removed the item from cache
  // That's why we remove and add new entry with new id
  let entry = readUserAction(id, cache);
  if (!entry) {
    return;
  }

  log.debug(`UserAction: setting final user action id ${newId} (${id})`);

  cache.evict({ id: cache.identify({ id: id, __typename }) });

  addAction(cache, { ...entry, id: newId, __typename });
};
