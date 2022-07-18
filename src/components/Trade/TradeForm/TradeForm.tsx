import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { every, find, times } from 'lodash';
import {
  MutableRefObject,
  useCallback,
  useDebugValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Control, FormProvider, useForm } from 'react-hook-form';
import {
  Account,
  Balance,
  Maybe,
  Pool,
  TradeType,
} from '../../../generated/graphql';
import { fromPrecision12 } from '../../../hooks/math/useFromPrecision';
import { useMath } from '../../../hooks/math/useMath';
import { percentageChange } from '../../../hooks/math/usePercentageChange';
import { toPrecision12 } from '../../../hooks/math/useToPrecision';
import { SubmitTradeMutationVariables } from '../../../hooks/pools/mutations/useSubmitTradeMutation';
import { idToAsset, TradeAssetIds } from '../../../pages/TradePage/TradePage';
import { AssetBalanceInput } from '../../Balance/AssetBalanceInput/AssetBalanceInput';
import { PoolType } from '../../Chart/shared';
import { TradeInfo } from './TradeInfo/TradeInfo';
import './TradeForm.scss';
import Icon from '../../Icon/Icon';
import { useModalPortal } from '../../Balance/AssetBalanceInput/hooks/useModalPortal';
import { FormattedBalance } from '../../Balance/FormattedBalance/FormattedBalance';
import { useDebugBoxContext } from '../../../pages/TradePage/hooks/useDebugBox';
import { horizontalBar } from '../../Chart/ChartHeader/ChartHeader';
import { usePolkadotJsContext } from '../../../hooks/polkadotJs/usePolkadotJs';
import { useApolloClient } from '@apollo/client';
import { estimateBuy } from '../../../hooks/pools/xyk/buy';
import { estimateSell } from '../../../hooks/pools/xyk/sell';
import { payment } from '@polkadot/types/interfaces/definitions';
import { useMultiFeePaymentConversionContext } from '../../../containers/MultiProvider';

export interface TradeFormSettingsProps {
  allowedSlippage: string | null;
  onAllowedSlippageChange: (allowedSlippage: string | null) => void;
  closeModal: any;
}

export interface TradeFormSettingsFormFields {
  allowedSlippage: string | null;
  autoSlippage: boolean;
}

export const TradeFormSettings = ({
  allowedSlippage,
  onAllowedSlippageChange,
  closeModal,
}: TradeFormSettingsProps) => {
  const { register, watch, getValues, setValue, handleSubmit } = useForm<
    TradeFormSettingsFormFields
  >({
    defaultValues: {
      allowedSlippage,
      autoSlippage: true,
    },
  });

  // propagate allowed slippage to the parent
  useEffect(() => {
    onAllowedSlippageChange(getValues('allowedSlippage'));
  }, watch(['allowedSlippage']));

  // if you want automatic slippage, override the previous user's input
  useEffect(() => {
    if (getValues('autoSlippage')) {
      // default is 3%
      setValue('allowedSlippage', '3');
    }
  }, watch(['autoSlippage']));

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
        <div className="settings-section">Slippage</div>
        <label className="settings-field">
          <div className="settings-field__label">Auto slippage</div>
          <input {...register('autoSlippage')} type="checkbox" />
        </label>
        <label className="settings-field">
          <div className="settings-field__label">Allowed slippage percent</div>
          <input
            {...register('allowedSlippage', {
              setValueAs: (value) =>
                value && new BigNumber(value).dividedBy('100').toFixed(3),
            })}
            // disabled if using auto slippage
            disabled={getValues('autoSlippage')}
            type="text"
          />
        </label>
      </div>
    </form>
  );
};

