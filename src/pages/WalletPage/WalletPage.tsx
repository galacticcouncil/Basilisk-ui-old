import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Account, Account as AccountModel, Balance, Maybe, Vesting, VestingSchedule } from '../../generated/graphql';
import { useSetActiveAccountMutation } from '../../hooks/accounts/mutations/useSetActiveAccountMutation';
import { useGetAccountsQuery } from '../../hooks/accounts/queries/useGetAccountsQuery';
import { usePersistActiveAccount } from '../../hooks/accounts/lib/usePersistActiveAccount';
import { useGetActiveAccountQuery, useGetActiveAccountQueryContext } from '../../hooks/accounts/queries/useGetActiveAccountQuery';
import { NetworkStatus } from '@apollo/client';
import { useLoading } from '../../hooks/misc/useLoading';
import { useGetExtensionQuery, useGetExtensionQueryContext } from '../../hooks/extension/queries/useGetExtensionQuery';
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
import { useSetConfigMutation } from '../../hooks/config/useSetConfigMutation';
import { useGetConfigQuery } from '../../hooks/config/useGetConfigQuery';

export type Notification = 'standby' | 'pending' | 'success' | 'failed';

export const WalletPage = () => {
  const [notification, setNotification] = useState<
    'standby' | 'pending' | 'success' | 'failed'
  >('standby');

  const { data: extensionData, loading: extensionLoading } =
    useGetExtensionQueryContext();

  const depsLoading = useLoading();
  const { data: activeAccountData, networkStatus: activeAccountNetworkStatus } =
    useGetActiveAccountQueryContext();
    
  const activeAccount = useMemo(
    () => activeAccountData?.activeAccount,
    [activeAccountData]
  );
  const activeAccountLoading = useMemo(() => (
    depsLoading || activeAccountNetworkStatus === NetworkStatus.loading
  ), [depsLoading, activeAccountNetworkStatus]);

  const { data: configData, networkStatus: configNetworkStatus } = useGetConfigQuery({
    skip: activeAccountLoading
  });

  const configLoading = useMemo(() => {
    return depsLoading || configNetworkStatus == NetworkStatus.loading
  }, [configNetworkStatus, depsLoading]);

  // couldnt really quickly figure out how to use just activeAccount + extension loading states
  // so depsLoading is reused here as well
  const loading = useMemo(
    () => activeAccountLoading || extensionLoading || depsLoading || configLoading,
    [activeAccountLoading, extensionLoading, depsLoading, configLoading]
  );

  const modalContainerRef = useRef<HTMLDivElement | null>(null);
  const { modalPortal, openModal } = useAccountSelectorModal({
    modalContainerRef,
  });

  const assets = useMemo(() => {
    return activeAccount?.balances.map((balance) => ({ id: balance.assetId }))
  }, [activeAccount]);

  const { modalPortal: transferFormModalPortal, openModal: openTransferFormModalPortal } = useTransferFormModalPortal(modalContainerRef, setNotification, assets);

  const handleOpenTransformForm = useCallback((assetId: string) => {
    console.log('asset id', assetId);
    openTransferFormModalPortal({ assetId })
  }, [openTransferFormModalPortal])

  const [setConfigMutation, { loading: setConfigLoading }] = useSetConfigMutation()
  const clearNotificationIntervalRef = useRef<any>();

  useEffect(() => {
    if (setConfigLoading) setNotification('pending');
  }, [setConfigLoading]);

  const onSetAsFeePaymentAsset = useCallback((feePaymentAsset: string) => {
    clearNotificationIntervalRef.current &&
      clearTimeout(clearNotificationIntervalRef.current);
    clearNotificationIntervalRef.current = null;
    
    console.log('setting fee payment asset', feePaymentAsset);
    setConfigMutation({
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
      variables: {
        config: {
          feePaymentAsset
        }
      }
    })
  }, [setConfigMutation]);

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
                  onOpenTransferForm={handleOpenTransformForm}
                  feePaymentAssetId={configData?.config.feePaymentAsset || '0'}
                  onSetAsFeePaymentAsset={onSetAsFeePaymentAsset}
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
