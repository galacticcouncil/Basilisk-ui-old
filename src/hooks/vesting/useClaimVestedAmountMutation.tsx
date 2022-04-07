import { MutationHookOptions, useMutation } from '@apollo/client';
import { loader } from 'graphql.macro';

export const CLAIM_VESTED_AMOUNT = loader('./graphql/ClaimVestedAmount.mutation.graphql');

export type ClaimVestedAmountMutationResponse = void;

// no need to refetch queries, active account will refetch with every new block anyways
export const useClaimVestedAmountMutation = (options?: MutationHookOptions<any, any>) => useMutation<ClaimVestedAmountMutationResponse>(
    CLAIM_VESTED_AMOUNT,
    { 
        notifyOnNetworkStatusChange: true,
        ...options,
    }
)