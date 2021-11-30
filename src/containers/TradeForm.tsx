import log from 'loglevel'
import { useEffect, useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { usePreviousDistinct } from 'react-use'
import { TokenInput } from '../components/Input/TokenInput'
import { Pool, TradeType } from '../generated/graphql'

export interface TradeFormProps {
    pool?: Pool,
    loading: boolean,
    onAssetIdsChange: (assetAId: string, assetBId?: string) => void
}

export interface TradeFormFields {
    assetAId: string,
    assetBId?: string,
    assetAAmount?: string,
    assetBAmount?: string,
    allowedSlippage: string,
}

export const useTradeForm = () => {
    return useForm<TradeFormFields>({
        defaultValues: {
            assetAAmount: '0',
            assetBAmount: '0',
            assetAId: '0',
            allowedSlippage: '5',
            assetBId: undefined
        }
    })
}

export const useTradeType = (form: UseFormReturn<TradeFormFields>) => {
    const [tradeType, setTradeType] = useState<TradeType>(TradeType.Sell);
    
    const watchAssetA = form.watch(['assetAAmount', 'assetAId']);
    const watchAssetB = form.watch(['assetBAmount', 'assetBId']);

    useEffect(() => { 
        log.debug('TradeForm.setTradeType', TradeType.Sell)
        setTradeType(TradeType.Sell) 
    }, watchAssetA);

    useEffect(() => {
        log.debug('TradeForm.setTradeType', TradeType.Buy)
        setTradeType(TradeType.Buy) 
    }, watchAssetB);

    return tradeType;
}


export const useHandleAssetIdsChange = (
    form: UseFormReturn<TradeFormFields>,
    onAssetIdsChange: TradeFormProps['onAssetIdsChange']
) => {
    const [assetAId, assetBId] = form.watch(['assetAId', 'assetBId']);
    useEffect(() => {
        log.debug('TradeForm.useHandleAssetIdsChange', assetAId, assetBId);
        onAssetIdsChange(assetAId, assetBId);
    }, [assetAId, assetBId]);
}

export const TradeForm = ({
    pool,
    loading,
    onAssetIdsChange
}: TradeFormProps) => {
    const form = useTradeForm();
    const tradeType = useTradeType(form);
    useHandleAssetIdsChange(form, onAssetIdsChange);

    return <div>
        <form onSubmit={form.handleSubmit(data => console.log('data', data))}>
            <TokenInput
                assetIdInputProps={form.register('assetAId')}
                assetAmountInputProps={form.register('assetAAmount')}
            />

            <br/>

            <TokenInput
                assetIdInputProps={form.register('assetBId')}
                assetAmountInputProps={form.register('assetBAmount')}
            />

            <br/>

            <button
                disabled={loading}
                type='submit'
            >
                Trade
            </button>
        </form>
    </div>
}