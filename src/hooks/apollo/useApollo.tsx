import { useEffect, useMemo } from 'react';
import { ApolloClient, InMemoryCache, Resolvers } from '@apollo/client';
import { useAccountsResolvers } from '../accounts/resolvers/useAccountsResolvers';
import { loader } from 'graphql.macro';
import { useAccountsMutationResolvers } from '../accounts/resolvers/useAccountsMutationResolvers';
import { useRefetchWithNewBlock } from '../lastBlock/useRefetchWithNewBlock';
import { useVestingMutationResolvers } from '../vesting/useVestingMutationResolvers';
import { useBalanceMutationResolvers } from '../balances/useBalanceMutationResolvers';
import { useConfigQueryResolvers } from '../config/useConfigQueryResolvers';
import { useConfigMutationResolvers } from '../config/useConfigMutationResolver';
import { useFeePaymentAssetsQueryResolvers } from '../feePaymentAssets/useFeePaymentAssetsQueryResolvers';
import { usePoolsQueryResolver } from '../pools/resolvers/usePoolsQueryResolver';
import { useBalanceQueryResolvers } from '../balances/useBalanceQueryResolvers';
import { useAssetsQueryResolvers } from '../assets/resolvers/useAssetsQueryResolvers';
import { usePoolsMutationResolvers } from '../pools/resolvers/usePoolsMutationResolvers';
import { useExtensionResolvers } from '../extension/resolvers/useExtensionResolvers';
import { usePersistentConfig } from '../config/usePersistentConfig';

/**
 * Add all local gql resolvers here
 * @returns Resolvers
 */
export const useResolvers: () => Resolvers = () => {
  const {
    Query: AccountsQueryResolvers,
    Accounts,
    SelectedAccount,
  } = useAccountsResolvers();
  const {
    Query: PoolsQueryResolver,
    XYKPool,
    LBPPool,
  } = usePoolsQueryResolver();
  const { Query: ExtensionQueryResolver } = useExtensionResolvers();
  return {
    Query: {
      ...AccountsQueryResolvers,
      ...ExtensionQueryResolver,
      ...useConfigQueryResolvers(),
      ...useFeePaymentAssetsQueryResolvers(),
      ...useBalanceQueryResolvers(),
      ...PoolsQueryResolver,
      ...useAssetsQueryResolvers(),
    },
    Mutation: {
      ...useAccountsMutationResolvers(),
      ...useVestingMutationResolvers(),
      ...useBalanceMutationResolvers(),
      ...useConfigMutationResolvers(),
      ...usePoolsMutationResolvers(),
    },
    Accounts,
    SelectedAccount,
    XYKPool,
    LBPPool,
  };
};

export const typeDefs = loader('./../../schema.graphql');

/**
 * Recreates the apollo client instance each time the config changes
 * @returns
 */
export const useConfigureApolloClient = () => {
  const resolvers = useResolvers();
  const cache = useMemo(() => new InMemoryCache(), []);
  // can't get the config from a query before we setup apollo
  // therefore we get it from the local storage instead
  const [{ processorUrl }] = usePersistentConfig();

  // todo test if url change triggers query refetch
  const client = useMemo(() => {
    return new ApolloClient({
      uri: processorUrl,
      cache,
      // TODO: don't connect in production
      connectToDevTools: true,
      queryDeduplication: true,
      resolvers,
      typeDefs,
    });
    // we don't want the client to re-instantiate when the resolvers change,
    // this is handled below in a separate effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processorUrl, cache]);

  useEffect(() => {
    console.log('updating resolvers');
    client?.setResolvers(resolvers);
  }, [resolvers, client]);

  useRefetchWithNewBlock(client);

  return client;
};

export const useApollo = () => useConfigureApolloClient();
