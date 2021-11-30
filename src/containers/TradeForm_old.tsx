import { isEqual, nth } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { LbpPool, Pool, TradeType } from '../generated/graphql';
import { useGetAssetsQuery } from '../hooks/assets/queries/useGetAssetsQuery';
import { useGetPoolByAssetsQuery } from '../hooks/pools/queries/useGetPoolByAssetsQuery';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useSubmitTradeMutation } from '../hooks/pools/mutations/useSubmitTradeMutation';
import { PoolType } from '../components/Chart/shared';
import { useCalculateInGivenOut } from '../hooks/pools/useCalculateInGivenOut';
import { useCalculateOutGivenIn } from '../hooks/pools/useCalculateOutGivenIn';
import { fromPrecision12, useFromPrecision12 } from '../hooks/math/useFromPrecision';
import { toPrecision12 } from '../hooks/math/useToPrecision';
import { usePool } from '../hooks/pools/usePool';
import { useSlippage } from './TradeForm/hooks/useSlippage';
import { applyAllowedSlippage, applyTradeFee } from '../hooks/pools/resolvers/useSubmitTradeMutationResolvers';
import { AnyNaptrRecord } from 'dns';

/**
 * Maintain which tradeType is currently active based on
 * which input have been interacted with last.
 * @returns 
 */
export const useTradeType = () => {
    const [tradeType, setTradeType] = useState<TradeType>(TradeType.Sell);

    // when the asset amount inputs are manually updated, change the trade type accordingly
    const onAssetAAmountInput = () => setTradeType(TradeType.Sell)
    const onAssetBAmountInput = () => setTradeType(TradeType.Buy)

    return {
        tradeType,
        onAssetAAmountInput,
        onAssetBAmountInput
    }
}

/**
 * Fetch available assets and watch the form for assetId updates.
 * If any form assets update, notify the parent via the callback.
 * 
 * TODO: maybe decouple the onAssetIdsChange logic to a separate hook?
 * @param onAssetIdsChange 
 * @param watch 
 * @returns 
 */
export const useAssets = (onAssetIdsChange: onAssetsIdsChange, watch: any) => {
    // should actually use the network status instead
    const { data: assets, loading } = useGetAssetsQuery();
    const [assetAId] = watch(['assetAId', 'assetAAmount']);
    const [assetBId] = watch(['assetBId', 'assetBAmount']);

    // when the user selects a new asset pair, notify the parent
    useEffect(() => { onAssetIdsChange(assetAId, assetBId) }, [assetAId, assetBId]);

    return {
        assets,
        loading,
        assetAId,
        assetBId
    }
}

/**
 * Construct the trade form with appropriate defaults, including
 * the form submit behaviour.
 * 
 * @param pool
 * @param tradeType 
 * @returns 
 */
export const useTradeForm = (
    pool?: Pool,
    tradeType?: TradeType
) => {
    // gql mutation for sending executing pool trades
    const [submitTrade] = useSubmitTradeMutation();
    // TODO: form value types
    const form = useForm<any, any>({
        defaultValues: {
            assetAAmount: '0',
            assetBAmount: '0',
            allowedSlippage: '5',
            // we're making the amount after slippage part of the form as a 'hidden field'
            // to make carrying over the value easier
            amountWithSlippage: undefined
        }
    });
    
    /**
     * When the form is submitted, submit a trade constructed
     * from the available pool/form/tradeType data.
     * @param data 
     * @returns 
     */
    const handleSubmit = (data: any) => {
        if (!pool || !tradeType) return;

        submitTrade({
            variables: {
                assetAId: data.assetAId,
                assetBId: data.assetBId,
                assetAAmount: toPrecision12(data.assetAAmount)!,
                assetBAmount: toPrecision12(data.assetBAmount)!,
                amountWithSlippage: data.amountWithSlippage,
                tradeType,
                poolType: pool?.__typename === 'XYKPool' ? PoolType.XYK : PoolType.LBP
            }
        })
    }

    return {
        form,
        handleSubmit: handleSubmit
    }
}

