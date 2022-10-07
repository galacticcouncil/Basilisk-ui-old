import { useApolloClient } from '@apollo/client'
import BigNumber from 'bignumber.js'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FormattedBalance } from '../../../../../components/Balance/FormattedBalance/FormattedBalance'
import { useMultiFeePaymentConversionContext } from '../../../../../containers/MultiProvider'
import { Maybe, Vesting } from '../../../../../generated/graphql'
import { fromPrecision12 } from '../../../../../hooks/math/useFromPrecision'
import { usePolkadotJsContext } from '../../../../../hooks/polkadotJs/usePolkadotJs'
import { useClaimVestedAmountMutation } from '../../../../../hooks/vesting/useClaimVestedAmountMutation'
import { estimateClaimVesting } from '../../../../../hooks/vesting/useVestingMutationResolvers'
import { Notification } from '../../../WalletPage'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import './VestingClaim.scss'

export const VestingClaim = ({
  vesting,
  setNotification
}: {
  vesting?: Maybe<Vesting | undefined>
  setNotification: (notification: Notification) => void
}) => {
  const isVestingAvailable = useMemo(() => {
    return (
      vesting?.originalLockBalance &&
      new BigNumber(vesting?.originalLockBalance).gt('0')
    )
  }, [vesting])
  const clearNotificationIntervalRef = useRef<any>()
  const [claimVestedAmount] = useClaimVestedAmountMutation({
    onCompleted: () => {
      setNotification('success')
      clearNotificationIntervalRef.current = setTimeout(() => {
        setNotification('standby')
      }, 4000)
    },
    onError: () => {
      setNotification('failed')
      clearNotificationIntervalRef.current = setTimeout(() => {
        setNotification('standby')
      }, 4000)
    }
  })

  // TODO: run mutation with confirmation
  const handleClaimClick = useCallback(() => {
    setNotification('pending')
    claimVestedAmount()
  }, [])

  const { apiInstance, loading: apiInstanceLoading } = usePolkadotJsContext()
  const client = useApolloClient()
  const { feePaymentAsset, convertToFeePaymentAsset } =
    useMultiFeePaymentConversionContext()

  const [txFee, setTxFee] = useState<string>()
  useEffect(() => {
    if (!apiInstance || apiInstanceLoading) return
    ;(async () => {
      const txFee = await estimateClaimVesting(
        client.cache as any,
        apiInstance,
        {}
      )
      console.log(
        'claim tx fee',
        convertToFeePaymentAsset(txFee.partialFee.toString())
      )
      setTxFee(convertToFeePaymentAsset(txFee.partialFee.toString()))
    })()
  }, [
    apiInstance,
    apiInstanceLoading,
    estimateClaimVesting,
    client,
    convertToFeePaymentAsset,
    feePaymentAsset
  ])

  return (
    <Table>
      <div className="vesting-claim">
        <h2 className="vesting-claim__title">Vesting</h2>
        <Thead>
          <Tr className="vesting-claim-wrapper active-account-wrapper-header">
            <Th className="item">Claimable</Th>
            <Th className="item">Original vesting</Th>
            <Th className="item">Remaining vesting</Th>
            <Th className="vesting-claim__fee">Tx fee</Th>
            <Th className="item"></Th>
          </Tr>
        </Thead>
        {isVestingAvailable ? (
          <Tbody>
            <Tr className="vesting-claim-wrapper">
              <Td className="item">
                {fromPrecision12(vesting?.claimableAmount || '0')} BSX
              </Td>
              <Td className="item">
                {fromPrecision12(vesting?.originalLockBalance || '0')} BSX
              </Td>
              <Td className="item">
                {fromPrecision12(vesting?.lockedVestingBalance || '0')} BSX
              </Td>
              <Td className="vesting-claim__fee">
                {txFee ? (
                  <FormattedBalance
                    balance={{
                      assetId: feePaymentAsset || '0',
                      balance: txFee
                    }}
                  />
                ) : (
                  <>-</>
                )}
              </Td>
              <Td className="item">
                <button
                  className="vesting-claim-button"
                  onClick={() => handleClaimClick()}
                >
                  <div className="vesting-claim-button__label">Claim</div>
                </button>
              </Td>
            </Tr>
          </Tbody>
        ) : (
          <Tbody>
            <Tr className="vesting-claim-wrapper vesting-claim-no-vesting">
              <>No vesting available</>
            </Tr>
          </Tbody>
        )}
      </div>
    </Table>
  )
}
