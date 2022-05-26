import styled from '@emotion/styled/macro';
import { Icon } from '../Icon/Icon';

export interface AssetIconProps {
  chainIcon?: string;
  assetIcon?: string;
}

const AssetIconContainer = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const AssetIconWrapper = styled.div`
  width: 34px;
  height: 34px;
  padding: 3px;
`;

const ChainIconWrapper = styled.div<{ icon?: string }>`
  width: 13px;
  height: 13px;
  position: relative;
  right: 7px;
  bottom: 8px;
  z-index: 10;
`;

const Token = styled.div<{ icon?: string }>`
  width: 34px;
  height: 34px;
  background-image: url('${(props) => props.icon}');
`;

const Chain = styled.div<{ icon?: string }>`
  width: 13px;
  height: 13px;
  background-image: url('${(props) => props.icon}');
`;

export const AssetIcon = ({ assetIcon, chainIcon }: AssetIconProps) => {
  return (
    <AssetIconContainer>
      <AssetIconWrapper>
        {assetIcon ? (
          <Token icon={assetIcon} />
        ) : (
          <Icon name={'MissingAsset'} size={34} />
        )}
      </AssetIconWrapper>
      <ChainIconWrapper icon={chainIcon}>
        {chainIcon ? (
          <Chain icon={chainIcon} />
        ) : (
          <Icon name={'MissingAsset'} size={13} />
        )}
      </ChainIconWrapper>
    </AssetIconContainer>
  );
};
