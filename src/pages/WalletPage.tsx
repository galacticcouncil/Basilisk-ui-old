import { useMemo } from 'react';
import { Account as AccountModel } from '../generated/graphql';
import { useSetActiveAccountMutation } from '../hooks/accounts/mutations/useSetActiveAccountMutation';
import { useGetAccountsQuery } from '../hooks/accounts/queries/useGetAccountsQuery'
import { useGetExtensionQuery } from '../hooks/polkadotJs/useGetExtensionQuery';

export const Account = ({ account }: { account?: AccountModel }) => {
    // TODO: you can get the loading state of the mutation here as well
    // but it probably needs to be turned into a contextual mutation
    // in order to share the loading state accross multiple mutation hook calls
    const [setActiveAccount] = useSetActiveAccountMutation({
        id: account?.id
    });

    const [unsetActiveAccount] = useSetActiveAccountMutation({
        id: undefined
    });

    return (
        <div style={{
            marginBottom: '24px',
            padding: '12px',
            paddingLeft: 0
        }}>
            <h3>
                {account?.name}
                {account?.isActive
                    ? ' [active]'
                    : <></>
                }
            </h3>
            <p>
                <b>Address:</b>
                {account?.id}
            </p>
            <div>
                <b>Balances:</b>
                {account?.balances.map((balance, i) => (
                    <p key={i}>
                        {balance.assetId}:
                        <i> {balance.balance}</i>
                    </p>
                ))}
            </div>
            <button
                onClick={_ => account?.isActive ? unsetActiveAccount() : setActiveAccount()}
            >
                {account?.isActive ? 'Unset active' : 'Set active'}
            </button>
        </div>
    )
}

export const WalletPage = () => {
    const { data: accountsData, loading: accountsLoading } = useGetAccountsQuery();
    const { data: extensionData, loading: extensionLoading } = useGetExtensionQuery();

    const loading = useMemo(() => {
        return accountsLoading || extensionLoading;
    }, [accountsLoading, extensionLoading])

    return <div style={{
        textAlign: 'left'
    }}>
        <h1>Accounts</h1>

        {loading
            ? <i>[WalletPage] Loading accounts...</i>
            : <i>[WalletPage] Everything is up to date</i>
        }

        <br /><br />

        {extensionData?.extension.isAvailable
            ? (
                <div>
                    {accountsData?.accounts.map((account, i) => (
                        <Account
                            key={i}
                            account={account}
                        />
                    ))}
                </div>
            )
            : <p>Extension unavailable</p>
        }
    </div>
}