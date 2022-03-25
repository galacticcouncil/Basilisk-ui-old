import { ConfirmationType } from '../../hooks/actionLog/useWithConfirmation';
import { SubmitTradeMutationVariables } from '../../hooks/pools/mutations/useSubmitTradeMutation';
import { ModalPortalElementFactoryArgs } from '../Balance/AssetBalanceInput/hooks/useModalPortal';
import './Confirmation.scss';

export const Confirmation = ({
  isModalOpen,
  options,
  resolve,
  reject,
  confirmationType,
}: ModalPortalElementFactoryArgs & {
  options?: SubmitTradeMutationVariables; // or any other type that might be handled through confirmations
  confirmationType: ConfirmationType;
}) => {
  return isModalOpen ? (
    <div className="confirmation-screen">
      <div className='modal-component-wrapper'>
        <div className="modal-component-heading">Confirm transaction</div>
        <div className="modal-component-content">
          <p>Trade type: {options?.tradeType}</p>
          <p>Assets: {options?.assetInId} / {options?.assetOutId}</p>
          <p>Amounts: {options?.assetInAmount} / {options?.assetOutAmount}</p>
          <p>Limit: {options?.amountWithSlippage}</p>
        </div>
        <div className="buttons">
            <button onClick={() => reject()}>Cancel</button>
            <button onClick={() => resolve()}>Sign and send</button>
          </div>
      </div>
    </div>
  ) : (
    <></>
  );
};
