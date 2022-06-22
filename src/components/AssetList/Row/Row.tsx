import styled from '@emotion/styled/macro';
import { Text } from '../../ConfirmationScreen/Text/Text';
import { TextKind } from '../../ConfirmationScreen/Text/TextTheme';
import { useCallback, useState } from 'react';
import { Dropdown, DropdownProps } from '../Dropdown/Dropdown';
import { AssetIcon } from '../../ConfirmationScreen/AssetIcon/AssetIcon';
import {
  Button,
  ButtonKind,
  ButtonPadding,
} from '../../ConfirmationScreen/Button/Button';
import { Tooltip } from '../../ConfirmationScreen/Tooltip/Tooltip';
import { Icon } from '../../ConfirmationScreen/Icon/Icon';
import { maskValue } from '../../ConfirmationScreen/helpers/mask';

export enum AssetType {
  Native = 'native',
  Shared = 'shared',
  Bridged = 'bridged',
}

export type Asset = {
  id: string;
  type: AssetType;
  name: string;
  icon?: string;
  symbol: string;
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
  chain?: {
    id: string;
    name: string;
    icon?: string | null;
  };
};

export interface RowProps {
  asset: Asset;
  totalLockedCoins: string;
  exchangeRate: number;
  onTrade?: () => void;
  onTransfer?: () => void;
  actions: DropdownProps;
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

const Td = styled.div<{ left?: boolean }>`
  width: 25%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${(props) => (props.left ? 'flex-start' : 'flex-end')};
  &:first-child {
    width: 15%;
    justify-content: flex-start;
  }
  &:last-child {
    width: 35%;
  }
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
  padding: 22px 10px 22px 8px;
  &:not(:last-child) {
    border-bottom: 1px solid #29292d;
  }
`;

const Spacer = styled.div`
  width: 34px;
  height: 34px;
`;

const FeeContainer = styled.div`
  width: 17px;
  height: 17px;
  border-radius: 5px;
`;

const FeeWrapper = styled.div`
  width: 17px;
  height: 17px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  border: 1px solid;

  border-image-source: linear-gradient(0deg, #44444a, #44444a),
    linear-gradient(0deg, #3e3e4b, #3e3e4b);
`;

const ArrowContainer = styled.div`
  width: 34px;
  height: 34px;
`;

const IconWrapper = styled.div<{ show: boolean }>`
  transform: rotate(${(props) => (props.show ? 180 : 0)}deg);
`;

const dollarValue = (coins: number, rate: number): string => {
  return `$${maskValue((coins / rate).toFixed(2))}`;
};

export const Row = ({
  asset,
  totalLockedCoins,
  onTrade,
  onTransfer,
  actions,
  exchangeRate,
  feeAssetId,
}: RowProps) => {
  const [show, setShow] = useState(false);
  const handleTrade = useCallback(
    (e) => {
      e.stopPropagation();
      onTrade && onTrade();
    },
    [onTrade]
  );
  const handleTransfer = useCallback(
    (e) => {
      e.stopPropagation();
      onTransfer && onTransfer();
    },
    [onTransfer]
  );

  return (
    <RowContainer onClick={() => setShow(!show)}>
      <Tr>
        <Td>
          <FeeContainer>
            {feeAssetId && asset.id === feeAssetId && (
              <FeeWrapper>
                <Tooltip
                  icon={'Dollar'}
                  id={'feeTooltip'}
                  defaultMessage={'Your current payment asset'}
                />
              </FeeWrapper>
            )}
          </FeeContainer>
          <AssetIconContainer>
            <IconContainer>
              <AssetIcon assetIcon={asset.icon} chainIcon={asset.chain?.icon} />
            </IconContainer>
            <AssetNames>
              <Text id={asset.symbol} kind={TextKind.AssetPrimaryUpperCase} />
              <Text id={asset.name} kind={TextKind.AssetSecondary} />
            </AssetNames>
          </AssetIconContainer>
        </Td>
        <Td>
          <TextRight>
            <Text id={asset.totalBalance} kind={TextKind.AssetPrimary} />
            <Text
              id={dollarValue(Number(asset.totalBalance), exchangeRate)}
              kind={TextKind.AssetTableSecondary}
            />
          </TextRight>
        </Td>
        <Td>
          <TextRight>
            <Text id={asset.spendableBalance} kind={TextKind.AssetPrimary} />
            <Text
              id={dollarValue(Number(asset.spendableBalance), exchangeRate)}
              kind={TextKind.AssetTableSecondary}
            />
          </TextRight>
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
          <Dropdown {...actions} />
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
            <FeeContainer />
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
                id={`1$ = ${maskValue(exchangeRate.toString())} ${
                  asset.symbol
                }`}
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
              <Text id={asset.inPoolBalance} kind={TextKind.AssetPrimary} />
              <Text
                id={dollarValue(Number(asset.inPoolBalance), exchangeRate)}
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
              <Text
                id={asset.lockedBalance.balance}
                kind={TextKind.AssetPrimary}
              />
              <Text
                id={dollarValue(
                  Number(asset.lockedBalance.balance),
                  exchangeRate
                )}
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
