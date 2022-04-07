import { ApolloCache, NormalizedCacheObject, useApolloClient } from "@apollo/client";
import { useCallback, useMemo } from "react";
import errors from "../../../../errors";
import { usePolkadotJsContext } from "../../../polkadotJs/usePolkadotJs"
import { mint } from "../../lib/mint"

export const useFaucetMintMutationResolvers = () => {
    const { apiInstance } = usePolkadotJsContext();
    return {
        faucetMint: useCallback(async (
            _obj,
            _args,
            { cache }: { cache: ApolloCache<NormalizedCacheObject> }
        ) => {
            if (!apiInstance) throw Error(errors.apiInstanceNotInitialized);
            return await mint(cache, apiInstance)
        }, [apiInstance])
    }
}