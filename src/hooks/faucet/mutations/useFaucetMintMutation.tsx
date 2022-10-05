import { useMutation } from '@apollo/client'
import { loader } from 'graphql.macro'

export const FAUCET_MINT = loader('./../graphql/FaucetMint.mutation.graphql')

export const useFaucetMintMutation = () =>
  useMutation(FAUCET_MINT, {
    notifyOnNetworkStatusChange: true
  })
