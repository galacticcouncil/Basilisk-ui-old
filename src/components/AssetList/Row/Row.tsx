import styled from '@emotion/styled/macro';
import { Text, TextProps } from '../../ConfirmationScreen/Text/Text';
import { TextKind } from '../../ConfirmationScreen/Text/TextTheme';
import { useCallback, useEffect, useState } from 'react';
import { Dropdown, DropdownItem } from '../Dropdown/Dropdown';
import { AssetIcon } from '../../ConfirmationScreen/AssetIcon/AssetIcon';
import {
  Button,
  ButtonKind,
  ButtonPadding,
} from '../../ConfirmationScreen/Button/Button';
import { Tooltip } from '../../ConfirmationScreen/Tooltip/Tooltip';
import { Icon, IconNames } from '../../ConfirmationScreen/Icon/Icon';
import { maskValue } from '../../ConfirmationScreen/helpers/mask';
import { FormattedBalance } from '../FormattedBalance/FormattedBalance';
import { FormattedDisplayBalance } from '../FormattedDisplayBalance/FormattedDisplayBalance';
import { useDisplayCurrencyContext } from '../hooks/UseDisplayCurrencyContext';
import { orderBy } from 'lodash';
import { LoadingPlaceholder } from '../LoadingPlaceholder/LoadingPlaceholder';
import { LPAssetIcon } from '../LPAseetIcon/LPAssetIcon';

export enum AssetType {
  Native = 'native',
  Shared = 'shared',
  Bridged = 'bridged',
}

export interface AssetBalance {
  value: string;
  id?: string;
}

export type AssetBase = {
  id: string;
  name: string;
  icon?: string;
  symbol: string;
  exchangeRate: string;
  chain?: {
    id: string;
    name: string;
    icon?: string | null;
  };
};

export type NativeAssetBase = AssetBase & {
  totalBalance: string;
  spendableBalance: string;
  inPoolBalance: string;
  freeBalance: string;
  reservedBalance: string;
  frozenBalance: string;
  lockedBalance: {
    balance: string;
    reason: string;
  };
};

type AssetActionsBase = {
  onTransfer: () => void;
  onCrossTransfer: () => void;
  onBuy: () => void;
  onSell: () => void;
  onPositionManagement: () => void;
  onAddLiquidity: () => void;
  onRemoveLiquidity: () => void;
};

type AssetNativeActions = AssetActionsBase & {
  onSetFeeAsset: () => void;
  onClaim: () => void;
};

type AssetBridgedActions = AssetActionsBase & {
  onSetFeeAsset: () => void;
};

type AssetSharedActions = AssetActionsBase;

type AssetNative = NativeAssetBase & {
  type: AssetType.Native;
  actions: AssetNativeActions;
};

type AssetBridged = NativeAssetBase & {
  type: AssetType.Bridged;
  actions: AssetBridgedActions;
};

export type AssetShare = {
  id: number;
  type: AssetType.Shared;
  assetA: AssetBase;
  assetB: AssetBase;
  totalBalance: string;
  spendableBalance: string;
  actions: AssetSharedActions;
  totalIssuance?: string;
  pool?: string;
  totalShare?: number;
};

type AssetNativeActionsData = {
  [key in keyof AssetNativeActions]: {
    icon: IconNames;
    label: TextProps;
    position: number;
  };
};

type AssetActionsKey =
  | keyof AssetNativeActions
  | keyof AssetSharedActions
  | keyof AssetBridgedActions;

export type Asset = AssetNative | AssetBridged;

export interface AssetRowProps {
  asset: Asset;
  totalLockedCoins: string;
  feeAssetId?: string;
}

const RowContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  &:not(:last-child) {
    border-bottom: 1px solid #29292d;
  }
`;

const LoadingRowContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5.5px 0px;
`;

const TextRight = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  overflow: hidden;
  white-space: nowrap;
`;

const TextLeft = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  overflow: hidden;
  white-space: nowrap;
`;

const AssetNames = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  overflow: hidden;
  white-space: nowrap;
`;

const TooltipContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const IconContainer = styled.div`
  width: fit-content;
  height: fit-content;
  padding-bottom: 5px;
