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
  setActiveAccount: Function;
  isExtensionAvailable: boolean;
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
  setActiveAccount,
  isExtensionAvailable,
}: AccountSelectorProps) => {
  const activeAccount = useMemo(() => account, [account]);

  return (
    <div className="account-selector" ref={innerRef}>
      <div className="account-selector__content-wrapper">
        <div className="d-flex flex-align-space mx-3 my-3 account-selector__heading">
          <div>
            {isExtensionAvailable ? 'Select an account' : 'Install extension'}
          </div>
          <div
            className="account-selector__close-modal-btn"
            onClick={() => closeModal()}
          >
            x
          </div>
        </div>
        {isExtensionAvailable ? (
          <>
            {accounts?.length ? (
              <div className="account-selector__accounts-list">
                {accounts?.map((account, i) => (
                  <AccountItem
                    key={i}
                    onClick={() => onAccountSelected(account)}
                    active={account.id === activeAccount?.id}
                    account={account}
                    setActiveAccount={setActiveAccount}
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
                <Button
                  kind={ButtonKind.Secondary}
                  onClick={() =>
                    setActiveAccount({
                      variables: {
                        id: undefined,
                      },
                    }).then(() => onAccountSelected(account))
                  }
                >
                  Clear account
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="mx-3 my-5 text-center">
            <p>
              {' '}
              To connect your account, please{' '}
              <a
                href="https://polkadot.js.org/extension/"
                title=""
                className="account-selector__create-account-link"
              >
                install or enable the polkadot.js extension
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
