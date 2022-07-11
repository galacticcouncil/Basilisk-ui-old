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
}: ModalPortalElementFactoryArgs<any> & {
  options?: SubmitTradeMutationVariables; // or any other type that might be handled through confirmations
  confirmationType: ConfirmationType;
}) => {

  console.log('options', options);
  
  return isModalOpen ? (
    <div className="confirmation-screen">
      <div className="modal-component-wrapper">
        <div className="modal-component-heading">
          <div className="modal-component-heading__main-text">
            Confirm transaction
          </div>
        </div>
        <div className="modal-component-content">
          <p>Trade type: {options?.tradeType}</p>
          <p>
            Assets: {options?.assetInId} / {options?.assetOutId}
          </p>
          <p>
            Amounts: {options?.assetInAmount} / {options?.assetOutAmount}
          </p>
          <p>Limit: {options?.amountWithSlippage}</p>
        </div>
        <div className="buttons">
          <button className="button button--secondary" onClick={() => reject()}>
            Cancel
          </button>
          <button className="button--primary" onClick={() => resolve()}>
            <div className="button--primary label">Sign and send</div>
          </button>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};
