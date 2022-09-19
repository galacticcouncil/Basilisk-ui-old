import { useEffect, useMemo } from 'react';
import { ApolloClient, InMemoryCache, Resolvers } from '@apollo/client';
import { useAccountsResolvers } from '../accounts/resolvers/useAccountsResolvers';
import { loader } from 'graphql.macro';
import { useRefetchWithNewBlock } from '../lastBlock/useRefetchWithNewBlock';
import { useVestingMutationResolvers } from '../vesting/useVestingMutationResolvers';
import { useConfigMutationResolvers } from '../config/useConfigMutationResolver';
import { useFeePaymentAssetsQueryResolvers } from '../feePaymentAssets/useFeePaymentAssetsQueryResolvers';
import { useXYKPoolsQueryResolver } from '../pools/resolvers/useXYKPoolsQueryResolver';
import { useLBPPoolsQueryResolver } from '../pools/resolvers/useLBPPoolsQueryResolver';
import { useBalanceQueryResolvers } from '../balances/resolvers/query/balances';
import { useAssetsQueryResolvers } from '../assets/resolvers/useAssetsQueryResolvers';
import { usePoolsMutationResolvers } from '../pools/resolvers/usePoolsMutationResolvers';
import { useExtensionResolvers } from '../extension/resolvers/useExtensionResolvers';
import { usePersistentConfig } from '../config/usePersistentConfig';
import { useFaucetResolvers } from '../faucet/resolvers/useFaucetResolvers';
import { useVestingQueryResolvers } from '../vesting/useVestingQueryResolvers';
import { useBalanceMutationsResolvers } from '../balances/resolvers/mutation/balanceTransfer';
import { useConfigQueryResolvers } from '../config/useConfigQueryResolvers';

/**
 * Add all local gql resolvers here
 * @returns Resolvers
 */
export const useResolvers: () => Resolvers = () => {
  const {
    Query: AccountsQueryResolvers,
    Mutation: AccountsMutationResolvers,
  } = useAccountsResolvers();
  const { Query: XYKPoolsQueryResolver, XYKPool } = useXYKPoolsQueryResolver();
  const { Query: LBPPoolsQueryResolver, LBPPool } = useLBPPoolsQueryResolver();
  const { Query: ExtensionQueryResolver } = useExtensionResolvers();
  return {
    Query: {
      ...AccountsQueryResolvers,
      ...ExtensionQueryResolver,
      ...useFeePaymentAssetsQueryResolvers(),
      ...useBalanceQueryResolvers(),
      ...XYKPoolsQueryResolver,
      ...LBPPoolsQueryResolver,
      ...useAssetsQueryResolvers(),
      ...useConfigQueryResolvers(),
    },
    Mutation: {
      ...AccountsMutationResolvers,
      ...useVestingMutationResolvers(),
      ...useConfigMutationResolvers(),
      ...usePoolsMutationResolvers(),
      ...useFaucetResolvers().Mutation,
      ...useBalanceMutationsResolvers(),
    },
    XYKPool,
    LBPPool,
    Account: {
      ...useBalanceQueryResolvers(),
      ...useVestingQueryResolvers(),
    },
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
  const {
    persistedConfig: { processorUrl },
  } = usePersistentConfig();

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
    client?.setResolvers(resolvers);
  }, [resolvers, client]);

  useRefetchWithNewBlock(client);

  return client;
};

export const useApollo = () => useConfigureApolloClient();
