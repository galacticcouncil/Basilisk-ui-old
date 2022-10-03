import { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import { Asset } from '../../../../generated/graphql'
import { AssetBalanceInputProps } from '../AssetBalanceInput'
import { AssetSelector } from '../AssetSelector/AssetSelector'
import {
  ModalPortalElementFactory,
  ModalPortalElementFactoryArgs
} from './useModalPortal'

export type ModalPortalElement = ({
  primaryAssets,
  secondaryAssets,
  defaultAsset,
  assetInputName
}: Pick<
  AssetBalanceInputProps,
  'primaryAssets' | 'secondaryAssets' | 'defaultAsset' | 'assetInputName'
>) => ModalPortalElementFactory
export type CloseModal = ModalPortalElementFactoryArgs<void>['closeModal']

export const useModalPortalElement: ModalPortalElement = ({
  primaryAssets,
  secondaryAssets,
  defaultAsset,
  assetInputName
}) => {
  const { register, setValue } = useFormContext()

  register(assetInputName, {
    value: defaultAsset
  })

  const handleAssetSelected = useCallback(
    (closeModal: CloseModal) => (asset: string) => {
      closeModal()
      // onAssetSelected(asset);
      setValue(assetInputName, asset)
    },
    [setValue]
  )

  return useCallback(
    ({ closeModal, elementRef, isModalOpen }) => {
      return isModalOpen ? (
        <AssetSelector
          innerRef={elementRef}
          primaryAssets={primaryAssets}
          secondaryAssets={secondaryAssets}
          asset={defaultAsset}
          closeModal={closeModal}
          onAssetSelected={handleAssetSelected(closeModal)}
        />
      ) : (
        <></>
      )
    },
    [primaryAssets, secondaryAssets, defaultAsset, handleAssetSelected]
  )
}
