import styled from '@emotion/styled/macro';
import {
  AssetListStats,
  AssetListStatsProps,
} from './AssetListStats/AssetListStats';
import { AssetTable, AssetTableProps } from './AssetTable/AssetTable';

export interface AssetListProps {
  stats: AssetListStatsProps;
  table: AssetTableProps;
}

const AssetListContainer = styled.div`
  max-width: 1110px;
  width: 100%;
  height: 100%;
  padding: 83px 0px;
  margin: 0px auto;
  display: flex;
  flex-direction: column;
  gap: 90px;
`;

export const AssetList = ({ stats, table }: AssetListProps) => {
  return (
    <AssetListContainer>
      <AssetListStats {...stats} />
      <AssetTable {...table} />
    </AssetListContainer>
  );
};
