import log from 'loglevel'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { usePreviousDistinct } from 'react-use'
import { PoolType } from '../../Chart/shared'
import { TokenInput } from '../../Input/TokenInput'
import { Pool, TradeType } from '../../../generated/graphql'
import { useSubmitTradeMutation } from '../../../hooks/pools/mutations/useSubmitTradeMutation'
import { calculateOutGivenInFromPool as calculateOutGivenInFromPoolXYK } from '../../../hooks/pools/xyk/calculateOutGivenIn'
import { calculateOutGivenInFromPool as calculateOutGivenInFromPoolLBP } from '../../../hooks/pools/lbp/calculateOutGivenIn'
import { useMathContext } from '../../../hooks/math/useMath'
import { fromPrecision12 } from '../../../hooks/math/useFromPrecision'
import { toPrecision12 } from '../../../hooks/math/useToPrecision'
import { calculateInGivenOutFromPool as calculateInGivenOutFromPoolLBP } from '../../../hooks/pools/lbp/calculateInGivenOut'
import { calculateInGivenOutFromPool as calculateInGivenOutFromPoolXYK } from '../../../hooks/pools/xyk/calculateInGivenOut'
import { SpotPrice } from '../../../pages/TradePage/TradePage'
import { useTradeForm } from './hooks/useTradeForm'
import { useListenForInput } from './hooks/useListenForInput'
import { useTradeType } from './hooks/useTradeType'
import { useHandleAssetIdsChange } from './hooks/useHandleAssetIdsChange'
import { useHandleSubmit } from './hooks/useHandleSubmit';
import { poolHasAssets } from '../../../hooks/pools/poolHasAssets'
import { useCalculateInAndOut } from './hooks/useCalculateInAndOut'
import { useSlippage } from './hooks/useSlippage'
import { isEqual } from 'lodash'
import { useResetAmountInputsOnPoolChange } from './hooks/useResetAmountInputsOnPoolChange'
import { useCalculateAllowedSlippage } from './hooks/useCalculateAllowedSlippage'
import { usePercentageFee } from './hooks/usePercentageFee'

export interface TradeFormProps {
    pool?: Pool,
    loading: boolean,
    assetIds: {
        assetInId: string,
        assetOutId?: string
    },
    spotPrice?: SpotPrice,
    onAssetIdsChange: (assetInId: string, assetOutId?: string) => void
}

export const TradeForm = ({
    pool,
    loading,
    onAssetIdsChange,
    assetIds,
    spotPrice
}: TradeFormProps) => {
    const form = useTradeForm(assetIds);
    const fee = usePercentageFee(pool);
    const tradeType = useTradeType(form);
    useHandleAssetIdsChange(form, onAssetIdsChange);
    useCalculateInAndOut(form, tradeType, pool);
    useResetAmountInputsOnPoolChange(form, pool);

    // TODO: adjust the precision in the hook itself?
    const slippage = useSlippage(tradeType, spotPrice, 
        toPrecision12(form.getValues('assetInAmount')),
        toPrecision12(form.getValues('assetOutAmount'))
    );

    const handleSubmit = useHandleSubmit(
        tradeType, 
        form.getValues('allowedSlippage'), 
        slippage, 
        pool
    );

    const { allowedSlippageInputDisabled } = useCalculateAllowedSlippage(form, pool);

    return <div>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
            <p>{tradeType}</p>
            <TokenInput
                assetIdInputProps={form.register('assetInId')}
                assetAmountInputProps={form.register('assetInAmount')}
            />

            <br/>

            <TokenInput
                assetIdInputProps={form.register('assetOutId')}
                assetAmountInputProps={form.register('assetOutAmount')}
            />

            <div>
                <b>Allowed slippage</b><br/>
                <input 
                    type="text"
                    disabled={allowedSlippageInputDisabled}
                    {...form.register('allowedSlippage')}
                />
                <br/>
                <b>Auto slippage</b> 
                <input type="checkbox" {...form.register('autoSlippage')}/>
            </div>

            <br/>

            <p>
                <b>Slippage:</b> {slippage?.percentualSlippage} / {fromPrecision12(slippage?.spotPriceAmount)}
            </p>
            <p>
                <b>Fee:</b> {fee}%
            </p>

            <button
                disabled={loading}
                type='submit'
            >
                Trade
            </button>
        </form>
    </div>
}