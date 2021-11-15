import { web3FromAddress } from '@polkadot/extension-dapp';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useResolverToRef } from '../accounts/resolvers/useAccountsMutationResolvers';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs'
import { gracefulExtensionCancelationErrorHandler, polkadotJsNotReadyYetError, reject, resolve, withGracefulErrors } from '../vesting/useVestingMutationResolvers';
import { TransferBalanceMutationVariables } from './useTransferBalanceMutation';
import { ExtrinsicStatus } from '@polkadot/types/interfaces/author';
import { DispatchError } from '@polkadot/types/interfaces/system';
import log from 'loglevel';
import { ApiPromise } from '@polkadot/api';
import { RuntimeDispatchInfo } from '@polkadot/types/interfaces/payment';

// TODO: use validate JSON schema module of some sort
export const invalidTransferVariablesError = 'Invalid transfer parameters provided';

export const transferBalanceHandler = (
    apiInstance: ApiPromise,
    resolve: resolve, 
    reject: reject
) => ({
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
            return log.error('transfer unsuccessful', 
                apiInstance.registry.findMetaError(dispatchError.asModule)
            );
        }

        return log.info('transfer successful');
    }

    // if the operation has been broadcast, finish the mutation
    if (status.isBroadcast) {
        log.info('transaction has been broadcast');
        return resolve();
    }
    if (dispatchError) {
        log.error('There was a dispatch error', 
            apiInstance.registry.findMetaError(dispatchError.asModule)
        );
        return reject();
    }
}

export const transferBalanceExtrinsic = (apiInstance: ApiPromise) => apiInstance.tx.currencies.transfer;

export const useEstimateTransferBalance = ({ from, to, currencyId, amount }: TransferBalanceMutationVariables) => {
    const { apiInstance } = usePolkadotJsContext();
    const [paymentInfo, setPaymentInfo] = useState<RuntimeDispatchInfo | undefined>(undefined);

    const estimatePaymentInfo = useCallback(async () => {
        if (!apiInstance || !from || !to || !currencyId || !amount) return setPaymentInfo(undefined);
        
        const paymentInfo = await transferBalanceExtrinsic(apiInstance)
                .apply(apiInstance, [to, currencyId, amount])
                .paymentInfo(from);
        
        setPaymentInfo(paymentInfo);

    }, [apiInstance, from, to, currencyId, amount, setPaymentInfo]);

    return { estimatePaymentInfo, paymentInfo };
}

export const useBalanceMutationResolvers = () => {
    const { apiInstance, loading } = usePolkadotJsContext();

    const transferBalance = useResolverToRef(
        useCallback(async (
            _obj,
            { from, to, currencyId, amount }: TransferBalanceMutationVariables
        ) => {
            if (!from || !to || !currencyId || !amount) throw new Error(invalidTransferVariablesError);
            if (loading || !apiInstance) throw new Error(polkadotJsNotReadyYetError);

            return withGracefulErrors(async (resolve, reject) => {
                const { signer } = await web3FromAddress(from);
                await transferBalanceExtrinsic(apiInstance).apply(apiInstance, [to, currencyId, amount])
                    .signAndSend(
                        from,
                        { signer },
                        transferBalanceHandler(apiInstance, resolve, reject)
                    )
            }, [
                gracefulExtensionCancelationErrorHandler
            ]);
        }, [apiInstance, loading])
    )

    return {
        transferBalance
    }
}