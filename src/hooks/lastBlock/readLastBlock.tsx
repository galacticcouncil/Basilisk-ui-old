import { ApolloClient } from '@apollo/client';
import {
  GetLastBlockQueryResponse,
  GET_LAST_BLOCK,
} from './queries/useLastBlockQuery';

export const readLastBlock = (client: ApolloClient<object>) => {
  return client.cache.readQuery<GetLastBlockQueryResponse>({
    query: GET_LAST_BLOCK,
  });
};
