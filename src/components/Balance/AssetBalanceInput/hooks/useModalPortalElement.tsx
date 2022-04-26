import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Asset } from '../../../../generated/graphql';
import { AssetBalanceInputProps } from '../AssetBalanceInput';
import { AssetSelector } from '../AssetSelector/AssetSelector';
import {
  ModalPortalElementFactory,
  ModalPortalElementFactoryArgs,
} from './useModalPortal';

export type ModalPortalElement = ({
  assets,
  defaultAsset,
  assetInputName,
}: Pick<
  AssetBalanceInputProps,
  'assets' | 'defaultAsset' | 'assetInputName'
>) => ModalPortalElementFactory;
export type CloseModal = ModalPortalElementFactoryArgs['closeModal'];

export const useModalPortalElement: ModalPortalElement = ({
  assets,
  defaultAsset,
  assetInputName,
}) => {
  const { register, setValue } = useFormContext();

  register(assetInputName, {
    value: defaultAsset?.id,
  });

  const handleAssetSelected = useCallback(
    (closeModal: CloseModal) => (asset: Asset) => {
      closeModal();
      // onAssetSelected(asset);
      setValue(assetInputName, asset.id);
    },
    [setValue]
  );

  return useCallback(
    ({ closeModal, elementRef, isModalOpen }) => {
      return isModalOpen ? (
        <AssetSelector
          innerRef={elementRef}
          assets={assets}
          asset={defaultAsset}
          closeModal={closeModal}
          onAssetSelected={handleAssetSelected(closeModal)}
        />
      ) : (
        <></>
      );
    },
    [assets, defaultAsset, handleAssetSelected]
  );
};
