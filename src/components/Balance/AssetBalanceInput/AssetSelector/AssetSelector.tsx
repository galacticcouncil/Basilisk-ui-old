import { MutableRefObject, useMemo } from 'react'
import Icon from '../../../Icon/Icon'
import { AssetItem } from './AssetItem/AssetItem'
import './AssetSelector.scss'

export interface AssetSelectorProps {
  primaryAssets?: string[]
  secondaryAssets?: string[]
  asset?: string
  onAssetSelected: (asset: string) => void
  closeModal: () => void
  innerRef: MutableRefObject<HTMLDivElement | null>
}

/**
 * Renders a list of assets that the user can select an asset from
 * @param param0
 * @returns
 */
export const AssetSelector = ({
  asset,
  onAssetSelected,
  primaryAssets,
  secondaryAssets,
  closeModal,
  innerRef
}: AssetSelectorProps) => {
  const activeAsset = useMemo(() => asset, [asset])

  // TODO: SEARCH
  return (
    <div className="asset-selector-wrapper" ref={innerRef}>
      <div className="asset-selector modal-component-wrapper">
        <div className="modal-component-heading">
          <div className="modal-component-heading__main-text">Select asset</div>{' '}
          <div className="close-modal-btn" onClick={closeModal}>
            <Icon name="Cancel" />
          </div>
        </div>

        <div className="modal-component-content">
          <div className="asset-selector__primary-assets asset-selector__asset-list">
            {primaryAssets?.map((asset, i) => (
              <AssetItem
                key={i}
                onClick={() => onAssetSelected(asset)}
                active={asset === activeAsset}
                asset={asset}
              />
            ))}
          </div>
          <div className="asset-selector__secondary-assets asset-selector__asset-list">
            {secondaryAssets?.map((asset, i) => (
              <AssetItem
                key={i}
                onClick={() => onAssetSelected(asset)}
                active={asset === activeAsset}
                asset={asset}
              />
            ))}
          </div>
          {!primaryAssets?.length && !secondaryAssets?.length && !asset ? (
            <p>Nothing to see here...</p>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  )
}
