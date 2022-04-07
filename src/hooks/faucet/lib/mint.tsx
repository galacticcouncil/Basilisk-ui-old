import { ApolloCache, NormalizedCacheObject } from '@apollo/client';
import { ApiPromise } from '@polkadot/api';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { readActiveAccount } from '../../accounts/lib/readActiveAccount';
import { vestingClaimHandler } from '../../vesting/useVestingMutationResolvers';

export const mint = async (
  cache: ApolloCache<any>,
  apiInstance: ApiPromise
) => {
  await new Promise(async (resolve, reject) => {
    const activeAccount = readActiveAccount(cache);
    const address = activeAccount?.id;

    // TODO: extract this error
    try {
      if (!address) return reject(new Error('No active account found!'));

      const { signer } = await web3FromAddress(address);

      await apiInstance.tx.faucet
        .mint()
        .signAndSend(
          address,
          { signer },
          vestingClaimHandler(resolve, reject, apiInstance)
        );
    } catch (e) {
      reject(e);
    }
  });
};
