import { MutationTuple } from '@apollo/client';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { ModalPortalElementFactoryArgs, useModalPortal } from '../../components/Balance/AssetBalanceInput/hooks/useModalPortal';
import { Confirmation } from '../../components/Confirmation/Confirmation';
import { useBodyContainerRefContext } from '../../containers/MultiProvider';

export enum ConfirmationType {
  Trade
}

export const useWithConfirmation = <
  TData extends unknown,
  TVariables extends unknown
>(
  mutationTuple: MutationTuple<TData, TVariables>,
  confirmationType: ConfirmationType
): {
  mutation: MutationTuple<TData, TVariables>;
  confirmationScreen: ReactNode;
} => {
  const [submit] = mutationTuple;
  // TODO: figure out a way to type this properly
  const [options, setOptions] = useState<any>();
  const bodyContainerRef = useBodyContainerRefContext();

  const { openModal, closeModal, modalPortal, status } = useModalPortal(
    useCallback((args: ModalPortalElementFactoryArgs<any>) => {
      console.log('options', options);
      return <Confirmation 
        confirmationType={confirmationType}
        options={options?.variables}
        {...args}
      />
    }, [options, confirmationType]),
    bodyContainerRef
  );

  useEffect(() => {
    status === 'success' && submit(options) 
  }, [status, submit, options]);

  const submitWithConfirmation = useCallback(
    async (options: Parameters<typeof submit>[0]) => {
      openModal();
      setOptions(options);
    },
    []
  );

  return {
    mutation: [submitWithConfirmation as any, mutationTuple[1]],
    confirmationScreen: modalPortal,
  };
};
