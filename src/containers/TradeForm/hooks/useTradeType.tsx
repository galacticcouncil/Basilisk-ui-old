import log from 'loglevel';
import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TradeType } from '../../../generated/graphql';
import { TradeFormFields } from '../TradeForm';
import { useListenForInput } from './useListenForInput';

/**
 * Listen to changes to inputs within the trade form, and set the trade type
 * according to which input field has been interacted with last
 * @param form 
 * @returns 
 */
 export const useTradeType = (form: UseFormReturn<TradeFormFields>) => {
    const [tradeType, setTradeType] = useState<TradeType>(TradeType.Sell);
    
    const watchAssetAAmount = useListenForInput(form, 'assetAAmount');
    const watchAassetAId = useListenForInput(form, 'assetAId');

    const watchAassetBAmount = useListenForInput(form, 'assetBAmount');
    const watchAassetBId = useListenForInput(form, 'assetBId');

    useEffect(() => { 
        log.debug('TradeForm.setTradeType', TradeType.Sell)
        setTradeType(TradeType.Sell) 
    }, [watchAssetAAmount, watchAassetAId]);

    useEffect(() => {
        log.debug('TradeForm.setTradeType', TradeType.Buy)
        setTradeType(TradeType.Buy) 
    }, [watchAassetBAmount, watchAassetBId]);

    return tradeType;
}