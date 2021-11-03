import { useMutation } from '@apollo/client';
import { loader } from 'graphql.macro';
import { GET_ACTIVE_ACCOUNT } from '../accounts/useGetActiveAccountQuery';

export const CLAIM_VESTED_AMOUNT = loader('./ClaimVestedAmount.mutation.graphql');

export type ClaimVestedAmountMutationResponse = void;
export interface ClaimVestedAmountMutationVariables {
    address?: string
}

// no need to refetch queries, active account will refetch with every new block anyways
export const useClaimVestedAmountMutation = (variables: ClaimVestedAmountMutationVariables) => useMutation<ClaimVestedAmountMutationResponse, ClaimVestedAmountMutationVariables>(
    CLAIM_VESTED_AMOUNT,
    { variables }
)