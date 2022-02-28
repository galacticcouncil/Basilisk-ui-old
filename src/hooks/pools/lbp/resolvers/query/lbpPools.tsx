import { ApiPromise } from '@polkadot/api';
import { useMemo } from 'react';
import errors from '../../../../../errors';
import { LbpPool } from '../../../../../generated/graphql';
import { withErrorHandler } from '../../../../apollo/withErrorHandler';
import { usePolkadotJsContext } from '../../../../polkadotJs/usePolkadotJs';
import { getAllLbpPools } from '../../lib/getAllLbpPools';

export const __typename: LbpPool['__typename'] = 'LBPPool';

const withTypename = (lbpPool: LbpPool) => ({
  __typename,
  ...lbpPool,
});

export const lbpPoolsQueryResolverFactory =
  (apiInstance?: ApiPromise) => async () => {
    if (!apiInstance) throw Error(errors.apiInstanceNotInitialized);

    return (await getAllLbpPools(apiInstance)).map((lbpPool: LbpPool) => {
      return withTypename(lbpPool);
    });
  };

export const useLbpPoolQueryResolvers = () => {
  const { apiInstance } = usePolkadotJsContext();

  return {
    lbpPools: useMemo(
      () =>
        withErrorHandler(lbpPoolsQueryResolverFactory(apiInstance), 'lbpPools'),
      [apiInstance]
    ),
  };
};
