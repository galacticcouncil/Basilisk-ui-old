import { useForm } from 'react-hook-form'
import { TradeFormFields, TradeFormProps } from '../TradeForm'

/**
 * Define fields for the TradeForm
 * @param param0 
 * @returns 
 */
 export const useTradeForm = ({ assetAId, assetBId }: TradeFormProps['assetIds']) => {
    return useForm<TradeFormFields>({
        defaultValues: {
            assetAId,
            assetBId,
            assetAAmount: '0',
            assetBAmount: '0',
            allowedSlippage: '5',
        }
    })
}