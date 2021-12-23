import { ApolloCache } from '@apollo/client';
import { __typename } from '../resolvers/useGetActionLogQueryResolver';

export const removeUserAction = (cache: ApolloCache<object>, id: string) => {
  cache.evict({ id: cache.identify({ id: id, __typename }) });
};