`;

const Td = styled.div`
  width: 25%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
`;

const AssetIconContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Tr = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 22px 10px 22px 25px;
  &:not(:last-child) {
    border-bottom: 1px solid #29292d;
  }
  position: relative;
`;

const Spacer = styled.div`
  width: 34px;
  height: 34px;
`;

const FeeContainer = styled.div`
  position: absolute;
  bottom: 13px;
`;

const ArrowContainer = styled.div`
  width: 34px;
  height: 34px;
`;

const IconWrapper = styled.div<{ show: boolean }>`
  transform: rotate(${(props) => (props.show ? 180 : 0)}deg);
`;

// TODO: Refactor with icons from designer
const dropdownItemsData: AssetNativeActionsData = {
  onTransfer: {
    icon: 'DropdownTransfer',
    label: { id: 'transfer', defaultMessage: 'Transfer' },
    position: 0,
  },
  onCrossTransfer: {
    icon: 'DropdownCrossTransfer',
    label: { id: 'crossTransfer', defaultMessage: 'Cross Transfer' },
    position: 1,
  },
  onBuy: {
    icon: 'DropdownBuy',
    label: { id: 'buy', defaultMessage: 'Buy' },
    position: 2,
  },
  onSell: {
    icon: 'DropdownSell',
    label: { id: 'sell', defaultMessage: 'Sell' },
    position: 3,
  },
  onPositionManagement: {
    icon: 'DropdownPositionManagement',
    label: { id: 'positionManagement', defaultMessage: 'Position Management' },
    position: 4,
  },
  onSetFeeAsset: {
    icon: 'DropdownSetFeeAsset',
    label: { id: 'setFeeAsset', defaultMessage: 'Set As Fee Asset' },
    position: 5,
  },
  onClaim: {
    icon: 'DropdownClaim',
    label: { id: 'claim', defaultMessage: 'Claim' },
    position: 11,
  },
  onAddLiquidity: {
    icon: 'DropdownAddLiquidity',
    label: { id: 'addLiquidity', defaultMessage: 'Add Liquidity' },
    position: 7,
  },
  onRemoveLiquidity: {
    icon: 'DropdownRemoveLiquidity',
    label: { id: 'removeLiquidity', defaultMessage: 'Remove Liquidity' },
    position: 8,
  },
};

export const LoadingRow = () => (
  <LoadingRowContainer>
    <Tr>
      <Td>
        <LoadingPlaceholder width={30} height={30} />
        <LoadingPlaceholder width={90} height={30} />
      </Td>
      <Td>
        <TextLeft>
          <LoadingPlaceholder width={134} height={30} />
        </TextLeft>
      </Td>
      <Td>
        <TextLeft>
          <LoadingPlaceholder width={149} height={30} />
        </TextLeft>
      </Td>
      <Td>
        <LoadingPlaceholder width={71} height={30} />
        <LoadingPlaceholder width={71} height={30} />
        <LoadingPlaceholder width={30} height={30} />
        <ArrowContainer></ArrowContainer>
      </Td>
    </Tr>
  </LoadingRowContainer>
);

