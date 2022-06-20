import { Icon } from '../Icon/Icon';
import styled from '@emotion/styled/macro';
import { keyframes } from '@emotion/react';

export interface LoadingIndicatorProps {
  size?: number;
  big?: boolean;
}

const rotate = keyframes`
  {
    0%
    {
      transform: rotate(0deg);
    }
    100%
    {
      transform: rotate(360deg);
    }
  }
`;

const rotateWithHue = keyframes`
  {
    0%
    {
      transform: rotate(0deg);
      filter: hue-rotate(0deg);
    }
    100%
    {
      transform: rotate(360deg);
      filter: hue-rotate(360deg);
    }
  }
`;

const LoadingIndicatorContainer = styled.div<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`;

const LoadingIndicatorWrapper = styled.div<{ hue: boolean }>`
  animation: ${(props) => (props.hue ? rotateWithHue : rotate)} 2s linear infinite;
`;

export const LoadingIndicator = ({
  size = 16,
  big = false,
}: LoadingIndicatorProps) => {
  return (
    <LoadingIndicatorContainer size={size}>
      <LoadingIndicatorWrapper hue={!big}>
        <Icon name={big ? 'LoadingBig' : 'Loading'} size={size} />
      </LoadingIndicatorWrapper>
    </LoadingIndicatorContainer>
  );
};
