import { NetworkStatus } from "@apollo/client";
import { MutableRefObject, useCallback, useEffect, useState } from "react";
import { useModalPortal } from "../../../components/Balance/AssetBalanceInput/hooks/useModalPortal";
import { useModalPortalElement } from "../../../components/Wallet/AccountSelector/hooks/useModalPortalElement";
import { Account } from "../../../generated/graphql";
import { useSetActiveAccountMutation } from "../../../hooks/accounts/mutations/useSetActiveAccountMutation";
import { useGetAccountsLazyQuery, useGetAccountsQuery } from "../../../hooks/accounts/queries/useGetAccountsQuery";
import { useGetActiveAccountQuery } from "../../../hooks/accounts/queries/useGetActiveAccountQuery";
import { useGetExtensionQuery } from "../../../hooks/extension/queries/useGetExtensionQuery";
import { useLoading } from "../../../hooks/misc/useLoading";

export const useAccountSelectorModal = ({
    modalContainerRef,
}: {
    modalContainerRef: MutableRefObject<HTMLDivElement | null>,
}) => {
  const { data: extensionData, loading: extensionLoading } =
    useGetExtensionQuery();
  const [setActiveAccount] = useSetActiveAccountMutation();
  const depsLoading = useLoading();
  const { data: activeAccountData, networkStatus: activeAccountNetworkStatus } =
    useGetActiveAccountQuery({
      skip: depsLoading || extensionLoading,
    });
  const [isAccountSelectorOpen, setAccountSelectorOpen] = useState(false);
  const [getAccounts, {
    data: accountsData,
    networkStatus: accountsNetworkStatus,
  }] = useGetAccountsLazyQuery(
    !(extensionData?.extension.isAvailable && isAccountSelectorOpen) ||
      depsLoading
  );

  const onAccountSelected = useCallback(
    (account: Account) => {
      setActiveAccount({ variables: { id: account.id } });
    },
    [setActiveAccount]
  );

  const onAccountCleared = useCallback(() => {
    setActiveAccount({ variables: { id: undefined } });
  }, [setActiveAccount]);

  const modalPortalElement = useModalPortalElement({
    accounts: accountsData?.accounts,
    accountsLoading: accountsNetworkStatus === NetworkStatus.loading,
    onAccountSelected,
    onAccountCleared,
    account: activeAccountData?.activeAccount,
    isExtensionAvailable: !!extensionData?.extension.isAvailable,
  });

  const modal = useModalPortal(
    modalPortalElement,
    modalContainerRef,
    // TODO: this doesnt work anyhow due to the backdrop
    // being included in the outside-click detection
    false // don't auto close when clicking outside the modalPortalElement
  );

  console.log('accountsNetworkStatus', accountsNetworkStatus)

  useEffect(() => {
    modal.isModalOpen && getAccounts();
  }, [modal.isModalOpen])

  return modal;
};