export const useModalPortalElement = ({
  allowedSlippage,
  setAllowedSlippage,
}: any) => {
  return useCallback(
    ({ closeModal, elementRef, isModalOpen }) => {
      return (
        <div
          className={classNames({
            hidden: !isModalOpen,
            'trade-settings-wrapper': true,
          })}
        >
          <TradeFormSettings
            closeModal={closeModal}
            allowedSlippage={allowedSlippage}
            onAllowedSlippageChange={(allowedSlippage) => {
              setAllowedSlippage(allowedSlippage);
            }}
          />
        </div>
      );
    },
    [allowedSlippage]
  );
};

export interface TradeFormProps {
  assets?: { id: string }[];
  assetIds: TradeAssetIds;
  onAssetIdsChange: (assetIds: TradeAssetIds) => void;
  isActiveAccountConnected?: boolean;
  pool?: Pool;
  assetInLiquidity?: string;
  assetOutLiquidity?: string;
  spotPrice?: {
    outIn?: string;
    inOut?: string;
  };
  isPoolLoading: boolean;
  onSubmitTrade: (trade: SubmitTradeMutationVariables) => void;
  tradeLoading: boolean;
  activeAccountTradeBalances?: {
    outBalance?: Balance;
    inBalance?: Balance;
  };
  activeAccountTradeBalancesLoading: boolean;
  activeAccount?: Maybe<Account>;
}

export interface TradeFormFields {
  assetIn: string | null;
  assetOut: string | null;
  assetInAmount: string | null;
  assetOutAmount: string | null;
  submit: void;
  warnings: any;
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
  const [state, setState] = useState<boolean>();

  useEffect(() => {
    if (!inputRef) return;
    // TODO: figure out why using the 'input' broke the mask
    // 'keydown' also doesnt work bcs its triggered by copy/paste, which then
    // changes the trade type (which this hook is primarily)
    const listener = inputRef.current?.addEventListener('keypress', () =>
      setState((state) => !state)
    );

    return () =>
      listener && inputRef.current?.removeEventListener('keydown', listener);
  }, [inputRef]);

  return state;
};

