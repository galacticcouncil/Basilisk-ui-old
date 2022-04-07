import { useCallback, useMemo, useRef, useState } from 'react';
import { Account, Account as AccountModel, Balance, Maybe, Vesting, VestingSchedule } from '../generated/graphql';
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
import { fromPrecision12 } from '../hooks/math/useFromPrecision';
import { useClaimVestedAmountMutation } from '../hooks/vesting/useClaimVestedAmountMutation';

export type Notification = 'standby' | 'pending' | 'success' | 'failed';

export const ActiveAccount = ({
  account,
  loading,
  onOpenAccountSelector,
  setNotification
}: {
  account?: Maybe<Account>;
  loading: boolean;
  onOpenAccountSelector: () => void,
  setNotification: (notification: Notification) => void
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

          <VestingClaim vesting={account?.vesting} setNotification={setNotification}/>
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

export const VestingClaim = ({ vesting, setNotification }: {
  vesting?: Maybe<Vesting | undefined>,
  setNotification: (notification: Notification) => void
}) => {

  const clearNotificationIntervalRef = useRef<any>();
  const [claimVestedAmount] = useClaimVestedAmountMutation({
    onCompleted: () => {
      setNotification('success');
      clearNotificationIntervalRef.current = setTimeout(() => {
        setNotification('standby');
      }, 4000);
    },
    onError: () => {
      setNotification('failed');
      clearNotificationIntervalRef.current = setTimeout(() => {
        setNotification('standby');
      }, 4000);
    },
  });

  // TODO: run mutation with confirmation
  const handleClaimClick = useCallback(() => {
    claimVestedAmount()
  }, []);

  return <>
    <h2>Vesting</h2>
    <p>Claimable: {fromPrecision12(vesting?.claimableAmount)} BSX</p>
    <p>Original vesting (TODO: fix calc): {fromPrecision12(vesting?.originalLockBalance)} BSX</p>
    <p>Remaining vesting: {fromPrecision12(vesting?.lockedVestingBalance)} BSX</p>
    <button onClick={() => handleClaimClick()}>claim</button>
  </>
}

export const WalletPage = () => {
  const [notification, setNotification] = useState<Notification>('standby');

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

  console.log('activeAccount', activeAccount?.vesting);

  return (
    <>
      <div ref={modalContainerRef}></div>
      {modalPortal}
      <div>
        {loading ? (
          <div>Wallet loading...</div>
        ) : (
          <div>
            <div>Notification: {notification}</div>
            {activeAccount ? (
              <>
                <ActiveAccount 
                  account={activeAccount} 
                  loading={loading}
                  onOpenAccountSelector={openModal}
                  setNotification={setNotification}
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
