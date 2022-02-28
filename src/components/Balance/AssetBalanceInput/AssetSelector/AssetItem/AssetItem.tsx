import { Asset } from '../../../../../generated/graphql';
import classNames from 'classnames';
import { idToAsset } from '../../../../../pages/TradePage/TradePage';
export interface AssetItemProps {
    asset: Asset,
    onClick: () => void,
    active: boolean
}

export const AssetItem = ({
    asset,
    onClick,
    active
}: AssetItemProps) => (
    <div
        className={'asset-selector__asset-item ' + classNames({
            'active': active
        })} 
        onClick={onClick}>
        {idToAsset(asset.id)?.symbol || asset.id}
    </div>
)