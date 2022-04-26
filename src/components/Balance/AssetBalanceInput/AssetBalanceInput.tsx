import classNames from 'classnames';
import { MutableRefObject, useCallback, useEffect } from 'react';
import { Asset, Maybe } from '../../../generated/graphql';
import { BalanceInput, BalanceInputProps } from '../BalanceInput/BalanceInput';
import { useModalPortal } from './hooks/useModalPortal';
import { useModalPortalElement } from './hooks/useModalPortalElement';

import './AssetBalanceInput.scss';
import { MetricUnit } from '../metricUnit';
import { MetricUnitSelector } from '../BalanceInput/MetricUnitSelector/MetricUnitSelector';
import { useDefaultUnit } from '../BalanceInput/hooks/useDefaultUnit';
import { useFormContext } from 'react-hook-form';
import Icon from '../../Icon/Icon';
import { idToAsset } from '../../../pages/TradePage/TradePage';
import { horizontalBar } from '../../Chart/ChartHeader/ChartHeader';

export interface AssetBalanceInputProps {
  modalContainerRef: MutableRefObject<HTMLDivElement | null>;
  balanceInputName: BalanceInputProps['name'];
  assetInputName: string;
  defaultUnit?: BalanceInputProps['defaultUnit'];
  assets?: Asset[];
  defaultAsset?: Asset;
  isAssetSelectable?: boolean;
  // onAssetSelected: (asset: Asset) => void,
  balanceInputRef?: MutableRefObject<HTMLInputElement | null>;
  required?: boolean;
  maxBalanceLoading?: boolean,
}

export const AssetBalanceInput = ({
  modalContainerRef,
  balanceInputName,
  assetInputName,
  defaultUnit = MetricUnit.NONE,
  assets,
  defaultAsset,
  isAssetSelectable = true,
  // onAssetSelected,
  balanceInputRef,
  required,
  maxBalanceLoading,
}: AssetBalanceInputProps) => {
  const modalPortalElement = useModalPortalElement({
    assets,
    defaultAsset,
    assetInputName,
  });
  const { toggleModal, modalPortal, toggleId } = useModalPortal(
    modalPortalElement,
    modalContainerRef,
    false // don't auto close when clicking outside the modalPortalElement
  );
  const { unit, setUnit } = useDefaultUnit(defaultUnit);
  const handleAssetSelectorClick = useCallback(
    () => isAssetSelectable && toggleModal(),
    [isAssetSelectable, toggleModal]
  );

  const methods = useFormContext();

  return (
    <div className={classNames('asset-balance-input', {
      disabled: maxBalanceLoading
    })}>
      {/* This portal will be rendered at it's container ref as defined above */}
      {modalPortal}
      <div
        className="asset-balance-input__asset-info"
        onClick={(_) => handleAssetSelectorClick()}
        data-modal-portal-toggle={toggleId}
      >
        <div
          className="asset-icon"
          style={{
            backgroundImage: `url('${
              idToAsset(methods.getValues(assetInputName))?.icon
            }')`,
          }}
        ></div>
        <div className="asset-balance-input__asset-info__names">
          <div className="asset-balance-input__asset-info__names__full-name">
            {idToAsset(methods.getValues(assetInputName))?.fullName ||
              'Select asset'}
          </div>
          <div className="asset-balance-input__asset-info__names__ticker">
            {idToAsset(methods.getValues(assetInputName))?.symbol ||
              methods.getValues(assetInputName) ||
              '---'}
            <Icon name="DropdownArrow" />
          </div>
        </div>
      </div>
      <div className="asset-balance-input__input-wrapper">
        <div className='asset-balance-input__input-wrapper__controls'>
          <div className="asset-balance-input__input-wrapper__controls__unit-selector">
            <MetricUnitSelector unit={unit} onUnitSelected={setUnit}>
              <div
                className={classNames(
                  'asset-balance-input__input-wrapper__controls__unit-selector__asset-name',
                  {
                    'horizontal-bar': !idToAsset(
                      methods.getValues(assetInputName)
                    )?.symbol,
                  }
                )}
              >
                {idToAsset(methods.getValues(assetInputName))?.symbol ||
                  `${horizontalBar}`}
              </div>
            </MetricUnitSelector>
          </div>
        </div>

        <BalanceInput
          name={balanceInputName}
          defaultUnit={unit}
          showMetricUnitSelector={false}
          inputRef={balanceInputRef}
          required={required}
        />
      </div>
    </div>
  );
};
