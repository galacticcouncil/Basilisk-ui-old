import log from 'loglevel';
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TradeFormFields, TradeFormProps } from '../TradeForm';

/**
 * Inform parent components about asset ID changes in the form
 * @param form 
 * @param onAssetIdsChange 
 */
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