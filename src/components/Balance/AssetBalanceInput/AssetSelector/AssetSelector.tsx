import { useMemo } from 'react';
import { Asset } from '../../../../generated/graphql';
import { AssetItem } from './AssetItem/AssetItem';

export interface AssetSelectorProps {
    assets?: Asset[],
    asset?: Asset,
    onAssetSelected: (asset: Asset) => void
}

/**
 * Renders a list of assets that the user can select an asset from
 * @param param0 
 * @returns 
 */
export const AssetSelector = ({ 
    assets,
    onAssetSelected,
    asset,
}: AssetSelectorProps) => {
    const activeAsset = useMemo(() => asset, [asset]);
    console.log('activeAsset', activeAsset);
    return <div>
        <h1>Select an asset</h1>
        {/* TODO: export as AssetItem */}
        {assets?.map((asset, i) => (
            <AssetItem
                key={i}
                onClick={() => onAssetSelected(asset)}
                active={asset.id === activeAsset?.id}
                asset={asset}
            />
        ))}
    </div>
}