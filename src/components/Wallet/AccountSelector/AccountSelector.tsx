import { MutableRefObject, useMemo } from 'react';
import { Account } from '../../../generated/graphql';
import { AccountItem } from './AccountItem/AccountItem';
import './AccountSelector.scss';

export interface AccountSelectorProps {
  accounts?: Account[];
  account?: Account;
  onAccountSelected: (asset: Account) => void;
  innerRef: MutableRefObject<HTMLDivElement | null>;
}

/**
 * Renders a list of accounts that the user can select an account from
 * @param param0
 * @returns
 */
export const AccountSelector = ({
  accounts,
  onAccountSelected,
  account,
  innerRef,
}: AccountSelectorProps) => {
  const activeAccount = useMemo(() => account, [account]);

  // TODO: SEARCH
  return (
    <div className="account-selector" ref={innerRef}>
      <div className="account-selector__heading">Select an account</div>
      {accounts?.map((account, i) => (
        <AccountItem
          key={i}
          onClick={() => onAccountSelected(account)}
          active={account.id === activeAccount?.id}
          account={account}
        />
      ))}
    </div>
  );
};
