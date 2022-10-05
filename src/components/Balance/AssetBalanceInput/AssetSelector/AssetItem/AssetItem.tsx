import { Asset } from '../../../../../generated/graphql'
import classNames from 'classnames'
import { idToAsset } from '../../../../../misc/idToAsset'
import { horizontalBar } from '../../../../Chart/ChartHeader/ChartHeader'
import Unknown from '../../../../../misc/icons/assets/Unknown.svg'
export interface AssetItemProps {
  asset: string
  onClick: () => void
  active: boolean
}

export const AssetItem = ({ asset, onClick, active }: AssetItemProps) => (
  <div
    className={
      'asset-selector__asset-item ' +
      classNames({
        active: active
      })
    }
    onClick={onClick}
  >
    <div className="asset-balance-input__asset-info">
      <div
        className="asset-icon"
        style={{
          backgroundImage: `url('${idToAsset(asset)?.icon || Unknown}')`
        }}
      />
      <div className="asset-balance-input__asset-info__names">
        <div className="asset-balance-input__asset-info__names__full-name">
          {idToAsset(asset)?.fullName}
        </div>
        <div className="asset-balance-input__asset-info__names__ticker">
          {idToAsset(asset)?.symbol}
        </div>
      </div>
    </div>
  </div>
)