/**
 * After the assets are done loading, set default form values for assetIds
 * 
 * TODO: this will be done at a higher level (router or such), where the query 
 * parameters are parsed (poolId, assetA, assetB, tradeType)
 * 
 * @param assetsLoading
 * @param setValue 
 */
export const useDefaultFormAssets = (assetsLoading?: boolean, setValue?: any) => {
    // TODO add default assets as props via router query params
    // set default assets on the trade page
    useEffect(() => {
        if (assetsLoading) return;
        setValue('assetAId', '0');
        setValue('assetBId', '1');
    }, [assetsLoading])
}

/**
 * Set form amounts for asset A or B depending on the current trade type
 * @param pool 
 * @param tradeType 
 * @param param2 
 */
export const useCalculatedAssetAmounts = (
    form: UseFormReturn,
    pool?: Pool,
    tradeType?: TradeType,
) => {
    // calculated amounts depending on if the user is interacting as buy/sell
    const { 
        inGivenOutWithFee: calculatedAssetAAmount, 
        inGivenOut: calculatedAssetAAmountWithoutFee 
    } = useCalculateInGivenOut(
        pool,
        form.getValues('assetAId'),
        form.getValues('assetBId'),
        toPrecision12(form.getValues('assetBAmount')),
        tradeType,
    ) || {}
    
    const { 
        outGivenInWithFee: calculatedAssetBAmount, 
        outGivenIn: calculatedAssetBAmountWithoutFee
    } = useCalculateOutGivenIn(
        pool,
        form.getValues('assetAId'),
        form.getValues('assetBId'), 
        toPrecision12(form.getValues('assetAAmount')), // 1
        tradeType 
    ) || {}

    useEffect(() => {
        if (tradeType === TradeType.Buy) form.setValue('assetAAmount', fromPrecision12(calculatedAssetAAmount));
        if (tradeType === TradeType.Sell) form.setValue('assetBAmount', fromPrecision12(calculatedAssetBAmount));
    }, [
        calculatedAssetAAmount,
        calculatedAssetBAmount
    ]);

    return {
        calculatedAssetAAmount,
        calculatedAssetAAmountWithoutFee,
        calculatedAssetBAmount,
        calculatedAssetBAmountWithoutFee
    }
}

/**
 * 
 * @param form 
 * @param slippage 
 * @param tradeType 
 */
export const useApplyAllowedSlippage = (
    form: UseFormReturn<any, any>, 
    slippage: any,
    tradeType: TradeType
) => {
    useEffect(() => {
        if (!slippage?.spotPriceAmount) return;
        
        // TODO: handle a NaN case
        form.setValue('amountWithSlippage',
            applyAllowedSlippage(
                slippage?.spotPriceAmount, 
                form.getValues('allowedSlippage'), 
                tradeType
            )
        );

    }, [
        form.watch(['allowedSlippage']),
        slippage?.spotPriceAmount
    ]);
}

export type onAssetsIdsChange = (assetAId: string, assetBId: string) => void;

