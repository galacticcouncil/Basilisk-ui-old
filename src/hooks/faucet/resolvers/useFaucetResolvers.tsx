import { useMemo } from 'react'
import { usePolkadotJsContext } from '../../polkadotJs/usePolkadotJs'
import { useFaucetMintMutationResolvers } from './mutation/faucetMint'

export const useFaucetResolvers = () => {
  return {
    Mutation: {
      ...useFaucetMintMutationResolvers()
    }
  }
}
