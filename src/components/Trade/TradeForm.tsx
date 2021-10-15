import { AssetPair } from '../Chart/shared';
import { TradeChart } from '../Chart/TradeChart/TradeChart'
import { TokenInput } from '../Input/TokenInput';
import './TradeForm.scss';


export const TradeForm = ({
    assetPair
}: {
    assetPair: AssetPair
}) => {

    return <div className="row p-5 g-0 trade-form">
        <div className="col-12">
            <span className='trade-form__title'>Pay With</span>
            <TokenInput asset={assetPair.assetA!}/>
        </div>
        <div className="col-12">
            <span className='trade-form__title'>You Get</span>
            <TokenInput 
                asset={assetPair.assetB!}
                slippage={7.5}
            />
        </div>
    </div>
}