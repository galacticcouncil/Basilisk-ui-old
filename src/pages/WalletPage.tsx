import { useCallback, useMemo, useRef } from 'react';
import { Account, Account as AccountModel, Balance, Maybe, VestingSchedule } from '../generated/graphql';
import { useSetActiveAccountMutation } from '../hooks/accounts/mutations/useSetActiveAccountMutation';
import { useGetAccountsQuery } from '../hooks/accounts/queries/useGetAccountsQuery';
import { usePersistActiveAccount } from '../hooks/accounts/lib/usePersistActiveAccount';
import { useGetActiveAccountQuery } from '../hooks/accounts/queries/useGetActiveAccountQuery';
import { NetworkStatus } from '@apollo/client';
import { useLoading } from '../hooks/misc/useLoading';
import { useGetExtensionQuery } from '../hooks/extension/queries/useGetExtensionQuery';
import { useModalPortalElement } from '../components/Wallet/AccountSelector/hooks/useModalPortalElement';
import { useAccountSelectorModal } from '../containers/Wallet/hooks/useAccountSelectorModal';
import { FormattedBalance } from '../components/Balance/FormattedBalance/FormattedBalance';
import BigNumber from 'bignumber.js';

export const ActiveAccount = ({
  account,
  loading,
  onOpenAccountSelector
}: {
  account?: Maybe<Account>;
  loading: boolean;
  onOpenAccountSelector: () => void,
}) => {
  const [setActiveAccount] = useSetActiveAccountMutation();

  const handleClearAccount = useCallback(() => {
    setActiveAccount({ variables: { id: undefined } });
  }, [setActiveAccount]);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : account ? (
        <>
          <div>
            <div>{account.name}</div>
            <div>{account.source}</div>
            <div>{account.id}</div>
          </div>
          <div onClick={() => onOpenAccountSelector()}>Change account</div>
          <div onClick={() => handleClearAccount()}>Clear account</div>

          <Vesting vestingSchedules={[account?.vestingSchedule]}/>
          <BalanceList balances={account.balances}/>
        </>
      ) : (
        <div>Please connect a wallet first</div>
      )}
    </div>
  );
};

export const BalanceList = ({
  balances
}: {
  balances?: Array<Balance>
}) => {
  return <>
    {balances?.map(balance => (
      <div>
        {/* TODO: how to deal with unknown assets? (not knowing the metadata e.g. symbol/fullname) */}
        <FormattedBalance balance={balance} />
      </div>
    ))}
  </>
}

export const Vesting = ({ vestingSchedules }: {
  vestingSchedules?: Maybe<VestingSchedule | undefined>[]
}) => {
  // how much is claimable atm
  const claimable = useMemo(() => {
    return new BigNumber('0').toFixed(0);
  }, [vestingSchedules]);

  // sum of vesting schedules
  const original = useMemo(() => {
    return new BigNumber('0').toFixed(0);
  }, [vestingSchedules]);

  // lock
  const remaining = useMemo(() => {
    return new BigNumber('0').toFixed(0);
  }, [vestingSchedules]);

  // TODO: run mutation with confirmation
  const handleClaimClick = useCallback(() => {
    console.log('claiming');
  }, []);

  return <>
    <h2>Vesting</h2>
    <p>{original}</p>
    <p>{remaining}</p>
    <p>{claimable}</p>
    <button onClick={() => handleClaimClick()}>claim</button>
  </>
}

export const WalletPage = () => {
  const { data: extensionData, loading: extensionLoading } =
    useGetExtensionQuery();

  const depsLoading = useLoading();
  const { data: activeAccountData, networkStatus: activeAccountNetworkStatus } =
    useGetActiveAccountQuery({
      skip: depsLoading || extensionLoading,
    });
  const activeAccount = useMemo(
    () => activeAccountData?.activeAccount,
    [activeAccountData]
  );
  const activeAccountLoading = useMemo(() => (
    depsLoading || activeAccountNetworkStatus === NetworkStatus.loading
  ), [depsLoading, activeAccountNetworkStatus]);

  // couldnt really quickly figure out how to use just activeAccount + extension loading states
  // so depsLoading is reused here as well
  const loading = useMemo(
    () => activeAccountLoading || extensionLoading || depsLoading,
    [activeAccountLoading, extensionLoading, depsLoading]
  );

  const modalContainerRef = useRef<HTMLDivElement | null>(null);
  const { modalPortal, openModal } = useAccountSelectorModal({
    modalContainerRef,
  });

  console.log('activeAccount', activeAccount?.vestingSchedules);

  return (
    <>
      <div ref={modalContainerRef}></div>
      {modalPortal}
      <div>
        {loading ? (
          <div>Wallet loading...</div>
        ) : (
          <div>
            {activeAccount ? (
              <>
                <ActiveAccount 
                  account={activeAccount} 
                  loading={loading}
                  onOpenAccountSelector={openModal}
                />
              </>
            ) : (
              <div onClick={() => openModal()}>
                Click here to connect an account
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
