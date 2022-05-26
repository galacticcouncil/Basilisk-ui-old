import { Icon } from '../Icon/Icon';
import styled from '@emotion/styled/macro';
import { keyframes } from '@emotion/react';

export interface LoadingIndicatorProps {
  size?: number;
}

const rotate = keyframes`
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

const LoadingIndicatorWrapper = styled.div`
  animation: ${rotate} 2s linear infinite;
`;

export const LoadingIndicator = ({ size = 16 }: LoadingIndicatorProps) => {
  return (
    <LoadingIndicatorContainer size={size}>
      <LoadingIndicatorWrapper>
        <Icon name="Loading" size={size} />
      </LoadingIndicatorWrapper>
    </LoadingIndicatorContainer>
  );
};
