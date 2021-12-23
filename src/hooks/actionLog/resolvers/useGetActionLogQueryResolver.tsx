import { useCallback } from 'react';
import { ClientUserAction } from '../../../generated/graphql';
import { useResolverToRef } from '../../accounts/resolvers/useAccountsMutationResolvers';
import { ApolloCache, NormalizedCacheObject } from '@apollo/client';
import { readActionLog } from '../helpers/readActionLog';
import { readUserAction } from '../helpers/readUserAction';
import { GetUserActionByIdQueryVariables } from '../queries/useGetUserActionByIDQuery';

export const __typename: ClientUserAction['__typename'] = 'ClientUserAction';

export const useGetActionLogQueryResolver = () => {
  return useResolverToRef(
    useCallback(
      async (
        { cache }: { cache: ApolloCache<NormalizedCacheObject> },
        args?: GetUserActionByIdQueryVariables
      ) => {
        if (args) {
          return readUserAction(args.id, cache);
        }
        return readActionLog(cache);
      },
      []
    ),
    'actionLog'
  );
};
