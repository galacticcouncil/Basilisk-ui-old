import log from 'loglevel';
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TradeFormProps } from '../TradeForm';
import { TradeFormFields } from './useTradeForm';

/**
 * Inform parent components about asset ID changes in the form
 * @param form 
 * @param onAssetIdsChange 
 */
 export const useHandleAssetIdsChange = (
    form: UseFormReturn<TradeFormFields>,
    onAssetIdsChange: TradeFormProps['onAssetIdsChange']
) => {
    const [assetInId, assetOutId] = form.watch(['assetInId', 'assetOutId']);
    useEffect(() => {
        log.debug('TradeForm.useHandleAssetIdsChange', assetInId, assetOutId);
        onAssetIdsChange(assetInId, assetOutId);
    }, [assetInId, assetOutId]);
}