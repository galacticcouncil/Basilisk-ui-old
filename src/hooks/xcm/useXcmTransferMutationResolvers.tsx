import { web3FromAddress } from '@polkadot/extension-dapp';
import { useCallback } from 'react';
import { useResolverToRef } from '../accounts/resolvers/useAccountsMutationResolvers';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs'
import { gracefulExtensionCancelationErrorHandler, polkadotJsNotReadyYetError, reject, resolve, withGracefulErrors } from '../vesting/useVestingMutationResolvers';
import { XcmTransferMutationVariables } from './useXcmTransferMutation';
import { ExtrinsicStatus } from '@polkadot/types/interfaces/author';
import { DispatchError } from '@polkadot/types/interfaces/system';
import log from 'loglevel';
import { ApiPromise } from '@polkadot/api';
import {GET_ACTIVE_ACCOUNT, GetActiveAccountQueryResponse} from "../accounts/queries/useGetActiveAccountQuery";
import {ApolloCache, NormalizedCacheObject} from "@apollo/client";

import isValidAddressPolkadotAddress from '../../misc/utils/validatePolkadotAddress';
import {Chains, ChainTransferData} from "./useGetChains";

// TODO: use validate JSON schema module of some sort
export const invalidTransferVariablesError = 'Invalid XCM transfer parameters provided';
export const xcmNotSupported = 'XCM transfer not supported between the chains';
export const invalidPolkadotAddress = 'Destination address is not valid polkadot address';
export const activeAccountInvalid = 'Active acount not found';

export const responseHandler = (
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

function isXcmTransferSupported(fromChain: string, toChain: string, currencyId: string) {
    const chains = Chains;

    const from = chains.find( v => v.name === fromChain );
    const to = chains.find( v => v.name === toChain);

    let isSupported = false;
    let destChain;

    if (from && to)
    {
        destChain = from.supportedTransfers.find(v => v.name === toChain) as ChainTransferData;
        isSupported = destChain && !!destChain.assets?.find(v => v === currencyId);
    }

    return {
        isSupported,
        destChain
    }
}

export const xcmTransferExtrinsic = (apiInstance: ApiPromise) => apiInstance.tx.xTokens.transfer;

export const useXcmTransferMutationResolvers = () => {
    const { apiInstance, loading } = usePolkadotJsContext();

    const xcmTransfer = useResolverToRef(
        useCallback(async (
            _obj,
            { fromChain, toChain, currencyId, amount, to}: XcmTransferMutationVariables,
            { cache }: { cache: ApolloCache<NormalizedCacheObject> }
        ) => {
            if (loading || !apiInstance) throw new Error(polkadotJsNotReadyYetError);

            if (!fromChain|| !toChain || !currencyId ) throw new Error(invalidTransferVariablesError);

            const { isSupported, destChain } = isXcmTransferSupported(fromChain, toChain, currencyId);

            if (!isSupported || !destChain) throw new Error(xcmNotSupported);

            if (!isValidAddressPolkadotAddress(to)) throw new Error(invalidPolkadotAddress);

            const account = cache.readQuery<GetActiveAccountQueryResponse>({
                query: GET_ACTIVE_ACCOUNT,
                returnPartialData: true
            })?.account;

            if (!account) throw new Error(activeAccountInvalid);

            const address = account.id;

            const dest = {
                parents: 1,
                interior: {
                    X2: [{
                        Parachain: destChain.id
                    }, {
                        AccountId32: {
                            id: to,
                            network: "Any"
                        }
                    }]
                }
            };

            return withGracefulErrors(async (resolve, reject) => {
                const { signer } = await web3FromAddress(address);

                await xcmTransferExtrinsic(apiInstance).apply(apiInstance, [currencyId, amount, { V1: dest}, destChain.destWeight])
                    .signAndSend(
                        address,
                        { signer },
                        responseHandler(apiInstance, resolve, reject)
                    )
            }, [
                gracefulExtensionCancelationErrorHandler
            ]);
        }, [apiInstance, loading])
    )

    return {
        xcmTransfer
    }
}