export const TradeForm = ({
  assetIds,
  onAssetIdsChange,
  isActiveAccountConnected,
  pool,
  isPoolLoading,
  assetInLiquidity,
  assetOutLiquidity,
  spotPrice,
  onSubmitTrade,
  tradeLoading,
  assets,
  activeAccountTradeBalances,
  activeAccountTradeBalancesLoading,
  activeAccount,
}: TradeFormProps) => {
  // TODO: include math into loading form state
  const { math, loading: mathLoading } = useMath();
  const [tradeType, setTradeType] = useState<TradeType>(TradeType.Sell);
  const [allowedSlippage, setAllowedSlippage] = useState<string | null>(null);

  const form = useForm<TradeFormFields>({
    reValidateMode: 'onChange',
    mode: 'all',
    defaultValues: {
      assetIn: assetIds.assetIn,
      assetOut: assetIds.assetOut,
    },
  });
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    trigger,
    control,
    formState,
  } = form;

  const { isValid, isDirty, errors } = formState;

  const assetOutAmountInputRef = useRef<HTMLInputElement>(null);
  const assetInAmountInputRef = useRef<HTMLInputElement>(null);

  // trigger form field validation right away
  useEffect(() => {
    trigger('submit');
  }, []);

  useEffect(() => {
    // must provide input name otherwise it does not validate appropriately
    trigger('submit');
  }, [
    isActiveAccountConnected,
    pool,
    isPoolLoading,
    activeAccountTradeBalances,
    assetInLiquidity,
    assetOutLiquidity,
    allowedSlippage,
    ...watch(['assetInAmount', 'assetOutAmount']),
  ]);

  // when the assetIds change, propagate the change to the parent
  useEffect(() => {
    const { assetIn, assetOut } = getValues();
    onAssetIdsChange({ assetIn, assetOut });
  }, watch(['assetIn', 'assetOut']));

  const assetInAmountInput = useListenForInput(assetInAmountInputRef);
  useEffect(() => {
    if (tradeType === TradeType.Sell || assetInAmountInput === undefined)
      return;
    setTradeType(TradeType.Sell);
  }, [assetInAmountInput]);

  const assetOutAmountInput = useListenForInput(assetOutAmountInputRef);
  useEffect(() => {
    if (tradeType === TradeType.Buy || assetOutAmountInput === undefined)
      return;

    setTradeType(TradeType.Buy);
  }, [assetOutAmountInput]);

  useEffect(() => {
    const assetOutAmount = getValues('assetOutAmount');
    if (!pool || !math || !assetInLiquidity || !assetOutLiquidity) return;
    if (tradeType !== TradeType.Buy) return;

    if (!assetOutAmount) return setValue('assetInAmount', null);

    const amount = math.xyk.calculate_in_given_out(
      // which combination is correct?
      // assetOutLiquidity,
      // assetInLiquidity,
      assetInLiquidity,
      assetOutLiquidity,
      assetOutAmount
    );
    // do nothing deliberately, because the math library returns '0' as calculated value, as oppossed to calculate_out_given_in
    if (amount === '0' && assetOutAmount !== '0') return;
    setValue('assetInAmount', amount || null);
  }, [tradeType, assetOutLiquidity, assetInLiquidity, watch('assetOutAmount')]);

  useEffect(() => {
    const assetInAmount = getValues('assetInAmount');
    if (!pool || !math || !assetInLiquidity || !assetOutLiquidity) return;
    if (tradeType !== TradeType.Sell) return;

    if (!assetInAmount) return setValue('assetOutAmount', null);

    const amount = math.xyk.calculate_out_given_in(
      assetInLiquidity,
      assetOutLiquidity,
      assetInAmount
    );
    if (amount === '0' && assetInAmount !== '0')
      return setValue('assetOutAmount', null);
    setValue('assetOutAmount', amount || null);
  }, [tradeType, assetOutLiquidity, assetInLiquidity, watch('assetInAmount')]);

  const getSubmitText = useCallback(() => {
    if (isPoolLoading) return 'loading';

    // TODO: change to 'input amounts'?
    // if (!isDirty) return 'Swap';

    switch (errors.submit?.type) {
      case 'activeAccount':
        return 'Select account';
      case 'poolDoesNotExist':
        return 'Select tokens';
    }

    if (errors.assetInAmount || errors.assetOutAmount) return 'invalid amount';

    if (Object.keys(errors).length) return 'Swap';

    return 'Swap';
  }, [isPoolLoading, errors, isDirty]);

  const modalContainerRef = useRef<HTMLDivElement | null>(null);

  const modalPortalElement = useModalPortalElement({
    allowedSlippage,
    setAllowedSlippage,
  });
  const { toggleModal, modalPortal, toggleId } = useModalPortal(
    modalPortalElement,
    modalContainerRef,
    false
  );

  const tradeLimit = useMemo(() => {
    // convert from precision, otherwise the math doesnt work
    const assetInAmount = fromPrecision12(
      getValues('assetInAmount') || undefined
    );
    const assetOutAmount = fromPrecision12(
      getValues('assetOutAmount') || undefined
    );
    const assetIn = getValues('assetIn');
    const assetOut = getValues('assetOut');

    if (
      !assetInAmount ||
      !assetOutAmount ||
      !spotPrice?.inOut ||
      !spotPrice?.outIn ||
      !assetIn ||
      !assetOut ||
      !allowedSlippage
    )
      return;

    switch (tradeType) {
      case TradeType.Sell:
        return {
          balance: new BigNumber(assetInAmount)
            .multipliedBy(spotPrice?.inOut)
            .multipliedBy(new BigNumber('1').minus(allowedSlippage))
            .toFixed(0),
          assetId: assetOut,
        };
      case TradeType.Buy:
        return {
          balance: new BigNumber(assetOutAmount)
            .multipliedBy(spotPrice?.outIn)
            .multipliedBy(new BigNumber('1').plus(allowedSlippage))
            .toFixed(0),
          assetId: assetIn,
        };
    }
  }, [
    spotPrice,
    tradeType,
    allowedSlippage,
    getValues,
    ...watch(['assetInAmount', 'assetOutAmount']),
  ]);

  const slippage = useMemo(() => {
    const assetInAmount = getValues('assetInAmount');
    const assetOutAmount = getValues('assetOutAmount');

    if (!assetInAmount || !assetOutAmount || !spotPrice || !allowedSlippage)
      return;

    switch (tradeType) {
      case TradeType.Sell:
        return percentageChange(
          new BigNumber(assetInAmount).multipliedBy(
            fromPrecision12(spotPrice.inOut) || '1'
          ),
          assetOutAmount
        )?.abs();
      case TradeType.Buy:
        return percentageChange(
          new BigNumber(assetOutAmount).multipliedBy(
            fromPrecision12(spotPrice.outIn) || '1'
          ),
          assetInAmount
        )?.abs();
    }
  }, [
    tradeType,
    getValues,
    spotPrice,
    ...watch(['assetInAmount', 'assetOutAmount']),
  ]);

  // handle submit of the form
  const _handleSubmit = useCallback(
    (data: TradeFormFields) => {
      if (
        !data.assetIn ||
        !data.assetOut ||
        !data.assetInAmount ||
        !data.assetOutAmount ||
        !tradeLimit
      ) {
        throw new Error('Unable to submit trade due to missing data');
      }

      onSubmitTrade({
        assetInId: data.assetIn,
        assetOutId: data.assetOut,
        assetInAmount: data.assetInAmount,
        assetOutAmount: data.assetOutAmount,
        poolType: PoolType.XYK,
        tradeType: tradeType,
        amountWithSlippage: tradeLimit.balance,
      });
    },
    [tradeType, tradeLimit]
  );

  const handleSwitchAssets = useCallback(
    (event: any) => {
      // prevent form submit
      event.preventDefault();
      onAssetIdsChange({
        assetIn: assetIds.assetOut,
        assetOut: assetIds.assetIn,
      });
      
      if (tradeType === TradeType.Buy) {
        const assetOutAmount = getValues('assetOutAmount');
        setValue('assetInAmount', assetOutAmount);
        setTradeType(TradeType.Sell);
        setValue('assetOutAmount', null)
      } else {
        const assetInAmount = getValues('assetInAmount');
        setValue('assetOutAmount', assetInAmount);
        setTradeType(TradeType.Buy);
        setValue('assetInAmount', null)
      }
    },
    [assetIds, tradeType, setValue, getValues, setTradeType]
  );

  const { apiInstance } = usePolkadotJsContext();
  const { cache } = useApolloClient();
  const [paymentInfo, setPaymentInfo] = useState<string>();
  const { convertToFeePaymentAsset, feePaymentAsset } = useMultiFeePaymentConversionContext();
  const calculatePaymentInfo = useCallback(async () => {
    if (!apiInstance) return;
    let [assetIn, assetOut, assetInAmount, assetOutAmount] = getValues([
      'assetIn',
      'assetOut',
      'assetInAmount',
      'assetOutAmount',
    ]);

    if (
      !assetIn ||
      !assetOut ||
      !assetInAmount ||
      !assetOutAmount ||
      !tradeLimit
    )
      return;

    switch (tradeType) {
      case TradeType.Buy: {
        const estimate = await estimateBuy(
          cache,
          apiInstance,
          assetOut,
          assetIn,
          assetOutAmount,
          tradeLimit.balance
        );
        const partialFee = estimate?.partialFee.toString();
        return convertToFeePaymentAsset(partialFee);
      }
      case TradeType.Sell: {
        const estimate = await estimateSell(
          cache,
          apiInstance,
          assetIn,
          assetOut,
          assetInAmount,
          tradeLimit.balance
        );
        const partialFee = estimate?.partialFee.toString();
        return convertToFeePaymentAsset(partialFee);
      }
      default:
        return;
    }
  }, [
    apiInstance,
    cache,
    ...watch(['assetInAmount', 'assetOutAmount', 'assetIn']),
    tradeLimit,
    tradeType,
    convertToFeePaymentAsset,
    feePaymentAsset,
    getValues,
    pool
  ]);

  useEffect(() => {
    (async () => {
      const paymentInfo = await calculatePaymentInfo();
      if (!paymentInfo) return;
      setPaymentInfo(paymentInfo);
    })();
  }, [
    apiInstance,
    cache,
    ...watch(['assetInAmount', 'assetOutAmount']),
    tradeLimit,
    tradeType,
    calculatePaymentInfo
  ]);

  useEffect(() => {
    setValue('assetIn', assetIds.assetIn);
    setValue('assetOut', assetIds.assetOut);
  }, [assetIds]);

  const tradeBalances = useMemo(() => {
    const assetOutAmount = getValues('assetOutAmount');
    const outBeforeTrade = activeAccountTradeBalances?.outBalance?.balance;
    const outAfterTrade =
      (outBeforeTrade &&
        assetOutAmount &&
        new BigNumber(outBeforeTrade).plus(assetOutAmount).toFixed(0)) ||
      undefined;
    const outTradeChange =
      outBeforeTrade !== '0'
        ? percentageChange(
            fromPrecision12(outBeforeTrade),
            fromPrecision12(outAfterTrade)
          )?.multipliedBy(100)
        : new BigNumber(
            outAfterTrade && outAfterTrade !== '0' ? '100.000' : '0'
          );

    const assetInAmount = getValues('assetInAmount');
    const inBeforeTrade = activeAccountTradeBalances?.inBalance?.balance;
    let inAfterTrade =
      (inBeforeTrade &&
        assetInAmount &&
        new BigNumber(inBeforeTrade).minus(assetInAmount).toFixed(0)) ||
      undefined;

    inAfterTrade =
      getValues('assetIn') !== '0'
        ? inAfterTrade
        : paymentInfo &&
          inAfterTrade &&
          new BigNumber(inAfterTrade).minus(paymentInfo).toFixed(0);

    const inTradeChange =
      inBeforeTrade !== '0'
        ? percentageChange(
            fromPrecision12(inBeforeTrade),
            fromPrecision12(inAfterTrade)
          )?.multipliedBy(100)
        : new BigNumber(
            inAfterTrade && inAfterTrade !== '0' ? '-100.000' : '0'
          );

    return {
      outBeforeTrade,
      outAfterTrade,
      outTradeChange,

      inBeforeTrade,
      inAfterTrade,
      inTradeChange,
    };
  }, [
    activeAccountTradeBalances,
    ...watch(['assetOutAmount', 'assetInAmount', 'assetIn']),
    paymentInfo,
  ]);

  const { debugComponent } = useDebugBoxContext();

  useEffect(() => {
    debugComponent('TradeForm', {
      ...getValues(),
      spotPrice,
      tradeLimit,
      assetInLiquidity,
      assetOutLiquidity,
      tradeBalances: {
        ...tradeBalances,
        inTradeChange: tradeBalances.inTradeChange?.toString(),
        outTradeChange: tradeBalances.outTradeChange?.toString(),
      },
      tradeType,
      slippage: slippage?.toString(),
      errors: Object.keys(errors).reduce((reducedErrors, error) => {
        return {
          ...reducedErrors,
          [error]: (errors as any)[error].type,
        };
      }, {}),
    });
  }, [
    Object.values(getValues()).toString(),
    spotPrice,
    tradeBalances,
    tradeBalances,
    tradeType,
    errors,
    assetInLiquidity,
    assetOutLiquidity,
    slippage,
    formState.isDirty,
  ]);

  const minTradeLimitIn = useCallback(
    (assetInAmount?: Maybe<string>) => {
      if (!assetInAmount || assetInAmount === '0') return false;
      return new BigNumber(assetInLiquidity || '0')
        .dividedBy(3)
        .gte(assetInAmount);
    },
    [assetInLiquidity]
  );

  const [maxAmountInLoading, setMaxAmountInLoading] = useState(false);

  const calculateMaxAmountIn = useCallback(async () => {
    const [assetIn, assetOut] = getValues(['assetIn', 'assetOut']);
    console.log(
      'calculateMaxAmountIn1',
      tradeBalances.inBeforeTrade,
      cache,
      apiInstance,
      assetIn,
      assetOut
    );
    if (
      !tradeBalances.inBeforeTrade ||
      !cache ||
      !apiInstance ||
      !assetIn ||
      !assetOut
    )
      return;
    console.log('calculateMaxAmountIn11');
    const maxAmount = tradeBalances.inBeforeTrade;
    const estimate = await estimateSell(
      cache,
      apiInstance,
      assetIn,
      assetOut,
      maxAmount,
      '0'
    );
    console.log('calculateMaxAmountIn11 estimate done', estimate);
    const paymentInfo = estimate?.partialFee.toString();
    const maxAmountWithoutFee = new BigNumber(maxAmount).minus(
      (feePaymentAsset === getValues('assetIn')
        ? feePaymentAsset === '0'
          ? paymentInfo
          : convertToFeePaymentAsset(paymentInfo)
        : '0'
      ) || '0'
    );
    console.log('calculateMaxAmountIn12', {
      inBeforeTrade: tradeBalances.inBeforeTrade,
      estimate,
      paymentInfo,
      maxAmount,
      maxAmountWithoutFee: maxAmountWithoutFee.toFixed(10),
    });

    return getValues('assetIn') === feePaymentAsset
      ? // max amount changed when all fields are filled out since that allows
        // us to calculate paymentInfo
        maxAmountWithoutFee.gt('0')
        ? maxAmountWithoutFee.toFixed(10)
        : undefined
      : maxAmount;
  }, [
    tradeBalances.inBeforeTrade,
    paymentInfo,
    cache,
    apiInstance,
    feePaymentAsset, convertToFeePaymentAsset,
    ...watch(['assetIn']),
  ]);

  const maxButtonDisabled = useMemo(() => {
    return (
      maxAmountInLoading || activeAccountTradeBalancesLoading || isPoolLoading
    );
  }, [maxAmountInLoading, activeAccountTradeBalancesLoading, isPoolLoading]);

  const handleMaxButtonOnClick = useCallback(async () => {
    setMaxAmountInLoading(true);
    const maxAmountIn = await calculateMaxAmountIn();
    console.log('setting max amount in', maxAmountIn);
    if (maxAmountIn)
      setValue('assetInAmount', maxAmountIn, {
        shouldDirty: true,
        shouldValidate: true,
      });
    setMaxAmountInLoading(false);
  }, [calculateMaxAmountIn]);

  return (
    <div className="trade-form-wrapper">
      <div ref={modalContainerRef}></div>
      {modalPortal}

      <FormProvider {...form}>
        <form className="trade-form" onSubmit={handleSubmit(_handleSubmit)}>
          <div
            className="settings-button"
            onClick={(e) => {
              e.preventDefault();
              toggleModal();
            }}
          >
            <Icon name="Settings" />
          </div>

          <div className="trade-form-heading">Trade Tokens</div>
          <div className="balance-wrapper">
            <AssetBalanceInput
              balanceInputName="assetInAmount"
              assetInputName="assetIn"
              modalContainerRef={modalContainerRef}
              balanceInputRef={assetInAmountInputRef}
              assets={assets?.filter(
                (asset) => !Object.values(assetIds).includes(asset.id)
              )}
              maxBalanceLoading={maxAmountInLoading}
            />
            <div className="balance-info balance-out-info">
              <div className="balance-info-type">Pay with</div>
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
                          assetId: assetIds.assetIn,
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
              <div
                className={classNames('max-button', {
                  disabled: maxButtonDisabled,
                })}
                onClick={() => handleMaxButtonOnClick()}
              >
                Max
              </div>
            </div>
          </div>

          <div className="asset-switch">
            <hr className="divider asset-switch-divider"></hr>
            <div className="asset-switch-icon" onClick={handleSwitchAssets}>
              <Icon name="AssetSwitch" />
            </div>
            <div className="asset-switch-price">
              <div className="asset-switch-price__wrapper">
                {(() => {
                  const assetOut = getValues('assetOut');
                  const assetIn = getValues('assetIn');
                  switch (tradeType) {
                    case TradeType.Sell:
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
                              assetId: getValues('assetIn')!,
                            }}
                          />
                          =
                          <FormattedBalance
                            balance={{
                              balance: spotPrice.inOut,
                              assetId: assetOut,
                            }}
                          />
                        </>
                      ) : (
                        <>-</>
                      );
                    case TradeType.Buy:
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
                              assetId: getValues('assetOut')!,
                            }}
                          />
                          =
                          <FormattedBalance
                            balance={{
                              balance: spotPrice.outIn,
                              assetId: assetIn,
                            }}
                          />
                        </>
                      ) : (
                        <>-</>
                      );
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
            />{' '}
            <div className="balance-info balance-out-info">
              <div className="balance-info-type">You get</div>
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
                          assetId: assetIds.assetOut,
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

          <TradeInfo
            tradeLimit={tradeLimit}
            expectedSlippage={slippage}
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
                minTradeLimitOut: () => {
                  const assetOutAmount = getValues('assetOutAmount');
                  if (!assetOutAmount || assetOutAmount === '0') return false;
                  return true;
                },
                minTradeLimitIn: () => {
                  const assetInAmount = getValues('assetInAmount');
                  if (!assetInAmount || assetInAmount === '0') return false;
                  return true;
                },
                notEnoughBalanceIn: () => {
                  const assetInAmount = getValues('assetInAmount');
                  if (
                    !activeAccountTradeBalances?.inBalance?.balance ||
                    !assetInAmount
                  )
                    return false;
                  return new BigNumber(
                    activeAccountTradeBalances.inBalance.balance
                  ).gte(assetInAmount);
                },
                maxTradeLimitOut: () => {
                  const assetOutAmount = getValues('assetOutAmount');
                  if (!assetOutAmount || assetOutAmount === '0') return false;
                  return new BigNumber(assetOutLiquidity || '0')
                    .dividedBy(3)
                    .gte(assetOutAmount);
                },
                maxTradeLimitIn: () => {
                  const assetInAmount = getValues('assetInAmount');
                  return minTradeLimitIn(assetInAmount);
                },
                slippageHigherThanTolerance: () => {
                  if (!allowedSlippage) return false;
                  return slippage?.lt(allowedSlippage);
                },
                notEnoughFeeBalance: () => {
                  const assetIn = getValues('assetIn');
                  const assetInAmount = getValues('assetInAmount');

                  if (!feePaymentAsset) return false;

                  let feePaymentAssetBalance = find(activeAccount?.balances, {
                    assetId: feePaymentAsset,
                  })?.balance

                  let balanceForFee = feePaymentAssetBalance;

                  if (assetIn === feePaymentAsset && assetInAmount && feePaymentAssetBalance) {
                    balanceForFee = new BigNumber(feePaymentAssetBalance)
                      .minus(assetInAmount)
                      .toString();
                  }

                  if (!paymentInfo) return true;
                  if (!balanceForFee) return false;
                  console.log('balance for free', balanceForFee, paymentInfo);
                  return new BigNumber(balanceForFee).gte(paymentInfo);
                },
              },
            })}
            disabled={!isValid || tradeLoading || !isDirty}
            value={getSubmitText()}
          />
        </form>
      </FormProvider>
    </div>
  );
};
