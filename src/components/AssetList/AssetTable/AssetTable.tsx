import styled from '@emotion/styled/macro';
import { useEffect } from 'react';
import { useLocalStorage } from 'use-hooks';
import { Text, TextKind } from '../../ConfirmationScreen/Text/Text';
import { Toggle } from '../../ConfirmationScreen/Toggle/Toggle';
import { Row, RowProps } from '../Row/Row';

export interface AssetTableProps {
  data: RowProps[];
  hideSmallBalances?: boolean;
  onHideSmallBalances?: () => void;
}

const TableContainer = styled.div`
  min-width: 1100px;
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

const Tr = styled.tr`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 22px 8px;
  border-bottom: 1px solid #29292d;
`;

const Th = styled.th`
  width: 25%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  &:first-child {
    width: 15%;
    justify-content: flex-start;
  }
  &:last-child {
    width: 35%;
  }
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

const HideSmallBalances = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const AssetLabelContainer = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 29px;
`;

export const AssetTable = ({
  data,
  hideSmallBalances = false,
  onHideSmallBalances,
}: AssetTableProps) => {
  const [hideSmallBalance, setHideSmallBalance] = useLocalStorage(
    'hideSmallBalances',
    hideSmallBalances
  );

  useEffect(() => {
    onHideSmallBalances && onHideSmallBalances();
  }, [onHideSmallBalances, hideSmallBalance]);

  return (
    <TableContainer>
      <HeaderContainer>
        <Text
          id={'availableAssets'}
          defaultMessage={'Available Assets'}
          kind={TextKind.AssetTableName}
        />
        <HideSmallBalances>
          <Text
            id={'hideSmallBalances'}
            defaultMessage={'Hide Small Balances'}
            kind={TextKind.AssetTableHideLabel}
          />
          <Toggle
            toggled={hideSmallBalance}
            onClick={() => setHideSmallBalance(!hideSmallBalance)}
          />
        </HideSmallBalances>
      </HeaderContainer>
      <Tr>
        <Th>
          <AssetLabelContainer>
            <Text
              id={'assetName'}
              defaultMessage={'Asset Name'}
              kind={TextKind.AssetTableHeader}
            />
          </AssetLabelContainer>
        </Th>
        <Th>
          <Text
            id={'totalBalance'}
            defaultMessage={'Total Balance'}
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
        <Th></Th>
      </Tr>
      {data.map((item) => (
        <RowContainer>
          <Row {...item} />
        </RowContainer>
      ))}
    </TableContainer>
  );
};
