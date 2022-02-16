import { useMemo } from 'react';
import { Account as AccountModel } from '../generated/graphql';
import { useSetActiveAccountMutation } from '../hooks/accounts/mutations/useSetActiveAccountMutation';
import { useGetAccountsQuery } from '../hooks/accounts/queries/useGetAccountsQuery';
import { usePersistActiveAccount } from '../hooks/accounts/lib/usePersistActiveAccount';

export const Account = ({ account }: { account?: AccountModel }) => {
  // TODO: you can get the loading state of the mutation here as well
  // but it probably needs to be turned into a contextual mutation
  // in order to share the loading state accross multiple mutation hook calls
  const [setActiveAccount] = useSetActiveAccountMutation();

  const [persistedActiveAccount] = usePersistActiveAccount();

  return (
    <div
      style={{
        marginBottom: '24px',
        padding: '12px',
        paddingLeft: 0,
      }}
    >
      <h3>
        {account?.name}
        {account?.id === persistedActiveAccount?.id ? ' [active]' : <></>}
      </h3>
      <p>
        <b>Address:</b>
        {account?.id}
      </p>
      <div>
        <b>Balances:</b>
        {account?.balances.map((balance, i) => (
          <p key={i}>
            {balance.assetId}:<i> {balance.balance}</i>
          </p>
        ))}
      </div>
      <button
        onClick={(_) =>
          account?.id === persistedActiveAccount?.id
            ? setActiveAccount({ variables: { id: undefined } })
            : setActiveAccount({ variables: { id: account?.id } })
        }
      >
        {account?.id === persistedActiveAccount?.id
          ? 'Unset active'
          : 'Set active'}
      </button>
    </div>
  );
};

export const WalletPage = () => {
  const { data: accountsData, loading: accountsLoading } =
    useGetAccountsQuery(false);

  const loading = useMemo(() => {
    return accountsLoading;
  }, [accountsLoading]);

  return (
    <div
      style={{
        textAlign: 'left',
      }}
    >
      <h1>Accounts</h1>

      {loading ? (
        <i>[WalletPage] Loading accounts...</i>
      ) : (
        <i>[WalletPage] Everything is up to date</i>
      )}

      <br />
      <br />

      {
        <div>
          {accountsData?.accounts?.map((account, i) => (
            <Account key={i} account={account} />
          ))}
        </div>
      }
    </div>
  );
};
