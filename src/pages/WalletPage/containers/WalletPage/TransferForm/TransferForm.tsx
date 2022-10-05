import { useApolloClient } from '@apollo/client'
import { watch } from 'fs'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { AssetBalanceInput } from '../../../../../components/Balance/AssetBalanceInput/AssetBalanceInput'
import { FormattedBalance } from '../../../../../components/Balance/FormattedBalance/FormattedBalance'
import Icon from '../../../../../components/Icon/Icon'
import { useMultiFeePaymentConversionContext } from '../../../../../containers/MultiProvider'
import { Asset } from '../../../../../generated/graphql'
import { estimateBalanceTransfer } from '../../../../../hooks/balances/resolvers/mutation/balanceTransfer'
import { useTransferBalanceMutation } from '../../../../../hooks/balances/resolvers/useTransferMutation'
import { usePolkadotJsContext } from '../../../../../hooks/polkadotJs/usePolkadotJs'
import { Notification } from '../../../WalletPage'
import './TransferForm.scss'
import { checkAddress } from '@polkadot/util-crypto'
import constants from '../../../../../constants'
import BigNumber from 'bignumber.js'
import { toPrecision12 } from '../../../../../hooks/math/useToPrecision'
import { fromPrecision12 } from '../../../../../hooks/math/useFromPrecision'
import { encodeAddress, decodeAddress } from '@polkadot/util-crypto'
import { AssetList } from '../../../../../misc/utils/getAssetMap'

export const TransferForm = ({
  closeModal,
  assetId = '0',
  balance = '0',
  setNotification,
  assets
}: {
  closeModal: () => void
  assetId?: string
  balance?: string
  setNotification: (notification: Notification) => void
  assets?: string[]
}) => {
  const modalContainerRef = useRef<HTMLDivElement | null>(null)
  const form = useForm<{
    to?: string
    amount?: string
    asset?: string
    submit: any
  }>({
    // mode: 'all',
    defaultValues: {
      asset: assetId,
      to: undefined,
      amount: undefined,
      submit: undefined
    }
  })

  const { register, watch, getValues, setValue, trigger, control, formState } =
    form

  const { isValid, isDirty, errors } = formState

  const [transferBalance] = useTransferBalanceMutation()

  const clearNotificationIntervalRef = useRef<any>()
  const handleSubmit = useCallback(
    (data: any) => {
      // this is not ideal, but we want to show the pending status
      // which is hidden behind the modal currently
      closeModal()
      setNotification('pending')
      transferBalance({
        variables: {
          currencyId: data.asset,
          amount: data.amount,
          to: data.to
        },
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
    },
    [closeModal, setNotification, transferBalance]
  )

  useEffect(() => {
    form.trigger('submit')
  }, [...form.watch(['amount', 'to', 'asset'])])

  const [txFee, setTxFee] = useState<string>()
  const { apiInstance, loading: apiInstanceLoading } = usePolkadotJsContext()
  const client = useApolloClient()
  const { convertToFeePaymentAsset, feePaymentAsset } =
    useMultiFeePaymentConversionContext()

  useEffect(() => {
    if (!apiInstance || apiInstanceLoading) return
    ;(async () => {
      console.log('reestimating', {
        from: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
        to:
          form.getValues('to') ||
          '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
        currencyId: form.getValues('asset') || '0',
        amount: form.getValues('amount') || '0'
      })
      const estimate = await estimateBalanceTransfer(
        client.cache,
        apiInstance,
        {
          from: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
          to:
            form.getValues('to') ||
            '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
          currencyId: form.getValues('asset') || '0',
          amount: form.getValues('amount') || '0'
        }
      )
      setTxFee(estimate.partialFee.toString())
    })()
  }, [
    apiInstance,
    apiInstanceLoading,
    client,
    ...form.watch(['amount', 'asset', 'to'])
  ])

  const [displayError, setDisplayError] = useState<string | undefined>()
  const isError = useMemo(() => !!errors?.submit?.type, [errors?.submit])
  const formError = useMemo(() => {
    console.log(
      'form.formState.errors?.submit?.type',
      form.formState.errors?.submit?.type
    )
    switch (form.formState.errors?.submit?.type) {
      case 'notEnoughBalance':
        return 'Insufficient balance'
      case 'address':
        return 'Incorrect address'
      case 'amount':
        return 'Amount must be more than zero'
    }
    return
  }, [form.formState.errors.submit])

  useEffect(() => {
    if (formError) {
      const timeoutId = setTimeout(() => setDisplayError(formError), 50)
      return () => timeoutId && clearTimeout(timeoutId)
    }
    const timeoutId = setTimeout(() => setDisplayError(formError), 300)
    return () => timeoutId && clearTimeout(timeoutId)
  }, [formError])

  return (
    <>
      <div ref={modalContainerRef}></div>
      <div className="transfer-form">
        <div className="modal-component-wrapper transfer-form-container">
          <div className="modal-component-heading">
            <div className="modal-component-heading__main-text">Transfer</div>
            <div className="close-modal-btn" onClick={() => closeModal()}>
              <Icon name="Cancel" />
            </div>
          </div>

          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="modal-component-content">
                <div className="transfer-form__transfer-form-asset-input-container">
                  <label>To </label>
                  {/* TODO: validate address */}
                  <input
                    className="transfer-form__transfer-form-address-input"
                    type="text"
                    {...form.register('to', { required: true })}
                  />
                </div>

                <div className="transfer-form__transfer-form-asset-input-container">
                  <label>Amount </label>
                  <AssetBalanceInput
                    modalContainerRef={modalContainerRef}
                    balanceInputName="amount"
                    assetInputName="asset"
                    primaryAssets={assets}
                    isAssetSelectable={false}
                  />
                </div>
                {/* Form state: {form.formState.isDirty ? 'dirty': 'clean'}, {form.formState.isValid ? 'valid' : 'invalid'} */}
                <div className="transfer-form__transfer-form-fee">
                  Tx fee:{' '}
                  {txFee && feePaymentAsset ? (
                    <FormattedBalance
                      balance={{
                        assetId: feePaymentAsset,
                        balance: convertToFeePaymentAsset(txFee)!
                      }}
                    />
                  ) : (
                    <>-</>
                  )}
                </div>
              </div>
              <div
                className={
                  'validation error ' + (isError && isDirty ? 'visible' : '')
                }
              >
                {displayError}
              </div>
              <div className="buttons">
                <input
                  type="submit"
                  className="transfer-form__submit-button"
                  disabled={!form.formState.isDirty || !form.formState.isValid}
                  {...form.register('submit', {
                    validate: {
                      address: () => {
                        const recipientAddress = form.getValues('to')

                        try {
                          decodeAddress(recipientAddress)
                          return true
                        } catch (e) {
                          return false
                        }
                      },
                      amount: () => form.getValues('amount') !== undefined,
                      notEnoughBalance: () => {
                        const amount = form.getValues('amount')

                        return new BigNumber(fromPrecision12(balance) || 0).gte(
                          fromPrecision12(amount || '0')!
                        )
                      }
                    }
                  })}
                />
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  )
}
