import { useCallback, useMemo, useRef } from 'react';
import { Asset } from '../../../../generated/graphql';
import { AssetBalanceInputProps } from './../AssetBalanceInput';
import { AssetSelector } from './../AssetSelector/AssetSelector';
import { ModalPortalElementFactory, ModalPortalElementFactoryArgs } from './useModalPortal';

export type ModalPortalElement =
    ({ assets, onAssetSelected, asset }: Pick<AssetBalanceInputProps, 'assets' | 'onAssetSelected' | 'asset'>) 
    => ModalPortalElementFactory;
export type CloseModal = ModalPortalElementFactoryArgs['closeModal'];

export const useModalPortalElement: ModalPortalElement = ({ assets, onAssetSelected, asset }) => {
    const handleAssetSelected = useCallback((closeModal: CloseModal) => (
        (asset: Asset) => {
            closeModal();
            onAssetSelected(asset);   
        }
    ), []);

    return ({ closeModal, elementRef }) => {
        return <AssetSelector
            innerRef={elementRef} 
            assets={assets}
            asset={asset}
            onAssetSelected={handleAssetSelected(closeModal)}
        />
    }
}