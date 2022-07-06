import { Balance, Maybe } from "../../../../../generated/graphql"
import { FormattedBalance } from "../../../../../components/Balance/FormattedBalance/FormattedBalance"
import { idToAsset } from "../../../../TradePage/TradePage"
import { horizontalBar } from "../../../../../components/Chart/ChartHeader/ChartHeader"

export const availableFeePaymentAssetIds = ['0', '1', '2'];

export const BalanceList = ({
    balances,
    onOpenTransferForm,
    onSetAsFeePaymentAsset,
    feePaymentAssetId
  }: {
    balances?: Array<Balance>,
    feePaymentAssetId?: Maybe<string>,
    onOpenTransferForm: (assetId: string) => void,
    onSetAsFeePaymentAsset: (assetId: string) => void
  }) => {
    return <>
      <h2>Balances</h2>
      {/* TODO: ordere by assetId? */}
      {balances?.map(balance => (
        <div>
          <h5>{idToAsset(balance.assetId || null)?.fullName || `Unknown asset (ID: ${balance.assetId})`}</h5>
          <span>{feePaymentAssetId === balance.assetId ? 'current fee payment asset' : ''}</span>
          <div>
            {/* TODO: how to deal with unknown assets? (not knowing the metadata e.g. symbol/fullname) */}
            <FormattedBalance balance={balance} />
          </div>
          <button onClick={() => onOpenTransferForm(balance.assetId)}>Transfer</button>
          {availableFeePaymentAssetIds.includes(balance.assetId)
            ? <button onClick={() => onSetAsFeePaymentAsset(balance.assetId)}>Set as fee payment asset</button>
            : <></>
          }

        </div>
      ))}
    </>
  }