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
        {error
            ? 'error'
            : 'test'
        }
        <p>trade info</p>
    </>
}