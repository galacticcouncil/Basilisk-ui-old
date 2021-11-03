import './TradeChartError.scss';

export enum TradeChartErrorType {
    InvalidPair = 'InvalidPair',
    Unexpected = 'Unexpected'
}
export const TradeChartError = ({
    type
}: {
    type: TradeChartErrorType
}) => {
    return <div className="row g-0 trade-chart-error align-items-center">
        <div className="col-12">
        {(() => {
            switch (type) {
                case TradeChartErrorType.InvalidPair:
                    return <div className='row g-0'>
                        <span className='large'>Graph unavailable, please select <br/> a valid asset pair</span>
                        <span className="small">You can read our FAQ to learn more about valid asset pairs.</span>
                    </div>
                default: 
                    return <div className='row g-0'>
                        <span className='large'>Oops, something went wrong.<br/>Please try again.</span>
                        <span className="small">If this problem persists, please report an issue or talk to our support team.</span>
                    </div>
            }
        })()}
        </div>
    </div>
}