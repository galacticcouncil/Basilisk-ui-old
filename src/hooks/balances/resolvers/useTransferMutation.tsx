import { useMutation } from '@apollo/client';
import { loader } from 'graphql.macro';

export const TRANSFER_BALANCE = loader(
  './graphql/TransferBalance.mutation.graphql'
);

export interface TransferBalanceMutationVariables {
  from?: string;
  to?: string;
  currencyId?: string;
  amount?: string;
}

export const useTransferBalanceMutation = (
  variables: TransferBalanceMutationVariables
) =>
  useMutation<void, TransferBalanceMutationVariables>(TRANSFER_BALANCE, {
    variables,
  });