export const TradeForm = ({
    onAssetIdsChange,
    pool
}: {
    onAssetIdsChange: onAssetsIdsChange
    pool?: Pool
}) => {
    const { tradeType, onAssetAAmountInput, onAssetBAmountInput } = useTradeType();
    const { form, handleSubmit } = useTradeForm(pool, tradeType);
    const { register, watch, getValues, setValue } = form;
    const { assets, loading: assetsLoading, assetAId, assetBId } = useAssets(onAssetIdsChange, watch);

    useDefaultFormAssets(assetsLoading, setValue)

    const { liquidity, spotPrice } = usePool(pool, assetAId, assetBId);
    const { 
        calculatedAssetAAmount,
        calculatedAssetAAmountWithoutFee,
        calculatedAssetBAmount,
        calculatedAssetBAmountWithoutFee
    } = useCalculatedAssetAmounts(form, pool, tradeType);

    const slippage = useSlippage(
        tradeType,
        spotPrice,
        calculatedAssetAAmount,
        calculatedAssetBAmount
    )
    
    useApplyAllowedSlippage(form, slippage, tradeType)
    
    // show all the asset options
    const assetOptions = useCallback((withoutAssetId: string | undefined) => {
        return <>
            {assets
                ?.assets
                .filter(asset => asset.id !== withoutAssetId)
                .map(asset => (
                    <option key={asset.id} value={`${asset.id}`}>{asset.id}</option>
                ))
            }
        </>
    }, [assets]);

    return <div>
        {assetsLoading
            ? <i>[TradeForm] Loading assets...</i>
            : <i>[TradeForm] Everything is up to date</i>
        }

        <br /><br />

        <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div>
                <div>
                    <label><b>(Pay with) Asset A: </b></label>
                    <select
                        {...register('assetAId', {
                            required: true
                        })}
                    >
                        {assetOptions(getValues('assetBId'))}
                    </select>
                </div>
                <div>
                    <div>
                        <input
                            type="text"
                            width={100}
                            style={{
                                width: '100%',
                                marginTop: '12px',
                                marginBottom: '24px'
                            }}
                            {...register('assetAAmount', {
                                required: true
                            })}
                            onInput={onAssetAAmountInput}
                        />
                    </div>
                </div>
            </div>
            <div>
                <label><b>(You get) Asset B: </b></label>
                <select
                    {...register('assetBId', {
                        required: true
                    })}
                >
                    {assetOptions(getValues('assetAId'))}
                </select>
            </div>
            <div>
                <input
                    type="text"
                    width={100}
                    style={{
                        width: '100%',
                        marginTop: '12px',
                        marginBottom: '24px'
                    }}
                    {...register('assetBAmount', {
                        required: true
                    })}
                    onInput={onAssetBAmountInput}
                />
            </div>
            <div>
                <label><b>(%) Slippage: </b></label>
            </div>
            <div>
                <input
                    type="text"
                    width={100}
                    style={{
                        width: '100%',
                        marginTop: '12px',
                        marginBottom: '24px'
                    }}
                    {...register('allowedSlippage', {
                        required: true
                    })}
                />
            </div>
            <button
                type='submit'
                style={{
                    width: '100%',
                }}
            >Trade</button>

            <br /><br />

            <div>
                <p><b>Trade type:</b> {tradeType}</p>
                <div>
                    {!pool
                        ? <b>Pool does not exist</b>
                        : <div>
                            <p><b>Pool Id:</b> {pool?.id}</p>
                            <p><b>Pool type:</b> {pool?.__typename}</p>
                            <p><b>Liquidity Asset A:</b> {fromPrecision12(liquidity.assetA.balance)}</p>
                            <p><b>Liquidity Asset B:</b> {fromPrecision12(liquidity.assetB.balance)}</p>
                            <p><b>Spot prices:</b>
                                <br/>
                                <span>1 B = {fromPrecision12(spotPrice.aToB)} A</span>
                                <br/>
                                <span>1 A = {fromPrecision12(spotPrice.bToA)} B</span>
                            </p>
                            <p>
                                <b>Slippage ({tradeType}): </b> 
                                {slippage 
                                    ? `${slippage.percentualSlippage}% / ${fromPrecision12(slippage.spotPriceAmount)}`
                                    : '-'
                                }
                            </p>
                            <p>
                                <b>Calculated amount with slippage: </b> 
                                {fromPrecision12(form.getValues('amountWithSlippage'))}
                            </p>

                            <p>
                                <b>Calculated amount without fee (A/B): </b> 
                                {`${fromPrecision12(calculatedAssetAAmountWithoutFee)} / ${fromPrecision12(calculatedAssetBAmountWithoutFee)}`}
                            </p>
                        </div>
                    }
                </div>
            </div>
        </form>
    </div>
}