// TODO: WIP ShareAsset
export const ShareAssetRow = ({
  id,
  type,
  assetA,
  assetB,
  totalBalance,
  spendableBalance,
  actions,
}: AssetShare) => {
  const [dropdownItems, setDropdownItems] = useState<DropdownItem[]>([]);
  const currency = useDisplayCurrencyContext();
  const [show, setShow] = useState(false);
  const handleTrade = useCallback(
    (e) => {
      e.stopPropagation();
      actions.onAddLiquidity && actions.onAddLiquidity();
    },
    [actions]
  );
  const handleTransfer = useCallback(
    (e) => {
      e.stopPropagation();
      actions.onRemoveLiquidity && actions.onRemoveLiquidity();
    },
    [actions]
  );

  useEffect(() => {
    setDropdownItems(
      orderBy(
        Object.keys(actions)
          .filter(
            (key) => key !== 'onAddLiquidity' && key !== 'onRemoveLiquidity'
          )
          .map((key) => {
            return {
              ...dropdownItemsData[key as AssetActionsKey],
              onClick: actions[key as keyof typeof actions],
            };
          }),
        'position',
        'asc'
      )
    );
  }, [actions]);

  return (
    <RowContainer onClick={() => setShow(!show)}>
      <Tr>
        <Td>
          <AssetIconContainer>
            <LPAssetIcon assets={[assetA, assetB]} />
          </AssetIconContainer>
        </Td>
        <Td>
          <TextLeft>
            <FormattedBalance
              assetBalance={{ value: spendableBalance }}
              kind={TextKind.AssetPrimary}
            />
            <FormattedDisplayBalance
              assetBalance={{ value: spendableBalance }}
              kind={TextKind.AssetTableSecondary}
            />
          </TextLeft>
        </Td>
        <Td>
          <TextLeft>
            <FormattedBalance
              assetBalance={{ value: totalBalance }}
              kind={TextKind.AssetPrimary}
            />
            <FormattedDisplayBalance
              assetBalance={{ value: totalBalance }}
              kind={TextKind.AssetTableSecondary}
            />
          </TextLeft>
        </Td>
        <Td>
          <Button
            text={{ id: 'trade', defaultMessage: 'Trade' }}
            onClick={(e) => handleTrade(e)}
            kind={ButtonKind.Secondary}
            padding={ButtonPadding.Small}
          />
          <Button
            text={{ id: 'transfer', defaultMessage: 'Transfer' }}
            onClick={(e) => handleTransfer(e)}
            kind={ButtonKind.Secondary}
            padding={ButtonPadding.Small}
          />
          <Dropdown items={dropdownItems} />
          <ArrowContainer>
            <IconWrapper show={show}>
              <Icon name={'ChevronDown'} size={34} />
            </IconWrapper>
          </ArrowContainer>
        </Td>
      </Tr>
      {show && (
        <Tr>
          <Td>
            <TextLeft>
              <Text
                id={'originChain'}
                defaultMessage={'Origin chain: '}
                kind={TextKind.AssetTableSecondary}
              />
              <Text
                id={assetA.chain?.name || ''}
                kind={TextKind.AssetPrimary}
              />
            </TextLeft>
          </Td>
          <Td>
            <TextRight>
              <Text
                id={'currentRate'}
                defaultMessage={'Current rate: '}
                kind={TextKind.AssetTableSecondary}
              />
              <Text
                id={`${currency.prefix ?? ''} 1 ${
                  currency.suffix ?? ''
                } = ${maskValue(assetA.exchangeRate)} ${assetA.symbol}`}
                kind={TextKind.AssetPrimary}
              />
            </TextRight>
          </Td>
          <Td></Td>
          <Td>
            <Spacer />
          </Td>
        </Tr>
      )}
    </RowContainer>
  );
};

