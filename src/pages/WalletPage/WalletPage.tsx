import { useCallback, useMemo, useRef, useState } from 'react';
import { Account, Account as AccountModel, Balance, Maybe, Vesting, VestingSchedule } from '../../generated/graphql';
import { useSetActiveAccountMutation } from '../../hooks/accounts/mutations/useSetActiveAccountMutation';
import { useGetAccountsQuery } from '../../hooks/accounts/queries/useGetAccountsQuery';
import { usePersistActiveAccount } from '../../hooks/accounts/lib/usePersistActiveAccount';
import { useGetActiveAccountQuery } from '../../hooks/accounts/queries/useGetActiveAccountQuery';
import { NetworkStatus } from '@apollo/client';
import { useLoading } from '../../hooks/misc/useLoading';
import { useGetExtensionQuery } from '../../hooks/extension/queries/useGetExtensionQuery';
import { useModalPortalElement } from '../../components/Wallet/AccountSelector/hooks/useModalPortalElement';
import { useAccountSelectorModal } from '../../containers/Wallet/hooks/useAccountSelectorModal';
import { FormattedBalance } from '../../components/Balance/FormattedBalance/FormattedBalance';
import BigNumber from 'bignumber.js';
import { fromPrecision12 } from '../../hooks/math/useFromPrecision';
import { useClaimVestedAmountMutation } from '../../hooks/vesting/useClaimVestedAmountMutation';
import { BalanceList } from './containers/WalletPage/BalanceList/BalanceList';
import { VestingClaim } from './containers/WalletPage/VestingClaim/VestingClaim';
import { ActiveAccount } from './containers/WalletPage/ActiveAccount/ActiveAccount';
import { useTransferFormModalPortal } from './containers/WalletPage/TransferForm/hooks/useTransferFormModalPortal';

export type Notification = 'standby' | 'pending' | 'success' | 'failed';

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

  const { modalPortal: transferFormModalPortal, openModal: openTransferFormModalPortal } = useTransferFormModalPortal(modalContainerRef);

  return (
    <>
      <div ref={modalContainerRef}></div>
      {modalPortal}
      {transferFormModalPortal}
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
                  onOpenTransferForm={openTransferFormModalPortal}
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
