import { ApolloCache } from '@apollo/client';
import { GetLastBlockQueryResponse, GET_LAST_BLOCK } from './useLastBlockQuery';

export const readLastBlock = (cache: ApolloCache<object>) => {
  return cache.readQuery<GetLastBlockQueryResponse>({
    query: GET_LAST_BLOCK,
  });
};
