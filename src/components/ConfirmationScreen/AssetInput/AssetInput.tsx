import styled from '@emotion/styled';
import { AssetIcon } from '../AssetIcon/AssetIcon';
import { Text, TextKind, TextProps } from '../Text/Text';

export interface Asset {
  id: string;
  name: string;
  icon?: string;
  symbol: string;
  chain?: {
    id: string;
    name: string;
    icon?: string;
  };
}

export enum AssetInputType {
  Sell = 'sell',
  Buy = 'buy',
  Receive = 'receive',
}

export interface AssetInputProps {
  name: string;
  icon?: string;
  symbol: string;
  chain?: {
    name: string;
    icon?: string;
  };
  amount: string;
  type: AssetInputType;
}

const Input = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 22px 27px;
  gap: 1px;
`;

const Wrapper = styled.div`
  height: 52px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Names = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 5px 8px;
`;

const Amount = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  width: auto;
  padding: 0px;
  margin-left: auto;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TextContent = (type: AssetInputType): TextProps => {
  switch (type) {
    case AssetInputType.Buy: {
      return {
        id: 'assetInput.buy',
        defaultMessage: 'You buy',
      };
    }
    case AssetInputType.Sell: {
      return {
        id: 'assetInput.sell',
        defaultMessage: 'You sell',
      };
    }
    case AssetInputType.Receive: {
      return {
        id: 'assetInput.receive',
        defaultMessage: 'You receive',
      };
    }
  }
};

export const AssetInput = ({
  name,
  icon,
  symbol,
  chain,
  amount,
  type,
}: AssetInputProps) => {
  return (
    <Input>
      <Text {...TextContent(type)} kind={TextKind.AssetInputTitle} />
      <Wrapper>
        <IconContainer>
          <AssetIcon chainIcon={chain?.icon} assetIcon={icon} />
        </IconContainer>
        <Names>
          <Text id={symbol} kind={TextKind.AssetInputSymbol} />
          <Text id={name} kind={TextKind.AssetInputAsset} />
        </Names>
        <Amount>
          <Text id={amount} kind={TextKind.AssetInputAmount} />
        </Amount>
      </Wrapper>
    </Input>
  );
};
