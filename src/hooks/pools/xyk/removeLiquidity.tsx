import { ApolloCache, NormalizedCacheObject } from '@apollo/client'
import { ApiPromise } from '@polkadot/api'
import { web3FromAddress } from '@polkadot/extension-dapp'
import { readActiveAccount } from '../../accounts/lib/readActiveAccount'
import {
  withGracefulErrors,
  gracefulExtensionCancelationErrorHandler,
  vestingClaimHandler,
  resolve,
  reject
} from '../../vesting/useVestingMutationResolvers'

export const xykRemoveLiquidityHandler = (
  resolve: resolve,
  reject: reject,
  apiInstance: ApiPromise
) => {
  return vestingClaimHandler(resolve, reject, apiInstance)
}

export const discount = false

export const estimateRemoveLiquidity = async (
  cache: ApolloCache<object>,
  apiInstance: ApiPromise,
  assetA: string,
  assetB: string,
  amount: string
) => {
  const activeAccount = readActiveAccount(cache)
  const address = activeAccount?.id

  if (!address) return

  return apiInstance.tx.xyk
    .removeLiquidity(assetA, assetB, amount)
    .paymentInfo(address)
}

export const removeLiquidity = async (
  cache: ApolloCache<NormalizedCacheObject>,
  apiInstance: ApiPromise,
  assetA: string,
  assetB: string,
  amount: string
) => {
  // await withGracefulErrors(
  // async (resolve, reject) => {
  await new Promise(async (resolve, reject) => {
    const activeAccount = readActiveAccount(cache)
    const address = activeAccount?.id

    // TODO: extract this error
    try {
      if (!address) return reject(new Error('No active account found!'))

      const { signer } = await web3FromAddress(address)

      await apiInstance.tx.xyk
        .removeLiquidity(assetA, assetB, amount)
        .signAndSend(
          address,
          { signer },
          xykRemoveLiquidityHandler(resolve, reject, apiInstance)
        )
    } catch (e) {
      reject(e)
    }
  })
  //   [gracefulExtensionCancelationErrorHandler]
  // );
}
