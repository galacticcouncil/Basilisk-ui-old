import { Asset } from '../../../../../generated/graphql';

export interface AssetItemProps {
    asset: Asset,
    onClick: () => void
}

export const AssetItem = ({
    asset,
    onClick
}: AssetItemProps) => (
    <div onClick={onClick}>
        {asset.id}
    </div>
)