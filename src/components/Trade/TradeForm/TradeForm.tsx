import BigNumber from "bignumber.js";
import classNames from "classnames";
import { find, times } from "lodash";
import { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Control, FormProvider, useForm } from "react-hook-form";
import { Balance, Pool, TradeType } from "../../../generated/graphql";
import { fromPrecision12 } from "../../../hooks/math/useFromPrecision";
import { useMath } from "../../../hooks/math/useMath";
import { percentageChange } from "../../../hooks/math/usePercentageChange";
import { toPrecision12 } from "../../../hooks/math/useToPrecision";
import { SubmitTradeMutationVariables } from "../../../hooks/pools/mutations/useSubmitTradeMutation";
import { TradeAssetIds } from "../../../pages/TradePage/TradePage";
import { AssetBalanceInput } from "../../Balance/AssetBalanceInput/AssetBalanceInput";
import { PoolType } from "../../Chart/shared";
import { TradeInfo } from "./TradeInfo/TradeInfo";

export interface TradeFormSettingsProps {
    allowedSlippage: string | null,
    onAllowedSlippageChange: (allowedSlippage: string | null) => void
}

export interface TradeFormSettingsFormFields {
    allowedSlippage: string | null
    autoSlippage: boolean
}

export const TradeFormSettings = ({
    allowedSlippage,
    onAllowedSlippageChange
}: TradeFormSettingsProps) => {
    const { register, watch, getValues, setValue } = useForm<TradeFormSettingsFormFields>({
        defaultValues: {
            allowedSlippage,
            autoSlippage: true
        }
    });

    // propagate allowed slippage to the parent
    useEffect(() => {
        onAllowedSlippageChange(
            getValues('allowedSlippage')
        )
    }, watch(['allowedSlippage']));

    // if you want automatic slippage, override the previous user's input
    useEffect(() => {
        if (getValues('autoSlippage')) {
            // default is 3%
            setValue('allowedSlippage', '3')
        }
    }, watch(['autoSlippage']))

    return <>
        <form>
            <label>Allowed slippage (%)</label>
            <input
                {...register('allowedSlippage', {
                    setValueAs: value => value && new BigNumber(value).dividedBy('100').toFixed(3)
                })}
                // disabled if using auto slippage
                disabled={getValues('autoSlippage')}
                type="text"
            />
            <input
                {...register('autoSlippage')}
                type='checkbox'
            />
        </form>
    </>
}

export interface TradeFormProps {
    assetIds: TradeAssetIds,
    onAssetIdsChange: (assetIds: TradeAssetIds) => void,
    isActiveAccountConnected?: boolean,
    pool?: Pool,
    assetInLiquidity?: string,
    assetOutLiquidity?: string,
    spotPrice?: {
        outIn?: string, 
        inOut?: string,
    },
    isPoolLoading: boolean,
    onSubmitTrade: (trade: SubmitTradeMutationVariables) => void
}

export interface TradeFormFields {
    assetIn: string | null,
    assetOut: string | null,
    assetInAmount: string | null,
    assetOutAmount: string | null
    submit: void
}

/**
 * Trigger a state update each time the given input changes (via the `input` event)
 * @param control
 * @param field 
 * @returns 
 */
export const useListenForInput = (inputRef: MutableRefObject<HTMLInputElement | null>) => {
    const [state, setState] = useState<boolean>();

    useEffect(() => {
        if (!inputRef) return;
        // TODO: figure out why using the 'input' broke the mask
        const listener = inputRef.current
            ?.addEventListener('keydown', () => setState(state => !state));

        return () => listener && inputRef.current?.removeEventListener('keydown', listener);
    }, [inputRef])

    return state;
}

