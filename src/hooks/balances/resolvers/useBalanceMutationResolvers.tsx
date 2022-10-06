import { ApiPromise } from '@polkadot/api'
import { web3FromAddress } from '@polkadot/extension-dapp'
import { DispatchError, ExtrinsicStatus } from '@polkadot/types/interfaces'
import log from 'loglevel'
import { useMemo } from 'react'
import errors from '../../../errors'
import { withErrorHandler } from '../../apollo/withErrorHandler'
import { usePolkadotJsContext } from '../../polkadotJs/usePolkadotJs'
import {
  gracefulExtensionCancelationErrorHandler as gracefulExtensionCancellationErrorHandler,
  reject,
  resolve,
  withGracefulErrors
} from '../../vesting/useVestingMutationResolvers'

export const transferBalanceHandler =
  (apiInstance: ApiPromise, resolve: resolve, reject: reject) =>
  ({
    status,
    dispatchError
  }: {
    status: ExtrinsicStatus
    dispatchError?: DispatchError
  }) => {
    if (status.isFinalized) log.info('operation finalized')

    // TODO: handle status via the action log / notification stack
    if (status.isInBlock) {
      if (dispatchError?.isModule) {
        return log.error(
          'transfer unsuccessful',
          apiInstance.registry.findMetaError(dispatchError.asModule)
        )
      }

      return log.info('transfer successful')
    }

    // if the operation has been broadcast, finish the mutation
    if (status.isBroadcast) {
      log.info('transaction has been broadcast')
      return resolve()
    }
    if (dispatchError) {
      log.error(
        'There was a dispatch error',
        apiInstance.registry.findMetaError(dispatchError.asModule)
      )
      return reject()
    }
  }

export const balanceMutationResolverFactory =
  (apiInstance?: ApiPromise) =>
  async (_obj: any, args: TransferBalanceMutationVariables) => {
    if (!apiInstance) throw Error(errors.apiInstanceNotInitialized)
    if (!args.to || !args.currencyId || !args.amount)
      throw new Error(errors.invalidTransferVariables)

    return withGracefulErrors(
      async (resolve, reject) => {
        const { signer } = await web3FromAddress(args.from!)
        await transferBalanceExtrinsic(apiInstance)
          .apply(apiInstance, [args.to!, args.currencyId!, args.amount!])
          .signAndSend(
            args.from!,
            { signer },
            transferBalanceHandler(apiInstance, resolve, reject)
          )
      },
      [gracefulExtensionCancellationErrorHandler]
    )
  }

export interface TransferBalanceMutationVariables {
  from?: string
  to?: string
  currencyId?: string
  amount?: string
}

const transferBalanceExtrinsic = (apiInstance: ApiPromise) =>
  apiInstance.tx.currencies.transfer

export const useBalanceMutationResolvers = () => {
  const { apiInstance } = usePolkadotJsContext()

  return {
    transferBalance: useMemo(
      () =>
        withErrorHandler(
          balanceMutationResolverFactory(apiInstance),
          'transferBalances'
        ),
      [apiInstance]
    )
  }
}
