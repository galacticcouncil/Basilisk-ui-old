import styled from '@emotion/styled/macro';
import { useEffect, useState } from 'react';
import { Text } from '../../ConfirmationScreen/Text/Text';
import { TextKind } from '../../ConfirmationScreen/Text/TextTheme';
import { Tooltip } from '../../ConfirmationScreen/Tooltip/Tooltip';

const DEFAULT_CURRENCY = '$';

export interface AssetListStatsProps {
  currencyLeft?: string;
  currencyRight?: string;
  spendableAssetsValue: string;
  spendableAssetsDecimalValue: string;
  lockedValue: string;
  lockedDecimalValue: string;
  totalValue: string;
  totalDecimalValue: string;
}

const AssetListStatsContainer = styled.div`
  width: fit-content;
  height: fit-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 123px;

  white-space: nowrap;
`;

const TotalContainer = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
`;

const LabelWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ValueWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;

export const AssetListStats = ({
  currencyLeft,
  currencyRight,
  spendableAssetsValue,
  spendableAssetsDecimalValue,
  lockedValue,
  lockedDecimalValue,
  totalValue,
  totalDecimalValue,
}: AssetListStatsProps) => {
  const defaultCurrency =
    !currencyLeft && !currencyRight ? DEFAULT_CURRENCY : undefined;
  const [leftCurrency, setLeftCurrency] = useState(currencyLeft);
  const [rightCurrency, setRightCurrency] = useState(currencyRight);

  useEffect(() => {
    if (currencyRight) {
      setLeftCurrency('');
    } else if (defaultCurrency) {
      setLeftCurrency(defaultCurrency);
    } else {
      setLeftCurrency(currencyLeft);
    }
  }, [currencyLeft, currencyRight, defaultCurrency]);

  useEffect(() => {
    if (currencyRight) {
      setRightCurrency(currencyRight);
    } else {
      setRightCurrency('');
    }
  }, [currencyRight]);

  return (
    <AssetListStatsContainer>
      <TotalContainer>
        <Text
          id={'spendableAssets'}
          defaultMessage={'Spendable Assets'}
          kind={TextKind.AssetListValueLabel}
        />
        <ValueWrapper>
          <Text
            id={`${leftCurrency}${spendableAssetsValue}.`}
            kind={TextKind.AssetListTotalValue}
          />
          <Text
            id={`${spendableAssetsDecimalValue}${rightCurrency}`}
            kind={TextKind.AssetListTotalDecimalValue}
          />
        </ValueWrapper>
      </TotalContainer>
      <TotalContainer>
        <LabelWrapper>
          <Text
            id={'lockedAssets'}
            defaultMessage={'Locked Assets'}
            kind={TextKind.AssetListValueLabel}
          />
          <Tooltip
            id={'lockedAssetsTooltip'}
            defaultMessage={'Locked Assets Tooltip'}
          />
        </LabelWrapper>
        <ValueWrapper>
          <Text
            id={`${leftCurrency}${lockedValue}.`}
            kind={TextKind.AssetListSecondaryValue}
          />
          <Text
            id={`${lockedDecimalValue}${rightCurrency}`}
            kind={TextKind.AssetListSecondaryDecimalValue}
          />
        </ValueWrapper>
      </TotalContainer>
      <TotalContainer>
        <LabelWrapper>
          <Text
            id={'totalPortfolio'}
            defaultMessage={'Total Portfolio'}
            kind={TextKind.AssetListValueLabel}
          />
          <Tooltip
            id={'totalPortfolioTooltip'}
            defaultMessage={'Total Portfolio Tooltip'}
          />
        </LabelWrapper>
        <ValueWrapper>
          <Text
            id={`${leftCurrency}${totalValue}.`}
            kind={TextKind.AssetListSecondaryValue}
          />
          <Text
            id={`${totalDecimalValue}${rightCurrency}`}
            kind={TextKind.AssetListSecondaryDecimalValue}
          />
        </ValueWrapper>
      </TotalContainer>
    </AssetListStatsContainer>
  );
};
