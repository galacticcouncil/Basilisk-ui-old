import { useApolloClient } from '@apollo/client';
import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormattedBalance } from '../../../../../components/Balance/FormattedBalance/FormattedBalance';
import { useMultiFeePaymentConversionContext } from '../../../../../containers/MultiProvider';
import { Maybe, Vesting } from '../../../../../generated/graphql';
import { fromPrecision12 } from '../../../../../hooks/math/useFromPrecision';
import { usePolkadotJsContext } from '../../../../../hooks/polkadotJs/usePolkadotJs';
import { useClaimVestedAmountMutation } from '../../../../../hooks/vesting/useClaimVestedAmountMutation';
import { estimateClaimVesting } from '../../../../../hooks/vesting/useVestingMutationResolvers';
import { Notification } from '../../../WalletPage';
import './VestingClaim.scss';

export const VestingClaim = ({
  vesting,
  setNotification,
}: {
  vesting?: Maybe<Vesting | undefined>;
  setNotification: (notification: Notification) => void;
}) => {
  const isVestingAvailable = useMemo(() => {
    return (
      vesting?.originalLockBalance &&
      new BigNumber(vesting?.originalLockBalance).gt('0')
    );
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
    claimVestedAmount();
  }, []);

  const { apiInstance, loading: apiInstanceLoading } = usePolkadotJsContext();
  const client = useApolloClient();
  const { feePaymentAsset, convertToFeePaymentAsset } =
    useMultiFeePaymentConversionContext();

  const [txFee, setTxFee] = useState<string>();
  useEffect(() => {
    if (!apiInstance || apiInstanceLoading) return;
    (async () => {
      const txFee = await estimateClaimVesting(
        client.cache as any,
        apiInstance,
        {}
      );
      console.log(
        'claim tx fee',
        convertToFeePaymentAsset(txFee.partialFee.toString())
      );
      setTxFee(convertToFeePaymentAsset(txFee.partialFee.toString()));
    })();
  }, [
    apiInstance,
    apiInstanceLoading,
    estimateClaimVesting,
    client,
    convertToFeePaymentAsset,
  ]);

  return (
    <div className="vesting-claim">
      <h2 className="vesting-claim__title">Vesting</h2>
      <div className="vesting-claim-wrapper">
        <div className="item">Claimable</div>
        <div className="item">Original vesting</div>
        <div className="item">Remaining vesting</div>
        <div className="vesting-claim__fee">Tx fee</div>
        <div className="item"></div>
      </div>
      {isVestingAvailable ? (
        <div className="vesting-claim-wrapper">
          <div className="item">
            {fromPrecision12(vesting?.claimableAmount)} BSX
          </div>
          <div className="item">
            {fromPrecision12(vesting?.originalLockBalance)} BSX
          </div>
          <div className="item">
            {fromPrecision12(vesting?.lockedVestingBalance)} BSX
          </div>
          <div className="vesting-claim__fee">
            {txFee ? (
              <FormattedBalance
                balance={{
                  assetId: feePaymentAsset || '0',
                  balance: txFee,
                }}
              />
            ) : (
              <>-</>
            )}
          </div>
          <div className="item">
            <button
              className="vesting-claim-button"
              onClick={() => handleClaimClick()}
            >
              <div className="vesting-claim-button__label">Claim</div>
            </button>
          </div>
        </div>
      ) : (
        <div className="vesting-claim-wrapper">
          <>No vesting available</>
        </div>
      )}
    </div>
  );
};
