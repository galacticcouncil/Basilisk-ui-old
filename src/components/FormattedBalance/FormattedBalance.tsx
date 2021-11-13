import { FormattedNumber } from 'react-intl';

export interface FormattedBalanceProps {
  balance: string | undefined;
  symbol: string | undefined;
}

const horizontalBar = '―';

export const FormattedBalance = ({
    balance,
    symbol
}: FormattedBalanceProps) => {

return <div className='formatted-balance'>
    {/* TODO: add guards for symbol length */}
    {/* TODO: add abbreviations for spot price */}
    {balance
        ? (
            <>
                <FormattedNumber
                    // TODO: BIGNUMBER + SCALING
                    value={parseFloat(balance)}
                    style='decimal'
                    // notation={determineNotation(displayData.balance)}
                    minimumFractionDigits={1}
                    maximumFractionDigits={3}
                />
                {' '}
            </>
        )
        : `${horizontalBar} `}

    {symbol}
    </div>
}