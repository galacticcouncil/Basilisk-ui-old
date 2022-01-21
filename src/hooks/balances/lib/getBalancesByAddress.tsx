import { ApiPromise } from '@polkadot/api';
import { includes } from 'lodash';
import { useCallback } from 'react';
import { Balance } from '../../../generated/graphql';
import { usePolkadotJsContext } from '../../polkadotJs/usePolkadotJs';
import constants from '../../../constants';

export const assetBalanceDataType = 'AccountData';

export const getBalancesByAddress = async (
  apiInstance: ApiPromise,
  address: string,
  assetIds?: string[]
): Promise<Balance[]> => {
  /**
   * Implementation
   *
   * const nativeAssetBalance = await apiInstance.query.system.account(address);
   * or
   * await apiInstance.query.tokens.accounts.multi( ... )
   * or
   * await apiInstance.query.tokens.accounts.entries( ... )
   */
  const balances: Balance[] = [];
  if (!assetIds || includes(assetIds, constants.nativeAssetId)) {
    const nativeAssetBalance = await apiInstance.query.system.account(address);

    balances.push({
      assetId: constants.nativeAssetId,
      balance: nativeAssetBalance?.data.free.toString(),
    });
  }

  return balances;
};

export const useGetBalancesByAddress = () => {
  const { apiInstance } = usePolkadotJsContext();

  return useCallback(
    async (address?: string, assetIds?: string[]) => {
      if (!apiInstance || !address) return;
      return await getBalancesByAddress(apiInstance, address, assetIds);
    },
    // TODO: investigate why 'loading' can't be used in callback (es-lint error)
    [apiInstance]
  );
};
