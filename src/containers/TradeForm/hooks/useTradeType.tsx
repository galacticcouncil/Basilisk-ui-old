import log from 'loglevel';
import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TradeType } from '../../../generated/graphql';
import { useListenForInput } from './useListenForInput';
import { TradeFormFields } from './useTradeForm';

/**
 * Listen to changes to inputs within the trade form, and set the trade type
 * according to which input field has been interacted with last
 * @param form 
 * @returns 
 */
 export const useTradeType = (form: UseFormReturn<TradeFormFields>) => {
    const [tradeType, setTradeType] = useState<TradeType>(TradeType.Sell);
    
    const watchassetInAmount = useListenForInput(form, 'assetInAmount');
    const watchAassetInId = useListenForInput(form, 'assetInId');

    const watchAassetOutAmount = useListenForInput(form, 'assetOutAmount');
    const watchAassetOutId = useListenForInput(form, 'assetOutId');

    useEffect(() => { 
        log.debug('TradeForm.setTradeType', TradeType.Sell)
        setTradeType(TradeType.Sell) 
    }, [watchassetInAmount, watchAassetInId]);

    useEffect(() => {
        log.debug('TradeForm.setTradeType', TradeType.Buy)
        setTradeType(TradeType.Buy) 
    }, [watchAassetOutAmount, watchAassetOutId]);

    return tradeType;
}