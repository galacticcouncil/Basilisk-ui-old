import styled from '@emotion/styled/macro';
import { Icon } from '../../ConfirmationScreen/Icon/Icon';
import { AssetBase } from '../Row/Row';

export interface LPAssetIconProps {
  assets: [AssetBase, AssetBase];
  outlineColor?: string;
}

const LPAssetIconContainer = styled.div`
  width: 55px;
  height: 31px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const FirstAssetIconContainer = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SecondAssetIconContainer = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
  right: -3px;
  z-index: 10;
`;

const AssetIconWrapper = styled.div`
  width: 34px;
  height: 34px;
  padding: 3px;
`;

const ChainIconWrapper = styled.div`
  width: 13px;
  height: 13px;
  position: relative;
  right: 7px;
  bottom: 8px;
  z-index: 100;
`;

const Token = styled.div<{ icon?: string; size?: number; color?: string }>`
  width: ${(props) => props.size || 34}px;
  height: ${(props) => props.size || 34}px;
  background-image: url('${(props) => props.icon}');
  border-radius: 100%;
  outline: 3px solid ${(props) => props.color || 'transparent'};
`;

const Chain = styled.div<{ icon?: string; size?: number }>`
  width: ${(props) => props.size || 13}px;
  height: ${(props) => props.size || 13}px;
  background-image: url('${(props) => props.icon}');
  border-radius: 100%;
  outline: 1.5px solid black;
`;

const Spacer = styled.div`
  width: 13px;
  height: 13px;
`;

export const LPAssetIcon = ({ assets, outlineColor }: LPAssetIconProps) => {
  const [assetA, assetB] = assets;

  return (
    <LPAssetIconContainer>
      <FirstAssetIconContainer>
        <AssetIconWrapper>
          {assetA.icon ? (
            <Token icon={assetA?.icon} size={34} />
          ) : (
            <Icon name={'MissingAsset'} size={34} />
          )}
        </AssetIconWrapper>
      </FirstAssetIconContainer>
      <SecondAssetIconContainer>
        <AssetIconWrapper>
          {assetB.icon ? (
            <Token icon={assetB.icon} size={34} color={outlineColor} />
          ) : (
            <Icon name={'MissingAsset'} size={34} />
          )}
        </AssetIconWrapper>
        <ChainIconWrapper>
          {!(assetB.chain?.icon === null) ? (
            assetB.chain?.icon ? (
              <Chain icon={assetB.chain?.icon} size={13} />
            ) : (
              <Icon name={'MissingAsset'} size={13} />
            )
          ) : (
            <Spacer />
          )}
        </ChainIconWrapper>
      </SecondAssetIconContainer>
    </LPAssetIconContainer>
  );
};
