import { web3Enable } from '@polkadot/extension-dapp';
import { useCallback } from 'react'
import { useResolverToRef } from '../accounts/useAccountsMutationResolvers'

export const __typename = 'Extension';
export const id = __typename;
export const useExtensionQueryResolvers = () => {
    /**
     * TODO: handle the followingc cases gracefully:
     * - pending authorization request exists
     * - user rejects the connection in the extension
     * - app tries to connect again, after the connection has been rejected
     */
    const extension = useResolverToRef(
        useCallback(async () => {
            const extensions = await web3Enable('basilisk-ui');
            return {
                __typename,
                id,
                isAvailable: !!extensions.length,
            };
        }, [])
    )

    return {
        extension
    }
}