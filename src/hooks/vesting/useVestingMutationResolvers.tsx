import { useCallback } from 'react'
import { useResolverToRef } from '../accounts/useAccountsMutationResolvers'
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs'
import { web3FromAddress } from '@polkadot/extension-dapp';
import { ClaimVestedAmountMutationVariables } from './useClaimVestedAmountMutation';
import { ExtrinsicStatus } from '@polkadot/types/interfaces/author';
import { DispatchError } from '@polkadot/types/interfaces/system';
import log from 'loglevel';

/**
 * Run an async function and handle the thrown errors
 * with an array of error handlers, which may handle the errors gracefully
 * 
 * @param fn 
 * @param errorHandlers 
 * @returns 
 */
type resolve = (result?: any) => void;
type reject = (error?: any) => void;
export const withGracefulErrors = async (
    fn: (resolve: resolve, reject: reject) => Promise<any>,
    errorHandlers: ((error: any) => void)[]
) => {
    return new Promise<any>(async (resolve, reject) => {
        try {
            resolve(await fn(resolve, reject));
        } catch (e: any) {
            e = errorHandlers.reduce((e, errorHandler) => errorHandler(e), e);
            // rejecting this promise with an error instead of throwing an error
            // is necessary to reflect the apollo resolver loading state correctly
            e ? reject(e) : resolve(null)
        }
    })
}

export const cancelledErrorMessage = 'Cancelled';

/**
 * This is an example graceful error handler,
 * if this would return `e` instead of `void`,
 * then the following graceful error handler would be triggered,
 * or by default the error would be thrown.
 * 
 * @param e
 * @returns 
 */
export const gracefulExtensionCancelationErrorHandler = (e: any) => {
    if ((e as Error)?.message === cancelledErrorMessage) {
        log.error('Operation presumably cancelled by the user in the Polkadot.js extension')
        return;
    }
    return e;
}

export const vestingClaimHandler = (resolve: resolve, reject: reject) => ({ 
    status, 
    dispatchError 
}: { 
    status: ExtrinsicStatus, 
    dispatchError?: DispatchError 
}) => {
    console.log('status', status);
    if (status.isFinalized) log.info('operation finalized')

    // TODO: handle status via the action log / notification stack
    if (status.isInBlock) {
        if (dispatchError?.isModule) {
            return log.info('claim unsuccessful');
        }

        return log.info('claim successful');
    }

    // if the operation has been broadcast, finish the mutation
    if (status.isBroadcast) {
        log.info('transaction has been broadcast');
        return resolve();
    }
    if (dispatchError) {
        log.error('There was a dispatch error', dispatchError);
        return reject();
    }
};

export const useVestingMutationResolvers = () => {
    const { apiInstance, loading } = usePolkadotJsContext();

    const claimVestedAmount = useResolverToRef(
        useCallback(async (
            _obj,
            { address }: ClaimVestedAmountMutationVariables
        ) => {
            // TODO: error handling?
            if (!address) return;
            if (loading || !apiInstance) return;

            // TODO: why does this not return a tx hash?
            return await withGracefulErrors(async (resolve, reject) => {
                const { signer } = await web3FromAddress(address);
                await apiInstance.tx.vesting.claim()
                        .signAndSend(
                            address,
                            { signer },
                            vestingClaimHandler(resolve, reject)
                        )
            }, [
                gracefulExtensionCancelationErrorHandler
            ])

        }, [loading, apiInstance]),
        'claimVestedAmount'
    )

    return {
        claimVestedAmount
    }
}