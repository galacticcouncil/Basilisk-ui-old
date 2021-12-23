import { ApolloCache } from '@apollo/client';
import {
  GetActionLogQueryResponse,
  GET_ACTION_LOG,
} from '../queries/useGetActionLogQuery';

export const readActionLog = (cache: ApolloCache<object>) => {
  return cache.readQuery<GetActionLogQueryResponse>({
    query: GET_ACTION_LOG,
    returnPartialData: true,
  })?.actionLog;
};
