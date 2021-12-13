import { useCallback } from 'react';
import { 
    TradeForm as TradeFormComponent, 
    TradeFormProps as TradeFormComponentProps 
} from '../../../components/Trade/TradeForm/TradeForm';
import { SubmitTradeMutationVariables, useSubmitTradeMutation } from '../../../hooks/pools/mutations/useSubmitTradeMutation';

export type TradeFormProps = Omit<TradeFormComponentProps, 'onTradeSubmit'>;

export const TradeForm = (args: TradeFormProps) => {
    const [submitTrade] = useSubmitTradeMutation();
    const onTradeSubmit = useCallback((variables: SubmitTradeMutationVariables) => {
        submitTrade({ variables })
    }, []);

    return <TradeFormComponent 
        {...args}
        onTradeSubmit={onTradeSubmit}
    />
}