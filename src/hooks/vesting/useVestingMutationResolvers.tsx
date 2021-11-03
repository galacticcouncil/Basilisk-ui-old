import { useCallback } from 'react'
import { useResolverToRef } from '../accounts/useAccountsMutationResolvers'
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs'
import { web3FromAddress } from '@polkadot/extension-dapp';
import { ClaimVestedAmountMutationVariables } from './useClaimVestedAmountMutation';

export const useVestingMutationResolvers = () => {
    const { apiInstance, loading } = usePolkadotJsContext();
    
    const claimVestedAmount = useResolverToRef(
        useCallback(async (
            _obj,
            { address }: ClaimVestedAmountMutationVariables
        ) => {
            // TODO: error handling?
            // or return a function thats callable with an address from the UI
            if (!address) return;
            if (loading || !apiInstance) return;
            const { signer } = await web3FromAddress(address);
            const hash = await apiInstance.tx.vesting.claim()
                .signAndSend(
                    address,
                    { signer },
                    ({ status }) => {
                        // TODO: handle status via the action log / notification stack
                        console.log('status', status);
                    }
                )
            console.log('hash', hash);
        }, [loading, apiInstance])
    )

    return {
        claimVestedAmount
    }
}