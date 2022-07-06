import styled from '@emotion/styled/macro';
import { useEffect } from 'react';
import { useLocalStorage } from 'use-hooks';
import { Text } from '../../ConfirmationScreen/Text/Text';
import { TextKind } from '../../ConfirmationScreen/Text/TextTheme';
import { Toggle } from '../../ConfirmationScreen/Toggle/Toggle';
import {
  AssetRow,
  ShareAssetRow,
  LoadingRow,
  AssetRowProps,
  AssetShare,
} from '../Row/Row';

export interface AssetTableProps {
  assetsRows?: AssetRowProps[];
  shareAssetsRows?: AssetShare[];
  showInPoolBalances?: boolean;
  onShowInPoolBalances?: () => void;
  loading?: boolean;
}

const TableContainer = styled.div`
  min-width: 850px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(
      180deg,
      rgba(35, 56, 55, 0.3) 0%,
      rgba(0, 0, 0, 0) 100%
    ),
    #16171c;
  border-radius: 20px;
  margin-bottom: 30px;
`;

const RowContainer = styled.div`
  width: 100%;
  &:nth-child(odd) {
    background: rgba(255, 255, 255, 0.06);
  }
  &:last-child {
    border-radius: 0px 0px 20px 20px;
  }
`;

const Tr = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 22px 10px 22px 25px;
  border-bottom: 1px solid #29292d;
`;

const Th = styled.div`
  width: 25%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
`;

const HeaderContainer = styled.div`
  width: 100%;
  padding: 22px 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #29292d;
`;

const TogglesContainer = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 30px;
`;

const TogglesWrapper = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export const AssetTable = ({
  assetsRows,
  shareAssetsRows,
  showInPoolBalances = false,
  onShowInPoolBalances,
  loading = false,
}: AssetTableProps) => {
  const [showInPoolBalance, setShowInPoolBalance] = useLocalStorage(
    'showInPoolBalances',
    showInPoolBalances
  );

  useEffect(() => {
    onShowInPoolBalances && onShowInPoolBalances();
  }, [onShowInPoolBalances, showInPoolBalance]);

  return (
    <>
      <TableContainer>
        <HeaderContainer>
          <Text
            id={'availableAssets'}
            defaultMessage={'Available Assets'}
            kind={TextKind.AssetTableName}
          />
          <TogglesContainer>
            <TogglesWrapper>
              <Text
                id={'inPoolBalances'}
                defaultMessage={'In Pool Balances'}
                kind={TextKind.AssetTableHideLabel}
              />
              <Toggle
                toggled={showInPoolBalance}
                onClick={() => setShowInPoolBalance(!showInPoolBalance)}
              />
            </TogglesWrapper>
          </TogglesContainer>
        </HeaderContainer>
        <Tr>
          <Th>
            <Text
              id={'assetName'}
              defaultMessage={'Asset Name'}
              kind={TextKind.AssetTableHeader}
            />
          </Th>
          <Th>
            <Text
              id={'spendableBalance'}
              defaultMessage={'Spendable Balance'}
              kind={TextKind.AssetTableHeader}
            />
          </Th>
          <Th>
            <Text
              id={'totalBalance'}
              defaultMessage={'Total Balance'}
              kind={TextKind.AssetTableHeader}
            />
          </Th>
          <Th></Th>
        </Tr>
        {assetsRows &&
          assetsRows.map((item) => (
            <RowContainer key={item.asset.id}>
              <AssetRow {...item} />
            </RowContainer>
          ))}
        {loading &&
          [1, 2, 3].map((item) => (
            <RowContainer key={item}>
              <LoadingRow />
            </RowContainer>
          ))}
      </TableContainer>

      <TableContainer>
        <HeaderContainer>
          <Text
            id={'shareTokens'}
            defaultMessage={'Share Tokens'}
            kind={TextKind.AssetTableName}
          />
        </HeaderContainer>
        <Tr>
          <Th>
            <Text
              id={'assetName'}
              defaultMessage={'Asset Name'}
              kind={TextKind.AssetTableHeader}
            />
          </Th>
          <Th>
            <Text
              id={'spendableBalance'}
              defaultMessage={'Spendable Balance'}
              kind={TextKind.AssetTableHeader}
            />
          </Th>
          <Th>
            <Text
              id={'totalBalance'}
              defaultMessage={'Total Balance'}
              kind={TextKind.AssetTableHeader}
            />
          </Th>
          <Th></Th>
        </Tr>
        {shareAssetsRows &&
          shareAssetsRows.map((item) => (
            <RowContainer key={item.id}>
              <ShareAssetRow {...item} />
            </RowContainer>
          ))}
        {loading &&
          [1, 2, 3].map((item) => (
            <RowContainer key={item}>
              <LoadingRow />
            </RowContainer>
          ))}
      </TableContainer>
    </>
  );
};
