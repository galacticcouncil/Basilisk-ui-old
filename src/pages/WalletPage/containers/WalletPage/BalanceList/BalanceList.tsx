import { Balance } from "../../../../../generated/graphql"
import { FormattedBalance } from "../../../../../components/Balance/FormattedBalance/FormattedBalance"
import { idToAsset } from "../../../../TradePage/TradePage"
import { horizontalBar } from "../../../../../components/Chart/ChartHeader/ChartHeader"

export const BalanceList = ({
    balances,
    onOpenTransferForm
  }: {
    balances?: Array<Balance>,
    onOpenTransferForm: () => void,
  }) => {
    return <>
      <h2>Balances</h2>
      {/* TODO: ordere by assetId? */}
      {balances?.map(balance => (
        <div>
          <h5>{idToAsset(balance.assetId || null)?.fullName || `Unknown asset (ID: ${balance.assetId})`}</h5>
          <div>
            {/* TODO: how to deal with unknown assets? (not knowing the metadata e.g. symbol/fullname) */}
            <FormattedBalance balance={balance} />
          </div>
          <div onClick={() => onOpenTransferForm()}>Transfer</div>
        </div>
      ))}
    </>
  }