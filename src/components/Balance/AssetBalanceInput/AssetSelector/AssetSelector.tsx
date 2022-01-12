import { MutableRefObject, useMemo } from 'react';
import { Asset } from '../../../../generated/graphql';
import { AssetItem } from './AssetItem/AssetItem';
import './AssetSelector.scss';

export interface AssetSelectorProps {
    assets?: Asset[],
    asset?: Asset,
    onAssetSelected: (asset: Asset) => void,
    innerRef: MutableRefObject<HTMLDivElement | null>
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
    innerRef
}: AssetSelectorProps) => {
    const activeAsset = useMemo(() => asset, [asset]);
    
    // TODO: SEARCH
    return <div className='asset-selector' ref={innerRef}>
        <div className='asset-selector__heading'>Select an asset</div>
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