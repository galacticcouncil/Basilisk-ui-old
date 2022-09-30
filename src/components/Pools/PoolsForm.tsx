import BigNumber from 'bignumber.js'
import classNames from 'classnames'
import { every, find, times } from 'lodash'
import {
  MutableRefObject,
  useCallback,
  useDebugValue,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { Control, FormProvider, useForm } from 'react-hook-form'
import { Account, Balance, Maybe, Pool, XykPool } from '../../generated/graphql'
import { fromPrecision12 } from '../../hooks/math/useFromPrecision'
import { useMath } from '../../hooks/math/useMath'
import { percentageChange } from '../../hooks/math/usePercentageChange'
import { toPrecision12 } from '../../hooks/math/useToPrecision'
import { SubmitTradeMutationVariables } from '../../hooks/pools/mutations/useSubmitTradeMutation'
import { TradeAssetIds } from '../../pages/TradePage/TradePage'
import { idToAsset } from '../../misc/idToAsset'
import { AssetBalanceInput } from '../Balance/AssetBalanceInput/AssetBalanceInput'
import { PoolType } from '../Chart/shared'
import { PoolsInfo } from './PoolsInfo/PoolsInfo'
import './PoolsForm.scss'
import Icon from '../Icon/Icon'
import { useModalPortal } from '../Balance/AssetBalanceInput/hooks/useModalPortal'
import { FormattedBalance } from '../Balance/FormattedBalance/FormattedBalance'
import { useDebugBoxContext } from '../../pages/TradePage/hooks/useDebugBox'
import { horizontalBar } from '../Chart/ChartHeader/ChartHeader'
import { usePolkadotJsContext } from '../../hooks/polkadotJs/usePolkadotJs'
import { useApolloClient } from '@apollo/client'
import { estimateBuy } from '../../hooks/pools/xyk/buy'
import { estimateSell } from '../../hooks/pools/xyk/sell'
import { payment } from '@polkadot/types/interfaces/definitions'
import { useMultiFeePaymentConversionContext } from '../../containers/MultiProvider'

export interface PoolsFormSettingsProps {
  allowedSlippage: string | null
  onAllowedSlippageChange: (allowedSlippage: string | null) => void
  closeModal: any
}

export enum ProvisioningType {
  Add,
  Remove
}

export interface PoolsFormSettingsFormFields {
  allowedSlippage: string | null
  autoSlippage: boolean
}

export const PoolsFormSettings = ({
  allowedSlippage,
  onAllowedSlippageChange,
  closeModal
}: PoolsFormSettingsProps) => {
  const { register, watch, getValues, setValue, handleSubmit } = useForm<
    PoolsFormSettingsFormFields
  >({
    defaultValues: {
      allowedSlippage,
      autoSlippage: true
    }
  })

  // propagate allowed slippage to the parent
  useEffect(() => {
    onAllowedSlippageChange(getValues('allowedSlippage'))
  }, watch(['allowedSlippage']))

  // if you want automatic slippage, override the previous user's input
  useEffect(() => {
    if (getValues('autoSlippage')) {
      // default is 3%
      setValue('allowedSlippage', '3')
    }
  }, watch(['autoSlippage']))

  return (
    <form
      className="trade-settings trade-modal-component-wrapper"
      onSubmit={handleSubmit(() => {})}
    >
      <div className="modal-component-heading">
        <div className="modal-component-heading__main-text">Settings</div>
        <div className="close-modal-btn" onClick={closeModal}>
          <Icon name="Back" />
        </div>
      </div>
      <div className="modal-component-content">
        <div className="settings-section">Liquidity provisioning</div>
        <label className="settings-field">
          <div className="settings-field__label">Auto</div>
          <input {...register('autoSlippage')} type="checkbox" />
        </label>
        <label className="settings-field">
          <div className="settings-field__label">Provisioning limit (%)</div>
          <input
            {...register('allowedSlippage', {
              setValueAs: (value) =>
                value && new BigNumber(value).dividedBy('100').toFixed(3)
            })}
            // disabled if using auto slippage
            disabled={getValues('autoSlippage')}
            type="text"
          />
        </label>
        <div className="disclaimer">
          The deviation of the final acceptable price from the spot price caused
          by the change in price between announcing the transaction and
          processing it.
        </div>
      </div>
    </form>
  )
}

export const useModalPortalElement = ({
  allowedSlippage,
  setAllowedSlippage
}: any) => {
  return useCallback(
    ({ closeModal, elementRef, isModalOpen }) => {
      return (
        <div
          className={classNames({
            hidden: !isModalOpen,
            'trade-settings-wrapper': true
          })}
        >
          <PoolsFormSettings
            closeModal={closeModal}
            allowedSlippage={allowedSlippage}
            onAllowedSlippageChange={(allowedSlippage) => {
              setAllowedSlippage(allowedSlippage)
            }}
          />
        </div>
      )
    },
    [allowedSlippage]
  )
}

export interface PoolsFormProps {
  assets?: { id: string }[]
  assetIds: TradeAssetIds
  onAssetIdsChange: (assetIds: TradeAssetIds) => void
  isActiveAccountConnected?: boolean
  pool?: XykPool | undefined
  assetInLiquidity?: string
  assetOutLiquidity?: string
  spotPrice?: {
    outIn?: string
    inOut?: string
  }
  isPoolLoading: boolean
  onSubmit: (form: PoolsFormFields & { amountBMaxLimit?: string }) => void
  tradeLoading: boolean
  activeAccountTradeBalances?: {
    outBalance?: Balance
    inBalance?: Balance
    shareBalance?: Balance
  }
  activeAccountTradeBalancesLoading: boolean
  activeAccount?: Maybe<Account>
}

export interface PoolsFormFields {
  assetIn: string | null
  assetOut: string | null
  assetInAmount: string | null
  assetOutAmount: string | null
  shareAssetAmount: string | null
  submit: void
  warnings: any
  provisioningType: ProvisioningType
}

/**
 * Trigger a state update each time the given input changes (via the `input` event)
 * @param control
 * @param field
 * @returns
 */
export const useListenForInput = (
  inputRef: MutableRefObject<HTMLInputElement | null>
) => {
  const [state, setState] = useState<boolean>()

  useEffect(() => {
    if (!inputRef) return
    // TODO: figure out why using the 'input' broke the mask
    // 'keydown' also doesnt work bcs its triggered by copy/paste, which then
    // changes the trade type (which this hook is primarily)
    const listener = inputRef.current?.addEventListener('keydown', () =>
      setState((state) => !state)
    )

    return () =>
      listener && inputRef.current?.removeEventListener('keydown', listener)
  }, [inputRef])

  return state
}

export const PoolsForm = ({
  assetIds,
  onAssetIdsChange,
  isActiveAccountConnected,
  pool,
  isPoolLoading,
  assetInLiquidity,
  assetOutLiquidity,
  spotPrice,
  onSubmit,
  tradeLoading,
  assets,
  activeAccountTradeBalances,
  activeAccountTradeBalancesLoading,
  activeAccount
}: PoolsFormProps) => {
  // TODO: include math into loading form state
  const { math, loading: mathLoading } = useMath()
  const [provisioningType, setProvisioningType] = useState<ProvisioningType>(
    ProvisioningType.Add
  )
  const [allowedSlippage, setAllowedSlippage] = useState<string | null>(null)

  const form = useForm<PoolsFormFields>({
    reValidateMode: 'onChange',
    mode: 'all',
    defaultValues: {
      assetIn: assetIds.assetIn,
      assetOut: assetIds.assetOut
    }
  })
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    trigger,
    control,
    formState
  } = form

  const { isValid, isDirty, errors } = formState

  const assetOutAmountInputRef = useRef<HTMLInputElement>(null)
  const assetInAmountInputRef = useRef<HTMLInputElement>(null)
  const shareAmountInputRef = useRef<HTMLInputElement>(null)

  // trigger form field validation right away
  useEffect(() => {
    trigger('submit')
  }, [])

  useEffect(() => {
    // must provide input name otherwise it does not validate appropriately
    trigger('submit')
  }, [
    isActiveAccountConnected,
    pool,
    isPoolLoading,
    activeAccountTradeBalances,
    assetInLiquidity,
    assetOutLiquidity,
    allowedSlippage,
    ...watch(['assetInAmount', 'assetOutAmount'])
  ])

  // when the assetIds change, propagate the change to the parent
  useEffect(() => {
    const { assetIn, assetOut } = getValues()
    onAssetIdsChange({ assetIn, assetOut })
  }, watch(['assetIn', 'assetOut']))

  const assetInAmountInput = useListenForInput(assetInAmountInputRef)
  const assetOutAmountInput = useListenForInput(assetOutAmountInputRef)
  const shareAssetAmountInput = useListenForInput(shareAmountInputRef)

  useEffect(() => setValue('provisioningType', provisioningType), [
    setValue,
    provisioningType
  ])

  const [lastAssetInteractedWith, setLastAssetInteractedWith] = useState<
    string | null
  >()

  const calculateAssetIn = useCallback(() => {
    setTimeout(() => {
      const [assetOutAmount, shareAssetAmount, assetIn, assetOut] = getValues([
        'assetOutAmount',
        'shareAssetAmount',
        'assetIn',
        'assetOut'
      ])
      if (
        !pool ||
        !math ||
        !assetInLiquidity ||
        !assetOutLiquidity ||
        !activeAccountTradeBalances ||
        !assetIn ||
        !assetOut ||
        !shareAssetAmount
      )
        return
      // if (provisioningType !== ProvisioningType.Add) return;

      // if (!assetOutAmount) return setValue('assetInAmount', null);

      // const amount = math.xyk.calculate_in_given_out(
      //   // which combination is correct?
      //   // assetOutLiquidity,
      //   // assetInLiquidity,
      //   assetInLiquidity,
      //   assetOutLiquidity,
      //   assetOutAmount
      // );

      if (provisioningType === ProvisioningType.Add && assetOutAmount) {
        const amount = math.xyk.calculate_liquidity_in(
          assetOutLiquidity,
          assetInLiquidity,
          assetOutAmount
        )

        console.log('calculateAssetIn2', {
          assetOutLiquidity,
          assetInLiquidity,
          assetOutAmount,
          amount
        })

        // do nothing deliberately, because the math library returns '0' as calculated value, as oppossed to calculate_out_given_in
        if (amount === '0' && assetOutAmount !== '0') return
        setValue('assetInAmount', amount || null)
      } else {
        const amountA = math.xyk.calculate_liquidity_out_asset_a(
          assetInLiquidity,
          assetOutLiquidity,
          shareAssetAmount,
          pool.totalLiquidity
        )

        console.log('calculateAssetIn1', {
          assetOutLiquidity,
          assetInLiquidity,
          assetOutAmount,
          amountA
        })

        // do nothing deliberately, because the math library returns '0' as calculated value, as oppossed to calculate_out_given_in
        // if (amountA === '0' && amountB !== '0') return;
        setValue('assetInAmount', amountA || null)
      }
    }, 0)
  }, [
    math,
    getValues,
    setValue,
    pool,
    assetInLiquidity,
    assetOutLiquidity,
    provisioningType,
    activeAccountTradeBalances
  ])

  const calculateAssetOut = useCallback(() => {
    setTimeout(() => {
      const [assetInAmount, shareAssetAmount, assetIn, assetOut] = getValues([
        'assetInAmount',
        'shareAssetAmount',
        'assetIn',
        'assetOut'
      ])

      console.log('calculateAssetOut1', [
        assetInAmount,
        shareAssetAmount,
        assetIn,
        assetOut
      ])

      if (
        !pool ||
        !math ||
        !assetInLiquidity ||
        !assetOutLiquidity ||
        !activeAccountTradeBalances ||
        !assetIn ||
        !assetOut ||
        !shareAssetAmount
      )
        return
      // if (provisioningType !== ProvisioningType.Remove) return;

      // if (!assetInAmount) return setValue('assetOutAmount', null);

      // const amount = math.xyk.calculate_out_given_in(
      //   assetInLiquidity,
      //   assetOutLiquidity,
      //   assetInAmount
      // );
      // if (amount === '0' && assetInAmount !== '0')
      //   return setValue('assetOutAmount', null);
      // setValue('assetOutAmount', amount || null);

      if (provisioningType === ProvisioningType.Add && assetInAmount) {
        const amount = math.xyk.calculate_liquidity_in(
          assetInLiquidity,
          assetOutLiquidity,
          assetInAmount
        )

        // do nothing deliberately, because the math library returns '0' as calculated value, as oppossed to calculate_out_given_in
        if (amount === '0' && assetInAmount !== '0') return
        setValue('assetOutAmount', amount || null)
      } else {
        const amountB = math.xyk.calculate_liquidity_out_asset_b(
          assetInLiquidity,
          assetOutLiquidity,
          shareAssetAmount,
          pool.totalLiquidity
        )

        // do nothing deliberately, because the math library returns '0' as calculated value, as oppossed to calculate_out_given_in
        // if (amountB === '0' && assetInAmount !== '0') return;
        setValue('assetOutAmount', amountB || null)
      }
    }, 0)
  }, [
    math,
    getValues,
    setValue,
    pool,
    assetInLiquidity,
    assetOutLiquidity,
    provisioningType,
    activeAccountTradeBalances
  ])

  useEffect(() => {
    if (lastAssetInteractedWith === assetIds.assetIn) return
    calculateAssetIn()
  }, [calculateAssetIn, lastAssetInteractedWith, assetOutAmountInput, assetIds])

  useEffect(() => {
    if (lastAssetInteractedWith === assetIds.assetOut) return
    calculateAssetOut()
  }, [calculateAssetOut, lastAssetInteractedWith, assetInAmountInput, assetIds])

  useEffect(() => {
    if (provisioningType === ProvisioningType.Remove) return
    const [assetInAmount, assetOutAmount, assetIn, assetOut] = getValues([
      'assetInAmount',
      'assetOutAmount',
      'assetIn',
      'assetOut'
    ])
    if (!assetIn || !assetOut || !assetInLiquidity || !assetInAmount || !pool)
      return

    const shareAmount = math?.xyk.calculate_shares(
      assetInLiquidity,
      assetInAmount,
      pool?.totalLiquidity
    )
    shareAmount && setValue('shareAssetAmount', shareAmount)
    // assetIn > assetOut
    //   ? setValue('shareAssetAmount', assetOutAmount)
    //   : setValue('shareAssetAmount', assetInAmount);
  }, [
    ...watch(['assetInAmount', 'assetOutAmount', 'assetIn', 'assetOut']),
    math,
    assetInLiquidity,
    provisioningType,
    getValues,
    pool
  ])

  useEffect(() => {
    setTimeout(() => {
      if (provisioningType === ProvisioningType.Add) return
      const [
        assetInAmount,
        assetOutAmount,
        assetIn,
        assetOut,
        shareAssetAmount
      ] = getValues([
        'assetInAmount',
        'assetOutAmount',
        'assetIn',
        'assetOut',
        'shareAssetAmount'
      ])
      if (!assetIn || !assetOut) return
      console.log('calc', assetIn, assetOut)
      calculateAssetIn()
      calculateAssetOut()
    }, 0)
  }, [
    shareAssetAmountInput,
    calculateAssetIn,
    calculateAssetOut,
    provisioningType
  ])

  const getSubmitText = useCallback(() => {
    if (isPoolLoading) return 'loading'

    // TODO: change to 'input amounts'?
    // if (!isDirty) return 'Swap';

    switch (errors.submit?.type) {
      case 'activeAccount':
        return 'Select account'
      case 'poolDoesNotExist':
        return 'Select tokens'
    }

    if (errors.assetInAmount || errors.assetOutAmount) return 'invalid amount'

    return provisioningType === ProvisioningType.Add
      ? 'Add Liquidity'
      : 'Remove Liquidity'
  }, [isPoolLoading, errors, isDirty, provisioningType])

  const modalContainerRef = useRef<HTMLDivElement | null>(null)

  const modalPortalElement = useModalPortalElement({
    allowedSlippage,
    setAllowedSlippage
  })
  const { toggleModal, modalPortal, toggleId } = useModalPortal(
    modalPortalElement,
    modalContainerRef,
    false
  )

  const tradeLimit = useMemo(() => {
    // convert from precision, otherwise the math doesnt work
    const assetInAmount = fromPrecision12(getValues('assetInAmount') || '0')
    const assetOutAmount = fromPrecision12(getValues('assetOutAmount') || '0')
    const assetIn = getValues('assetIn')
    const assetOut = getValues('assetOut')

    if (
      !assetInAmount ||
      !assetOutAmount ||
      !spotPrice?.inOut ||
      !spotPrice?.outIn ||
      !assetIn ||
      !assetOut ||
      !allowedSlippage
    )
      return

    console.log('limit', {
      assetInAmount,
      spotPrice,
      allowedSlippage
    })

    switch (lastAssetInteractedWith) {
      case assetIds.assetIn:
        return {
          balance: new BigNumber(assetInAmount)
            .multipliedBy(spotPrice?.inOut)
            .multipliedBy(new BigNumber('1').plus(allowedSlippage))
            .toFixed(0),
          assetId: assetOut
        }
      case assetIds.assetOut:
        return {
          balance: new BigNumber(assetOutAmount)
            .multipliedBy(spotPrice?.outIn)
            .multipliedBy(new BigNumber('1').plus(allowedSlippage))
            .toFixed(0),
          assetId: assetIn
        }
    }
  }, [
    spotPrice,
    provisioningType,
    allowedSlippage,
    getValues,
    assetIds,
    lastAssetInteractedWith,
    ...watch(['assetInAmount', 'assetOutAmount'])
  ])

  const slippage = useMemo(() => {
    const assetInAmount = getValues('assetInAmount')
    const assetOutAmount = getValues('assetOutAmount')

    if (!assetInAmount || !assetOutAmount || !spotPrice || !allowedSlippage)
      return

    switch (provisioningType) {
      case ProvisioningType.Remove:
        return percentageChange(
          new BigNumber(assetInAmount).multipliedBy(
            fromPrecision12(spotPrice.inOut || '0')
          ),
          assetOutAmount
        )?.abs()
      case ProvisioningType.Add:
        return percentageChange(
          new BigNumber(assetOutAmount).multipliedBy(
            fromPrecision12(spotPrice.outIn || '0')
          ),
          assetInAmount
        )?.abs()
    }
  }, [
    provisioningType,
    getValues,
    spotPrice,
    ...watch(['assetInAmount', 'assetOutAmount'])
  ])

  useEffect(() => {
    setLastAssetInteractedWith(assetIds.assetIn)
  }, [assetInAmountInput, assetIds.assetIn])

  useEffect(() => {
    setLastAssetInteractedWith(assetIds.assetOut)
  }, [assetOutAmountInput, assetIds.assetOut])

  // handle submit of the form
  const _handleSubmit = useCallback(
    (data: PoolsFormFields) => {
      if (!lastAssetInteractedWith) return
      onSubmit({
        ...data,
        assetIn: lastAssetInteractedWith,
        assetOut:
          lastAssetInteractedWith === data.assetOut
            ? data.assetIn
            : data.assetOut,
        assetInAmount:
          lastAssetInteractedWith === data.assetOut
            ? data.assetOutAmount
            : data.assetInAmount,
        assetOutAmount:
          lastAssetInteractedWith === data.assetOut
            ? data.assetInAmount
            : data.assetOutAmount,
        amountBMaxLimit: tradeLimit?.balance
      })
    },
    [
      provisioningType,
      tradeLimit,
      lastAssetInteractedWith,
      assetIds,
      tradeLimit
    ]
  )

  const handleSwitchAssets = useCallback(
    (event: any) => {
      onAssetIdsChange({
        assetIn: assetIds.assetOut,
        assetOut: assetIds.assetIn
      })

      // prevent form submit
      event.preventDefault()
      if (lastAssetInteractedWith === assetIds.assetOut) {
        setLastAssetInteractedWith(assetIds.assetIn)
        const assetOutAmount = getValues('assetOutAmount')
        setValue('assetInAmount', assetOutAmount)
      } else {
        setLastAssetInteractedWith(assetIds.assetOut)
        const assetInAmount = getValues('assetInAmount')
        setValue('assetOutAmount', assetInAmount)
      }

      setTimeout(() => {}, 0)
    },
    [assetIds, setValue, getValues, lastAssetInteractedWith]
  )

  const { apiInstance, loading: apiInstanceLoading } = usePolkadotJsContext()
  const { cache } = useApolloClient()
  const [paymentInfo, setPaymentInfo] = useState<string>()
  const { convertToFeePaymentAsset } = useMultiFeePaymentConversionContext()
  const calculatePaymentInfo = useCallback(async () => {
    if (!apiInstance) return
    let [assetIn, assetOut, assetInAmount, assetOutAmount] = getValues([
      'assetIn',
      'assetOut',
      'assetInAmount',
      'assetOutAmount'
    ])

    if (
      !assetIn ||
      !assetOut ||
      !assetInAmount ||
      !assetOutAmount ||
      !tradeLimit
    )
      return

    switch (provisioningType) {
      case ProvisioningType.Add: {
        const estimate = await estimateBuy(
          cache,
          apiInstance,
          assetOut,
          assetIn,
          assetOutAmount,
          tradeLimit.balance
        )
        const partialFee = estimate?.partialFee.toString()
        return convertToFeePaymentAsset(partialFee)
      }
      case ProvisioningType.Remove: {
        const estimate = await estimateSell(
          cache,
          apiInstance,
          assetIn,
          assetOut,
          assetInAmount,
          tradeLimit.balance
        )
        const partialFee = estimate?.partialFee.toString()
        return convertToFeePaymentAsset(partialFee)
      }
      default:
        return
    }
  }, [
    apiInstance,
    cache,
    ...watch(['assetInAmount', 'assetOutAmount', 'assetIn']),
    tradeLimit,
    provisioningType,
    convertToFeePaymentAsset
  ])

  useEffect(() => {
    ;(async () => {
      const paymentInfo = await calculatePaymentInfo()
      if (!paymentInfo) return
      setPaymentInfo(paymentInfo)
    })()
  }, [
    apiInstance,
    cache,
    ...watch(['assetInAmount', 'assetOutAmount']),
    tradeLimit,
    provisioningType,
    calculatePaymentInfo
  ])

  useEffect(() => {
    setValue('assetIn', assetIds.assetIn)
    setValue('assetOut', assetIds.assetOut)
  }, [assetIds])

  const tradeBalances = useMemo(() => {
    const assetOutAmount = getValues('assetOutAmount')
    const outBeforeTrade = activeAccountTradeBalances?.outBalance?.balance
    const outAfterTrade =
      (outBeforeTrade &&
        assetOutAmount &&
        new BigNumber(outBeforeTrade).plus(assetOutAmount).toFixed(0)) ||
      undefined
    const outTradeChange =
      outBeforeTrade !== '0'
        ? percentageChange(
            fromPrecision12(outBeforeTrade || '0'),
            fromPrecision12(outAfterTrade || '0')
          )?.multipliedBy(100)
        : new BigNumber(
            outAfterTrade && outAfterTrade !== '0' ? '100.000' : '0'
          )

    const assetInAmount = getValues('assetInAmount')
    const inBeforeTrade = activeAccountTradeBalances?.inBalance?.balance
    let inAfterTrade =
      (inBeforeTrade &&
        assetInAmount &&
        new BigNumber(inBeforeTrade).minus(assetInAmount).toFixed(0)) ||
      undefined

    inAfterTrade =
      getValues('assetIn') !== '0'
        ? inAfterTrade
        : paymentInfo &&
          inAfterTrade &&
          new BigNumber(inAfterTrade).minus(paymentInfo).toFixed(0)

    const inTradeChange =
      inBeforeTrade !== '0'
        ? percentageChange(
            fromPrecision12(inBeforeTrade || '0'),
            fromPrecision12(inAfterTrade || '0')
          )?.multipliedBy(100)
        : new BigNumber(inAfterTrade && inAfterTrade !== '0' ? '-100.000' : '0')

    return {
      outBeforeTrade,
      outAfterTrade,
      outTradeChange,

      inBeforeTrade,
      inAfterTrade,
      inTradeChange
    }
  }, [
    activeAccountTradeBalances,
    ...watch(['assetOutAmount', 'assetInAmount', 'assetIn']),
    paymentInfo
  ])

  const { debugComponent } = useDebugBoxContext()

  useEffect(() => {
    debugComponent('PoolsForm', {
      ...getValues(),
      spotPrice,
      tradeLimit,
      assetInLiquidity,
      assetOutLiquidity,
      tradeBalances: {
        ...tradeBalances,
        inTradeChange: tradeBalances.inTradeChange?.toString(),
        outTradeChange: tradeBalances.outTradeChange?.toString()
      },
      provisioningType,
      slippage: slippage?.toString(),
      errors: Object.keys(errors).reduce((reducedErrors, error) => {
        return {
          ...reducedErrors,
          [error]: (errors as any)[error].type
        }
      }, {})
    })
  }, [
    Object.values(getValues()).toString(),
    spotPrice,
    tradeBalances,
    tradeBalances,
    provisioningType,
    errors,
    assetInLiquidity,
    assetOutLiquidity,
    slippage,
    formState.isDirty
  ])

  const minTradeLimitIn = useCallback(
    (assetInAmount?: Maybe<string>) => {
      if (!assetInAmount || assetInAmount === '0') return false
      return new BigNumber(assetInLiquidity || '0')
        .dividedBy(3)
        .gte(assetInAmount)
    },
    [assetInLiquidity]
  )

  const [maxAmountInLoading, setMaxAmountInLoading] = useState(false)

  const calculateMaxAmountIn = useCallback(async () => {
    const [assetIn, assetOut] = getValues(['assetIn', 'assetOut'])
    console.log(
      'calculateMaxAmountIn1',
      tradeBalances.inBeforeTrade,
      cache,
      apiInstance,
      assetIn,
      assetOut
    )
    if (
      !tradeBalances.inBeforeTrade ||
      !cache ||
      !apiInstance ||
      !assetIn ||
      !assetOut
    )
      return
    console.log('calculateMaxAmountIn11')
    const maxAmount = tradeBalances.inBeforeTrade
    const estimate = await estimateSell(
      cache,
      apiInstance,
      assetIn,
      assetOut,
      maxAmount,
      '0'
    )
    console.log('calculateMaxAmountIn11 estimate done', estimate)
    const paymentInfo = estimate?.partialFee.toString()
    const maxAmountWithoutFee = new BigNumber(maxAmount).minus(
      paymentInfo || '0'
    )
    console.log('calculateMaxAmountIn12', {
      inBeforeTrade: tradeBalances.inBeforeTrade,
      estimate,
      paymentInfo,
      maxAmount,
      maxAmountWithoutFee: maxAmountWithoutFee.toFixed(10)
    })

    return getValues('assetIn') === '0'
      ? // max amount changed when all fields are filled out since that allows
        // us to calculate paymentInfo
        maxAmountWithoutFee.gt('0')
        ? maxAmountWithoutFee.toFixed(10)
        : undefined
      : maxAmount
  }, [
    tradeBalances.inBeforeTrade,
    paymentInfo,
    cache,
    apiInstance,
    ...watch(['assetIn'])
  ])

  const maxButtonDisabled = useMemo(() => {
    return (
      maxAmountInLoading || activeAccountTradeBalancesLoading || isPoolLoading
    )
  }, [maxAmountInLoading, activeAccountTradeBalancesLoading, isPoolLoading])

  const handleMaxButtonOnClick = useCallback(async () => {
    setMaxAmountInLoading(true)
    const maxAmountIn = await calculateMaxAmountIn()
    console.log('setting max amount in', maxAmountIn)
    if (maxAmountIn)
      setValue('assetInAmount', maxAmountIn, {
        shouldDirty: true,
        shouldValidate: true
      })
    setMaxAmountInLoading(false)
  }, [calculateMaxAmountIn])

  const xykDisabled = useMemo(() => {
    return (
      apiInstance &&
      !apiInstanceLoading &&
      parseInt(apiInstance?.runtimeVersion.specVersion.toString() || '0') < 69
    )
  }, [apiInstance, apiInstanceLoading])

  return (
    <div className="pools-form-wrapper">
      <div ref={modalContainerRef}></div>
      {modalPortal}

      <FormProvider {...form}>
        <form className="pools-form" onSubmit={handleSubmit(_handleSubmit)}>
          <div className="settings-button-wrapper">
            <div className="pool-page-tabs">
              <button
                className="tab"
                disabled={provisioningType === ProvisioningType.Add}
                onClick={() => {
                  setProvisioningType(ProvisioningType.Add)
                }}
              >
                <div className="label">Add</div>
              </button>
              <button
                className="tab"
                disabled={provisioningType === ProvisioningType.Remove}
                onClick={() => {
                  setProvisioningType(ProvisioningType.Remove)
                }}
              >
                <div className="label">Remove</div>
              </button>
            </div>
            <div
              className="pool-settings-button"
              onClick={(e) => {
                e.preventDefault()
                toggleModal()
              }}
            >
              <Icon name="Settings" />
            </div>
          </div>

          <div className="pools-form-heading">
            {provisioningType === ProvisioningType.Add ? 'Add' : 'Remove'}{' '}
            Liquidity
          </div>
          <div className="balance-wrapper">
            <AssetBalanceInput
              balanceInputName="assetInAmount"
              assetInputName="assetIn"
              modalContainerRef={modalContainerRef}
              balanceInputRef={assetInAmountInputRef}
              assets={assets?.filter(
                (asset) => !Object.values(assetIds).includes(asset.id)
              )}
              disabled={provisioningType === ProvisioningType.Remove}
              maxBalanceLoading={maxAmountInLoading}
            />
            <div className="balance-info balance-out-info">
              <div className="balance-info-type">First token</div>
              <div className="balance-info-balance">
                {activeAccountTradeBalancesLoading || isPoolLoading ? (
                  'Your balance: loading'
                ) : (
                  <>
                    Your balance:
                    {assetIds.assetIn ? (
                      tradeBalances.inBeforeTrade !== undefined ? (
                        <FormattedBalance
                          balance={{
                            balance: tradeBalances.inBeforeTrade,
                            assetId: assetIds.assetIn
                          }}
                        />
                      ) : (
                        <> {horizontalBar}</>
                      )
                    ) : (
                      <> {horizontalBar}</>
                    )}
                  </>
                )}
                {/* <div
                className={classNames('max-button', {
                  disabled: maxButtonDisabled,
                })}
                onClick={() => handleMaxButtonOnClick()}
              >
                Max
              </div> */}
              </div>
            </div>
          </div>

          <div className="asset-switch">
            <hr className="divider asset-switch-divider"></hr>
            {/* <div className="asset-switch-icon" onClick={handleSwitchAssets}>
              <Icon name="AssetSwitch" />
            </div> */}
            <div className="asset-switch-price">
              <div className="asset-switch-price__wrapper">
                {(() => {
                  const assetOut = getValues('assetOut')
                  const assetIn = getValues('assetIn')
                  switch (provisioningType) {
                    case ProvisioningType.Remove:
                      // return `1 ${
                      //   idToAsset(getValues('assetIn'))?.symbol ||
                      //   getValues('assetIn')
                      // } = ${fromPrecision12(spotPrice?.inOut)} ${
                      //   idToAsset(getValues('assetOut'))?.symbol ||
                      //   getValues('assetOut')
                      // }`;
                      return spotPrice?.inOut && assetOut ? (
                        <>
                          <FormattedBalance
                            balance={{
                              balance: toPrecision12('1')!,
                              assetId: getValues('assetIn')!
                            }}
                          />
                          =
                          <FormattedBalance
                            balance={{
                              balance: spotPrice.inOut,
                              assetId: assetOut
                            }}
                          />
                        </>
                      ) : (
                        <>-</>
                      )
                    case ProvisioningType.Add:
                      // return `1 ${
                      //   idToAsset(getValues('assetOut'))?.symbol ||
                      //   getValues('assetOut')
                      // } = ${fromPrecision12(spotPrice?.outIn)} ${
                      //   idToAsset(getValues('assetIn'))?.symbol ||
                      //   getValues('assetIn')
                      // }`;
                      return spotPrice?.outIn && assetIn ? (
                        <>
                          <FormattedBalance
                            balance={{
                              balance: toPrecision12('1')!,
                              assetId: getValues('assetOut')!
                            }}
                          />
                          =
                          <FormattedBalance
                            balance={{
                              balance: spotPrice.outIn,
                              assetId: assetIn
                            }}
                          />
                        </>
                      ) : (
                        <>-</>
                      )
                  }
                })()}
              </div>
            </div>
          </div>

          <div className="balance-wrapper">
            {' '}
            <AssetBalanceInput
              balanceInputName="assetOutAmount"
              assetInputName="assetOut"
              modalContainerRef={modalContainerRef}
              balanceInputRef={assetOutAmountInputRef}
              assets={assets?.filter(
                (asset) => !Object.values(assetIds).includes(asset.id)
              )}
              disabled={provisioningType === ProvisioningType.Remove}
            />{' '}
            <div className="balance-info balance-out-info">
              <div className="balance-info-type">Second token</div>
              <div className="balance-info-balance">
                {activeAccountTradeBalancesLoading || isPoolLoading ? (
                  'Your balance: loading'
                ) : (
                  // : `${fromPrecision12(tradeBalances.outBeforeTrade)} -> ${fromPrecision12(tradeBalances.outAfterTrade)}`
                  <>
                    Your balance:
                    {assetIds.assetOut ? (
                      tradeBalances.outBeforeTrade !== undefined ? (
                        <FormattedBalance
                          balance={{
                            balance: tradeBalances.outBeforeTrade,
                            assetId: assetIds.assetOut
                          }}
                        />
                      ) : (
                        <> {horizontalBar}</>
                      )
                    ) : (
                      <> {horizontalBar}</>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="balance-wrapper-share-tokens">
            {' '}
            <AssetBalanceInput
              balanceInputName="shareAssetAmount"
              assetInputName="shareAsset"
              isAssetSelectable={false}
              modalContainerRef={modalContainerRef}
              balanceInputRef={shareAmountInputRef}
              // disabled={provisioningType === ProvisioningType.Add}
              assets={assets?.filter(
                (asset) => !Object.values(assetIds).includes(asset.id)
              )}
              disabled={provisioningType === ProvisioningType.Add}
            />{' '}
            <div className="balance-info balance-out-info">
              <div className="balance-info-type">Share token</div>
              <div className="balance-info-balance">
                {activeAccountTradeBalancesLoading || isPoolLoading ? (
                  'Your balance: loading'
                ) : (
                  // : `${fromPrecision12(tradeBalances.outBeforeTrade)} -> ${fromPrecision12(tradeBalances.outAfterTrade)}`
                  <>
                    Your balance:
                    {activeAccountTradeBalances?.shareBalance ? (
                      <FormattedBalance
                        balance={{
                          balance:
                            activeAccountTradeBalances.shareBalance.balance,
                          assetId:
                            activeAccountTradeBalances.shareBalance.assetId
                        }}
                      />
                    ) : (
                      <> {horizontalBar}</>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <PoolsInfo
            tradeLimit={tradeLimit}
            provisioningType={provisioningType}
            errors={errors}
            isDirty={isDirty}
            paymentInfo={paymentInfo}
          />
          <input
            type="submit"
            className="submit-button"
            {...register('submit', {
              validate: {
                activeAccount: () => isActiveAccountConnected,
                poolDoesNotExist: () => !isPoolLoading && !!pool,
                minBalanceInA: () => {
                  const assetInAmount = getValues('assetInAmount')
                  if (!assetInAmount || assetInAmount === '0') return false
                  return true
                },
                minBalanceInB: () => {
                  const assetOutAmount = getValues('assetOutAmount')
                  if (!assetOutAmount || assetOutAmount === '0') return false
                  return true
                },
                minBalanceInShare: () => {
                  const shareAssetAmount = getValues('shareAssetAmount')
                  if (!shareAssetAmount || shareAssetAmount === '0')
                    return false
                  return true
                },
                notEnoughBalanceInA: () => {
                  if (provisioningType === ProvisioningType.Remove) return true
                  const assetInAmount = getValues('assetInAmount')
                  if (
                    !activeAccountTradeBalances?.inBalance?.balance ||
                    !assetInAmount
                  )
                    return false
                  return new BigNumber(
                    activeAccountTradeBalances.inBalance.balance
                  ).gte(assetInAmount)
                },
                notEnoughBalanceInB: () => {
                  if (provisioningType === ProvisioningType.Remove) return true
                  const assetOutAmount = getValues('assetOutAmount')
                  if (
                    !activeAccountTradeBalances?.outBalance?.balance ||
                    !assetOutAmount
                  )
                    return false
                  return new BigNumber(
                    activeAccountTradeBalances.outBalance.balance
                  ).gte(assetOutAmount)
                },
                notEnoughBalanceInShare: () => {
                  if (provisioningType === ProvisioningType.Add) return true
                  const shareAssetAmount = getValues('shareAssetAmount')
                  if (
                    !activeAccountTradeBalances?.shareBalance?.balance ||
                    !shareAssetAmount
                  )
                    return false
                  return new BigNumber(
                    activeAccountTradeBalances.shareBalance.balance
                  ).gte(shareAssetAmount)
                }
                // notEnoughFeeBalance: () => {
                //   const assetIn = getValues('assetIn');
                //   const assetInAmount = getValues('assetInAmount');

                //   let nativeAssetBalance = find(activeAccount?.balances, {
                //     assetId: '0',
                //   })?.balance;

                //   let balanceForFee = nativeAssetBalance;

                //   if (assetIn === '0' && assetInAmount && nativeAssetBalance) {
                //     balanceForFee = new BigNumber(nativeAssetBalance)
                //       .minus(assetInAmount)
                //       .toString();
                //   }

                //   if (!paymentInfo) return true;
                //   if (!balanceForFee) return false;

                //   return new BigNumber(balanceForFee).gte(paymentInfo);
                // },
              }
            })}
            disabled={xykDisabled || !isValid || tradeLoading || !isDirty}
            value={getSubmitText()}
          />
        </form>
      </FormProvider>
    </div>
  )
}
