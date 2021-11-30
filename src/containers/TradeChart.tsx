import { fromPrecision12 } from '../hooks/math/useFromPrecision'
import { SpotPrice } from '../pages/TradePage/TradePage'

export interface PoolLiquidity {
    assetABalance?: string,
    assetBBalance?: string,
}
export interface TradeChartProps {
    spotPrice?: SpotPrice,
    poolLiquidity: PoolLiquidity
}
export const TradeChart = ({ spotPrice, poolLiquidity }: TradeChartProps) => {
    return <div>
        <p>TradeChart</p>
        <div>
            <b>Spot price</b><br/>
            <span>1 A = {fromPrecision12(spotPrice?.aToB)}B</span><br/>
            <span>1 B = {fromPrecision12(spotPrice?.bToA)}A</span>
            
            <br/><br/>

            <b>Pool liquidity</b><br/>
            <span>A = {fromPrecision12(poolLiquidity.assetABalance)}</span><br/>
            <span>B = {fromPrecision12(poolLiquidity.assetBBalance)}</span>

            <br/><br/>
        </div>
    </div>
}