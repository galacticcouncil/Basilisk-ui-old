import './TradeChartError.scss';

export enum TradeChartErrorType {
  InvalidPair = 'InvalidPair',
  Loading = 'Loading',
  Unexpected = 'Unexpected',
}
export const TradeChartError = ({ type }: { type: TradeChartErrorType }) => {
  return (
    <div className="trade-chart-error">
      {(() => {
        switch (type) {
          case TradeChartErrorType.InvalidPair:
            return (
              <div className="row">
                <div className="large">
                  Graph unavailable, please select <br /> a valid asset pair
                </div>
                <div className="small">
                  You can read our FAQ to learn more about valid asset pairs.
                </div>
              </div>
            );
            case TradeChartErrorType.Loading:
              return (
                <div className="row">
                  <div className="large">
                    Loading chart data,
                    <br/> this shouldn't take too long.
                  </div>

                  <div className="small">
                    Thanks for being a patient snek.
                  </div>

                </div>
              );
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
            );
        }
      })()}
    </div>
  );
};
