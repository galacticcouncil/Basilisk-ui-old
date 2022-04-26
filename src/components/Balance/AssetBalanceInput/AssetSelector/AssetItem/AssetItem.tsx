import { Asset } from '../../../../../generated/graphql';
import classNames from 'classnames';
import { idToAsset } from '../../../../../pages/TradePage/TradePage';
export interface AssetItemProps {
  asset: Asset;
  onClick: () => void;
  active: boolean;
}

export const AssetItem = ({ asset, onClick, active }: AssetItemProps) => (
  <div
    className={
      'asset-selector__asset-item ' +
      classNames({
        active: active,
      })
    }
    onClick={onClick}
  >
    <div className="asset-balance-input__asset-info">
      <div
        className="asset-icon"
        style={{
          backgroundImage: `url('${idToAsset(asset.id)?.icon}')`,
        }}
      />
      <div className="asset-balance-input__asset-info__names">
        <div className="asset-balance-input__asset-info__names__full-name">
          {idToAsset(asset.id)?.fullName || ''}
        </div>
        <div className="asset-balance-input__asset-info__names__ticker">
          {idToAsset(asset.id)?.symbol}
        </div>
      </div>
    </div>
  </div>
);
