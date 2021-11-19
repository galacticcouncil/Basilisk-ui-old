import { isEqual, nth } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { Pool } from '../generated/graphql';
import { useGetAssetsQuery } from '../hooks/assets/queries/useGetAssetsQuery';
import { useGetPoolByAssetsQuery } from '../hooks/pools/queries/useGetPoolByAssetsQuery';
import { useForm } from 'react-hook-form';

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

    const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');

    // should actually use the network status instead
    const { data: assetsData, loading: assetsLoading } = useGetAssetsQuery();

    const [assetAId, assetAAmount] = watch(['assetAId', 'assetAAmount']);
    const [assetBId, assetBAmount] = watch(['assetBId', 'assetBAmount']);

    useEffect(() => { setTradeType('buy') }, [assetAId, assetAAmount]);
    useEffect(() => { setTradeType('sell') }, [assetBId, assetBAmount]);

    useEffect(() => {
        onAssetIdsChange(assetAId, assetBId);
    }, [assetAId, assetBId]);

    useEffect(() => {
        if (assetsLoading) return;
        setValue('assetAId', '0');
        setValue('assetBId', '1');
    }, [assetsLoading])

    const onSubmit = (data: any) => console.log('submitted yay', data);

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
                    <label><b>Asset A: </b></label>
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
                        />
                    </div>
                </div>
            </div>
            <div>
                <label><b>Asset B: </b></label>
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
                            <p><b>Pool type:</b> {pool?.__typename}</p>
                            <p><b>Liquidity {nth(pool?.balances, 0)?.assetId}:</b> {nth(pool?.balances, 0)?.balance}</p>
                            <p><b>Liquidity {nth(pool?.balances, 1)?.assetId}:</b> {nth(pool?.balances, 1)?.balance}</p>
                            <p><b>Spot price:</b> TODO</p>
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
            : <i>[TradePage] Eveyrything are up to date</i>
        }

        <br/><br/>

        <TradeForm 
            onAssetIdsChange={handleAssetIdsChange} 
            pool={poolData?.pool}
        />
    </div>
}