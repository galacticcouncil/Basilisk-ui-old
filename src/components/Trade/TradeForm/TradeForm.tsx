import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { find, times } from 'lodash';
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Control, FormProvider, useForm } from 'react-hook-form';
import { Balance, Pool, TradeType } from '../../../generated/graphql';
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
      className="trade-settings modal-component-wrapper"
      onSubmit={handleSubmit(() => {})}
    >
      <div className="modal-component-heading">
        Settings
        <div className="close-modal-btn" onClick={closeModal}>
          <Icon name="Cancel" />
        </div>
      </div>
      <div className="modal-component-content">
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
      console.log('useModalPortalElement', allowedSlippage);
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
              console.log('onAllowedSlippageChange', allowedSlippage);
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
}

export interface TradeFormFields {
  assetIn: string | null;
  assetOut: string | null;
  assetInAmount: string | null;
  assetOutAmount: string | null;
  submit: void;
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
}: TradeFormProps) => {
  // TODO: include math into loading form state
  const { math, loading: mathLoading } = useMath();
  const [tradeType, setTradeType] = useState<TradeType>(TradeType.Buy);
  const [allowedSlippage, setAllowedSlippage] = useState<string | null>(null);

  const form = useForm<TradeFormFields>({
    reValidateMode: 'onChange',
    mode: 'onTouched',
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
  }, [isActiveAccountConnected, pool, isPoolLoading]);

  // when the assetIds change, propagate the change to the parent
  useEffect(() => {
    const { assetIn, assetOut } = getValues();
    onAssetIdsChange({ assetIn, assetOut });
  }, watch(['assetIn', 'assetOut']));

  const assetInAmountInput = useListenForInput(assetInAmountInputRef);
  useEffect(() => {
    if (tradeType === TradeType.Sell && assetInAmountInput !== undefined)
      return;
    console.log('setting trade type to sell', assetInAmountInput);

    setTradeType(TradeType.Sell);
  }, [assetInAmountInput]);

  const assetOutAmountInput = useListenForInput(assetOutAmountInputRef);
  useEffect(() => {
    if (tradeType === TradeType.Buy && assetOutAmountInput !== undefined)
      return;
    console.log('setting trade type to buy', assetOutAmountInput);

    setTradeType(TradeType.Buy);
  }, [assetOutAmountInput]);

  useEffect(() => {
    const assetOutAmount = getValues('assetOutAmount');
    console.log('assetOutAmount', assetOutAmount);
    if (
      !pool ||
      !math ||
      !assetInLiquidity ||
      !assetOutLiquidity ||
      !assetOutAmount
    )
      return;
    if (tradeType !== TradeType.Buy) return;

    console.log('assetOutAmount using math', assetOutAmount);

    const amount = math.xyk.calculate_in_given_out(
      // which combination is correct?
      // assetOutLiquidity,
      // assetInLiquidity,
      assetInLiquidity,
      assetOutLiquidity,
      assetOutAmount
    );
    // return
    console.log('buy setting assetInAmount', amount);
    setValue('assetInAmount', amount || null);
  }, [tradeType, assetOutLiquidity, assetInLiquidity, watch('assetOutAmount')]);

  useEffect(() => {
    const assetInAmount = getValues('assetInAmount');
    console.log('assetInAmount', assetInAmount);
    if (
      !pool ||
      !math ||
      !assetInLiquidity ||
      !assetOutLiquidity ||
      !assetInAmount
    )
      return;
    if (tradeType !== TradeType.Sell) return;

    const amount = math.xyk.calculate_out_given_in(
      assetInLiquidity,
      assetOutLiquidity,
      assetInAmount
    );
    console.log('sell setting assetOutAmount', amount);
    setValue('assetOutAmount', amount || null);
  }, [tradeType, assetOutLiquidity, assetInLiquidity, watch('assetInAmount')]);

  const getSubmitText = useCallback(() => {
    if (isPoolLoading) return 'loading';

    switch (errors.submit?.type) {
      case 'activeAccount':
        return 'Select account';
      case 'poolDoesNotExist':
        return 'Select tokens';
    }

    if (errors.assetInAmount || errors.assetOutAmount) return 'invalid amount';

    if (Object.keys(errors).length) return 'form invalid';

    return 'Swap';
  }, [isPoolLoading, errors]);

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
    const assetInAmount = fromPrecision12(getValues('assetInAmount') || '0');
    const assetOutAmount = fromPrecision12(getValues('assetOutAmount') || '0');

    if (
      !assetInAmount ||
      !assetOutAmount ||
      !spotPrice?.inOut ||
      !spotPrice?.outIn ||
      !allowedSlippage
    )
      return;

    console.log(
      'tradeLimit',
      assetOutAmount,
      spotPrice?.outIn,
      allowedSlippage
    );

    switch (tradeType) {
      case TradeType.Sell:
        return new BigNumber(assetInAmount)
          .multipliedBy(spotPrice?.inOut)
          .multipliedBy(new BigNumber('1').minus(allowedSlippage))
          .toFixed(0);
      case TradeType.Buy:
        return new BigNumber(assetOutAmount)
          .multipliedBy(spotPrice?.outIn)
          .multipliedBy(new BigNumber('1').plus(allowedSlippage))
          .toFixed(0);
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

    console.log('slipige', assetInAmount, spotPrice.inOut); // continue here, spot price * in/out amount produce too big of a number

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

  console.log('form', errors, isDirty, isValid);

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
        amountWithSlippage: tradeLimit,
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
    },
    [assetIds]
  );

  useEffect(() => {
    setValue('assetIn', assetIds.assetIn);
    setValue('assetOut', assetIds.assetOut);
  }, [assetIds]);

  const tradeBalances = useMemo(() => {
    const assetOutAmount = getValues('assetOutAmount') || undefined;
    const outBeforeTrade = activeAccountTradeBalances?.outBalance?.balance;
    const outAfterTrade =
      outBeforeTrade &&
      assetOutAmount &&
      new BigNumber(outBeforeTrade).plus(assetOutAmount).toFixed(0);
    const outTradeChange = percentageChange(
      outBeforeTrade,
      outAfterTrade
    )?.toFixed(3);

    const assetInAmount = getValues('assetInAmount') || undefined;
    const inBeforeTrade = activeAccountTradeBalances?.inBalance?.balance;
    const inAfterTrade =
      inBeforeTrade &&
      assetInAmount &&
      new BigNumber(inBeforeTrade).minus(assetInAmount).toFixed(0);
    const inTradeChange = percentageChange(
      inBeforeTrade,
      inAfterTrade
    )?.toFixed(3);

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
    ...watch(['assetOutAmount', 'assetInAmount']),
  ]);

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
          <div className="trade-form-heading">You get</div>

          <div className="balance-wrapper">
            {' '}
            <AssetBalanceInput
              balanceInputName="assetOutAmount"
              assetInputName="assetOut"
              modalContainerRef={modalContainerRef}
              balanceInputRef={assetOutAmountInputRef}
              assets={assets}
            />{' '}
            <div className="balance-info balance-out-info">
              {activeAccountTradeBalancesLoading ? (
                'Your balance: loading'
              ) : (
                // : `${fromPrecision12(tradeBalances.outBeforeTrade)} -> ${fromPrecision12(tradeBalances.outAfterTrade)}`
                <>
                  Your balance:
                  {tradeBalances.outBeforeTrade && assetIds.assetOut ? (
                    <FormattedBalance
                      balance={{
                        balance: tradeBalances.outBeforeTrade,
                        assetId: assetIds.assetOut,
                      }}
                    />
                  ) : (
                    <></>
                  )}
                  {tradeBalances.outAfterTrade && assetIds.assetOut ? (
                    <>
                      <Icon name="RightArrow" />
                      <FormattedBalance
                        balance={{
                          balance: tradeBalances.outAfterTrade,
                          assetId: assetIds.assetOut,
                        }}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                  {tradeBalances.outTradeChange && (
                    <div className="green">
                      (${tradeBalances.outTradeChange}%)
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="asset-switch">
            <hr className="divider asset-switch-divider"></hr>
            <div className="asset-switch-icon" onClick={handleSwitchAssets}>
              <Icon name="AssetSwitch" />
            </div>
            <div className="asset-switch-price">
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
                        1 {idToAsset(getValues('assetIn'))?.symbol} =
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
                        1 {idToAsset(getValues('assetOut'))?.symbol} =
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
          <div className="trade-form-heading">Pay with</div>
          <div className="balance-wrapper">
            <AssetBalanceInput
              balanceInputName="assetInAmount"
              assetInputName="assetIn"
              modalContainerRef={modalContainerRef}
              balanceInputRef={assetInAmountInputRef}
              assets={assets}
            />
            <div className="balance-info balance-out-info">
              {activeAccountTradeBalancesLoading ? (
                'Your balance: loading'
              ) : (
                // : `${fromPrecision12(tradeBalances.outBeforeTrade)} -> ${fromPrecision12(tradeBalances.outAfterTrade)}`
                <>
                  Your balance:
                  {tradeBalances.inBeforeTrade && assetIds.assetIn ? (
                    <FormattedBalance
                      balance={{
                        balance: tradeBalances.inBeforeTrade,
                        assetId: assetIds.assetIn,
                      }}
                    />
                  ) : (
                    <></>
                  )}
                  {tradeBalances.inAfterTrade && assetIds.assetIn ? (
                    <>
                      <Icon name="RightArrow" />
                      <FormattedBalance
                        balance={{
                          balance: tradeBalances.inAfterTrade,
                          assetId: assetIds.assetIn,
                        }}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                  {tradeBalances.inTradeChange && (
                    <div className="red">(${tradeBalances.inTradeChange}%)</div>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="divider-wrapper">
            <hr className="divider"></hr>
          </div>
          <TradeInfo
            tradeLimit={fromPrecision12(tradeLimit)}
            expectedSlippage={slippage?.multipliedBy(100).toFixed(2)}
            errors={errors}
          />
          <input
            type="submit"
            className="submit-button"
            {...register('submit', {
              validate: {
                poolDoesNotExist: () => !!pool,
                activeAccount: () => isActiveAccountConnected,
              },
            })}
            disabled={!isValid || tradeLoading}
            value={getSubmitText()}
          />
        </form>
      </FormProvider>

      <div className="debug">
        <h3>[Trade Form] Debug box</h3>
        <p>
          Liquidity (out/in): [{getValues('assetOut')}]{' '}
          {fromPrecision12(assetOutLiquidity)} / [{getValues('assetIn')}]{' '}
          {fromPrecision12(assetInLiquidity)}
        </p>
        <p>Trade type: {tradeType}</p>
        <p>Asset IDs: {JSON.stringify(assetIds)}</p>
        <p>
          Allowed slippage:{' '}
          {new BigNumber(allowedSlippage || '0').multipliedBy(100).toFixed(3)} %
        </p>
        <p>
          Spot Price (outIn / inOut): {fromPrecision12(spotPrice?.outIn)} /{' '}
          {fromPrecision12(spotPrice?.inOut)}
        </p>
        <p>
          {(() => {
            switch (tradeType) {
              case TradeType.Sell:
                return `1 [${getValues('assetIn')}] = ${fromPrecision12(
                  spotPrice?.inOut
                )} [${getValues('assetOut')}]`;
              case TradeType.Buy:
                return `1 [${getValues('assetOut')}] = ${fromPrecision12(
                  spotPrice?.outIn
                )} [${getValues('assetIn')}]`;
            }
          })()}
        </p>
        <p>Trade limit: {tradeLimit && fromPrecision12(tradeLimit)}</p>
        <p>
          Amounts (out / in):{' '}
          {fromPrecision12(getValues('assetOutAmount') || undefined)} /{' '}
          {fromPrecision12(getValues('assetInAmount') || undefined)}
        </p>
        <p>
          Slippage:{' '}
          {slippage && new BigNumber(slippage).multipliedBy(100).toFixed(3)}%
        </p>
        <p>Form is valid?: {isValid ? 'true' : 'false'}</p>
      </div>
    </div>
  );
};
