import { ApolloCache, NormalizedCacheObject } from "@apollo/client";
import { web3FromAddress } from "@polkadot/extension-dapp";
import { Maybe } from "graphql/jsutils/Maybe";
import { useCallback } from "react";
import { readActiveAccount } from "../../accounts/lib/readActiveAccount";
import { usePolkadotJsContext } from "../../polkadotJs/usePolkadotJs";
import { RemoveLiquidityMutationVariables } from "../mutations/useRemoveLiquidityMutation";
import { SubmitTradeMutationVariables } from "../mutations/useSubmitTradeMutation";
import { xykBuyHandler } from "../xyk/buy";

export const useRemoveLiquidityMutationResolver = () => {
  const { apiInstance } = usePolkadotJsContext();

  // return withErrorHandler(
  return useCallback(
      async (
        _obj,
        args: Maybe<RemoveLiquidityMutationVariables>,
        { cache }: { cache: ApolloCache<NormalizedCacheObject> }
      ) => {

        await new Promise(async (resolve, reject) => {
          const activeAccount = readActiveAccount(cache);
          const address = activeAccount?.id;
    
          // TODO: extract this error
          try {
            if (!address) return reject(new Error('No active account found!'));
    
          const { signer } = await web3FromAddress(address);
    
          await apiInstance?.tx.xyk.removeLiquidity(args?.assetA, args?.assetB, args?.amount)
            .signAndSend(
              address,
              { signer },
              xykBuyHandler(resolve, reject, apiInstance)
            );
          } catch (e) {
            reject(e)
          }
        })
      },
      [apiInstance]
    )
  // );
};