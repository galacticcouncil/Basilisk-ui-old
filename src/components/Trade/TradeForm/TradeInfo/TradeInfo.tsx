import { Fee } from "../../../../generated/graphql"

export interface TradeInfoProps {
    transactionFee?: string,
    tradeFee?: Fee,
    tradeLimit?: string,
    expectedSlippage?: string,
    error?: string
}

export const TradeInfo = ({
    error
}: TradeInfoProps) => {
    return <>
        
        <p>trade info</p>
    </>
}