export const AssetRow = ({
  asset,
  totalLockedCoins,
  feeAssetId,
}: AssetRowProps) => {
  const [dropdownItems, setDropdownItems] = useState<DropdownItem[]>([]);
  const currency = useDisplayCurrencyContext();
  const [show, setShow] = useState(false);
  const handleTrade = useCallback(
    (e) => {
      e.stopPropagation();
      asset.actions.onBuy && asset.actions.onBuy();
    },
    [asset.actions]
  );
  const handleTransfer = useCallback(
    (e) => {
      e.stopPropagation();
      asset.actions.onTransfer && asset.actions.onTransfer();
    },
    [asset.actions]
  );

  useEffect(() => {
    setDropdownItems(
      orderBy(
        Object.keys(asset.actions)
          .filter((key) => key !== 'onBuy' && key !== 'onTransfer')
          .map((key) => {
            return {
              ...dropdownItemsData[key as AssetActionsKey],
              onClick: asset.actions[key as keyof typeof asset.actions],
            };
          }),
        'position',
        'asc'
      )
    );
  }, [asset]);

  return (
    <RowContainer onClick={() => setShow(!show)}>
      <Tr>
        <Td>
          <AssetIconContainer>
            <IconContainer>
              <AssetIcon assetIcon={asset.icon} chainIcon={asset.chain?.icon} />
            </IconContainer>
            <AssetNames>
              <Text id={asset.symbol} kind={TextKind.AssetPrimaryUpperCase} />
              <Text id={asset.name} kind={TextKind.AssetSecondary} />
              {feeAssetId && asset.id === feeAssetId && (
                <FeeContainer>
                  <Text
                    id={'feeLabel'}
                    defaultMessage={'$ Fee payment asset'}
                    kind={TextKind.AssetListFeeLabel}
                  />
                </FeeContainer>
              )}
            </AssetNames>
          </AssetIconContainer>
        </Td>
        <Td>
          <TextLeft>
            <FormattedBalance
              assetBalance={{ value: asset.totalBalance, id: asset.id }}
              kind={TextKind.AssetPrimary}
            />
            <FormattedDisplayBalance
              assetBalance={{ value: asset.totalBalance, id: asset.id }}
              kind={TextKind.AssetTableSecondary}
            />
          </TextLeft>
        </Td>
        <Td>
          <TextLeft>
            <FormattedBalance
              assetBalance={{ value: asset.totalBalance, id: asset.id }}
              kind={TextKind.AssetPrimary}
            />
            <FormattedDisplayBalance
              assetBalance={{ value: asset.totalBalance, id: asset.id }}
              kind={TextKind.AssetTableSecondary}
            />
          </TextLeft>
        </Td>
        <Td>
          <Button
            text={{ id: 'trade', defaultMessage: 'Trade' }}
            onClick={(e) => handleTrade(e)}
            kind={ButtonKind.Secondary}
            padding={ButtonPadding.Small}
          />
          <Button
            text={{ id: 'transfer', defaultMessage: 'Transfer' }}
            onClick={(e) => handleTransfer(e)}
            kind={ButtonKind.Secondary}
            padding={ButtonPadding.Small}
          />
          <Dropdown items={dropdownItems} />
          <ArrowContainer>
            <IconWrapper show={show}>
              <Icon name={'ChevronDown'} size={34} />
            </IconWrapper>
          </ArrowContainer>
        </Td>
      </Tr>
      {show && (
        <Tr>
          <Td>
            <TextLeft>
              <Text
                id={'originChain'}
                defaultMessage={'Origin chain: '}
                kind={TextKind.AssetTableSecondary}
              />
              <Text id={asset.chain?.name || ''} kind={TextKind.AssetPrimary} />
            </TextLeft>
          </Td>
          <Td>
            <TextRight>
              <Text
                id={'currentRate'}
                defaultMessage={'Current rate: '}
                kind={TextKind.AssetTableSecondary}
              />
              <Text
                id={`${currency.prefix ?? ''} 1 ${
                  currency.suffix ?? ''
                } = ${maskValue(asset.exchangeRate)} ${asset.symbol}`}
                kind={TextKind.AssetPrimary}
              />
            </TextRight>
          </Td>
          <Td>
            <TextRight>
              <Text
                id={'inPool'}
                defaultMessage={'In Pool: '}
                kind={TextKind.AssetTableSecondary}
              />
              <FormattedBalance
                assetBalance={{ value: asset.inPoolBalance, id: asset.id }}
                kind={TextKind.AssetPrimary}
              />
              <FormattedDisplayBalance
                assetBalance={{ value: asset.inPoolBalance, id: asset.id }}
                kind={TextKind.AssetTableSecondary}
              />
            </TextRight>
          </Td>
          <Td>
            <TextRight>
              <TooltipContainer>
                <Text
                  id={'locked'}
                  defaultMessage={'Locked: '}
                  kind={TextKind.AssetTableSecondary}
                />
                <Tooltip id={`${totalLockedCoins} ${asset.symbol}`} />
              </TooltipContainer>
              <FormattedBalance
                assetBalance={{
                  value: asset.lockedBalance.balance,
                  id: asset.id,
                }}
                kind={TextKind.AssetPrimary}
              />
              <FormattedDisplayBalance
                assetBalance={{
                  value: asset.lockedBalance.balance,
                  id: asset.id,
                }}
                kind={TextKind.AssetTableSecondary}
              />
            </TextRight>
            <Spacer />
          </Td>
        </Tr>
      )}
    </RowContainer>
  );
};
