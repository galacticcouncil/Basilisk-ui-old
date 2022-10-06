import { ApolloCache, useMutation } from '@apollo/client'
import { ApiPromise } from '@polkadot/api'
import { web3FromAddress } from '@polkadot/extension-dapp'
import { loader } from 'graphql.macro'
import { useMemo } from 'react'
import errors from '../../../../errors'
import { readActiveAccount } from '../../../accounts/lib/readActiveAccount'
import { withErrorHandler } from '../../../apollo/withErrorHandler'
import { usePolkadotJsContext } from '../../../polkadotJs/usePolkadotJs'
import { xykBuyHandler } from '../../../pools/xyk/buy'
import { vestingClaimHandler } from '../../../vesting/useVestingMutationResolvers'

export const TRANSFER_BALANCE = loader(
  './../../graphql/TransferBalance.mutation.graphql'
)

export interface TransferBalanceMutationVariables {
  from?: string
  to?: string
  currencyId?: string
  amount?: string
}

export const useTransferBalanceMutation = (
  variables: TransferBalanceMutationVariables
) =>
  useMutation<void, TransferBalanceMutationVariables>(TRANSFER_BALANCE, {
    variables
  })

export type resolve = (result?: any) => void
export type reject = (error?: any) => void

// TODO: use handler from #71
export const transferBalanceHandler = (
  apiInstance: ApiPromise,
  resolve: resolve,
  reject: reject
) => {
  return vestingClaimHandler(resolve, reject, apiInstance)
}

const transferBalanceExtrinsic = (apiInstance: ApiPromise) =>
  apiInstance.tx.currencies.transfer

export const estimateBalanceTransfer = async (
  cache: ApolloCache<object>,
  apiInstance: ApiPromise,
  args: TransferBalanceMutationVariables
) => {
  const activeAccount = readActiveAccount(cache)
  const address = activeAccount?.id

  if (!address)
    throw new Error(`Can't retrieve sender's address for estimation`)
  if (!args.from || !args.to || !args.currencyId || !args.amount)
    throw new Error(errors.invalidTransferVariables)

  return transferBalanceExtrinsic(apiInstance)
    .apply(apiInstance, [args.to, args.currencyId, args.amount])
    .paymentInfo(address)
}

const balanceTransferMutationResolverFactory =
  (apiInstance?: ApiPromise) =>
  async (
    _obj: any,
    args: TransferBalanceMutationVariables,
    { cache }: { cache: ApolloCache<any> }
  ) => {
    if (!args.to || !args.currencyId || !args.amount)
      throw new Error(errors.invalidTransferVariables)
    if (!apiInstance) throw new Error(errors.apiInstanceNotInitialized)

    // return withGracefulErrors(
    //   ,
    //   [gracefulExtensionCancellationErrorHandler]
    // );

    await new Promise(async (resolve, reject) => {
      try {
        const activeAccount = readActiveAccount(cache)
        const address = activeAccount?.id
        if (!address) return reject(new Error('No active account found!'))
        const { signer } = await web3FromAddress(address)

        await transferBalanceExtrinsic(apiInstance)
          .apply(apiInstance, [args.to, args.currencyId, args.amount])
          .signAndSend(
            address,
            { signer },
            xykBuyHandler(resolve, reject, apiInstance)
          )
      } catch (e) {
        reject(e)
      }
    })
  }

export const useBalanceMutationsResolvers = () => {
  const { apiInstance } = usePolkadotJsContext()

  return {
    transferBalance: withErrorHandler(
      useMemo(
        () => balanceTransferMutationResolverFactory(apiInstance),
        [apiInstance]
      ),
      'transferBalance'
    )
  }
}
