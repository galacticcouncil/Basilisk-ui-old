import './TradeChartError.scss'

export enum TradeChartErrorType {
  InvalidPair,
  Loading,
  NotInitialized,
  NotStarted,
  Unexpected,
  NotExists
}
export const TradeChartError = ({ type }: { type: TradeChartErrorType }) => {
  return (
    <div className="trade-chart-error">
      {(() => {
        switch (type) {
          case TradeChartErrorType.NotExists:
            return (
              <div className="row">
                <div className="large">
                  This pool doesn't exist <br />
                  please select different one
                </div>
                <div className="small">Sssory</div>
              </div>
            )
          case TradeChartErrorType.InvalidPair:
            return (
              <div className="row">
                <div className="large">
                  Chart is not available <br />
                  for this pair
                </div>
                <div className="small">Sssory</div>
              </div>
            )
          case TradeChartErrorType.NotStarted:
            return (
              <div className="row">
                <div className="large">Prepare</div>
                <div className="small">
                  Bootstrapping event will start shortly
                </div>
              </div>
            )
          case TradeChartErrorType.NotInitialized:
            return (
              <div className="row">
                <div className="large">You're early</div>
                <div className="small">
                  Please wait for the Bootstrapping event to start
                </div>
              </div>
            )
          case TradeChartErrorType.Loading:
            return (
              <div className="row">
                <div className="large">
                  Loading chart data,
                  <br /> this shouldn't take too long
                </div>

                <div className="small">Thanks for being a patient snek</div>
              </div>
            )
          default:
            return (
              <div className="row">
                <div className="large">
                  Oops, something went wrong.
                  <br />
                  Please try again.
                </div>
                <div className="small">
                  If this problem persists, please report an issue or talk to
                  our support team.
                </div>
              </div>
            )
        }
      })()}
    </div>
  )
}
