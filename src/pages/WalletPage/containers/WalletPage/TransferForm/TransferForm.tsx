import { useCallback, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { AssetBalanceInput } from '../../../../../components/Balance/AssetBalanceInput/AssetBalanceInput';
import Icon from '../../../../../components/Icon/Icon';
import { useTransferBalanceMutation } from '../../../../../hooks/balances/resolvers/useTransferMutation';
import './TransferForm.scss';

export const TransferForm = ({ closeModal }: { closeModal: () => void }) => {
  const modalContainerRef = useRef<HTMLDivElement | null>(null);
  const form = useForm();

  const [transferBalance] = useTransferBalanceMutation()

  const handleSubmit = useCallback((data: any) => {
    console.log('transfering', data);
    transferBalance({
      variables: {
        currencyId: '0',
        amount: data.amount,
        to: data.to
      }
    })
  }, []);

  return (
    <div className="transfer-form modal-component-wrapper">
      <div className="transfer-form__content-wrapper">
        <div ref={modalContainerRef}></div>
        <div className="modal-component-heading">
          Transfer
          <div className="close-modal-btn" onClick={() => closeModal()}>
            <Icon name="Cancel" />
          </div>
        </div>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <label>To: </label>
            {/* TODO: validate address */}
            <input type="text" {...form.register('to')} />
            <AssetBalanceInput
              modalContainerRef={modalContainerRef}
              balanceInputName="amount"
              assetInputName="asset"
            />

            <input type="submit" className="submit-button" />
          </form>
        </FormProvider>
      </div>
    </div>
  );
};
