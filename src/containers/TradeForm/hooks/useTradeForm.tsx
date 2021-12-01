import { useForm } from 'react-hook-form'
import { TradeFormProps } from '../TradeForm'

export interface TradeFormFields {
    assetInId: string,
    assetOutId?: string,
    assetInAmount?: string,
    assetOutAmount?: string,
    allowedSlippage: string,
    autoSlippage: boolean,
}


/**
 * Define fields for the TradeForm
 * @param param0 
 * @returns 
 */
 export const useTradeForm = ({ assetInId, assetOutId }: TradeFormProps['assetIds']) => {
    return useForm<TradeFormFields>({
        defaultValues: {
            assetInId,
            assetOutId,
            assetInAmount: '0',
            assetOutAmount: '0',
            allowedSlippage: '5',
            autoSlippage: true,
        }
    })
}