import { ApolloClient, NormalizedCache } from '@apollo/client'
import { GetLastBlockQueryResponse, GET_LAST_BLOCK } from './useLastBlockQuery'

export const readLastBlock = (client: ApolloClient<object>) => {
  return client.cache.readQuery<GetLastBlockQueryResponse>({
    query: GET_LAST_BLOCK
  })
}
