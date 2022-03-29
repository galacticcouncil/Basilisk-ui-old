import { MutableRefObject, useMemo } from 'react';
import { Asset } from '../../../../generated/graphql';
import Icon from '../../../Icon/Icon';
import { AssetItem } from './AssetItem/AssetItem';
import './AssetSelector.scss';

export interface AssetSelectorProps {
  assets?: Asset[];
  asset?: Asset;
  onAssetSelected: (asset: Asset) => void;
  closeModal: () => void;
  innerRef: MutableRefObject<HTMLDivElement | null>;
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
  closeModal,
  innerRef,
}: AssetSelectorProps) => {
  const activeAsset = useMemo(() => asset, [asset]);

  // TODO: SEARCH
  return (
    <div className="asset-selector-wrapper" ref={innerRef}>
      <div className="asset-selector modal-component-wrapper">
        <div className="modal-component-heading">
          <div>Select an asset</div>{' '}
          <div className="close-modal-btn" onClick={closeModal}>
            <Icon name="Cancel" />
          </div>
        </div>

        <div className="modal-component-content">
          {assets?.length
            ? (
              assets?.map((asset, i) => (
                <AssetItem
                  key={i}
                  onClick={() => onAssetSelected(asset)}
                  active={asset.id === activeAsset?.id}
                  asset={asset}
                />
              ))
            )
            : (
              <p>No other assets available</p>
            )
          }
        </div>
      </div>
    </div>
  );
};
