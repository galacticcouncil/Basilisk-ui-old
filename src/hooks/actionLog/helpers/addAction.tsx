import { ApolloCache } from '@apollo/client';
import {
  GetActionLogQueryResponse,
  GET_ACTION_LOG,
} from '../queries/useGetActionLogQuery';
import { readActionLog } from './readActionLog';
import { ClientUserAction } from '../../../generated/graphql';
import { __typename } from '../resolvers/useGetActionLogQueryResolver';
import log from 'loglevel';

export const addAction = (
  cache: ApolloCache<object>,
  item: ClientUserAction
) => {
  const current = readActionLog(cache) || [];

  log.debug(
    `UserAction: add user action ${item.action} (${item.id} - ${item.status})`
  );

  return cache.writeQuery<GetActionLogQueryResponse>({
    query: GET_ACTION_LOG,
    data: {
      actionLog: [...current, { ...item, __typename }],
    },
  });
};
