import { DisplayData } from "../Chart/shared";
import { FormattedBalance } from "../FormattedBalance/FormattedBalance";
import './AppBar.scss'

export interface AppBarProps {
    balance: DisplayData
};

export const AppBar = ({
    balance
}: AppBarProps) => {
    return (
        <div className="app-bar">
            <div className="app-bar-help">?</div>
            <div className="app-bar-notifications">!</div>
            <div className="app-bar-balance">
                <FormattedBalance
                    balance={balance.balance}
                    symbol={balance.asset.symbol}
                />
                <FormattedBalance
                    balance={balance.usdBalance}
                    symbol="USD"
                />
            </div>
            <div className="app-bar-account">(---) 
                <div className="account-name">Alice has account</div>
            </div>
            <div className="app-bar-settings">v</div>
        </div>
    );
};