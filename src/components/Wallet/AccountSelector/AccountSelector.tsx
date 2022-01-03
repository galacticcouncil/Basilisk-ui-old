import { MutableRefObject, useMemo } from 'react';
import { Account } from '../../../generated/graphql';
import { AccountItem } from './AccountItem/AccountItem';
import { Button, ButtonKind } from '../../Button/Button';
import './AccountSelector.scss';

export interface AccountSelectorProps {
  accounts?: Account[];
  account?: Account;
  onAccountSelected: (asset: Account) => void;
  innerRef: MutableRefObject<HTMLDivElement | null>;
  closeModal: () => void;
}

/**
 * Renders a list of accounts that the user can select an account from
 */
export const AccountSelector = ({
  accounts,
  onAccountSelected,
  account,
  innerRef,
  closeModal,
}: AccountSelectorProps) => {
  const activeAccount = useMemo(() => account, [account]);

  return (
    <div className="account-selector" ref={innerRef}>
      <div className="account-selector__content-wrapper">
        <div className="account-selector__heading d-flex flex-align-space mx-3 my-3">
          <div>Select an account</div>
          <div
            className="account-selector__close-modal-btn"
            onClick={() => closeModal()}
          >
            x
          </div>
        </div>
        {accounts?.length ? (
          <div className="account-selector__accounts-list">
            {accounts?.map((account, i) => (
              <AccountItem
                key={i}
                onClick={() => onAccountSelected(account)}
                active={account.id === activeAccount?.id}
                account={account}
              />
            ))}
          </div>
        ) : (
          <div className="mx-3 my-5 text-center">
            <h4>No accounts available</h4>
            <a href="/#" className="account-selector__create-account-link">
              Need help creating an account? <br />
              Click here
            </a>
          </div>
        )}
        {account && (
          <div className="d-flex mx-3">
            <Button kind={ButtonKind.Secondary}>Clear account</Button>
          </div>
        )}
      </div>
    </div>
  );
};
