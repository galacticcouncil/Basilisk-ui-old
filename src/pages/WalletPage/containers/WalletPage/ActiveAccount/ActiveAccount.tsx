import { useCallback } from "react";
import { Account, Maybe } from "../../../../../generated/graphql";
import { useSetActiveAccountMutation } from "../../../../../hooks/accounts/mutations/useSetActiveAccountMutation";
import { Notification } from "../../../WalletPage";
import { BalanceList } from "../BalanceList/BalanceList";
import { VestingClaim } from "../VestingClaim/VestingClaim";

export const ActiveAccount = ({
    account,
    loading,
    onOpenAccountSelector,
    onOpenTransferForm,
    setNotification
  }: {
    account?: Maybe<Account>;
    loading: boolean;
    onOpenAccountSelector: () => void,
    onOpenTransferForm: () => void,
    setNotification: (notification: Notification) => void
  }) => {
    const [setActiveAccount] = useSetActiveAccountMutation();
  
    const handleClearAccount = useCallback(() => {
      setActiveAccount({ variables: { id: undefined } });
    }, [setActiveAccount]);
  
    return (
      <div>
        <h2>Active account</h2>
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
            <BalanceList balances={account.balances} onOpenTransferForm={onOpenTransferForm}/>
          </>
        ) : (
          <div>Please connect a wallet first</div>
        )}
      </div>
    );
  };