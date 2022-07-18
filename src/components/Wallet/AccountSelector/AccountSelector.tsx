import { MutableRefObject, useMemo } from 'react';
import { Account, Maybe } from '../../../generated/graphql';
import { AccountItem } from './AccountItem/AccountItem';
import { Button, ButtonKind } from '../../Button/Button';
import './AccountSelector.scss';
import { FormattedMessage } from 'react-intl';
import Icon from '../../Icon/Icon';

export interface AccountSelectorProps {
  accounts?: Account[];
  accountsLoading: boolean;
  account?: Maybe<Account>;
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
      <div className="account-selector__content-wrapper modal-component-wrapper">
        <div className="modal-component-heading">
          <div>
            {isExtensionAvailable ? (
              <>
                <div className="modal-component-heading__main-text">
                  <FormattedMessage
                    id="Wallet.SelectAccount"
                    defaultMessage="Select account"
                  />
                </div>
                <div className="modal-component-heading__main-text__secondary">
                  Pick one of your accounts to connect to Basilisk
                </div>
              </>
            ) : (
              <div className="modal-component-heading__main-text">
                <FormattedMessage
                  id="Wallet.InstallExtension"
                  defaultMessage="Install extension"
                />
              </div>
            )}
          </div>
          <div className="close-modal-btn" onClick={() => closeModal()}>
            <Icon name="Cancel" />
          </div>
        </div>
        {isExtensionAvailable ? (
          <>
            {accountsLoading ? (
              <div className="account-selector__message">
                <FormattedMessage
                  id="Wallet.Loading"
                  defaultMessage="Loading..."
                />
              </div>
            ) : (
              <>
                {accounts?.length ? (
                  <div className="modal-component-content">
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
                  <div className="account-selector__message">
                    <h5>
                      <FormattedMessage
                        id="Wallet.NoAccountsAvailable"
                        defaultMessage="No accounts available"
                      />
                    </h5>
                    <div className="account-selector__create-account-link">
                      <FormattedMessage
                        id="Wallet.SelectAccountHelp"
                        defaultMessage="Need help creating an account?"
                      />
                      <br />
                      <a href="/#" title="" target="_blank">
                        <FormattedMessage id="Wallet.ClickHere" />
                      </a>
                    </div>
                  </div>
                )}
                {account && (
                  <div className="account-selector__clear-button">
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
          <div className="account-selector__message">
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
          </div>
        )}
      </div>
    </div>
  );
};
