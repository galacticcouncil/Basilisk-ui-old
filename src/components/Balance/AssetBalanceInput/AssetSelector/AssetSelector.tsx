import { Asset } from '../../../../generated/graphql';

export interface AssetSelectorProps {
    assets?: Asset[],
    onAssetSelected: (asset: Asset) => void
}

export const AssetSelector = ({ 
    assets,
    onAssetSelected
}: AssetSelectorProps) => {
    return <div>
        <h1>Select an asset</h1>
        {/* TODO: export as AssetItem */}
        {assets?.map((asset, i) => (
            <p 
                key={i}
                onClick={_ => onAssetSelected(asset)}
            >{asset.id}</p>
        ))}
    </div>
}