import { useMutation } from '@apollo/client';
import { loader } from 'graphql.macro';

export const XCM_TRANSFER = loader('./graphql/XcmTransfer.mutation.graphql');


export interface XcmTransferMutationVariables {
    fromChain: string,
    toChain: string,
    currencyId: string,
    amount: string
    to: string
}

export const useXcmTransferMutation = () => useMutation<void, XcmTransferMutationVariables>(
    XCM_TRANSFER,
    {
        notifyOnNetworkStatusChange: true
    }
)