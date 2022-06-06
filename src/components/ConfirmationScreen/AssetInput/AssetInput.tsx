import styled from '@emotion/styled/macro';
import { AssetIcon } from '../AssetIcon/AssetIcon';
import { Text, TextKind, TextProps } from '../Text/Text';
import MaskedInput, { MaskedInputProps } from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

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

  background: #1c1a1f;
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
  overflow: hidden;
  white-space: nowrap;
`;

const Amount = styled.div`
  min-width: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  width: auto;
  margin-left: auto;
  overflow: hidden;
  white-space: nowrap;
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

export const thousandsSeparatorSymbol = ' ';
export const maskOptions = {
  prefix: '',
  suffix: '',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol,
  allowDecimal: true,
  decimalSymbol: '.',
  // TODO: adjust decimal limit depending on the selected MetricUnit
  decimalLimit: 12,
  // integerLimit: 7,
  allowNegative: false,
  allowLeadingZeroes: false,
};

export const AssetInput = ({
  name,
  icon,
  symbol,
  chain,
  amount,
  type,
}: AssetInputProps) => {
  const mask = createNumberMask(maskOptions);

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
