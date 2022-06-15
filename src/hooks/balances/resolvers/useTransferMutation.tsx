import { MutationHookOptions, useMutation } from '@apollo/client';
import { loader } from 'graphql.macro';

export const TRANSFER_BALANCE = loader(
  './../graphql/TransferBalance.mutation.graphql'
);

export interface TransferBalanceMutationVariables {
  to?: string;
  currencyId?: string;
  amount?: string;
}

export const useTransferBalanceMutation = (options?: MutationHookOptions) =>
  useMutation<void, TransferBalanceMutationVariables>(TRANSFER_BALANCE, options);
