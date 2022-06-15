import BigNumber from "bignumber.js";
import { useCallback, useMemo, useRef } from "react";
import { Maybe, Vesting } from "../../../../../generated/graphql";
import { fromPrecision12 } from "../../../../../hooks/math/useFromPrecision";
import { useClaimVestedAmountMutation } from "../../../../../hooks/vesting/useClaimVestedAmountMutation";
import { Notification } from "../../../WalletPage";

export const VestingClaim = ({ vesting, setNotification }: {
    vesting?: Maybe<Vesting | undefined>,
    setNotification: (notification: Notification) => void
  }) => {
    const isVestingAvailable = useMemo(() => {
      return vesting?.originalLockBalance && new BigNumber(vesting?.originalLockBalance).gt('0');
    }, [vesting]);
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
      setNotification('pending');
      claimVestedAmount()
    }, []);
  
    return <>
      <h2>Vesting</h2>
      {isVestingAvailable
        ? (
          <>
            <p>Claimable: {fromPrecision12(vesting?.claimableAmount)} BSX</p>
            <p>Original vesting (TODO: fix calc): {fromPrecision12(vesting?.originalLockBalance)} BSX</p>
            <p>Remaining vesting: {fromPrecision12(vesting?.lockedVestingBalance)} BSX</p>
            <button onClick={() => handleClaimClick()}>claim</button>
          </>
        )
        : (
          <>
            No vesting available
          </>
        )
      }
      
    </>
  }