import { first, isEqual, nth } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pool, TradeType } from '../generated/graphql';
import { useGetAssetsQuery } from '../hooks/assets/queries/useGetAssetsQuery';
import { useGetPoolByAssetsQuery } from '../hooks/pools/queries/useGetPoolByAssetsQuery';
import { useForm } from 'react-hook-form';
import { useSubmitTradeMutation } from '../hooks/pools/mutations/useSubmitTradeMutation';
import { PoolType } from '../components/Chart/shared';
import { usePolkadotJsContext } from '../hooks/polkadotJs/usePolkadotJs';
import { useGetActiveAccountQuery } from '../hooks/accounts/queries/useGetActiveAccountQuery';
import { Event } from '@polkadot/types/interfaces';

export const TradeForm = ({
    onAssetIdsChange,
    pool
}: {
    onAssetIdsChange: (assetAId: string, assetBId: string) => void,
    pool?: Pool
}) => {
    const { register, handleSubmit, watch, formState: { errors }, getValues, setValue, trigger, reset } = useForm<any, any>({
        defaultValues: {
            assetAAmount: '0',
            assetBAmount: '0'
        }
    });

    const { data: activeAccountData } = useGetActiveAccountQuery();
    console.log('active account data', activeAccountData);

    // TODO: extract hook
    const [wasm, setWasm] = useState<any>();
    useEffect(() => {
        (async () => {
            setWasm(await import('hydra-dx-wasm/build/xyk/bundler'))
        })();
    }, []);

    const spotPriceAmount = useMemo(() => {
        const assetABalance = first(
            pool?.balances
                ?.filter(balance => balance.assetId === getValues('assetAId'))
        )?.balance

        const assetBBalance = first(
            pool?.balances
                ?.filter(balance => balance.assetId === getValues('assetBId'))
        )?.balance

        if (!assetABalance || !assetBBalance || !wasm) return;

        return wasm.get_spot_price(
            assetABalance,
            assetBBalance,
            '1000000000000'
        );
    }, [wasm, pool])

    const calculatedAssetAAmount = useMemo(() => {
        const assetABalance = first(
            pool?.balances
                ?.filter(balance => balance.assetId === getValues('assetAId'))
        )?.balance

        const assetBBalance = first(
            pool?.balances
                ?.filter(balance => balance.assetId === getValues('assetBId'))
        )?.balance

        if (!assetABalance || !assetBBalance || !wasm) return;
        
        return wasm.calculate_in_given_out(
            assetABalance,
            assetBBalance,
            getValues('assetBAmount')
        );
    }, [getValues, wasm, pool, getValues('assetBAmount')]);

    useEffect(() => {
        setValue('assetAAmount', calculatedAssetAAmount);
    }, [calculatedAssetAAmount]);

    const { apiInstance, loading } = usePolkadotJsContext();

    

    const isForActiveAccount = useRef<any>();

    useEffect(() => {
        isForActiveAccount.current = (address: string) => {
            return address === activeAccountData?.account?.id;
        }
    }, [activeAccountData])

    const subscribeToEvents = useCallback(() => {
        if (!apiInstance || loading) return;

        apiInstance.query.system.events((events) => {
            const relevantEvents: Event[] = [];
            // filter out events for our account
            events.forEach(({ event }) => {
                const eventId = `${event.section}.${event.method}`;
                console.log('eventId', eventId);
                if (eventId === 'system.ExtrinsicFailed') {
                    console.log('system.ExtrinsicFailed', event.data);
                }
                if (eventId === 'exchange.IntentionResolveErrorEvent') {
                    const accountId = event.data[0];
                    if (isForActiveAccount && isForActiveAccount.current(accountId.toHuman() as string)) {
                        relevantEvents.push(event);
                    }
                }
            });

            console.log('relevant events', relevantEvents)
            relevantEvents.forEach(event => {
                const eventId = `${event.section}.${event.method}`;
                console.log(eventId);
                if (eventId === 'exchange.IntentionResolveErrorEvent') {
                    console.error('oops, something went wrong with your trade');
                    console.log('event data', event.data);
                }
            })
        })
    }, [apiInstance, loading])

    
    useEffect(() => {
        if (activeAccountData) return;
        subscribeToEvents()
    }, [activeAccountData]);

    const [submitTrade, { loading: submitTradeLoading }] = useSubmitTradeMutation();

    const [tradeType, setTradeType] = useState<TradeType>(TradeType.Sell);

    // should actually use the network status instead
    const { data: assetsData, loading: assetsLoading } = useGetAssetsQuery();

    const [assetAId, assetAAmount] = watch(['assetAId', 'assetAAmount']);
    const [assetBId, assetBAmount] = watch(['assetBId', 'assetBAmount']);

    // useEffect(() => { setTradeType(TradeType.Sell) }, [assetAId, assetAAmount]);
    // useEffect(() => { setTradeType(TradeType.Buy) }, [assetBId, assetBAmount]);

    const onAssetAAmountInput = () => {
        // setTradeType(TradeType.Sell)
    }
    const onAssetBAmountInput = () => setTradeType(TradeType.Buy)


    useEffect(() => {
        onAssetIdsChange(assetAId, assetBId);
    }, [assetAId, assetBId]);

    useEffect(() => {
        if (assetsLoading) return;
        setValue('assetAId', '0');
        setValue('assetBId', '1');
    }, [assetsLoading])

    const onSubmit = (data: any) => {
        console.log('submitting trade', {
            assetAId: data.assetAId,
            assetBId: data.assetBId,
            assetAAmount: data.assetAAmount,
            assetBAmount: data.assetBAmount,
            tradeType,
            poolType: pool?.__typename === 'XYKPool' ? PoolType.XYK : PoolType.LBP
        });
        submitTrade({
            variables: {
                assetAId: data.assetAId,
                assetBId: data.assetBId,
                assetAAmount: data.assetAAmount,
                assetBAmount: data.assetBAmount,
                tradeType,
                poolType: pool?.__typename === 'XYKPool' ? PoolType.XYK : PoolType.LBP
            }
        })
    }

    const assetOptions = useCallback((withoutAssetId: string | undefined) => {
        return <>
            {assetsData
                ?.assets
                .filter(asset => asset.id !== withoutAssetId)
                .map(asset => (
                    <option key={asset.id} value={`${asset.id}`}>{asset.id}</option>
                ))
            }
        </>
    }, [assetsData]);

    return <div>
        {assetsLoading
            ? <i>[TradeForm] Loading assets...</i>
            : <i>[TradeForm] Everything is up to date</i>
        }
        
        <br/><br/>

        <form onSubmit={handleSubmit(onSubmit)}>
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
            <button 
                type='submit'
                style={{
                    width: '100%',
                }}
                disabled={submitTradeLoading}
            >Trade</button>

            <br /><br />

            <div>
                <p><b>Trade type:</b> {tradeType}</p>
                <div>
                    {!pool
                        ? <b>Pool does not exist</b>
                        : <div>
                            <p><b>Pool type:</b> {pool?.__typename}</p>
                            <p><b>Liquidity Asset {nth(pool?.balances, 0)?.assetId}:</b> {nth(pool?.balances, 0)?.balance}</p>
                            <p><b>Liquidity Asset {nth(pool?.balances, 1)?.assetId}:</b> {nth(pool?.balances, 1)?.balance}</p>
                            <p><b>Spot price:</b> {spotPriceAmount}</p>
                        </div>
                    }
                </div>
            </div>
        </form>
    </div>
}

export const TradePage = () => {
    const [assetIds, setAssetIds] = useState<{
        assetAId: undefined | string,
        assetBId: undefined | string
    }>({
        assetAId: undefined,
        assetBId: undefined
    })

    const { data: poolData, loading } = useGetPoolByAssetsQuery(assetIds);

    const handleAssetIdsChange = (assetAId: string, assetBId: string) => {
        const newIds = { assetAId, assetBId };
        if (isEqual(assetIds, newIds)) return;
        setAssetIds(newIds)
    }

    return <div>
        <h1>Trade</h1>

        {loading
            ? <i>[TradePage] Loading pools...</i>
            : <i>[TradePage] Pools are up to date</i>
        }

        <br/><br/>

        <TradeForm 
            onAssetIdsChange={handleAssetIdsChange} 
            pool={poolData?.pool}
        />
    </div>
}