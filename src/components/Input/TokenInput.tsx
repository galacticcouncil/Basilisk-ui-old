import { Asset } from '../Chart/shared'
import './TokenInput.scss'
import '@fortawesome/fontawesome-free';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CurrencyInput from 'react-currency-input-field';
import { FormattedNumber } from 'react-intl'
import { useCallback } from 'react';


export const TokenInput = ({
    asset,
    slippage,
    value,
    onValueChange
}: {
    asset: Asset,
    slippage?: number,
    value: number,
    onValueChange?: (value: number) => void
}) => {
    
    // TODO: this is probably really bad and should be handled as a string always
    const handleValueChange = useCallback((value: string) => onValueChange && onValueChange(parseInt(value)), []);
    
    return <div className="container-fluid p-0 token-input">
        <div className="row p-0 g-0 align-items-stretch justify-content-between">
            <div className="col-auto token-input__selector">
                <div className="row p-0 g-0 h-100">
                    <div className="col-auto align-self-center">
                        <div className="row p-0 g-0 align-items-center">
                            <div className="col-auto token-input__selector__asset-icon">
                                <img src={asset.icon} />
                            </div>
                            <div className="col token-input__selector__asset-symbol">
                                {asset.symbol}
                            </div>
                            <div className="col-auto token-input__selector__chevron">
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col token-input__input">
                <div className="row p-0 g-0">
                    <div className="col ">
                        <div className="token-input__input__granularity">
                            <FontAwesomeIcon
                                icon={faChevronDown}
                            />
                            <span>micro {asset.symbol}</span>
                        </div>
                        <CurrencyInput
                            className="token-input__input__currency-input"
                            placeholder="0"
                            decimalsLimit={6}
                            value={value}
                            onValueChange={handleValueChange}
                            size={5}
                        />
                        <div className="token-input__input__details">
                            <span className="token-input__input__details__usd-balance">
                                ~<FormattedNumber
                                    value={3200.567}
                                    style='currency'
                                    currency='USD'
                                    // notation={determineNotation(displayData.balance)}
                                    minimumFractionDigits={2}
                                    maximumFractionDigits={2}
                                />
                            </span>

                            {slippage
                                ? <>
                                    {' '}
                                    <span className="token-input__input__details__slippage">
                                        (-{slippage}%)
                                    </span>
                                </>
                                : <></>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}