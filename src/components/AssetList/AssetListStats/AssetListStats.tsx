import styled from '@emotion/styled/macro';
import { Text } from '../../ConfirmationScreen/Text/Text';
import { TextKind } from '../../ConfirmationScreen/Text/TextTheme';
import { Tooltip } from '../../ConfirmationScreen/Tooltip/Tooltip';
import { DisplayBalanceSplit } from '../FormattedDisplayBalance/FormattedDisplayBalance';
import { useDisplayCurrencyContext } from '../hooks/UseDisplayCurrencyContext';
import { useDisplayValueContext } from '../hooks/UseDisplayValueContext';
import { LoadingPlaceholder } from '../LoadingPlaceholder/LoadingPlaceholder';
export interface AssetListStatsProps {
  spendableAssets?: string;
  locked?: string;
  total?: string;
  loading?: boolean;
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
  loading = false,
}: AssetListStatsProps) => {
  const exchangeRate = useDisplayValueContext();
  const currency = useDisplayCurrencyContext();
  const [spendableAssetsValue, spendableAssetsDecimal] = spendableAssets
    ? DisplayBalanceSplit({ value: spendableAssets }, exchangeRate, currency)
    : [undefined, undefined];
  const [lockedValue, lockedDecimal] = locked
    ? DisplayBalanceSplit({ value: locked }, exchangeRate, currency)
    : [undefined, undefined];
  const [totalValue, totalDecimal] = total
    ? DisplayBalanceSplit({ value: total }, exchangeRate, currency)
    : [undefined, undefined];

  return (
    <AssetListStatsContainer>
      <TotalContainer>
        <Text
          id={'spendableAssets'}
          defaultMessage={'Spendable Assets'}
          kind={TextKind.AssetListValueLabel}
        />
        {loading ? (
          <LoadingPlaceholder width={208} height={52} />
        ) : (
          <ValueWrapper>
            <Text
              id={spendableAssetsValue || ''}
              kind={TextKind.AssetListTotal}
            />
            <Text
              id={spendableAssetsDecimal || ''}
              kind={TextKind.AssetListTotalDecimal}
            />
          </ValueWrapper>
        )}
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
        {loading ? (
          <LoadingPlaceholder width={168} height={42} />
        ) : (
          <ValueWrapper>
            <Text id={totalValue || ''} kind={TextKind.AssetListSecondary} />
            <Text
              id={totalDecimal || ''}
              kind={TextKind.AssetListSecondaryDecimal}
            />
          </ValueWrapper>
        )}
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
        {loading ? (
          <LoadingPlaceholder width={168} height={42} />
        ) : (
          <ValueWrapper>
            <Text id={lockedValue || ''} kind={TextKind.AssetListSecondary} />
            <Text
              id={lockedDecimal || ''}
              kind={TextKind.AssetListSecondaryDecimal}
            />
          </ValueWrapper>
        )}
      </TotalContainer>
    </AssetListStatsContainer>
  );
};