export const TradeForm = ({
    assetIds,
    onAssetIdsChange,
    isActiveAccountConnected,
    pool,
    isPoolLoading,
    assetInLiquidity,
    assetOutLiquidity,
    spotPrice,
    onSubmitTrade
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
            assetOut: assetIds.assetOut
        }
    });
    const { register, handleSubmit, watch, getValues, setValue, trigger, control, formState } = form;

    const { isValid, isDirty, errors} = formState;

    const assetOutAmountInputRef = useRef<HTMLInputElement>(null)
    const assetInAmountInputRef = useRef<HTMLInputElement>(null)

    const assets = useMemo(() => (
        times(10).map((id) => ({ id: `${id}` }))
    ), []);

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
    }, watch(['assetIn', 'assetOut']))

    const assetInAmountInput = useListenForInput(assetInAmountInputRef);
    useEffect(() => {
        if (tradeType === TradeType.Sell && assetInAmountInput !== undefined) return;
        console.log('setting trade type to sell', assetInAmountInput)

        setTradeType(TradeType.Sell)
    }, [assetInAmountInput]);

    const assetOutAmountInput = useListenForInput(assetOutAmountInputRef);
    useEffect(() => {
        if (tradeType === TradeType.Buy && assetOutAmountInput !== undefined) return;
        console.log('setting trade type to buy', assetOutAmountInput)

        setTradeType(TradeType.Buy)
    }, [assetOutAmountInput]);

    useEffect(() => {
        const assetOutAmount = getValues('assetOutAmount') || '0';
        console.log('assetOutAmount', assetOutAmount)
        if (!pool || !math || !assetInLiquidity || !assetOutLiquidity) return;
        if (tradeType !== TradeType.Buy) return;

        console.log('assetOutAmount using math', assetOutAmount)

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
    }, [tradeType, assetOutLiquidity, assetInLiquidity, watch('assetOutAmount')])

    useEffect(() => {
        const assetInAmount = getValues('assetInAmount') || '0';
        console.log('assetInAmount', assetInAmount);
        if (!pool || !math || !assetInLiquidity || !assetOutLiquidity) return;
        if (tradeType !== TradeType.Sell) return;

        const amount = math.xyk.calculate_out_given_in(
            assetInLiquidity,
            assetOutLiquidity,
            assetInAmount
        );
        console.log('sell setting assetOutAmount', amount);
        setValue('assetOutAmount', amount || null);
    }, [tradeType, assetOutLiquidity, assetInLiquidity, watch('assetInAmount')])

    const getSubmitText = useCallback(() => {
        if (isPoolLoading) return 'loading';

        switch (errors.submit?.type) {
            case 'activeAccount':
                return 'no active account';
            case 'poolDoesNotExist':
                return 'invalid pair';
        }

        if (errors.assetInAmount || errors.assetOutAmount)
            return 'invalid amounts'

        if (Object.keys(errors).length) return 'form invalid';

        return 'trade';
    }, [isPoolLoading, errors]);

    const modalContainerRef = useRef<HTMLDivElement | null>(null)

    const tradeLimit = useMemo(() => {
        const assetInAmount = getValues('assetInAmount');
        const assetOutAmount = getValues('assetOutAmount');

        if (!assetInAmount || !assetOutAmount || !spotPrice?.inOut || !spotPrice?.outIn || !allowedSlippage) return;

        switch (tradeType) {
            case TradeType.Sell:
                return new BigNumber(assetInAmount)
                    .multipliedBy(spotPrice?.outIn)
                    .multipliedBy(
                        new BigNumber('1')
                            .minus(allowedSlippage)
                    )
                    .toFixed(0)
            case TradeType.Buy:
                return new BigNumber(assetOutAmount)
                    .multipliedBy(spotPrice?.inOut)
                    .multipliedBy(
                        new BigNumber('1')
                            .plus(allowedSlippage)
                    )
                    .toFixed(0)
        }
    }, [spotPrice, tradeType, allowedSlippage, getValues, ...watch(['assetInAmount', 'assetOutAmount'])]);

    const slippage = useMemo(() => {
        const assetInAmount = getValues('assetInAmount');
        const assetOutAmount = getValues('assetOutAmount');

        if (!assetInAmount || !assetOutAmount || !spotPrice || !allowedSlippage) return;

        console.log('slipige', assetInAmount, spotPrice.inOut) // continue here, spot price * in/out amount produce too big of a number

        switch (tradeType) {
            case TradeType.Sell:
                return percentageChange( 
                    new BigNumber(assetInAmount)
                        .multipliedBy(
                            fromPrecision12(spotPrice.outIn) || '1'
                        ),
                    assetOutAmount
                )
            case TradeType.Buy:
                return percentageChange(
                    new BigNumber(assetOutAmount)
                        .multipliedBy(
                            fromPrecision12(spotPrice.inOut) || '1'
                        ),
                    assetInAmount,
                )
        }
    }, [tradeType, getValues, spotPrice, ...watch(['assetInAmount', 'assetOutAmount'])]);

    console.log('form', errors, isDirty, isValid);


    // handle submit of the form
    const _handleSubmit = useCallback((data: TradeFormFields) => {
        if (!data.assetIn || !data.assetOut || !data.assetInAmount || !data.assetOutAmount || !tradeLimit) {
            throw new Error('Unable to submit trade due to missing data');
        }

        onSubmitTrade({
            assetInId: data.assetIn,
            assetOutId: data.assetOut,
            assetInAmount: data.assetInAmount,
            assetOutAmount: data.assetOutAmount,
            poolType: PoolType.XYK,
            tradeType: tradeType,
            amountWithSlippage: tradeLimit
        })
    }, [tradeType, tradeLimit]);

    return <>
        <div ref={modalContainerRef}></div>
        <TradeFormSettings
            allowedSlippage={allowedSlippage}
            onAllowedSlippageChange={(allowedSlippage) => setAllowedSlippage(allowedSlippage)}
        />
        <br/>
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(_handleSubmit)}>
                <div>
                    <br/>
                    <AssetBalanceInput
                        balanceInputName='assetOutAmount'
                        assetInputName='assetOut'
                        modalContainerRef={modalContainerRef}
                        balanceInputRef={assetOutAmountInputRef}
                        assets={assets}
                    />
                </div>

                <p>asset switcher goes here</p>
                <p>spot price goes here</p>

                <div>
                    <br/>
                    <AssetBalanceInput
                        balanceInputName='assetInAmount'
                        assetInputName='assetIn'
                        modalContainerRef={modalContainerRef}
                        balanceInputRef={assetInAmountInputRef}
                        assets={assets}
                    />
                </div>

                <TradeInfo />
                
                {JSON.stringify({
                    assetIn: errors.assetIn?.type,
                    assetOut: errors.assetOut?.type,
                    assetInAmount: errors.assetInAmount?.type,
                    assetOutAmount: errors.assetOutAmount?.type,
                    submit: errors.submit?.type
                })}

                <div>
                    <input type="submit"
                        {...register('submit', {
                            validate: {
                                poolDoesNotExist: () => !!pool,
                                activeAccount: () => isActiveAccountConnected,
                            }
                        })}
                        disabled={!isValid}
                        value={getSubmitText()}
                    />
                </div>
            </form>

        </FormProvider>
        
        <div>
            <br/>
            <h3>[Trade Form] Debug box</h3>
            <p>Liquidity (out/in): [{getValues('assetOut')}] {assetOutLiquidity} /  [{getValues('assetIn')}] {assetInLiquidity}</p>
            <p>Trade type: {tradeType}</p>
            <p>Asset IDs: {JSON.stringify(assetIds)}</p>
            <p>Allowed slippage: {allowedSlippage}</p>
            <p>Spot Price (outIn / inOut): {spotPrice?.outIn} / {spotPrice?.inOut}</p>
            <p>
                Spot Price: 
                1 IN [{getValues('assetIn')}] = {fromPrecision12(spotPrice?.outIn)} OUT [{getValues('assetOut')}] 
                /
                1 OUT [{getValues('assetOut')}] = {fromPrecision12(spotPrice?.inOut)} IN [{getValues('assetIn')}] 
            </p>
            <p>Trade limit: {tradeLimit && fromPrecision12(tradeLimit)}</p>
            <p>Amounts (out / in): {getValues('assetOutAmount')} / {getValues('assetInAmount')}</p>
            <p>Slippage: {slippage && new BigNumber(slippage).multipliedBy(100).toFixed(3)}%</p>
            <p>Form is valid?: {isValid ? 'true' : 'false'}</p>
        </div>
        
    </>
}