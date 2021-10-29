import { gql } from '@apollo/client';
import { PolkadotJsExtension } from '../../../../generated/graphql';
import { useState } from 'react';
import { web3Enable} from '@polkadot/extension-dapp';
import { useDedupeResolver } from '../../useDedupeResolver';
import { useCallback } from 'react';
import constants from '../../../../constants';

export interface GetPolkadotExtensionQueryResponse {
    polkadotExtension: PolkadotJsExtension
}

export const usePolkadotJsExtensionQueryResolver = () => useDedupeResolver(
    function useResolver() {
        const [state, setState] = useState<PolkadotJsExtension>({
            isAvailable: false
        });
        const resolver = useCallback(async () => {
            const extensions = await web3Enable(constants.appName);
    
            setState(() => ({
                isAvailable: extensions.length > 0
            }))
        }, []);
        return { resolver, state };
    }
);

/**
 * Apollo resolver that checks if a PolkadotJs extension is available/installed
 * TODO: provide a standalone query for the extension availability
 */
export const usePolkadotJsExtensionQueryResolvers = () => ({
    polkadotExtension: usePolkadotJsExtensionQueryResolver()
})