import classNames from "classnames";
import { find } from "lodash";
import { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Control, FormProvider, useForm } from "react-hook-form";
import { Balance, Pool, TradeType } from "../../../generated/graphql";
import { useMath } from "../../../hooks/math/useMath";
import { TradeAssetIds } from "../../../pages/TradePage/TradePage";
import { AssetBalanceInput } from "../../Balance/AssetBalanceInput/AssetBalanceInput";
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
            setValue('allowedSlippage', '0.2')
        }
    }, watch(['autoSlippage']))

    return <>
        <form>
            <input
                {...register('allowedSlippage')}
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
    isPoolLoading: boolean
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
    isPoolLoading
}: TradeFormProps) => {
    // TODO: include math into loading form state
    const { math, loading: mathLoading } = useMath();
    const [tradeType, setTradeType] = useState<TradeType>(TradeType.Buy);
    const [allowedSlippage, setAllowedSlippage] = useState<string | null>(null);
    const form = useForm<TradeFormFields>({
        reValidateMode: 'onBlur',
        mode: 'all',
        defaultValues: {
            // assetIn: assetIds.assetIn,
            // assetOut: assetIds.assetOut
        }
    });
    const { register, handleSubmit, watch, getValues, setValue, trigger, control, formState: { errors, isValid } } = form;

    const assetOutAmountInputRef = useRef<HTMLInputElement>(null)
    const assetInAmountInputRef = useRef<HTMLInputElement>(null)


    // trigger form field validation right away
    useEffect(() => {
        trigger();
    }, []);

    useEffect(() => {
        trigger();
    }, [isActiveAccountConnected, pool, isPoolLoading]);

    // handle submit of the form
    const _handleSubmit = useCallback((data: TradeFormFields) => {
        console.log('submit', data)
    }, []);

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

    // console.log('submit', useListenForInput(control, 'submit'))

    const assetOutLiquidity = useMemo(() => {
        const assetId = getValues('assetOut') || undefined;
        return find<Balance | null>(pool?.balances, { assetId })?.balance
    }, [pool, watch('assetOut')]);

    const assetInLiquidity = useMemo(() => {
        const assetId = getValues('assetIn') || undefined;
        return find<Balance | null>(pool?.balances, { assetId })?.balance
    }, [pool, watch('assetIn')]);

    useEffect(() => {
        const assetOutAmount = getValues('assetOutAmount') || '0';
        console.log('assetOutAmount', assetOutAmount)
        if (!pool || !math || !assetInLiquidity || !assetOutLiquidity) return;
        if (tradeType !== TradeType.Buy) return;

        console.log('assetOutAmount using math', assetOutAmount)

        const amount = math.xyk.calculate_in_given_out(
            assetOutLiquidity,
            assetInLiquidity,
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

    return <>
        <div ref={modalContainerRef}></div>
        <TradeFormSettings
            allowedSlippage={allowedSlippage}
            onAllowedSlippageChange={(allowedSlippage) => setAllowedSlippage(allowedSlippage)}
        />
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(_handleSubmit)}>
                <div>
                    <AssetBalanceInput
                        balanceInputName='assetOutAmount'
                        assetInputName='assetOut'
                        modalContainerRef={modalContainerRef}
                        balanceInputRef={assetOutAmountInputRef}
                        // onAssetSelected={(asset) => console.log('asset', asset)}
                    />
                    <input type="text" {...register('assetOut')}/>
                    {/* <input type="text" {...register('assetOutAmount')}/> */}
                </div>

                <p>asset switcher</p>
                <p>spot price: -</p>

                <div>
                <AssetBalanceInput
                        balanceInputName='assetInAmount'
                        assetInputName='assetIn'
                        modalContainerRef={modalContainerRef}
                        balanceInputRef={assetInAmountInputRef}
                        // onAssetSelected={(asset) => console.log('asset', asset)}
                    />
                    <input type="text" {...register('assetIn')}/>
                </div>

                <TradeInfo />
                
                <div>
                    <input type="submit"
                        {...register('submit', {
                            validate: {
                                poolDoesNotExist: () => !!pool,
                                activeAccount: () => isActiveAccountConnected,
                            }
                        })}
                        // disabled={!isValid}
                        value={getSubmitText()}
                    />
                </div>
            </form>
            <button onClick={() => setValue('assetInAmount', '0')}>click</button>
        </FormProvider>

        <p>Trade type: {tradeType}</p>
        <p>{JSON.stringify(assetIds)}</p>
    </>
}