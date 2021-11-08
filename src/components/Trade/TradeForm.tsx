import { AssetPair } from '../Chart/shared';
import { TradeChart } from '../Chart/TradeChart/TradeChart'
import { TokenInput } from '../Input/TokenInput';
import { Button, ButtonKind } from '../Button/Button';
import './TradeForm.scss';
import { useEffect, useState } from 'react';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export interface TradeFormProps {
    assetPair: AssetPair,
    spotPrice: number,
    onAssetPairSwitch: () => void
}

export const TradeForm = ({
    assetPair,
    spotPrice,
    onAssetPairSwitch,
}: TradeFormProps) => {
    const [tradeForm, setTradeForm] = useState({
        assetA: { value: '0' },
        assetB: { value: '0' }
    })

    const handleAssetAValueChange = (value: string) => setTradeForm({
        assetB: {
            value: `${parseFloat(value) / 2}`
        },
        assetA: { value }
    });
    const handleAssetBValueChange = (value: string) => setTradeForm({
        assetA: {
            value: `${parseFloat(value) * 2}`
        },
        assetB: { value }
    });

    return <div className="row p-5 g-0 justify-content-between flex-column trade-form">
        <div className="col-auto">
            <span className='trade-form__title'>Pay With</span>
            <TokenInput
                asset={assetPair.assetA}
                value={tradeForm.assetA.value}
                onValueChange={handleAssetAValueChange}
            />
        </div>
        <div className="col-auto flex-row trade-form__switcher">
            <div className="divider"></div>
            <div className="row justify-content-between">
                <div className="col-auto">
                    <div 
                        className="trade-form__switcher__switch-assets"
                        onClick={onAssetPairSwitch}
                    >
                        <FontAwesomeIcon icon={faExchangeAlt}/>
                    </div>
                </div>
                <div className="col-auto align-self-center">
                    <div className="trade-form__switcher__spot-price">
                        1 {assetPair.assetA.symbol} = {spotPrice} {assetPair.assetB?.symbol}
                    </div>
                </div>
            </div>
        </div>
        <div className="col-auto">
            <span className='trade-form__title'>You Get</span>
            <TokenInput
                // TODO: need state for no asset selected
                asset={assetPair.assetB!}
                value={tradeForm.assetB.value}
                onValueChange={handleAssetBValueChange}
            />
        </div>
        <div className="col-auto trade-form__action">
            <div className="divider"></div>
            <div className="row g-0 p-0 h-100">
                <div className="col-12 align-self-end text-center">
                    <span className="trade-form__trade-fee">
                        Trade fee = 0.03%
                    </span>
                    <Button kind={ButtonKind.Primary}>
                        SWAP NOW
                    </Button>
                </div>
            </div>
        </div>
    </div>
}