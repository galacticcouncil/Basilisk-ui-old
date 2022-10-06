import { useFaucetMintMutationResolvers } from './mutation/faucetMint'

export const useFaucetResolvers = () => {
  return {
    Mutation: {
      ...useFaucetMintMutationResolvers()
    }
  }
}
