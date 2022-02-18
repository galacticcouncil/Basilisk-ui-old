import { MutableRefObject, useMemo } from 'react';
import { Account } from '../../../generated/graphql';
import { AccountItem } from './AccountItem/AccountItem';
import { Button, ButtonKind } from '../../Button/Button';
import './AccountSelector.scss';
import { FormattedMessage } from 'react-intl';

export interface AccountSelectorProps {
  accounts?: Account[];
  accountsLoading: boolean;
  account?: Account;
  onAccountSelected: (account: Account) => void;
  onAccountCleared: () => void;
  innerRef: MutableRefObject<HTMLDivElement | null>;
  closeModal: () => void;
  isExtensionAvailable: boolean;
}

/**
 * Renders a list of accounts that the user can select an account from
 */
export const AccountSelector = ({
  accounts,
  accountsLoading,
  onAccountSelected,
  onAccountCleared,
  account,
  innerRef,
  closeModal,
  isExtensionAvailable,
}: AccountSelectorProps) => {
  const activeAccount = useMemo(() => account, [account]);

  return (
    <div className="account-selector" ref={innerRef}>
      <div className="account-selector__content-wrapper">
        <div className="d-flex flex-align-space mx-3 my-3 account-selector__heading">
          <div>
            {isExtensionAvailable ? (
              <FormattedMessage
                id="Wallet.SelectAccount"
                defaultMessage="Select account"
              />
            ) : (
              <FormattedMessage
                id="Wallet.InstallExtension"
                defaultMessage="Install extension"
              />
            )}
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
            {accountsLoading ? (
              <div className="mx-3 my-5 text-center">
                <FormattedMessage
                  id="Wallet.Loading"
                  defaultMessage="Loading..."
                />
              </div>
            ) : (
              <>
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
                  //TODO update href param when we know where to send user
                  <div className="mx-3 my-5 text-center">
                    <h4>
                      <FormattedMessage
                        id="Wallet.NoAccountsAvailable"
                        defaultMessage="No accounts available"
                      />
                    </h4>
                    <a
                      href="/#"
                      className="account-selector__create-account-link"
                    >
                      <FormattedMessage
                        id="Wallet.SelectAccountHelp"
                        defaultMessage="Need help creating an account?"
                      />
                      <br />
                      <a href="/#" title="" target="_blank">
                        <FormattedMessage id="Wallet.ClickHere" />
                      </a>
                    </a>
                  </div>
                )}
                {account && (
                  <div className="d-flex mx-3">
                    <Button
                      kind={ButtonKind.Secondary}
                      onClick={onAccountCleared}
                    >
                      <FormattedMessage
                        id="Wallet.ClearAccount"
                        defaultMessage="Clear account"
                      />
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div className="mx-3 my-5 text-center">
            <p>
              <FormattedMessage
                id="Wallet.InstallInstructions"
                values={{
                  link: (
                    <a
                      href="https://polkadot.js.org/extension/"
                      title=""
                      className="account-selector__create-account-link"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FormattedMessage id="Wallet.InstallLinkText" />
                    </a>
                  ),
                }}
              />
            </p>
            <p>
              <FormattedMessage
                id="Wallet.ReloadInstructions"
                values={{
                  link: (
                    <a
                      href="/#"
                      className="account-selector__create-account-link"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.reload();
                      }}
                    >
                      <FormattedMessage
                        id="Wallet.ReloadLinkText"
                        defaultMessage="reload the page"
                      />
                    </a>
                  ),
                }}
              />
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
