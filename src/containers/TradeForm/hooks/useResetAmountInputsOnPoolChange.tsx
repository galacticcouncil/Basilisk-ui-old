import { isEqual } from 'lodash';
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { usePreviousDistinct } from 'react-use';
import { Pool } from '../../../generated/graphql';
import { TradeFormFields } from '../TradeForm';

export const useResetAmountInputsOnPoolChange = (
    form: UseFormReturn<TradeFormFields>,
    pool?: Pool
) => {
    const previousPoolId = usePreviousDistinct(pool?.id);
    useEffect(() => {
        if (!isEqual(previousPoolId, pool?.id)) {
            form.resetField('assetAAmount');
            form.resetField('assetBAmount');
        }
    }, [previousPoolId, pool?.id])
}