import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table'
import { FormattedBalance } from '../../../../../components/Balance/FormattedBalance/FormattedBalance'
import { Balance, Maybe } from '../../../../../generated/graphql'
import { idToAsset } from '../../../../../misc/idToAsset'
import './BalanceList.scss'

export const availableFeePaymentAssetIds = ['0', '4', '5']

export const BalanceList = ({
  balances,
  onOpenTransferForm,
  onSetAsFeePaymentAsset,
  feePaymentAssetId
}: {
  balances?: Array<Balance>
  feePaymentAssetId?: Maybe<string>
  onOpenTransferForm: (assetId: string, balance: string) => void
  onSetAsFeePaymentAsset: (assetId: string) => void
}) => {
  return (
    <Table>
      <div className="balance-list">
        <h2 className="balance-list__title">Balance</h2>
        <Thead>
          <Tr className="balance-list-wrapper active-account-wrapper-header">
            <Th className="item">Asset Name</Th>
            <Th className="item">Balance</Th>
            <Th className="item balance-list-actions"></Th>
          </Tr>
        </Thead>

        {/* TODO: ordere by assetId? */}
        {balances?.map((balance) => (
          <Tbody>
            <Tr className="balance-list-wrapper">
              <Td className="item">
                <div>
                  {idToAsset(balance.assetId || null)?.fullName ||
                    `Unknown asset (ID: ${balance.assetId})`}
                </div>

                {feePaymentAssetId === balance.assetId ? (
                  <div>fee asset</div>
                ) : (
                  ''
                )}
              </Td>

              <Td className="item">
                {/* TODO: how to deal with unknown assets? (not knowing the metadata e.g. symbol/fullname) */}
                <FormattedBalance balance={balance} />
              </Td>
              <Td className="item balance-list-actions">
                {availableFeePaymentAssetIds.includes(balance.assetId) ? (
                  <button
                    className="balance-list-button"
                    onClick={() => onSetAsFeePaymentAsset(balance.assetId)}
                  >
                    <div className="balance-list-button__label">
                      Set as fee asset
                    </div>
                  </button>
                ) : (
                  <></>
                )}
                <button
                  className="balance-list-button"
                  onClick={() =>
                    onOpenTransferForm(balance.assetId, balance.balance)
                  }
                >
                  <div className="balance-list-button__label">Transfer</div>
                </button>
              </Td>
            </Tr>
          </Tbody>
        ))}
      </div>
    </Table>
  )
}
