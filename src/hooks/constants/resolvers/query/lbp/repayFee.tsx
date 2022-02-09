import { useMemo } from 'react';
import { ApiPromise } from '@polkadot/api';
import { Fee } from '../../../../../generated/graphql';
import { getRepayFee } from '../../../lib/lbp/getRepayFee';
import { usePolkadotJsContext } from '../../../../polkadotJs/usePolkadotJs';
import { useResolverToRef } from '../../../../accounts/resolvers/useAccountsMutationResolvers';
import errors from '../../../../../errors';

export const __typename: Fee['__typename'] = 'Fee';

const withTypename = (fee: Fee) => ({
  __typename,
  ...fee,
});

export const repayFeeQueryResolverFactory =
  (apiInstance?: ApiPromise) => (): Fee | undefined => {
    if (!apiInstance) throw Error(errors.apiInstanceNotInitialized);

    return withTypename(getRepayFee(apiInstance));
  };

export const useRepayFeeQueryResolver = () => {
  const { apiInstance } = usePolkadotJsContext();

  return {
    // key is the entity, value is the resolver
    repayFee: useResolverToRef(
      // practically we dont have to wrap this in useCallback
      // since it does not have any contextual dependencies
      useMemo(() => repayFeeQueryResolverFactory(apiInstance), [apiInstance]),
      'repayFee'
    ),
  };
};
