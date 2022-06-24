import styled from '@emotion/styled/macro';
import { Text } from '../../ConfirmationScreen/Text/Text';
import { TextKind } from '../../ConfirmationScreen/Text/TextTheme';
import { Tooltip } from '../../ConfirmationScreen/Tooltip/Tooltip';
import { DisplayBalanceSplit } from '../FormattedDisplayBalance/FormattedDisplayBalance';
import { useDisplayCurrencyContext } from '../hooks/UseDisplayCurrencyContext';
import { useDisplayValueContext } from '../hooks/UseDisplayValueContext';
export interface AssetListStatsProps {
  spendableAssets: string;
  locked: string;
  total: string;
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
  spendableAssets,
  locked,
  total,
}: AssetListStatsProps) => {
  const exchangeRate = useDisplayValueContext();
  const currency = useDisplayCurrencyContext();
  const [spendableAssetsValue, spendableAssetsDecimal] = DisplayBalanceSplit(
    { value: spendableAssets },
    exchangeRate,
    currency
  );
  const [lockedValue, lockedDecimal] = DisplayBalanceSplit(
    { value: locked },
    exchangeRate,
    currency
  );
  const [totalValue, totalDecimal] = DisplayBalanceSplit(
    { value: total },
    exchangeRate,
    currency
  );

  return (
    <AssetListStatsContainer>
      <TotalContainer>
        <Text
          id={'spendableAssets'}
          defaultMessage={'Spendable Assets'}
          kind={TextKind.AssetListValueLabel}
        />
        <ValueWrapper>
          <Text id={spendableAssetsValue} kind={TextKind.AssetListTotal} />
          <Text
            id={spendableAssetsDecimal}
            kind={TextKind.AssetListTotalDecimal}
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
          <Text id={lockedValue} kind={TextKind.AssetListSecondary} />
          <Text id={lockedDecimal} kind={TextKind.AssetListSecondaryDecimal} />
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
          <Text id={totalValue} kind={TextKind.AssetListSecondary} />
          <Text id={totalDecimal} kind={TextKind.AssetListSecondaryDecimal} />
        </ValueWrapper>
      </TotalContainer>
    </AssetListStatsContainer>
  );
};
